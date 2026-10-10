import Link from "next/link";
import { Suspense } from "react";
import { formatMoney, money } from "@/lib/money";
import type { AuthUser } from "@/lib/server/auth";
import { Flash } from "@/components/flash";
import { NavLinks } from "@/components/nav-links";
import { SiteFooter } from "@/components/site-footer";

export { SiteFooter };

export function Avatar({ assetId, name, size = 48 }: { assetId?: string | null; name: string; size?: number }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  return assetId
    ? // eslint-disable-next-line @next/next/no-img-element
      <img className="avatar" src={`/api/media/${assetId}`} alt={`${name} profile photo`} width={size} height={size} style={{ width: size, height: size }} loading="lazy" />
    : <span className="avatar placeholder" aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.38 }}>{initials}</span>;
}

export function EmptyState({ title, children, action }: { title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return <div className="empty-state"><strong>{title}</strong>{children && <p>{children}</p>}{action}</div>;
}

export function StateBadge({ state }: { state: string }) {
  const tone = ["PUBLISHED", "ACTIVE", "APPROVED_FOR_PAYOUT_ONBOARDING", "READY", "SENT", "CONNECTED"].includes(state) ? "success" : ["REJECTED", "SUSPENDED", "UNPUBLISHED_BY_MODERATION", "PAST_DUE", "FAILED"].includes(state) ? "danger" : ["DRAFT", "ARCHIVED"].includes(state) ? "muted" : "info";
  return <span className={`status ${tone}`}>{state.replaceAll("_", " ").toLowerCase()}</span>;
}

export function PublicHeader({ user }: { user?: AuthUser | null }) {
  return (
    <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <Link className="brand" href="/"><span className="brand-mark">Z</span><span>ZeroFee</span></Link>
      <nav className="marketing-nav" aria-label="Main">
        <NavLinks items={[["How it works", "/how-it-works"], ["Creators", "/creators"], ["Migration", "/migration"], ["Pricing", "/pricing"], ["Safety", "/safety"]]} />
      </nav>
      <div className="header-actions">
        <span className="test-badge">TEST MODE</span>
        {user ? <Link className="text-button" href={user.roles.includes("ADMIN") ? "/admin" : user.roles.includes("CREATOR") ? "/creator" : "/member"}>{user.name}</Link> : <Link className="text-button" href="/login">Log in</Link>}
        <Link className="primary-button" href="/signup?role=creator">Start as a creator</Link>
      </div>
    </header>
    <Suspense fallback={null}><Flash /></Suspense>
    </>
  );
}

export function ProductShell({ kind, title, user, children }: { kind: "creator" | "member" | "admin"; title: string; user: AuthUser; children: React.ReactNode }) {
  const nav = kind === "admin"
    ? [["Overview", "/admin"], ["Applications", "/admin/applications"], ["Creators", "/admin/creators"], ["Guarantee Health", "/admin/guarantee"], ["Pricing Catalog", "/admin/pricing-catalog"], ["Countries", "/admin/countries"], ["Webhooks", "/admin/webhooks"], ["Support", "/admin/support"], ["Moderation", "/admin/moderation"], ["Audit", "/admin/audit"]]
    : kind === "creator"
      ? [["Dashboard", "/creator"], ["Application", "/creator/application"], ["Payments", "/creator/payments"], ["Billing", "/creator/billing"], ["Membership Tiers", "/creator/tiers"], ["Members", "/creator/members"], ["Content", "/creator/content"], ["Earnings", "/creator/earnings"], ["Financial Verification", "/creator/financial-verification"], ["Payouts", "/creator/payouts"], ["Migration", "/creator/migration"], ["Integrations", "/creator/integrations"], ["Broadcasts", "/creator/broadcasts"], ["API / Webhooks", "/creator/api"], ["Seller Profile", "/creator/settings"], ["Account", "/creator/account"], ["Support", "/creator/support"]]
      : [["Home", "/member"], ["Memberships", "/member/memberships"], ["Billing", "/member/billing"], ["Notifications", "/member/notifications"], ["Support", "/member/support"], ["Account", "/member/account"]];
  return (
    <div className="app-root">
      <PublicHeader user={user} />
      <div className="product-shell">
        <aside className="sidebar">
          <Link className="side-brand" href={`/${kind}`}><span className="brand-mark">Z</span><span>{kind[0].toUpperCase() + kind.slice(1)}</span></Link>
          <nav className="nav-group" aria-label={`${kind} navigation`}>
            <NavLinks items={nav as Array<[string, string]>} exact={[`/${kind}`]} />
          </nav>
        </aside>
        <main className="workspace" id="main-content">
          <div className="workspace-top"><div><p>{user.name}</p><h1 className="page-title">{title}</h1></div><Link className="search-trigger wide" href={`/${kind}/search`}>Search records</Link></div>
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
