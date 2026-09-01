import { createApiKeyAction, createWebhookEndpointAction, revokeApiKeyAction } from "@/app/actions";
import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function CreatorApiPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const user = await requireRole("CREATOR");
  const params = await searchParams;
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  const keys = (await query<{ id: string; scopes: string[]; revoked_at: Date | null }>("SELECT id,scopes,revoked_at FROM api_keys WHERE creator_id = $1 ORDER BY created_at DESC", [creator.id])).rows;
  const hooks = (await query<{ id: string; url: string; disabled_at: Date | null }>("SELECT id,url,disabled_at FROM outbound_webhook_endpoints WHERE creator_id = $1 ORDER BY created_at DESC", [creator.id])).rows;
  return <ProductShell kind="creator" title="API / Webhooks" user={user}>{params.created && <p className="status-pill success">Plaintext key, shown once: {params.created}</p>}<Panel title="Create API key"><form className="inline-form" action={createApiKeyAction}><input type="hidden" name="creatorId" value={creator.id} /><select name="scope"><option>entitlements:read</option><option>members:read</option></select><button className="primary-button">Create key</button></form></Panel><DataTable headings={["ID", "Scopes", "State", "Action"]} rows={keys.map((k) => [k.id, k.scopes.join(", "), k.revoked_at ? "REVOKED" : "ACTIVE", <form action={revokeApiKeyAction}><input type="hidden" name="creatorId" value={creator.id} /><input type="hidden" name="keyId" value={k.id} /><button className="secondary-button">Revoke</button></form>])} /><Panel title="Outbound webhook"><form className="inline-form" action={createWebhookEndpointAction}><input type="hidden" name="creatorId" value={creator.id} /><input name="url" required defaultValue="https://example.com/zerofee-hook" /><button className="primary-button">Save endpoint</button></form></Panel><DataTable headings={["URL", "State"]} rows={hooks.map((h) => [h.url, h.disabled_at ? "DISABLED" : "ACTIVE"])} /></ProductShell>;
}
