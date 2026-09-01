import { ProductShell, Panel, Metric } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser, listCreatorTiers } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function CreatorDashboardPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return <ProductShell kind="creator" title="Application required" user={user}><Panel title="Create your creator profile"><a className="primary-button" href="/creator/application">Start application</a></Panel></ProductShell>;
  const tiers = await listCreatorTiers(creator.id);
  const members = await query<{ count: string }>("SELECT COUNT(*) FROM membership_subscriptions WHERE creator_id = $1 AND state IN ('ACTIVE','GRACE','CANCEL_AT_PERIOD_END')", [creator.id]);
  const earnings = await query<{ total: string }>("SELECT COALESCE(SUM(actual_creator_proceeds_minor),0) AS total FROM guarantee_reconciliations gr JOIN membership_price_quotes q ON q.id = gr.quote_id WHERE q.creator_id = $1", [creator.id]);
  return (
    <ProductShell kind="creator" title="Dashboard" user={user}>
      <section className="metric-grid">
        <Metric title="Active members" value={members.rows[0].count} />
        <Metric title="Published tiers" value={String(tiers.filter((tier) => tier.state === "PUBLISHED").length)} />
        <Metric title="Creator earnings" value={`€${(Number(earnings.rows[0].total) / 100).toFixed(2)}`} tone="success" />
        <Metric title="ZeroFee membership fee" value="€0.00" tone="success" />
      </section>
    </ProductShell>
  );
}
