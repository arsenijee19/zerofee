import type { AuthUser } from "@/lib/server/auth";
import { money } from "@/lib/money";
import { reconcilePayment } from "@/lib/domain/pricing";
import { query, transaction } from "@/lib/server/db";
import { getCreatorPaymentsProvider } from "@/lib/server/providers";
import { requireCreatorOwner, requireRole } from "@/lib/server/policies";

export async function acceptQuoteAndCreatePendingSubscription(user: AuthUser, quoteId: string) {
  const quote = await query<{ id: string; creator_id: string; tier_id: string; retail_minor: string; currency: string; expires_at: string; status: string; billing_interval: "monthly" | "annual"; tier_name: string }>(
    `SELECT q.*, tpv.billing_interval, ct.name AS tier_name
     FROM membership_price_quotes q
     JOIN tier_price_versions tpv ON tpv.id = q.tier_price_version_id
     JOIN creator_tiers ct ON ct.id = q.tier_id
     WHERE q.id = $1`,
    [quoteId]
  );
  if (!quote.rowCount) throw new Error("Quote not found");
  if (quote.rows[0].status !== "ACTIVE" || new Date(quote.rows[0].expires_at) <= new Date()) throw new Error("Quote expired or unavailable");
  const account = await query<{ external_account_id: string }>("SELECT external_account_id FROM creator_connected_accounts WHERE creator_id = $1 AND charges_enabled = true", [quote.rows[0].creator_id]);
  if (!account.rowCount) throw new Error("Creator payments are not ready");
  const provider = await getCreatorPaymentsProvider().createRecurringDirectChargeSubscription({
    connectedAccountId: account.rows[0].external_account_id,
    customerEmail: user.email,
    amountMinor: Number(quote.rows[0].retail_minor),
    currency: quote.rows[0].currency,
    interval: quote.rows[0].billing_interval === "annual" ? "year" : "month",
    applicationFeeMinor: 0,
    quoteId,
    tierName: quote.rows[0].tier_name
  });
  return transaction(async (client) => {
    await client.query("UPDATE membership_price_quotes SET status = 'ACCEPTED', accepted_at = now() WHERE id = $1", [quoteId]);
    const sub = await client.query<{ id: string }>(
      `INSERT INTO membership_subscriptions (creator_id, member_user_id, tier_id, quote_id, state, provider_subscription_id, provider_customer_id, provider_price_id, provider_invoice_id)
       VALUES ($1,$2,$3,$4,'PENDING_PAYMENT',$5,$6,$7,$8)
       ON CONFLICT (creator_id, member_user_id, tier_id) DO UPDATE SET quote_id = EXCLUDED.quote_id, state = 'PENDING_PAYMENT', provider_subscription_id = EXCLUDED.provider_subscription_id, provider_customer_id = EXCLUDED.provider_customer_id, provider_price_id = EXCLUDED.provider_price_id, provider_invoice_id = EXCLUDED.provider_invoice_id
       RETURNING id`,
      [quote.rows[0].creator_id, user.id, quote.rows[0].tier_id, quoteId, provider.providerSubscriptionId, provider.providerCustomerId, provider.providerPriceId, provider.providerInvoiceId]
    );
    await client.query("INSERT INTO membership_events (subscription_id,event_type,metadata) VALUES ($1,'subscription_pending_provider_confirmation',$2)", [sub.rows[0].id, provider]);
    return { subscriptionId: sub.rows[0].id, providerPaymentId: provider.providerPaymentId };
  });
}

