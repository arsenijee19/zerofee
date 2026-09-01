import { ProductShell, Panel, Metric } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { listMyMemberships } from "@/lib/server/route-data";

export default async function MemberDashboardPage() {
  const user = await requireRole("MEMBER");
  const memberships = await listMyMemberships(user);
  return <ProductShell kind="member" title="Home" user={user}><section className="metric-grid"><Metric title="Memberships" value={String(memberships.length)} /><Metric title="Active" value={String(memberships.filter((membership) => membership.state === "ACTIVE").length)} /><Metric title="Payment model" value="0% platform fee" tone="success" /></section><Panel title="Your memberships"><p>{memberships.length ? "Manage access, billing and renewal from Memberships." : "You are not supporting a creator yet."}</p><a className="primary-button" href={memberships.length ? "/member/memberships" : "/c/mila-nova"}>{memberships.length ? "Open memberships" : "Explore Mila's page"}</a></Panel></ProductShell>;
}
