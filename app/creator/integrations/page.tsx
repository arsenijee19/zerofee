import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function CreatorIntegrationsPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  const rows = (await query<{ provider: string; external_reference: string; state: string; metadata: Record<string, unknown> }>("SELECT provider,external_reference,state,metadata FROM integration_connections WHERE creator_id=$1 ORDER BY provider", [creator.id])).rows;
  return <ProductShell kind="creator" title="Integrations" user={user}><Panel title="Connected channels"><DataTable headings={["Provider", "Reference", "State", "Mode"]} rows={rows.map((row) => [row.provider, row.external_reference, row.state, row.metadata.mode ? String(row.metadata.mode) : "mock"])} /></Panel><p className="muted">Discord, Telegram and email adapters use the same entitlement boundary; live credentials remain external configuration.</p></ProductShell>;
}
