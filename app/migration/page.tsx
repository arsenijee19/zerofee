import type { Metadata } from "next";
import { CtaBand, MarketingShell, PageIntro, Steps } from "@/components/marketing";

export const metadata: Metadata = { title: "Migrate from Patreon", description: "Import your Patreon audience from a CSV export and invite members to a new ZeroFee subscription." };

export default function MigrationPage() {
  return (
    <MarketingShell>
      <PageIntro eyebrow="Migration center" title="Bring your community with you.">Move your audience from Patreon with personal invitations. Your members stay in control of their payment details.</PageIntro>
      <section className="section two-column">
        <Steps items={[
          { title: "Export your member list", text: "Download the member CSV from your Patreon creator dashboard." },
          { title: "Upload and map tiers", text: "ZeroFee validates every row, flags invalid emails and lets you map each Patreon tier to a ZeroFee tier." },
          { title: "Send personal invitations", text: "Each member receives a unique link that expires after a set period. Only people in your file are invited." },
          { title: "Members re-subscribe", text: "Members review the final price and authorize a new subscription. Track clicks and conversions in the migration center." }
        ]} />
        <div className="panel">
          <p className="eyebrow">Important</p>
          <h3>Payment credentials do not move</h3>
          <p>Cards and bank details cannot be exported from another platform. Every member must authorize a new subscription, so conversion depends on a clear invitation and a fair price.</p>
        </div>
      </section>
      <CtaBand title="Start your migration" text="Create a creator account and import your first CSV from the migration center." />
    </MarketingShell>
  );
}
