import Link from "next/link";
import { Avatar, Metric, PublicHeader, SiteFooter } from "@/components/route-ui";
import { currentUserFromCookies } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { listPublishedCreators } from "@/lib/server/profile-service";
import { formatMoney, money } from "@/lib/money";

export async function MarketingShell({ children, hero }: { children: React.ReactNode; hero?: boolean }) {
  const user = await currentUserFromCookies();
  return (
    <>
      <PublicHeader user={user} />
      <main id="main-content" className={hero ? undefined : "marketing-main"}>{children}</main>
      <SiteFooter />
    </>
  );
}

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p className="hero-text">{children}</p>}
    </section>
  );
}

export function Steps({ items }: { items: Array<{ title: string; text: string }> }) {
  return (
    <ol className="steps">
      {items.map((item, index) => (
        <li key={item.title}><span className="step-number" aria-hidden="true">{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>
      ))}
    </ol>
  );
}

export function Faq({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>
      ))}
    </div>
  );
}

export function CtaBand({ title = "Ready to choose what you earn?", text = "Create your seller profile in minutes. No platform fee on membership revenue." }: { title?: string; text?: string }) {
  return (
    <section className="cta-band">
      <div><h2>{title}</h2><p>{text}</p></div>
      <div className="cta-row"><Link className="light-button large" href="/signup?role=creator">Start as a creator</Link><Link className="ghost-button large" href="/pricing">See plans</Link></div>
    </section>
  );
}

export const faqItems = [
  { q: "Does ZeroFee really take 0% of membership revenue?", a: "Yes. ZeroFee earns from a fixed monthly SaaS plan. The platform fee on every membership payment is 0, and this is enforced in the database for every price quote and payment reconciliation." },
  { q: "What are provider costs?", a: "Payment providers charge processing fees and local taxes may apply. With Guaranteed Earnings, ZeroFee calculates the lowest legal retail price so your modeled proceeds still reach your target, and shows the buyer the final price up front." },
  { q: "What happens if provider fees turn out higher than modeled?", a: "A shortfall opens a guarantee incident and pauses the affected eligibility profile so no new quotes are created from outdated pricing. Surplus always stays with the creator." },
  { q: "Can I bring my Patreon audience?", a: "Yes. Import a CSV export to create personal invitations. Payment credentials never move between platforms, so each member authorizes a new subscription." },
  { q: "Which countries are supported?", a: "Availability is configured per country and changes during the closed beta. The creator application shows the current status for your country." }
];

export async function PlanCards() {
  const plans = await query<{ code: string; name: string; monthly_price_minor: string; currency: "EUR" | "USD"; active_member_limit: number; storage_mb_limit: number; broadcast_limit: number }>(
    `SELECT pp.code, pp.name, ppv.monthly_price_minor, ppv.currency, ppv.active_member_limit, ppv.storage_mb_limit, ppv.broadcast_limit
     FROM platform_plans pp JOIN LATERAL (SELECT * FROM platform_plan_versions v WHERE v.plan_id = pp.id ORDER BY v.version DESC LIMIT 1) ppv ON true
     WHERE pp.active = true ORDER BY ppv.monthly_price_minor`
  );
  return (
    <div className="plan-grid">
      {plans.rows.map((plan) => (
        <article className={`price-card${plan.code === "creator" ? " recommended" : ""}`} key={plan.code}>
          {plan.code === "creator" && <span className="status-pill">Most popular</span>}
          <h3>{plan.name}</h3>
          <strong>{formatMoney(money(Number(plan.monthly_price_minor), plan.currency))}<small> / month</small></strong>
          <ul>
            <li>Up to {plan.active_member_limit.toLocaleString("en")} active members</li>
            <li>{plan.storage_mb_limit.toLocaleString("en")} MB media storage</li>
            <li>{plan.broadcast_limit.toLocaleString("en")} broadcast emails / month</li>
            <li>0% ZeroFee fee on membership revenue</li>
          </ul>
          <Link className={plan.code === "creator" ? "primary-button" : "secondary-button"} href="/signup?role=creator">Choose {plan.name}</Link>
        </article>
      ))}
    </div>
  );
}

export async function FeaturedCreators({ limit = 3 }: { limit?: number }) {
  const creators = await listPublishedCreators(limit);
  if (!creators.length) return null;
  return (
    <section className="section">
      <p className="eyebrow">See it in action</p>
      <h2>Creator pages built on ZeroFee</h2>
      <div className="creator-grid">
        {creators.map((creator) => <CreatorCard key={creator.slug} creator={creator} />)}
      </div>
    </section>
  );
}

export function CreatorCard({ creator }: { creator: { slug: string; display_name: string; tagline: string; category: string; avatar_asset_id: string | null; banner_asset_id: string | null; tier_count: string } }) {
  return (
    <Link className="creator-card" href={`/c/${creator.slug}`}>
      <div className="creator-card-banner" style={creator.banner_asset_id ? { backgroundImage: `url(/api/media/${creator.banner_asset_id})` } : undefined} />
      <div className="creator-card-body">
        <Avatar assetId={creator.avatar_asset_id} name={creator.display_name} size={56} />
        <h3>{creator.display_name}</h3>
        <p>{creator.tagline || "Membership creator"}</p>
        <span className="status info">{creator.category}</span>
      </div>
    </Link>
  );
}

export function PriceBreakdownExample() {
  return (
    <div className="hero-product" aria-label="Example price breakdown">
      <div className="flow-card featured"><span className="flow-label">Creator earnings target</span><strong>€10.00</strong></div>
      <div className="flow-grid">
        <Metric title="Buyer final price" value="€12.60" tone="info" />
        <Metric title="Tax" value="€2.01" />
        <Metric title="Provider cost" value="€0.59" />
        <Metric title="ZeroFee fee" value="€0.00" tone="success" />
      </div>
      <p className="muted">Illustrative test-mode example for a EUR card payment in the EEA. Real quotes are generated on the server for each buyer.</p>
    </div>
  );
}
