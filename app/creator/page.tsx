import type { Metadata } from "next";
import Link from "next/link";
import { ProductShell, Panel, Metric } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser, listCreatorTiers } from "@/lib/server/route-data";
import { creatorOnboarding } from "@/lib/server/profile-service";
import { query } from "@/lib/server/db";
import { formatMoney, money } from "@/lib/money";

export const metadata: Metadata = { title: "Creator dashboard" };

export default async function CreatorDashboardPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return <ProductShell kind="creator" title="Application required" user={user}><Panel title="Create your creator profile"><p>Tell us about your offering. An operator reviews every application before payouts are enabled.</p><Link className="primary-button" href="/creator/application">Start application</Link></Panel></ProductShell>;
  const [tiers, members, earnings, steps] = await Promise.all([
    listCreatorTiers(creator.id),
    query<{ count: string }>("SELECT COUNT(*) FROM membership_subscriptions WHERE creator_id = $1 AND state IN ('ACTIVE','GRACE','CANCEL_AT_PERIOD_END')", [creator.id]),
    query<{ total: string }>("SELECT COALESCE(SUM(actual_creator_proceeds_minor),0) AS total FROM guarantee_reconciliations gr JOIN membership_price_quotes q ON q.id = gr.quote_id WHERE q.creator_id = $1", [creator.id]),
    creatorOnboarding(creator.id)
  ]);
  const done = steps.filter((step) => step.done).length;
  const next = steps.find((step) => !step.done);
  return (
    <ProductShell kind="creator" title="Dashboard" user={user}>
      <section className="metric-grid">
        <Metric title="Active members" value={members.rows[0].count} />
        <Metric title="Published tiers" value={String(tiers.filter((tier) => tier.state === "PUBLISHED").length)} />
        <Metric title="Creator earnings" value={formatMoney(money(Number(earnings.rows[0].total), "EUR"))} tone="success" />
        <Metric title="ZeroFee membership fee" value="€0.00" tone="success" />
      </section>
      {done < steps.length ? (
        <Panel title="Launch checklist" eyebrow={`${done} of ${steps.length} done`}>
          <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={done} aria-label="Launch progress"><span style={{ width: `${(done / steps.length) * 100}%` }} /></div>
          <ol className="checklist">
            {steps.map((step) => (
              <li key={step.key} className={step.done ? "done" : undefined}>
                <span className="check-mark" aria-hidden="true">{step.done ? "✓" : ""}</span>
                <div><Link href={step.href}>{step.label}</Link><small>{step.done ? "Done" : step.hint}</small></div>
              </li>
            ))}
          </ol>
          {next && <Link className="primary-button" href={next.href}>Next: {next.label}</Link>}
        </Panel>
      ) : (
        <Panel title="You are live" eyebrow="All steps complete"><p>Your page is public and accepting members.</p><Link className="secondary-button" href={`/c/${creator.slug}`}>View public page</Link></Panel>
      )}
    </ProductShell>
  );
}
