import { createTierAction } from "@/app/actions";
import { ProductShell, Panel } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";

export default async function NewTierPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  return <ProductShell kind="creator" title="Create tier" user={user}><Panel title="Tier details"><form className="form-stack" action={createTierAction}><input type="hidden" name="creatorId" value={creator.id} /><label>Name<input name="name" required defaultValue={`Signal ${Date.now()}`} /></label><label>Description<input name="description" required defaultValue="Member briefings" /></label><label>Benefits<textarea name="benefits" required defaultValue="Weekly posts and community access" /></label><label>Pricing mode<select name="pricingMode"><option value="GUARANTEED_EARNINGS">Set what you earn</option><option value="SIMPLE_PRICE">Simple Price</option></select></label><label>Amount<input name="amount" required type="number" step="0.01" defaultValue="10.00" /></label><label>Currency<select name="currency"><option>EUR</option><option>USD</option></select></label><label>Interval<select name="interval"><option value="monthly">Monthly</option><option value="annual">Annual</option></select></label><label><span><input name="publish" type="checkbox" defaultChecked /> Publish now</span></label><button className="primary-button">Save tier</button></form></Panel></ProductShell>;
}
