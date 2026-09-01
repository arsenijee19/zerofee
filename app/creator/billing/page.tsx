import { activatePlanAction } from "@/app/actions";
import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function CreatorBillingPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  const subs = (await query<{ plan: string; state: string; current_period_end: Date | null }>("SELECT pp.name AS plan, ps.state, ps.current_period_end FROM platform_subscriptions ps JOIN platform_plan_versions ppv ON ppv.id = ps.plan_version_id JOIN platform_plans pp ON pp.id = ppv.plan_id WHERE ps.creator_id = $1", [creator.id])).rows;
  return <ProductShell kind="creator" title="ZeroFee Billing" user={user}><Panel title="Activate SaaS plan"><form className="inline-form" action={activatePlanAction}><input type="hidden" name="creatorId" value={creator.id} /><select name="planCode"><option value="creator">Creator</option><option value="pro">Pro</option></select><button className="primary-button">Activate mock billing</button></form></Panel><DataTable headings={["Plan", "State", "Period end"]} rows={subs.map((s) => [s.plan, s.state, s.current_period_end?.toISOString() ?? "n/a"])} /></ProductShell>;
}
