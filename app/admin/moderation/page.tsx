import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { query } from "@/lib/server/db";

export default async function AdminModerationPage() {
  const user = await requireRole("ADMIN");
  const rows = (await query<{ reason: string; status: string; created_at: Date }>("SELECT reason,status,created_at FROM content_reports ORDER BY created_at DESC")).rows;
  return <ProductShell kind="admin" title="Moderation" user={user}><Panel title="Content reports"><DataTable headings={["Reason", "State", "Created"]} rows={rows.map((row) => [row.reason, row.status, new Date(row.created_at).toLocaleString()])} /></Panel></ProductShell>;
}
