import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, FeaturedCreators, Faq, MarketingShell, PriceBreakdownExample, Steps, faqItems } from "@/components/marketing";

export const metadata: Metadata = {
  title: { absolute: "ZeroFee: creator memberships with 0% platform fee" },
  description: "Choose what you earn. ZeroFee takes 0% of creator membership revenue and charges a fixed monthly plan instead."
};

export default function Page() {
  return (
    <MarketingShell hero>
      <section className="hero" data-testid="homepage">
        <div className="hero-copy">
          <p className="eyebrow">Creator membership SaaS</p>
          <h1>You choose what you earn.</h1>
          <p className="hero-text">Creators set earnings targets. ZeroFee takes 0% of membership revenue and earns through fixed SaaS plans. Provider costs remain visible and auditable.</p>
          <div className="cta-row">
            <Link className="primary-button large" href="/signup?role=creator">Start as a creator</Link>
            <Link className="secondary-button large" href="/c/mila-nova">View public creator page</Link>
          </div>
          <div className="feature-band">
            <span>0% ZeroFee platform fee</span>
            <span>Provider-authoritative reconciliation</span>
            <span>Audience migration without card claims</span>
          </div>
        </div>
        <PriceBreakdownExample />
      </section>

      <section className="section">
        <p className="eyebrow">How it works</p>
        <h2>From target to paid member in four steps</h2>
        <Steps items={[
          { title: "Set your target", text: "Decide what you want to earn per member each month or year. ZeroFee solves for the lowest legal buyer price." },
          { title: "Publish your page", text: "Add your photo, banner, story and links. Members see one transparent final price with tax and costs itemised." },
          { title: "Members subscribe", text: "Payments run through your own connected payment account. ZeroFee never holds your revenue." },
          { title: "Reconcile every payment", text: "Each payment is matched to the provider record. Surplus stays yours; shortfalls trigger a safety pause." }
        ]} />
        <p><Link className="text-link" href="/how-it-works">Read the full walkthrough →</Link></p>
      </section>

      <section className="section split-feature">
        <div>
          <p className="eyebrow">Everything for a membership business</p>
          <h2>One workspace for content, members and money</h2>
          <ul className="check-list">
            <li>Seller profile with banner, photo, bio and links</li>
            <li>Tiers, members-only posts, courses with YouTube lessons and file downloads</li>
            <li>Patreon CSV migration with personal invitations</li>
            <li>Discord, Telegram and email connectors</li>
            <li>API keys and signed webhooks for your own tools</li>
            <li>Refunds, disputes and payout visibility in one place</li>
          </ul>
        </div>
        <div className="panel feature-panel">
          <p className="eyebrow">Fixed plans</p>
          <h3>No percentage of your revenue, ever</h3>
          <p>Plans are priced per month and sized by active members. Your income grows without your ZeroFee bill growing with it.</p>
          <Link className="primary-button" href="/pricing">See plans</Link>
        </div>
      </section>

      <FeaturedCreators />

      <section className="section">
        <p className="eyebrow">Questions</p>
        <h2>Straight answers</h2>
        <Faq items={faqItems} />
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
