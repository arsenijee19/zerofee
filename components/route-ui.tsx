import Link from "next/link";
import { formatMoney, money } from "@/lib/money";
import type { AuthUser } from "@/lib/server/auth";

export function PublicHeader({ user }: { user?: AuthUser | null }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/"><span className="brand-mark">Z</span><span>ZeroFee</span></Link>
      <nav className="marketing-nav">
        <Link href="/how-it-works">How it works</Link>
        <Link href="/migration">Migration</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/safety">Safety</Link>
      </nav>
      <div className="header-actions">
        <span className="test-badge">TEST MODE</span>
        {user ? <Link className="text-button" href={user.roles.includes("ADMIN") ? "/admin" : user.roles.includes("CREATOR") ? "/creator" : "/member"}>{user.name}</Link> : <Link className="text-button" href="/login">Log in</Link>}
        <Link className="primary-button" href="/signup?role=creator">Start as a creator</Link>
      </div>
    </header>
  );
}

export function MarketingPage({ title = "You choose what you earn.", eyebrow = "Creator membership SaaS" }: { title?: string; eyebrow?: string }) {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="hero" data-testid="homepage">
          <div className="hero-copy">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="hero-text">Creators set earnings targets. ZeroFee takes 0% of membership revenue and earns through fixed SaaS plans. Provider costs remain visible and auditable.</p>
            <div className="cta-row">
              <Link className="primary-button large" href="/signup?role=creator">Start as a creator</Link>
              <Link className="secondary-button large" href="/c/mila-nova">View public creator page</Link>
            </div>
          </div>
          <div className="hero-product">
            <div className="flow-card featured"><label>Creator earnings target</label><strong>€10.00</strong></div>
            <div className="flow-grid">
              <Metric title="Buyer final price" value="€12.60" tone="info" />
              <Metric title="Tax" value="€2.01" />
              <Metric title="Provider cost" value="€0.59" />
              <Metric title="ZeroFee fee" value="€0.00" tone="success" />
            </div>
          </div>
        </section>
        <section className="section proof-section">
          <p className="eyebrow">Built for the money movement</p>
          <div className="feature-band">
            <span>0% ZeroFee platform fee</span>
            <span>Provider-authoritative reconciliation</span>
            <span>Audience migration without card claims</span>
          </div>
        </section>
      </main>
    </>
  );
}

export function ProductShell({ kind, title, user, children }: { kind: "creator" | "member" | "admin"; title: string; user: AuthUser; children: React.ReactNode }) {
  const nav = kind === "admin"
    ? [["Overview", "/admin"], ["Applications", "/admin/applications"], ["Creators", "/admin/creators"], ["Guarantee Health", "/admin/guarantee"], ["Pricing Catalog", "/admin/pricing-catalog"], ["Countries", "/admin/countries"], ["Webhooks", "/admin/webhooks"], ["Support", "/admin/support"], ["Moderation", "/admin/moderation"], ["Audit", "/admin/audit"]]
    : kind === "creator"
      ? [["Dashboard", "/creator"], ["Application", "/creator/application"], ["Payments", "/creator/payments"], ["Billing", "/creator/billing"], ["Membership Tiers", "/creator/tiers"], ["Members", "/creator/members"], ["Content", "/creator/content"], ["Earnings", "/creator/earnings"], ["Financial Verification", "/creator/financial-verification"], ["Payouts", "/creator/payouts"], ["Migration", "/creator/migration"], ["Integrations", "/creator/integrations"], ["Broadcasts", "/creator/broadcasts"], ["API / Webhooks", "/creator/api"], ["Settings", "/creator/settings"], ["Support", "/creator/support"]]
      : [["Home", "/member"], ["Memberships", "/member/memberships"], ["Billing", "/member/billing"], ["Notifications", "/member/notifications"], ["Support", "/member/support"], ["Account", "/member/account"]];
  return (
    <div className="app-root">
      <PublicHeader user={user} />
      <div className="product-shell">
        <aside className="sidebar">
          <Link className="side-brand" href={`/${kind}`}><span className="brand-mark">Z</span><span>{kind[0].toUpperCase() + kind.slice(1)}</span></Link>
          <div className="nav-group">
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
        </aside>
        <main className="workspace">
          <div className="workspace-top"><div><p>{user.name}</p><h1>{title}</h1></div><Link className="search-trigger wide" href={`/${kind}/search`}>Search records</Link></div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function Panel({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return <section className="panel"><p className="eyebrow">{eyebrow ?? "ZeroFee"}</p><h2>{title}</h2>{children}</section>;
}

export function Metric({ title, value, tone }: { title: string; value: string; tone?: "info" | "success" | "danger" }) {
  return <div className={`metric ${tone ?? ""}`}><span>{title}</span><strong>{value}</strong></div>;
}

export function DataTable({ rows, headings }: { headings: string[]; rows: Array<Array<React.ReactNode>> }) {
  return (
    <div className="table-wrap"><table><thead><tr>{headings.map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>
  );
}

export function MoneyCell({ amount, currency = "EUR" }: { amount: string | number; currency?: "EUR" | "USD" }) {
  return <>{formatMoney(money(Number(amount), currency))}</>;
}
