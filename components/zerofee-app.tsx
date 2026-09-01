"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Bell,
  Cable,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Command,
  CreditCard,
  Database,
  Download,
  FileText,
  Globe2,
  HeartHandshake,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  Megaphone,
  Menu,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  WalletCards,
  X
} from "lucide-react";
import { formatMoney, money } from "@/lib/money";
import type { Reconciliation, SeedState } from "@/lib/domain/types";

type View =
  | "home"
  | "pricing"
  | "how"
  | "migration-marketing"
  | "safety"
  | "signup"
  | "creator-apply"
  | "creator-status"
  | "creator-dashboard"
  | "tiers"
  | "members"
  | "content"
  | "earnings"
  | "verification"
  | "payouts"
  | "tax"
  | "migration"
  | "integrations"
  | "broadcasts"
  | "api"
  | "settings"
  | "support"
  | "public"
  | "checkout"
  | "member"
  | "locked"
  | "unlocked"
  | "admin"
  | "admin-apps"
  | "admin-creator"
  | "admin-guarantee"
  | "admin-catalog"
  | "admin-countries"
  | "admin-webhooks"
  | "admin-support"
  | "admin-audit";

const moneyRoutes = ["earnings", "verification", "payouts", "tax"];
const creatorRoutes = ["creator-dashboard", "tiers", "members", "content", "migration", "integrations", "broadcasts", "api", "settings", "support", ...moneyRoutes];
const adminRoutes = ["admin", "admin-apps", "admin-creator", "admin-guarantee", "admin-catalog", "admin-countries", "admin-webhooks", "admin-support", "admin-audit"];

