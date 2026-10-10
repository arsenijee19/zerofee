import type { Metadata } from "next";
import Link from "next/link";
import { CreatorCard, CtaBand, MarketingShell, PageIntro } from "@/components/marketing";
import { EmptyState } from "@/components/route-ui";
import { listPublishedCreators } from "@/lib/server/profile-service";

export const metadata: Metadata = { title: "Browse creators", description: "Discover creators who run their memberships on ZeroFee." };
export const dynamic = "force-dynamic";

export default async function CreatorsPage() {
  const creators = await listPublishedCreators(60);
  return (
    <MarketingShell>
      <PageIntro eyebrow="Creators" title="Memberships on ZeroFee.">Every page below is run by an approved creator.</PageIntro>
      <section className="section">
        {creators.length ? <div className="creator-grid">{creators.map((creator) => <CreatorCard key={creator.slug} creator={creator} />)}</div> : <EmptyState title="No public creator pages yet" action={<Link className="primary-button" href="/signup?role=creator">Be the first creator</Link>}>Approved creators appear here once they publish their page.</EmptyState>}
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