export async function activateFromProviderPayment(input: { quoteId: string; providerPaymentId: string; actualProviderFeeMinor: number }) {
  return transaction(async (client) => {
    const quoteResult = await client.query(
      `SELECT q.*, tpv.billing_interval
       FROM membership_price_quotes q
       JOIN tier_price_versions tpv ON tpv.id = q.tier_price_version_id
       WHERE q.id = $1
       FOR UPDATE OF q`,
      [input.quoteId]
    );
    if (!quoteResult.rowCount) throw new Error("Quote not found");
    const quote = quoteResult.rows[0];
    const sub = await client.query<{ id: string; creator_id: string; member_user_id: string }>("SELECT id,creator_id,member_user_id FROM membership_subscriptions WHERE quote_id = $1 FOR UPDATE", [input.quoteId]);
    if (!sub.rowCount) throw new Error("Subscription not found");
    await client.query(
      "UPDATE membership_subscriptions SET state = 'ACTIVE', current_period_end = now() + CASE WHEN $2 = 'annual' THEN interval '1 year' ELSE interval '1 month' END, updated_at = now() WHERE id = $1",
      [sub.rows[0].id, quote.billing_interval]
    );
    await client.query(
      `INSERT INTO integration_entitlement_events (creator_id,member_user_id,provider,action,state,metadata)
       SELECT $1,$2,provider,'grant','ACTIVE',jsonb_build_object('subscriptionId',$3::text)
       FROM integration_connections WHERE creator_id = $1 AND state = 'CONNECTED'`,
      [sub.rows[0].creator_id, sub.rows[0].member_user_id, sub.rows[0].id]
    );
    const payment = await client.query<{ id: string }>(
      `INSERT INTO membership_payments (subscription_id, quote_id, provider_payment_id, gross_minor, currency, status)
       VALUES ($1,$2,$3,$4,$5,'SUCCEEDED')
       ON CONFLICT (provider_payment_id) DO UPDATE SET status = membership_payments.status
       RETURNING id`,
      [sub.rows[0].id, input.quoteId, input.providerPaymentId, quote.retail_minor, quote.currency]
    );
    const reconciliation = reconcilePayment(
      {
        id: quote.id,
        creatorId: quote.creator_id,
        tierId: quote.tier_id,
        target: money(Number(quote.target_minor), quote.currency),
        retail: money(Number(quote.retail_minor), quote.currency),
        tax: money(Number(quote.tax_minor), quote.currency),
        providerCost: money(Number(quote.provider_cost_minor), quote.currency),
        billingCost: money(0, quote.currency),
        fxCost: money(0, quote.currency),
        modeledCreatorProceeds: money(Number(quote.modeled_creator_proceeds_minor), quote.currency),
        platformFee: money(0, quote.currency),
        pricingRuleVersion: quote.pricing_rule_version,
        eligibilityProfileVersion: quote.eligibility_profile_version,
        paymentContext: quote.payment_context,
        expiresAt: quote.expires_at,
        status: quote.status
      },
      money(input.actualProviderFeeMinor, quote.currency),
      input.providerPaymentId
    );
    const rec = await client.query<{ id: string }>(
      `INSERT INTO guarantee_reconciliations
       (payment_id,quote_id,target_minor,customer_charged_minor,actual_tax_minor,actual_provider_fee_minor,actual_creator_proceeds_minor,zero_fee_platform_fee_minor,surplus_minor,shortfall_minor,currency,status,provider_transaction_reference)
       VALUES ($1,$2,$3,$4,$5,$6,$7,0,$8,$9,$10,$11,$12)
       ON CONFLICT (payment_id) DO UPDATE SET status = guarantee_reconciliations.status
       RETURNING id`,
      [payment.rows[0].id, input.quoteId, reconciliation.target.amountMinor, reconciliation.customerCharged.amountMinor, reconciliation.actualTax.amountMinor, reconciliation.actualProviderFee.amountMinor, reconciliation.actualCreatorProceeds.amountMinor, reconciliation.surplus.amountMinor, reconciliation.shortfall.amountMinor, reconciliation.customerCharged.currency, reconciliation.status, reconciliation.providerTransactionReference]
    );
    if (reconciliation.status === "GUARANTEE_SHORTFALL") {
      await client.query(
        "INSERT INTO guarantee_incidents (reconciliation_id, creator_id, pricing_rule_version, status, severity) VALUES ($1,$2,$3,'OPEN','HIGH') ON CONFLICT (reconciliation_id) DO NOTHING",
        [rec.rows[0].id, quote.creator_id, quote.pricing_rule_version]
      );
      await client.query("UPDATE guarantee_eligibility_profiles SET status = 'PAUSED' WHERE version = $1", [quote.eligibility_profile_version]);
    }
    return reconciliation;
  });
}

export async function canAccessPost(user: AuthUser | null, postId: string) {
  const post = await query<{ creator_id: string; visibility: string; body: string; state: string }>("SELECT * FROM posts WHERE id = $1", [postId]);
  if (!post.rowCount || post.rows[0].state !== "PUBLISHED") return { allowed: false, body: null };
  if (post.rows[0].visibility === "PUBLIC") return { allowed: true, body: post.rows[0].body };
  if (!user) return { allowed: false, body: null };
  const entitlement = await query(
    `SELECT ms.id FROM membership_subscriptions ms
     LEFT JOIN post_tier_access pta ON pta.tier_id = ms.tier_id
     WHERE ms.creator_id = $1 AND ms.member_user_id = $2 AND ms.state IN ('ACTIVE','GRACE','CANCEL_AT_PERIOD_END')
       AND ($3 = 'ALL_PAID' OR pta.post_id = $4)`,
    [post.rows[0].creator_id, user.id, post.rows[0].visibility, postId]
  );
  return entitlement.rowCount ? { allowed: true, body: post.rows[0].body } : { allowed: false, body: null };
}

export async function recordMembershipEvent(subscriptionId: string, eventType: string, metadata: Record<string, unknown> = {}) {
  await query("INSERT INTO membership_events (subscription_id,event_type,metadata) VALUES ($1,$2,$3)", [subscriptionId, eventType, metadata]);
}

export async function requireMemberSubscription(user: AuthUser, subscriptionId: string) {
  requireRole(user, "MEMBER");
  const result = await query<{ id: string }>("SELECT id FROM membership_subscriptions WHERE id = $1 AND member_user_id = $2", [subscriptionId, user.id]);
  if (!result.rowCount) throw new Error("FORBIDDEN");
}

