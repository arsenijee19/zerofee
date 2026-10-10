import type { Metadata } from "next";
import { CtaBand, Faq, MarketingShell, PageIntro, PriceBreakdownExample, Steps, faqItems } from "@/components/marketing";

export const metadata: Metadata = { title: "How ZeroFee works", description: "Set your earnings target, publish your page and let ZeroFee solve for a transparent buyer price with a 0% platform fee." };

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <PageIntro eyebrow="How ZeroFee works" title="Your target sets the price.">Instead of guessing a price and hoping fees leave enough, you tell ZeroFee what you want to earn. We calculate the rest.</PageIntro>
      <section className="section two-column">
        <Steps items={[
          { title: "Apply and get approved", text: "Submit a short application with your country, offering and content-rights confirmation. An operator reviews it before payouts are enabled." },
          { title: "Connect payouts", text: "You connect your own payment account. Membership payments are charged on your account, so ZeroFee is never in the money flow." },
          { title: "Create tiers", text: "Choose Guaranteed Earnings (you set the target, we solve the price) or Simple Price (you set the final price)." },
          { title: "Publish content", text: "Posts, files, YouTube lessons and courses can be public, for all paying members, or restricted to selected tiers." },
          { title: "Grow and migrate", text: "Invite your existing audience from Patreon with a CSV import and track conversion in the migration center." }
        ]} />
        <PriceBreakdownExample />
      </section>
      <section className="section">
        <p className="eyebrow">Guaranteed Earnings</p>
        <h2>What “guaranteed” means here</h2>
        <div className="card-grid">
          <article className="price-card"><h3>Modeled up front</h3><p>The quote uses a versioned, verified provider pricing rule. Only eligible payment contexts can use the guarantee.</p></article>
          <article className="price-card"><h3>Checked after payment</h3><p>Every payment is reconciled against what the provider actually charged. Surplus stays with the creator.</p></article>
          <article className="price-card"><h3>Self-correcting</h3><p>If real costs exceed the model, an incident is opened and the affected profile is paused until pricing is re-verified.</p></article>
        </div>
      </section>
      <section className="section"><p className="eyebrow">Questions</p><h2>Frequently asked</h2><Faq items={faqItems} /></section>
      <CtaBand />
    </MarketingShell>
  );
}
