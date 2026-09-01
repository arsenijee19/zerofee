import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { query } from "@/lib/server/db";

export default async function AdminWebhooksPage() {
  const user = await requireRole("ADMIN");
  const rows = (await query<{ provider: string; provider_event_id: string; event_type: string; status: string; received_at: Date }>("SELECT provider,provider_event_id,event_type,status,received_at FROM webhooks ORDER BY received_at DESC LIMIT 100")).rows;
  return <ProductShell kind="admin" title="Webhooks" user={user}><Panel title="Provider event log"><DataTable headings={["Provider", "Event", "Type", "State", "Received"]} rows={rows.map((row) => [row.provider, row.provider_event_id, row.event_type, row.status, new Date(row.received_at).toLocaleString()])} /></Panel></ProductShell>;
}
