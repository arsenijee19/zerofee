import { randomToken, hashToken } from "@/lib/server/crypto";
import { validateOutboundWebhookUrl } from "@/lib/server/security";
import { query } from "@/lib/server/db";

export async function createApiKey(creatorId: string, scopes: string[]) {
  const secret = randomToken("zfapi");
  const result = await query<{ id: string }>("INSERT INTO api_keys (creator_id, key_hash, scopes) VALUES ($1,$2,$3) RETURNING id", [creatorId, hashToken(secret), scopes]);
  return { id: result.rows[0].id, secret };
}

export async function verifyApiKey(secret: string, creatorId: string, scope: string) {
  const key = await query<{ scopes: string[] }>("SELECT scopes FROM api_keys WHERE key_hash = $1 AND creator_id = $2 AND revoked_at IS NULL", [hashToken(secret), creatorId]);
  return Boolean(key.rowCount && key.rows[0].scopes.includes(scope));
}

export async function revokeApiKey(id: string, creatorId: string) {
  await query("UPDATE api_keys SET revoked_at = now() WHERE id = $1 AND creator_id = $2", [id, creatorId]);
}

export async function createOutboundWebhook(creatorId: string, url: string, secret: string) {
  const safeUrl = validateOutboundWebhookUrl(url);
  return query("INSERT INTO outbound_webhook_endpoints (creator_id,url,secret_hash) VALUES ($1,$2,$3) RETURNING id", [creatorId, safeUrl, hashToken(secret)]);
}