export async function markSubscriptionRenewal(subscriptionId: string, succeeded: boolean) {
  const state = succeeded ? "ACTIVE" : "PAST_DUE";
  const tier = await query<{ billing_interval: "monthly" | "annual" }>(
    `SELECT tpv.billing_interval
     FROM membership_subscriptions ms
     JOIN creator_tiers ct ON ct.id = ms.tier_id
     JOIN tier_price_versions tpv ON tpv.tier_id = ct.id AND tpv.active = true
     WHERE ms.id = $1`,
    [subscriptionId]
  );
  const interval = tier.rows[0]?.billing_interval === "annual" ? "1 year" : "1 month";
  await query(
    "UPDATE membership_subscriptions SET state = $1, current_period_end = CASE WHEN $2 THEN now() + $3::interval ELSE current_period_end END, updated_at = now() WHERE id = $4",
    [state, succeeded, interval, subscriptionId]
  );
  await recordMembershipEvent(subscriptionId, succeeded ? "renewal_succeeded" : "renewal_failed", { provider: "mock" });
}

export async function simulateFailedRenewal(subscriptionId: string) {
  await query("UPDATE membership_subscriptions SET state = 'GRACE', updated_at = now() WHERE id = $1", [subscriptionId]);
  await recordMembershipEvent(subscriptionId, "dunning_grace_started", { provider: "mock", retry: 1 });
}

export async function cancelSubscription(subscriptionId: string, atPeriodEnd: boolean) {
  const subscription = await query<{ creator_id: string; member_user_id: string }>("SELECT creator_id,member_user_id FROM membership_subscriptions WHERE id = $1", [subscriptionId]);
  if (!subscription.rowCount) throw new Error("Subscription not found");
  await query("UPDATE membership_subscriptions SET state = $1, updated_at = now() WHERE id = $2", [atPeriodEnd ? "CANCEL_AT_PERIOD_END" : "CANCELLED", subscriptionId]);
  if (!atPeriodEnd) await query("INSERT INTO integration_entitlement_events (creator_id,member_user_id,provider,action,state,metadata) SELECT $1,$2,provider,'revoke','REVOKED',jsonb_build_object('subscriptionId',$3) FROM integration_connections WHERE creator_id=$1 AND state='CONNECTED'", [subscription.rows[0].creator_id, subscription.rows[0].member_user_id, subscriptionId]);
  await recordMembershipEvent(subscriptionId, atPeriodEnd ? "cancel_at_period_end" : "cancelled_immediately");
}

export async function resumeSubscription(subscriptionId: string) {
  await query("UPDATE membership_subscriptions SET state = 'ACTIVE', updated_at = now() WHERE id = $1", [subscriptionId]);
  await recordMembershipEvent(subscriptionId, "resumed");
}

export async function changeSubscriptionTier(subscriptionId: string, tierId: string) {
  await query("UPDATE membership_subscriptions SET tier_id = $1, state = 'REPRICE_REQUIRED', updated_at = now() WHERE id = $2", [tierId, subscriptionId]);
  await recordMembershipEvent(subscriptionId, "tier_change_reprice_required", { tierId });
}

export async function refundMembershipPayment(user: AuthUser, paymentId: string) {
  const payment = await query<{ id: string; creator_id: string; external_account_id: string; provider_payment_id: string }>(
    `SELECT mp.id, ms.creator_id, cca.external_account_id, mp.provider_payment_id
     FROM membership_payments mp
     JOIN membership_subscriptions ms ON ms.id = mp.subscription_id
     JOIN creator_connected_accounts cca ON cca.creator_id = ms.creator_id
     WHERE mp.id = $1`,
    [paymentId]
  );
  if (!payment.rowCount) throw new Error("Payment not found");
  await requireCreatorOwner(user, payment.rows[0].creator_id);
  const refund = await getCreatorPaymentsProvider().refundPayment({ connectedAccountId: payment.rows[0].external_account_id, providerPaymentId: payment.rows[0].provider_payment_id, idempotencyKey: `refund:${paymentId}` });
  await query("UPDATE membership_payments SET status = 'REFUNDED' WHERE id = $1", [paymentId]);
  await query("UPDATE guarantee_reconciliations SET status = 'REFUNDED' WHERE payment_id = $1", [paymentId]);
  await query("INSERT INTO membership_events (subscription_id,event_type,metadata) SELECT subscription_id,'refund_created',$2 FROM membership_payments WHERE id = $1", [paymentId, refund]);
  return refund;
}

export async function simulateDispute(paymentId: string) {
  await query("UPDATE membership_payments SET status = 'DISPUTED' WHERE id = $1", [paymentId]);
  await query("UPDATE guarantee_reconciliations SET status = 'DISPUTED' WHERE payment_id = $1", [paymentId]);
  await query("INSERT INTO membership_events (subscription_id,event_type,metadata) SELECT subscription_id,'dispute_created','{}'::jsonb FROM membership_payments WHERE id = $1", [paymentId]);
}
