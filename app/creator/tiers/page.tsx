import Link from "next/link";
import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser, listCreatorTiers } from "@/lib/server/route-data";

export default async function CreatorTiersPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  const tiers = await listCreatorTiers(creator.id);
  return <ProductShell kind="creator" title="Membership Tiers" user={user}><Panel title="Persisted tiers"><Link className="primary-button" href="/creator/tiers/new">Create tier</Link></Panel><DataTable headings={["Name", "Mode", "Amount", "Interval", "State"]} rows={tiers.map((t) => [t.name, t.pricing_mode, `${t.currency} ${(Number(t.creator_target_minor) / 100).toFixed(2)}`, t.billing_interval, t.state])} /></ProductShell>;
}
