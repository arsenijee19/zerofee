import { hashPayload } from "@/lib/server/crypto";
import { verifyPayloadSignature } from "@/lib/server/security";
import { query, transaction } from "@/lib/server/db";
import { activateFromProviderPayment } from "@/lib/server/membership-service";

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
