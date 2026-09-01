import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { listMyMemberships } from "@/lib/server/route-data";

export default async function MemberMembershipsPage() {
  const user = await requireRole("MEMBER");
  const memberships = await listMyMemberships(user);
  return <ProductShell kind="member" title="Memberships" user={user}><Panel title="Access and status"><DataTable headings={["Creator", "Tier", "State", "Renewal"]} rows={memberships.map((membership) => [membership.creator_name, membership.tier_name, membership.state, membership.current_period_end ? new Date(membership.current_period_end).toLocaleDateString() : "Pending provider confirmation"])} /></Panel></ProductShell>;
}
