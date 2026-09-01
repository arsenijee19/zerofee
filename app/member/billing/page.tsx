import { subscriptionLifecycleAction, changeTierAction } from "@/app/actions";
import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { listMyMemberships } from "@/lib/server/route-data";

export default async function MemberBillingPage() {
  const user = await requireRole("MEMBER");
  const memberships = await listMyMemberships(user);
  return <ProductShell kind="member" title="Billing" user={user}><Panel title="Subscription controls"><DataTable headings={["Creator", "Tier", "State", "Actions"]} rows={memberships.map((membership) => [membership.creator_name, membership.tier_name, membership.state, <div className="cta-row" key={membership.id}><form action={subscriptionLifecycleAction}><input type="hidden" name="subscriptionId" value={membership.id} /><input type="hidden" name="lifecycle" value="cancel" /><button className="secondary-button">Cancel at period end</button></form><form action={subscriptionLifecycleAction}><input type="hidden" name="subscriptionId" value={membership.id} /><input type="hidden" name="lifecycle" value="resume" /><button className="secondary-button">Resume</button></form><form action={subscriptionLifecycleAction}><input type="hidden" name="subscriptionId" value={membership.id} /><input type="hidden" name="lifecycle" value="fail" /><button className="secondary-button">Test dunning</button></form></div>])} /></Panel><p className="muted">Changes are server-authoritative and provider events are recorded for audit.</p></ProductShell>;
}
