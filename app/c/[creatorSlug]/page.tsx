import Link from "next/link";
import { createCheckoutQuoteAction } from "@/app/actions";
import { DataTable, Panel, PublicHeader } from "@/components/route-ui";
import { getPublicCreator, listCreatorTiers } from "@/lib/server/route-data";
import { formatMoney, money } from "@/lib/money";

export default async function PublicCreatorPage({ params }: { params: Promise<{ creatorSlug: string }> }) {
  const { creatorSlug } = await params;
  const creator = await getPublicCreator(creatorSlug);
  if (!creator) return <><PublicHeader /><main className="section"><Panel title="Creator not found"><p>This public page is no longer available.</p></Panel></main></>;
  const tiers = await listCreatorTiers(creator.id);
  return <><PublicHeader /><main className="section"><p className="eyebrow">{creator.category}</p><h1>{creator.display_name}</h1><p className="hero-text">{creator.bio}</p><div className="card-grid">{tiers.filter((tier) => tier.state === "PUBLISHED").map((tier) => <article className="price-card" key={tier.id}><h2>{tier.name}</h2><p>{tier.description}</p><p>{tier.benefits}</p><strong>{tier.pricing_mode === "GUARANTEED_EARNINGS" ? `From ${formatMoney(money(Number(tier.creator_target_minor), tier.currency))} earned` : formatMoney(money(Number(tier.simple_retail_minor ?? tier.creator_target_minor), tier.currency))}</strong><form action={createCheckoutQuoteAction}><input type="hidden" name="tierId" value={tier.id} /><button className="primary-button">See final price</button></form></article>)}</div><Panel title="Already a member?"><Link className="secondary-button" href="/login">Log in to manage membership</Link></Panel></main></>;
}
