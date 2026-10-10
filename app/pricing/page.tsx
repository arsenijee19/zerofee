import type { Metadata } from "next";
import { CtaBand, Faq, MarketingShell, PageIntro, PlanCards } from "@/components/marketing";

export const metadata: Metadata = { title: "Pricing", description: "Fixed monthly ZeroFee plans. No percentage of your membership revenue." };

export const dynamic = "force-dynamic";

export default function PricingPage() {
  return (
    <MarketingShell>
      <PageIntro eyebrow="Transparent SaaS pricing" title="Fixed plans for a fairer creator business.">ZeroFee is paid by a flat monthly plan. We never take a share of what your members pay you.</PageIntro>
      <section className="section"><PlanCards /><p className="muted">Plan prices are shown in test mode and may change before launch. Payment-provider processing fees and applicable taxes are separate and always itemised for the buyer.</p></section>
      <section className="section">
        <p className="eyebrow">Compare</p>
        <h2>What is included in every plan</h2>
        <div className="detail-list">
          <div><span>Platform fee on membership revenue</span><strong>0%</strong></div>
          <div><span>Seller profile and public page</span><strong>Included</strong></div>
          <div><span>Tiers, posts, courses and downloads</span><strong>Included</strong></div>
          <div><span>Patreon CSV migration</span><strong>Included</strong></div>
          <div><span>API keys and signed webhooks</span><strong>Included</strong></div>
          <div><span>Discord, Telegram and email connectors</span><strong>Included</strong></div>
        </div>
      </section>
      <section className="section"><p className="eyebrow">Questions</p><h2>Pricing questions</h2>
        <Faq items={[
          { q: "What happens if I exceed my member limit?", a: "You can upgrade at any time. Existing members keep access; new sign-ups pause until you move to a larger plan." },
          { q: "Can I change plans?", a: "Yes. Plan changes apply to the next billing period and are recorded in your billing history." },
          { q: "Are there setup or payout fees from ZeroFee?", a: "No. Your payment provider may charge its own processing and payout fees, which are shown transparently in your earnings reports." }
        ]} />
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
