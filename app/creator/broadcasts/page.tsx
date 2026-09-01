import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function CreatorBroadcastsPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  const rows = (await query<{ subject: string; audience: string; state: string; sent_at: Date | null }>("SELECT subject,audience,state,sent_at FROM broadcasts WHERE creator_id=$1 ORDER BY created_at DESC", [creator.id])).rows;
  return <ProductShell kind="creator" title="Broadcasts" user={user}><Panel title="Broadcast history"><DataTable headings={["Subject", "Audience", "State", "Sent"]} rows={rows.map((row) => [row.subject, row.audience, row.state, row.sent_at ? new Date(row.sent_at).toLocaleString() : "Queued"])} /></Panel></ProductShell>;
}
