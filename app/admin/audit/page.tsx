import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { query } from "@/lib/server/db";

export default async function AdminAuditPage() {
  const user = await requireRole("ADMIN");
  const rows = (await query<{ action: string; target_type: string; target_id: string; created_at: Date }>("SELECT action,target_type,target_id,created_at FROM audit_logs ORDER BY created_at DESC LIMIT 100")).rows;
  return <ProductShell kind="admin" title="Audit" user={user}><Panel title="Immutable operational trail"><DataTable headings={["Action", "Target", "Target ID", "Created"]} rows={rows.map((row) => [row.action, row.target_type, row.target_id, new Date(row.created_at).toLocaleString()])} /></Panel></ProductShell>;
}
