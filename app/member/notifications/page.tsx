import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { query } from "@/lib/server/db";

export default async function MemberNotificationsPage() {
  const user = await requireRole("MEMBER");
  const rows = (await query<{ title: string; body: string; created_at: Date }>("SELECT title,body,created_at FROM notifications WHERE user_id=$1 ORDER BY created_at DESC", [user.id])).rows;
  return <ProductShell kind="member" title="Notifications" user={user}><Panel title="Inbox"><DataTable headings={["Title", "Message", "Received"]} rows={rows.map((row) => [row.title, row.body, new Date(row.created_at).toLocaleString()])} /></Panel></ProductShell>;
}
