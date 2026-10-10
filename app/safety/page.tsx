import type { Metadata } from "next";
import { CtaBand, MarketingShell, PageIntro } from "@/components/marketing";

export const metadata: Metadata = { title: "Safety and verification", description: "How ZeroFee keeps money visible, accounts secure and content accountable." };

export default function SafetyPage() {
  return (
    <MarketingShell>
      <PageIntro eyebrow="Safety and verification" title="Money stays visible at every step.">Transparency for buyers, control for creators and guardrails for the platform.</PageIntro>
      <section className="section">
        <div className="card-grid">
          <article className="price-card"><h3>Visible pricing</h3><p>Buyers see the final price, tax and provider cost before they subscribe. The ZeroFee fee line is always €0.00.</p></article>
          <article className="price-card"><h3>Verified creators</h3><p>Every creator is reviewed before payouts are enabled. Identity and bank verification happen with the payment provider.</p></article>
          <article className="price-card"><h3>Protected accounts</h3><p>Passwords are hashed with scrypt, sessions are stored server-side in HTTP-only cookies, and login attempts are rate limited.</p></article>
          <article className="price-card"><h3>Tenant isolation</h3><p>Every creator action is checked against ownership on the server. Files and paid posts are only served to people who are entitled to them.</p></article>
          <article className="price-card"><h3>Auditable operations</h3><p>Reviews, refunds, publishing and moderation actions are written to an audit log with the actor and time.</p></article>
          <article className="price-card"><h3>Content accountability</h3><p>Members can report posts. Operators can unpublish content that breaks the <a className="text-link" href="/acceptable-use">acceptable use policy</a>.</p></article>
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">Responsible disclosure</p>
        <h2>Found a security issue?</h2>
        <p>Email security reports to the address listed in your creator or member support page. Please do not publicly disclose issues before we have had a chance to fix them.</p>
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
