import { hashPayload } from "@/lib/server/crypto";
import { verifyPayloadSignature } from "@/lib/server/security";
import { query, transaction } from "@/lib/server/db";
import { activateFromProviderPayment, cancelSubscription, markSubscriptionRenewal, simulateDispute } from "@/lib/server/membership-service";
import type Stripe from "stripe";
import { getEnv } from "@/lib/server/env";
import { getCreatorPaymentsProvider } from "@/lib/server/providers";

export async function processMockWebhook(payload: string, signature: string, secret: string) {
  if (!verifyPayloadSignature(payload, signature, secret)) throw new Error("Invalid webhook signature");
  const event = JSON.parse(payload) as { id: string; type: string; connectedAccountId?: string; data: { quoteId?: string; providerPaymentId?: string; actualProviderFeeMinor?: number } };
  const existing = await query("SELECT id, status FROM webhooks WHERE provider = 'mock' AND provider_event_id = $1", [event.id]);
  if (existing.rowCount) return { idempotent: true, status: existing.rows[0].status };
  return transaction(async (client) => {
    const saved = await client.query<{ id: string }>(
      "INSERT INTO webhooks (provider, provider_event_id, connected_account_id, event_type, payload_hash, status) VALUES ('mock',$1,$2,$3,$4,'PROCESSING') RETURNING id",
      [event.id, event.connectedAccountId ?? null, event.type, hashPayload(payload)]
    );
    try {
      if (event.type === "payment.succeeded" && event.data.quoteId && event.data.providerPaymentId) {
        await activateFromProviderPayment({
          quoteId: event.data.quoteId,
          providerPaymentId: event.data.providerPaymentId,
          actualProviderFeeMinor: event.data.actualProviderFeeMinor ?? 0
        });
      }
      await client.query("UPDATE webhooks SET status = 'PROCESSED', processed_at = now() WHERE id = $1", [saved.rows[0].id]);
      await client.query("INSERT INTO webhook_processing_attempts (webhook_id, status) VALUES ($1,'PROCESSED')", [saved.rows[0].id]);
      return { idempotent: false, status: "PROCESSED" };
    } catch (error) {
      await client.query("UPDATE webhooks SET status = 'FAILED' WHERE id = $1", [saved.rows[0].id]);
      await client.query("INSERT INTO webhook_processing_attempts (webhook_id, status, error) VALUES ($1,'FAILED',$2)", [saved.rows[0].id, error instanceof Error ? error.message : "unknown"]);
      throw error;
    }
  });
}

export async function processStripeWebhook(event: Stripe.Event) {
  const existing = await query("SELECT id, status FROM webhooks WHERE provider = 'stripe' AND provider_event_id = $1", [event.id]);
  if (existing.rowCount) return { idempotent: true, status: existing.rows[0].status };

  const payloadHash = hashPayload(JSON.stringify({ id: event.id, type: event.type, account: event.account, object: event.data.object }));
  return transaction(async (client) => {
    const saved = await client.query<{ id: string }>(
      "INSERT INTO webhooks (provider, provider_event_id, connected_account_id, event_type, payload_hash, status) VALUES ('stripe',$1,$2,$3,$4,'PROCESSING') RETURNING id",
      [event.id, event.account ?? null, event.type, payloadHash]
    );
    try {
      await mapStripeEvent(event);
      await client.query("UPDATE webhooks SET status = 'PROCESSED', processed_at = now() WHERE id = $1", [saved.rows[0].id]);
      await client.query("INSERT INTO webhook_processing_attempts (webhook_id, status) VALUES ($1,'PROCESSED')", [saved.rows[0].id]);
      return { idempotent: false, status: "PROCESSED" };
    } catch (error) {
      await client.query("UPDATE webhooks SET status = 'FAILED' WHERE id = $1", [saved.rows[0].id]);
      await client.query("INSERT INTO webhook_processing_attempts (webhook_id, status, error) VALUES ($1,'FAILED',$2)", [saved.rows[0].id, error instanceof Error ? error.message : "unknown"]);
      throw error;
    }
  });
}

async function mapStripeEvent(event: Stripe.Event) {
  const object = event.data.object as unknown as Record<string, unknown>;
  const metadata = typeof object.metadata === "object" && object.metadata ? object.metadata as Record<string, string> : {};
  const subscriptionId = metadata.subscriptionId || String(object.subscription ?? "");
  let quoteId = metadata.quoteId;
  if (event.type === "invoice.payment_succeeded" && !quoteId && subscriptionId) {
    const quote = await query<{ quote_id: string }>(
      "SELECT quote_id FROM membership_subscriptions WHERE provider_subscription_id = $1 OR provider_invoice_id = $2 LIMIT 1",
      [subscriptionId, String(object.id)]
    );
    quoteId = quote.rows[0]?.quote_id;
  }
  if (event.type === "invoice.payment_succeeded" && quoteId) {
    const providerPaymentId = String(object.payment_intent ?? object.id);
    let actualProviderFeeMinor = Number(metadata.actualProviderFeeMinor ?? 0);
    if (event.account && getEnv().CREATOR_PAYMENTS_PROVIDER === "stripe") {
      const actual = await getCreatorPaymentsProvider().getActualProviderFee({ connectedAccountId: event.account, providerPaymentId });
      actualProviderFeeMinor = actual.actualProviderFeeMinor;
    }
    await activateFromProviderPayment({
      quoteId,
      providerPaymentId,
      actualProviderFeeMinor
    });
    return;
  }
  if (event.type === "invoice.payment_failed" && subscriptionId) {
    const sub = await query<{ id: string }>("SELECT id FROM membership_subscriptions WHERE provider_subscription_id = $1", [subscriptionId]);
    if (sub.rowCount) await markSubscriptionRenewal(sub.rows[0].id, false);
    return;
  }
  if (event.type === "customer.subscription.updated" && subscriptionId) {
    const sub = await query<{ id: string }>("SELECT id FROM membership_subscriptions WHERE provider_subscription_id = $1", [subscriptionId]);
    if (sub.rowCount && object.cancel_at_period_end === true) await cancelSubscription(sub.rows[0].id, true);
    return;
  }
  if (event.type === "customer.subscription.deleted" && subscriptionId) {
    const sub = await query<{ id: string }>("SELECT id FROM membership_subscriptions WHERE provider_subscription_id = $1", [subscriptionId]);
    if (sub.rowCount) await cancelSubscription(sub.rows[0].id, false);
    return;
  }
  if (event.type === "charge.dispute.created" || event.type === "payment_intent.payment_failed") {
    const paymentId = metadata.paymentId;
    if (paymentId) await simulateDispute(paymentId);
    return;
  }
  if (event.type === "account.updated" && event.account) {
    await query(
      "UPDATE creator_connected_accounts SET onboarding_state = $1, charges_enabled = $2, payouts_enabled = $3, requirements = $4, updated_at = now() WHERE external_account_id = $5",
      [object.charges_enabled && object.payouts_enabled ? "READY" : "REQUIREMENTS_DUE", Boolean(object.charges_enabled), Boolean(object.payouts_enabled), JSON.stringify(object.requirements ?? {}), event.account]
    );
  }
}
