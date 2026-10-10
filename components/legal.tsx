import { CtaBand, MarketingShell, PageIntro } from "@/components/marketing";

export function LegalPage({ title, updated = "October 2026", children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <MarketingShell>
      <PageIntro eyebrow="Legal" title={title}>Last updated {updated}.</PageIntro>
      <section className="section legal">
        <div className="warning-box" role="note"><strong>Draft for legal review.</strong><span>This text describes how ZeroFee works in test mode. It must be reviewed and adapted by qualified counsel before the first live payment.</span></div>
        <div className="prose">{children}</div>
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