export function ZeroFeeApp({ initialState }: { initialState: SeedState }) {
  const [view, setView] = useState<View>("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const quote = initialState.quotes[0];
  const currentReconciliation = initialState.reconciliations[1];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const searchResults = useMemo(
    () => [
      ...initialState.users.map((user) => ({ group: "Users", label: user.name, meta: user.email, view: "admin" as View })),
      ...initialState.tiers.map((tier) => ({ group: "Tiers", label: tier.name, meta: `${tier.mode} ${formatMoney(tier.target)}`, view: "tiers" as View })),
      ...initialState.reconciliations.map((item) => ({ group: "Payments", label: item.providerTransactionReference, meta: item.status, view: "verification" as View })),
      ...initialState.migrations.map((row) => ({ group: "Migration", label: row.name, meta: `${row.externalTier} -> ${row.status}`, view: "migration" as View })),
      ...initialState.supportTickets.map((ticket) => ({ group: "Support", label: ticket.title, meta: ticket.state, view: "support" as View }))
    ],
    [initialState]
  );

  return (
    <div className="app-root">
      <header className="site-header">
        <button className="icon-button mobile-only" onClick={() => setMobileNav(true)} aria-label="Open navigation">
          <Menu size={20} />
        </button>
        <button className="brand" onClick={() => setView("home")} aria-label="ZeroFee home">
          <span className="brand-mark">Z</span>
          <span>ZeroFee</span>
        </button>
        <nav className="marketing-nav">
          <button onClick={() => setView("how")}>How it works</button>
          <button onClick={() => setView("migration-marketing")}>Migration</button>
          <button onClick={() => setView("pricing")}>Pricing</button>
          <button onClick={() => setView("safety")}>Safety</button>
        </nav>
        <button className="search-trigger" onClick={() => setSearchOpen(true)}>
          <Search size={16} />
          <span>Search</span>
          <kbd>⌘K</kbd>
        </button>
        <div className="header-actions">
          <span className="test-badge">TEST MODE</span>
          <button className="text-button" onClick={() => setView("admin")}>Admin</button>
          <button className="text-button" onClick={() => setView("member")}>Log in</button>
          <button className="primary-button" onClick={() => setView("signup")}>Start as a creator</button>
        </div>
      </header>

      {creatorRoutes.includes(view) ? (
        <Shell kind="creator" view={view} setView={setView} openSearch={() => setSearchOpen(true)}>
          <CreatorSurface view={view} data={initialState} />
        </Shell>
      ) : adminRoutes.includes(view) ? (
        <Shell kind="admin" view={view} setView={setView} openSearch={() => setSearchOpen(true)}>
          <AdminSurface view={view} data={initialState} />
        </Shell>
      ) : (
        <main>
          <MarketingSurface view={view} setView={setView} data={initialState} reconciliation={currentReconciliation} />
        </main>
      )}

      {searchOpen && (
        <div className="dialog-backdrop" onClick={() => setSearchOpen(false)}>
          <section className="command-panel" onClick={(event) => event.stopPropagation()} aria-label="Global command search">
            <div className="command-input">
              <Command size={18} />
              <input autoFocus placeholder="Search members, payments, migrations, incidents..." />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X size={18} />
              </button>
            </div>
            <div className="result-list">
              {searchResults.map((result) => (
                <button key={`${result.group}-${result.label}`} onClick={() => { setView(result.view); setSearchOpen(false); }}>
                  <span className="result-group">{result.group}</span>
                  <strong>{result.label}</strong>
                  <small>{result.meta}</small>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {mobileNav && (
        <div className="dialog-backdrop" onClick={() => setMobileNav(false)}>
          <section className="mobile-sheet" onClick={(event) => event.stopPropagation()}>
            {(["home", "pricing", "migration-marketing", "creator-dashboard", "member", "admin"] as View[]).map((route) => (
              <button key={route} onClick={() => { setView(route); setMobileNav(false); }}>{label(route)}</button>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}

function MarketingSurface({ view, setView, data, reconciliation }: { view: View; setView: (view: View) => void; data: SeedState; reconciliation: Reconciliation }) {
  const quote = data.quotes[0];
  if (view === "signup" || view === "creator-apply" || view === "creator-status") return <Onboarding view={view} setView={setView} data={data} />;
  if (view === "public" || view === "checkout" || view === "member" || view === "locked" || view === "unlocked") return <MemberSurface view={view} setView={setView} data={data} />;

  return (
    <>
      <section className="hero" data-testid="homepage">
        <div className="hero-copy">
          <p className="eyebrow">Creator membership SaaS</p>
          <h1>You choose what you earn.</h1>
          <p className="hero-text">Set the amount you want to earn per successful member payment. ZeroFee takes 0% of your membership revenue and 0% payout markup. Provider costs stay visible, auditable, and never become hidden ZeroFee revenue.</p>
          <div className="cta-row">
            <button className="primary-button large" onClick={() => setView("signup")}>Start as a creator <ArrowRight size={18} /></button>
            <button className="secondary-button large" onClick={() => setView("how")}>See how pricing works</button>
          </div>
          <div className="proof-strip">
            <span>0% membership platform fee</span>
            <span>Fixed SaaS plans</span>
            <span>Verify provider records</span>
          </div>
        </div>
        <div className="hero-product">
          <div className="flow-card featured">
            <label>Creator earnings target</label>
            <strong>{formatMoney(quote.target)}</strong>
            <input aria-label="Creator earnings target" value="10.00" readOnly />
          </div>
          <div className="flow-line" />
          <div className="flow-grid">
            <Metric title="Buyer final price" value={formatMoney(quote.retail)} tone="info" />
            <Metric title="Tax" value={formatMoney(quote.tax)} />
            <Metric title="Provider cost" value={formatMoney(quote.providerCost)} />
            <Metric title="ZeroFee fee" value={formatMoney(quote.platformFee)} tone="success" />
          </div>
          <div className="verification-card">
            <BadgeCheck />
            <div>
              <strong>Verified creator earnings</strong>
              <span>{formatMoney(reconciliation.actualCreatorProceeds)} with {formatMoney(reconciliation.surplus)} creator surplus</span>
            </div>
          </div>
        </div>
      </section>

      {(view === "home" || view === "how") && <HomeSections setView={setView} data={data} />}
      {view === "pricing" && <PricingPage setView={setView} data={data} />}
      {view === "migration-marketing" && <MigrationMarketing setView={setView} />}
      {view === "safety" && <SafetyPage />}
    </>
  );
}

function HomeSections({ setView, data }: { setView: (view: View) => void; data: SeedState }) {
  const quote = data.quotes[0];
  return (
    <>
      <section className="section two-column">
        <div>
          <p className="eyebrow">Financial model</p>
          <h2>Fixed software, not a tax on growth.</h2>
          <p>ZeroFee separates creator membership GMV from ZeroFee SaaS revenue. The creator’s connected provider account receives membership payments; ZeroFee’s own subscription billing is separate.</p>
        </div>
        <div className="comparison">
          <div><span>Percentage platform</span><strong>Cost rises with every member</strong></div>
          <div><span>ZeroFee</span><strong>Fixed plan + provider cost at cost</strong></div>
        </div>
      </section>
      <section className="section calculator" data-testid="calculator">
        <div>
          <p className="eyebrow">Set what you earn</p>
          <h2>Guaranteed Earnings demo</h2>
          <p>The seeded mock provider uses versioned fee rules. Unknown or stale routes cannot issue a guaranteed quote.</p>
        </div>
        <div className="calc-panel">
          <Metric title="Target" value={formatMoney(quote.target)} />
          <Metric title="Lowest eligible retail" value={formatMoney(quote.retail)} tone="info" />
          <Metric title="Modeled proceeds" value={formatMoney(quote.modeledCreatorProceeds)} tone="success" />
          <Metric title="Eligibility" value="Verified upper bound" />
        </div>
      </section>
      <section className="section dark-proof">
        <div>
          <p className="eyebrow">Financial verification</p>
          <h2>Don’t trust us. Verify it.</h2>
          <p>Every guaranteed payment stores the quote, rule versions, actual provider cost, ZeroFee fee of 0, creator proceeds, surplus, and shortfall state.</p>
        </div>
        <button className="light-button" onClick={() => setView("verification")}>Open Financial Verification</button>
      </section>
      <section className="section feature-band">
        {["Memberships", "Gated content", "Dunning", "Refunds", "Disputes", "Payouts", "Creator API", "Discord", "Tax center", "Support", "Data export"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>
      <section className="section two-column">
        <div>
          <p className="eyebrow">Migration</p>
          <h2>Bring your Patreon audience without pretending cards moved.</h2>
          <p>Import CSV exports, map fields and tiers, create campaigns, generate secure member migration links, and track conversion to new ZeroFee subscriptions.</p>
        </div>
        <div className="cta-row">
          <button className="secondary-button" onClick={() => setView("public")}>View public creator page</button>
          <button className="primary-button" onClick={() => setView("migration")}>See migration workflow</button>
        </div>
      </section>
    </>
  );
}

function PricingPage({ setView, data }: { setView: (view: View) => void; data: SeedState }) {
  const plans = [
    ["Starter", "$19", "100 active members"],
    ["Creator", "$49", "1,000 active members"],
    ["Pro", "$99", "5,000 active members"],
    ["Business", "$199", "25,000 active members"]
  ];
  return (
    <section className="section">
      <p className="eyebrow">Pricing</p>
      <h2>Plans scale by software usage, not creator revenue.</h2>
      <div className="pricing-grid">
        {plans.map(([name, price, allowance]) => (
          <article className={name === data.creator.saasPlan ? "price-card recommended" : "price-card"} key={name}>
            <span>{name}</span>
            <strong>{price}<small>/mo</small></strong>
            <p>{allowance}</p>
            <ul>
              <li>0% membership platform fee</li>
              <li>0% payout markup</li>
              <li>Provider cost remains separate</li>
            </ul>
            <button className="secondary-button" onClick={() => setView("signup")}>Choose {name}</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function MigrationMarketing({ setView }: { setView: (view: View) => void }) {
  return (
    <section className="section two-column">
      <div>
        <p className="eyebrow">Patreon migration</p>
        <h2>Import, map, invite, convert.</h2>
        <p>The migration center validates Patreon or generic CSV exports, maps monthly and annual plans, supports grandfathering, creates campaigns, and tracks invite to conversion. Members authorize new ZeroFee subscriptions themselves.</p>
        <button className="primary-button" onClick={() => setView("migration")}>Open Migration Center</button>
      </div>
      <ol className="step-list">
        <li>Upload CSV</li>
        <li>Map fields and tiers</li>
        <li>Choose pricing strategy</li>
        <li>Generate secure links</li>
        <li>Track recovered MRR</li>
      </ol>
    </section>
  );
}

function SafetyPage() {
  return (
    <section className="section">
      <p className="eyebrow">Safety</p>
      <h2>Trust boundaries are explicit.</h2>
      <div className="feature-band">
        <span>Server RBAC</span><span>Paid content gating</span><span>Webhook signatures</span><span>Quote tamper checks</span><span>SSRF guarded webhooks</span><span>CSV injection protection</span><span>Mock email verification</span><span>Password reset boundary</span>
      </div>
    </section>
  );
}

function Onboarding({ view, setView, data }: { view: View; setView: (view: View) => void; data: SeedState }) {
  return (
    <section className="section wizard">
      <p className="eyebrow">Creator onboarding</p>
      <h2>{view === "signup" ? "Create your ZeroFee account" : view === "creator-apply" ? "Creator country and compliance application" : "Application approved, payout setup required"}</h2>
      <div className="stepper"><span className="active">Signup</span><span className={view !== "signup" ? "active" : ""}>Application</span><span className={view === "creator-status" ? "active" : ""}>Payouts</span></div>
      {view === "signup" && <FormRows rows={["Email verification: mock email sent", "Password reset: enabled through token boundary", "Roles: member, creator, admin seeded"]} />}
      {view === "creator-apply" && <FormRows rows={[`Country ${data.creator.country}: BETA, onboarding enabled`, "Offering: paid research, office hours, templates", "Rights and acceptable use attestations accepted", "Creator cannot self-approve"]} />}
      {view === "creator-status" && <FormRows rows={["Admin approved for payout onboarding", "Mock Connect account created", "KYC requirements due", "SaaS subscription active", "Live Stripe: not configured / external approval required"]} />}
      <div className="cta-row">
        <button className="secondary-button" onClick={() => setView("admin-apps")}>Admin approval view</button>
        <button className="primary-button" onClick={() => setView(view === "signup" ? "creator-apply" : view === "creator-apply" ? "creator-status" : "creator-dashboard")}>Continue</button>
      </div>
    </section>
  );
}

function Shell({ kind, view, setView, openSearch, children }: { kind: "creator" | "admin"; view: View; setView: (view: View) => void; openSearch: () => void; children: React.ReactNode }) {
  const groups = kind === "creator"
    ? [
        ["Overview", [["Home", "creator-dashboard"], ["Earnings", "earnings"], ["Financial Verification", "verification"], ["Payouts", "payouts"]]],
        ["Business", [["Members", "members"], ["Membership Tiers", "tiers"], ["Content", "content"], ["Migration", "migration"], ["Broadcasts", "broadcasts"]]],
        ["Growth / Tools", [["Integrations", "integrations"], ["API / Webhooks", "api"]]],
        ["Account / Compliance", [["Payout setup", "creator-status"], ["Tax", "tax"], ["ZeroFee Billing", "settings"], ["Support", "support"]]]
      ]
    : [
        ["Platform", [["Overview", "admin"], ["Applications", "admin-apps"], ["Creator Detail", "admin-creator"]]],
        ["Money / Provider", [["Guarantee Health", "admin-guarantee"], ["Pricing Catalog", "admin-catalog"], ["Webhooks", "admin-webhooks"]]],
        ["Commerce / Safety", [["Countries", "admin-countries"], ["Support", "admin-support"]]],
        ["System", [["Audit", "admin-audit"]]]
      ];
  return (
    <div className="product-shell">
      <aside className="sidebar">
        <div className="side-brand"><span className="brand-mark">Z</span><strong>{kind === "creator" ? "Creator" : "Admin"}</strong></div>
        {groups.map(([group, items]) => (
          <div className="nav-group" key={String(group)}>
            <span>{String(group)}</span>
            {(items as string[][]).map(([name, route]) => (
              <button key={route} className={view === route ? "active" : ""} onClick={() => setView(route as View)}>{navIcon(route)}{name}</button>
            ))}
          </div>
        ))}
      </aside>
      <section className="workspace">
        <div className="topbar">
          <div><small>{kind === "creator" ? "Mila Novak" : "ZeroFee Operations"}</small><strong>{label(view)}</strong></div>
          <button className="search-trigger wide" onClick={openSearch}><Search size={16} /> Search records <kbd>⌘K</kbd></button>
          <span className="test-badge">TEST MODE</span>
          <Bell size={20} />
        </div>
        {children}
      </section>
    </div>
  );
}

function CreatorSurface({ view, data }: { view: View; data: SeedState }) {
  const quote = data.quotes[0];
  const exact = data.reconciliations[0];
  const surplus = data.reconciliations[1];
  const shortfall = data.reconciliations[2];
  if (view === "tiers") return <TierBuilder data={data} />;
  if (view === "members") return <TablePage title="Members" rows={data.users.filter((u) => u.roles.includes("MEMBER")).map((u) => [u.name, "Signal Room", "ACTIVE", formatMoney(quote.target), "2026-10-01"])} actions={["Search", "Filter", "Export"]} />;
  if (view === "content") return <TablePage title="Content" rows={[["Weekly signal brief", "Paid: Signal Room", "Published", "184 views"], ["Public migration guide", "Public", "Published", "910 views"], ["Template vault", "Paid: all tiers", "Draft", "0 views"]]} actions={["New post", "Preview", "Upload"]} />;
  if (view === "earnings") return <Financial title="Earnings" items={[["Creator Earnings", formatMoney(money(186000, "EUR"))], ["Creator Surplus", formatMoney(surplus.surplus)], ["Refunds/reversals", "-€10.00"], ["ZeroFee membership fees", "€0.00"]]} />;
  if (view === "verification") return <Verification data={data} />;
  if (view === "payouts") return <Payouts />;
  if (view === "tax") return <Financial title="Tax Center" items={[["Tax provider", "mock"], ["Seller profile", "Creator-side sales: legal review required"], ["Tax-inclusive quote", formatMoney(quote.tax)], ["Stripe Tax", "Not configured"]]} />;
  if (view === "migration") return <MigrationCenter data={data} />;
  if (view === "integrations") return <Integrations data={data} />;
  if (view === "broadcasts") return <TablePage title="Broadcasts" rows={[["September update", "Active members", "Sent", "228 recipients"], ["Payment recovery reminder", "Past due", "Draft", "14 recipients"]]} actions={["Compose", "Preview recipients"]} />;
  if (view === "api") return <TablePage title="API / Webhooks" rows={[["key_live_mock_hidden", "entitlements:read", "Active", "Last used today"], ["https://example.test/hooks/zerofee", "HMAC signed", "Healthy", "3 deliveries"]]} actions={["Create key", "Rotate secret", "Replay"]} />;
  if (view === "settings" || view === "support") return <TablePage title={view === "settings" ? "ZeroFee Billing / Settings" : "Support"} rows={view === "settings" ? [["Creator plan", data.creator.saasPlan, data.creator.platformBillingState, "1,000 active-member allowance"], ["Security", "Email verified", "Sessions active", "API key revoke available"]] : data.supportTickets.map((t) => [t.id, t.title, t.category, t.state])} actions={["Update", "Export data"]} />;
  return (
    <div className="dashboard">
      <section className="financial-hero">
        <div>
          <p className="eyebrow">Creator Earnings</p>
          <strong>{formatMoney(money(186000, "EUR"))}</strong>
          <span>186 successful earning events · ZeroFee transaction fees: €0.00</span>
        </div>
        <div className="balance-box">
          <span>Provider balance</span>
          <strong>€2,410.30 available</strong>
          <small>€318.70 pending · next standard payout Sep 5</small>
        </div>
      </section>
      <section className="ops-grid">
        <Metric title="Target met" value="181" tone="success" />
        <Metric title="With surplus" value="4" tone="success" />
        <Metric title="Pending reconciliation" value="2" tone="info" />
        <Metric title="Guarantee shortfalls" value="1" tone="danger" />
      </section>
      <section className="split">
        <Timeline />
        <div className="action-list">
          {["Complete mock KYC", "Review Guarantee shortfall", "Import remaining Patreon members", "Publish September content"].map((item) => <button key={item}>{item}<ChevronRight size={16} /></button>)}
        </div>
      </section>
      <Verification data={{ ...data, reconciliations: [exact, surplus, shortfall] }} compact />
    </div>
  );
}

function TierBuilder({ data }: { data: SeedState }) {
  const quote = data.quotes[0];
  return (
    <div className="builder">
      <section className="form-panel">
        <p className="eyebrow">Membership Tier</p>
        <h2>Guaranteed Earnings builder</h2>
        <label>Tier name<input defaultValue="Signal Room" /></label>
        <label>Billing interval<select defaultValue="monthly"><option>monthly</option><option>annual</option></select></label>
        <label>Pricing mode<select defaultValue="GUARANTEED_EARNINGS"><option>GUARANTEED_EARNINGS</option><option>SIMPLE_PRICE</option></select></label>
        <label>I want to earn<input defaultValue="10.00" inputMode="decimal" /></label>
        <label>Benefits<textarea defaultValue="Weekly paid briefings, template vault, Discord office hours" /></label>
        <button className="primary-button">Publish tier</button>
      </section>
      <aside className="preview-panel">
        <h3>Live pricing preview</h3>
        <Metric title="Creator target" value={formatMoney(quote.target)} />
        <Metric title="Buyer retail" value={formatMoney(quote.retail)} tone="info" />
        <Metric title="Provider rule" value={quote.pricingRuleVersion} />
        <Metric title="ZeroFee fee" value={formatMoney(quote.platformFee)} tone="success" />
        <details open><summary>How this is calculated</summary><p>Tax-inclusive retail less creator-borne provider fee and billing cost must leave at least the target. Reducing this quote by one cent fails the invariant.</p></details>
        <div className="warning-box">Guaranteed Earnings is not available for unknown-wallet international routes. Offer card/SEPA or Simple Price.</div>
      </aside>
    </div>
  );
}

function Verification({ data, compact = false }: { data: SeedState; compact?: boolean }) {
  return (
    <section className="table-section">
      <div className="section-header"><div><p className="eyebrow">Financial Verification</p><h2>Every important number, independently verifiable.</h2></div><button className="secondary-button"><Download size={16} /> Export</button></div>
      <div className="responsive-table">
        <table>
          <thead><tr><th>Provider ref</th><th>Charged</th><th>Tax</th><th>Provider cost</th><th>ZeroFee fee</th><th>Target</th><th>Actual earnings</th><th>Surplus</th><th>Status</th></tr></thead>
          <tbody>
            {data.reconciliations.map((r) => (
              <tr key={r.id}>
                <td>{r.providerTransactionReference}</td><td>{formatMoney(r.customerCharged)}</td><td>{formatMoney(r.actualTax)}</td><td>{formatMoney(r.actualProviderFee)}</td><td>{formatMoney(r.zeroFeePlatformFee)}</td><td>{formatMoney(r.target)}</td><td>{formatMoney(r.actualCreatorProceeds)}</td><td>{formatMoney(r.surplus)}</td><td><Status status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!compact && <div className="audit-breakdown"><ReceiptText /><p>Payment detail stores quote snapshot, pricing profile version, eligibility profile version, provider transaction references, refund/dispute state, and creator surplus/shortfall evidence.</p></div>}
    </section>
  );
}

function Payouts() {
  return <Financial title="Payouts" items={[["Available provider balance", "€2,410.30"], ["Pending provider balance", "€318.70"], ["Standard payout", "ZeroFee fee €0 · amount sent by provider"], ["Instant payout", "Provider cost shown when available · ZeroFee fee €0"], ["Bank landing disclaimer", "Receiving banks may apply their own fees"]]} />;
}

function MigrationCenter({ data }: { data: SeedState }) {
  return (
    <section className="wizard">
      <p className="eyebrow">Migration Center</p>
      <h2>Patreon CSV to ZeroFee campaign</h2>
      <div className="stepper"><span className="active">Upload</span><span className="active">Map fields</span><span className="active">Map tiers</span><span className="active">Pricing</span><span className="active">Campaign</span><span>Track</span></div>
      <div className="ops-grid">
        <Metric title="Imported" value="3" />
        <Metric title="Invited" value="2" />
        <Metric title="Clicked" value="1" />
        <Metric title="Converted" value="1" tone="success" />
      </div>
      <TablePage title="Migration members" rows={data.migrations.map((row) => [row.name, row.email, row.externalTier, row.mappedTier, row.status])} actions={["Upload CSV", "Download validation report", "Export unconverted"]} embedded />
      <div className="warning-box">Payment credentials are not migrated. Each fan receives a secure link and authorizes a new subscription.</div>
    </section>
  );
}

function Integrations({ data }: { data: SeedState }) {
  return <section className="card-grid">{data.integrations.map((item) => <article className="integration-card" key={item.name}><Cable /><strong>{item.name}</strong><span>{item.status}</span><p>{item.details}</p><button className="secondary-button">Manage</button></article>)}</section>;
}

function MemberSurface({ view, setView, data }: { view: View; setView: (view: View) => void; data: SeedState }) {
  const quote = data.quotes[0];
  return (
    <section className="section member-zone">
      <p className="eyebrow">Member / Fan</p>
      <h2>{view === "checkout" ? "Review your final recurring price" : view === "public" ? "Mila Novak" : view === "locked" ? "Paid content locked" : view === "unlocked" ? "Weekly signal brief" : "Your memberships"}</h2>
      {view === "checkout" ? (
        <div className="checkout-card">
          <Metric title="Creator" value={data.creator.name} />
          <Metric title="Tier" value="Signal Room" />
          <Metric title="Final recurring amount" value={formatMoney(quote.retail)} tone="info" />
          <Metric title="Tax included" value={formatMoney(quote.tax)} />
          <Metric title="ZeroFee platform fee" value={formatMoney(quote.platformFee)} tone="success" />
          <button className="primary-button" onClick={() => setView("member")}>Confirm mock payment</button>
        </div>
      ) : view === "locked" ? (
        <div className="warning-box"><Lock /> This post requires Signal Room. Private content is not included in public HTML.</div>
      ) : view === "unlocked" ? (
        <article className="post-body"><h3>Members-only briefing</h3><p>This unlocked content is shown only after the seeded entitlement resolver marks the membership active.</p></article>
      ) : (
        <div className="checkout-card">
          <Metric title="Active membership" value="Signal Room" />
          <Metric title="Renewal" value="Oct 1, 2026" />
          <Metric title="Status" value="ACTIVE" tone="success" />
          <div className="cta-row"><button className="secondary-button" onClick={() => setView("locked")}>Locked preview</button><button className="primary-button" onClick={() => setView(view === "public" ? "checkout" : "unlocked")}>{view === "public" ? "Join Signal Room" : "Open paid content"}</button></div>
        </div>
      )}
    </section>
  );
}

function AdminSurface({ view, data }: { view: View; data: SeedState }) {
  if (view === "admin-apps") return <TablePage title="Applications" rows={data.applications.map((app) => [app.id, app.creatorId, app.country, app.state, app.offering])} actions={["Approve", "Needs info", "Reject"]} />;
  if (view === "admin-creator") return <Financial title="Creator detail" items={[["Creator", data.creator.name], ["Application", data.creator.applicationState], ["KYC", data.creator.kycState], ["SaaS billing", data.creator.platformBillingState], ["Direct charges", "Mock enabled · live external approval required"]]} />;
  if (view === "admin-guarantee") return <Verification data={data} />;
  if (view === "admin-catalog") return <TablePage title="Provider Pricing Catalog" rows={[["mock-ie-eea-card-consumer-eur-v1", "IE", "card/consumer/EEA", "VERIFIED", "revalidate 2027-01-01"], ["mock-us-domestic-commercial-fx-v1", "US", "card/commercial/FX", "VERIFIED", "revalidate 2027-01-01"], ["unknown-wallet", "global", "wallet/unknown", "DISABLED", "not eligible"]]} actions={["Search", "Pause profile", "Run matrix"]} />;
  if (view === "admin-countries") return <TablePage title="Country Registry" rows={data.countries.map((c) => [c.code, c.status, `${c.guaranteedRoutes} guaranteed route(s)`, "manual review required"])} actions={["Edit", "Pause country"]} />;
  if (view === "admin-webhooks") return <TablePage title="Webhook Inspector" rows={[["evt_001", "invoice.payment_succeeded", "processed", "idempotent"], ["evt_002", "charge.dispute.created", "processed", "incident linked"], ["evt_replay", "replay attempt", "blocked duplicate", "signature verified"]]} actions={["Replay", "Inspect signature"]} />;
  if (view === "admin-support") return <TablePage title="Support / Moderation" rows={data.supportTickets.map((t) => [t.id, t.title, t.owner, t.category, t.state])} actions={["Escalate", "Suspend", "Export evidence"]} />;
  if (view === "admin-audit") return <TablePage title="Audit / System Health" rows={[["audit_001", "admin approved application", "ZeroFee Ops", "immutable"], ["audit_002", "profile paused after shortfall", "system", "immutable"], ["health", "mock providers operational", "system", "green"]]} actions={["Export audit"]} />;
  return (
    <div className="dashboard">
      <section className="ops-grid">
        <Metric title="ZeroFee SaaS MRR" value="$49.00" tone="success" />
        <Metric title="Active creators" value="1" />
        <Metric title="Creator GMV" value="€2,231.28" />
        <Metric title="Open incidents" value="1" tone="danger" />
      </section>
      <section className="split">
        <div className="action-list">
          {["Application awaiting review", "Guarantee shortfall needs profile review", "Stripe live capability not configured", "Tax/merchant legal review required"].map((item) => <button key={item}>{item}<AlertTriangle size={16} /></button>)}
        </div>
        <Timeline />
      </section>
    </div>
  );
}

function Financial({ title, items }: { title: string; items: string[][] }) {
  return <section className="table-section"><div className="section-header"><div><p className="eyebrow">{title}</p><h2>{title}</h2></div></div><div className="detail-list">{items.map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div></section>;
}

function TablePage({ title, rows, actions, embedded = false }: { title: string; rows: string[][]; actions: string[]; embedded?: boolean }) {
  const body = (
    <>
      <div className="section-header"><div><p className="eyebrow">Operations</p><h2>{title}</h2></div><div className="cta-row">{actions.map((a) => <button className="secondary-button" key={a}>{a}</button>)}</div></div>
      <div className="responsive-table"><table><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
    </>
  );
  return embedded ? <div>{body}</div> : <section className="table-section">{body}</section>;
}

function Metric({ title, value, tone }: { title: string; value: string; tone?: "success" | "info" | "danger" }) {
  return <div className={`metric ${tone ?? ""}`}><span>{title}</span><strong>{value}</strong></div>;
}

function Status({ status }: { status: string }) {
  const tone = status.includes("SHORTFALL") || status.includes("DISPUT") ? "danger" : status.includes("SURPLUS") || status.includes("MET") ? "success" : "info";
  return <span className={`status ${tone}`}>{status.replaceAll("_", " ")}</span>;
}

function FormRows({ rows }: { rows: string[] }) {
  return <div className="detail-list">{rows.map((row) => <div key={row}><CheckCircle2 /><strong>{row}</strong></div>)}</div>;
}

function Timeline() {
  return <div className="timeline"><div /><div /><div /><div /><span>Creator Earnings trend</span></div>;
}

function navIcon(route: string) {
  const Icon = route.includes("earning") || route.includes("guarantee") ? CircleDollarSign : route.includes("member") || route.includes("creator") ? Users : route.includes("content") ? FileText : route.includes("migration") ? Upload : route.includes("integration") || route.includes("api") || route.includes("webhook") ? Cable : route.includes("payout") ? WalletCards : route.includes("tax") ? ReceiptText : route.includes("support") ? LifeBuoy : route.includes("catalog") || route.includes("countries") ? Database : route.includes("audit") ? ShieldCheck : route.includes("billing") ? CreditCard : route.includes("broadcast") ? Megaphone : route.includes("status") ? KeyRound : LayoutDashboard;
  return <Icon size={16} />;
}

function label(view: View) {
  return view.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}
