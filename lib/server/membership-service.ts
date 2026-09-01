import type { AuthUser } from "@/lib/server/auth";
import { money } from "@/lib/money";
import { reconcilePayment } from "@/lib/domain/pricing";
import { query, transaction } from "@/lib/server/db";
import { getCreatorPaymentsProvider } from "@/lib/server/providers";

export async function acceptQuoteAndCreatePendingSubscription(user: AuthUser, quoteId: string) {
  const quote = await query<{ id: string; creator_id: string; tier_id: string; retail_minor: string; currency: string; expires_at: string; status: string }>("SELECT * FROM membership_price_quotes WHERE id = $1", [quoteId]);
  if (!quote.rowCount) throw new Error("Quote not found");
  if (quote.rows[0].status !== "ACTIVE" || new Date(quote.rows[0].expires_at) <= new Date()) throw new Error("Quote expired or unavailable");
  const account = await query<{ external_account_id: string }>("SELECT external_account_id FROM creator_connected_accounts WHERE creator_id = $1 AND charges_enabled = true", [quote.rows[0].creator_id]);
  if (!account.rowCount) throw new Error("Creator payments are not ready");
  const provider = await getCreatorPaymentsProvider().createDirectChargeSubscription({
    connectedAccountId: account.rows[0].external_account_id,
    customerEmail: user.email,
    amountMinor: Number(quote.rows[0].retail_minor),
    currency: quote.rows[0].currency,
    applicationFeeMinor: 0,
    quoteId
  });
  return transaction(async (client) => {
    await client.query("UPDATE membership_price_quotes SET status = 'ACCEPTED', accepted_at = now() WHERE id = $1", [quoteId]);
    const sub = await client.query<{ id: string }>(
      `INSERT INTO membership_subscriptions (creator_id, member_user_id, tier_id, quote_id, state, provider_subscription_id)
       VALUES ($1,$2,$3,$4,'PENDING_PAYMENT',$5)
       ON CONFLICT (creator_id, member_user_id, tier_id) DO UPDATE SET quote_id = EXCLUDED.quote_id, state = 'PENDING_PAYMENT', provider_subscription_id = EXCLUDED.provider_subscription_id
       RETURNING id`,
      [quote.rows[0].creator_id, user.id, quote.rows[0].tier_id, quoteId, provider.providerSubscriptionId]
    );
    return { subscriptionId: sub.rows[0].id, providerPaymentId: provider.providerPaymentId };
  });
}

export async function activateFromProviderPayment(input: { quoteId: string; providerPaymentId: string; actualProviderFeeMinor: number }) {
  return transaction(async (client) => {
    const quoteResult = await client.query("SELECT * FROM membership_price_quotes WHERE id = $1 FOR UPDATE", [input.quoteId]);
    if (!quoteResult.rowCount) throw new Error("Quote not found");
    const quote = quoteResult.rows[0];
    const sub = await client.query<{ id: string }>("SELECT id FROM membership_subscriptions WHERE quote_id = $1 FOR UPDATE", [input.quoteId]);
    if (!sub.rowCount) throw new Error("Subscription not found");
    await client.query("UPDATE membership_subscriptions SET state = 'ACTIVE', current_period_end = now() + interval '1 month', updated_at = now() WHERE id = $1", [sub.rows[0].id]);
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
