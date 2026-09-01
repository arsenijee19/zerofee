import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function CreatorMembersPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return <ProductShell kind="creator" title="Members" user={user}><Panel title="Application required"><a className="primary-button" href="/creator/application">Start application</a></Panel></ProductShell>;
  const rows = (await query<{ name: string; email: string; tier_name: string; state: string; current_period_end: Date | null }>("SELECT u.name,u.email,ct.name AS tier_name,ms.state,ms.current_period_end FROM membership_subscriptions ms JOIN users u ON u.id=ms.member_user_id JOIN creator_tiers ct ON ct.id=ms.tier_id WHERE ms.creator_id=$1 ORDER BY ms.updated_at DESC", [creator.id])).rows;
  return <ProductShell kind="creator" title="Members" user={user}><Panel title="Member access"><DataTable headings={["Member", "Email", "Tier", "State", "Renewal"]} rows={rows.map((row) => [row.name, row.email, row.tier_name, row.state, row.current_period_end ? new Date(row.current_period_end).toLocaleDateString() : "Pending"])} /></Panel></ProductShell>;
}
