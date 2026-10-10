import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createCheckoutQuoteAction } from "@/app/actions";
import { Avatar, EmptyState, PublicHeader, SiteFooter } from "@/components/route-ui";
import { currentUserFromCookies } from "@/lib/server/auth";
import { listCreatorTiers } from "@/lib/server/route-data";
import { getPublishedProfile, getCreatorProfileByUser } from "@/lib/server/profile-service";
import { listPublicPosts } from "@/lib/server/content-service";
import { previewTierPrice } from "@/lib/server/pricing-service";
import { formatMoney } from "@/lib/money";
import { plainTextPreview } from "@/lib/server/rich-text";

type Props = { params: Promise<{ creatorSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await getPublishedProfile((await params).creatorSlug);
  if (!profile) return { title: "Creator not found", robots: { index: false } };
  const description = profile.tagline || plainTextPreview(profile.bio, 160) || `Memberships from ${profile.display_name}`;
  const image = profile.banner_asset_id ?? profile.avatar_asset_id;
  return {
    title: profile.display_name,
    description,
    alternates: { canonical: `/c/${profile.slug}` },
    openGraph: { title: profile.display_name, description, type: "profile", images: image ? [`/api/media/${image}`] : undefined },
    twitter: { card: image ? "summary_large_image" : "summary", title: profile.display_name, description }
  };
}

export default async function PublicCreatorPage({ params }: Props) {
  const { creatorSlug } = await params;
  const user = await currentUserFromCookies();
  let profile = await getPublishedProfile(creatorSlug);
  let preview = false;
  if (!profile && user) {
    const own = await getCreatorProfileByUser(user.id);
    if (own?.slug === creatorSlug) {
      profile = own;
      preview = true;
    }
  }
  if (!profile) notFound();

  const [allTiers, posts] = await Promise.all([listCreatorTiers(profile.id), listPublicPosts(profile.id)]);
  const tiers = allTiers.filter((tier) => tier.state === "PUBLISHED");
  const prices = await Promise.all(tiers.map((tier) => previewTierPrice({ ...tier })));
  const bioParagraphs = profile.bio.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);

  return (
    <>
      <PublicHeader user={user} />
      <main id="main-content" className="creator-page">
        {preview && <div className="flash info" role="note"><span aria-hidden="true">i</span><p>Preview: your page is not published yet. <Link href="/creator/settings">Publish it from your settings.</Link></p></div>}
        <div className="profile-banner" role="img" aria-label={profile.banner_asset_id ? `${profile.display_name} banner` : "Decorative banner"} style={profile.banner_asset_id ? { backgroundImage: `url(/api/media/${profile.banner_asset_id})` } : undefined} />
        <section className="profile-head">
          <Avatar assetId={profile.avatar_asset_id} name={profile.display_name} size={112} />
          <div className="profile-title">
            <p className="eyebrow">{profile.category}</p>
            <h1>{profile.display_name}</h1>
            {profile.tagline && <p className="hero-text">{profile.tagline}</p>}
            {(profile.website_url || profile.links.length > 0) && (
              <ul className="link-chips" aria-label="Links">
                {profile.website_url && <li><a href={profile.website_url} rel="noopener noreferrer nofollow" target="_blank">Website ↗</a></li>}
                {profile.links.map((link) => <li key={link.id}><a href={link.url} rel="noopener noreferrer nofollow" target="_blank">{link.label} ↗</a></li>)}
              </ul>
            )}
          </div>
        </section>

        <div className="creator-layout">
          <div className="creator-main">
            {bioParagraphs.length > 0 && (
              <section aria-labelledby="about-heading"><h2 id="about-heading">About</h2><div className="prose">{bioParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></section>
            )}
            <section aria-labelledby="posts-heading">
              <h2 id="posts-heading">Latest posts</h2>
              {posts.length ? (
                <div className="post-list">
                  {posts.map((post) => (
                    <Link className="post-card" key={post.slug} href={`/c/${profile!.slug}/posts/${post.slug}`}>
                      {post.cover_asset_id && post.visibility === "PUBLIC" ? <div className="post-card-cover" role="img" aria-label="" style={{ backgroundImage: `url(/api/media/${post.cover_asset_id})` }} /> : null}
                      <div>
                        <span className={`status ${post.visibility === "PUBLIC" ? "success" : "info"}`}>{post.visibility === "PUBLIC" ? "Free" : "Members only"}</span>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                        {post.published_at && <time dateTime={post.published_at.toISOString()}>{post.published_at.toLocaleDateString("en", { dateStyle: "medium" })}</time>}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : <EmptyState title="No posts yet">New posts from {profile.display_name} appear here.</EmptyState>}
            </section>
          </div>

          <aside className="creator-side" aria-labelledby="tiers-heading">
            <h2 id="tiers-heading">Memberships</h2>
            {tiers.length ? tiers.map((tier, index) => {
              const price = prices[index];
              return (
                <article className="price-card tier-card" key={tier.id}>
                  <h3>{tier.name}</h3>
                  <p className="tier-price">{price ? <>{formatMoney(price)}<small> / {tier.billing_interval === "annual" ? "year" : "month"}</small></> : <small>Final price shown at checkout</small>}</p>
                  <p>{tier.description}</p>
                  <ul>{tier.benefits.split(/\n|,/).map((benefit) => benefit.trim()).filter(Boolean).map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
                  <form action={createCheckoutQuoteAction}><input type="hidden" name="tierId" value={tier.id} /><button className="primary-button wide-button">See final price</button></form>
                  {price && <p className="muted tiny">Includes tax and provider costs. Indicative for EU card payments; your exact price is confirmed before you pay.</p>}
                </article>
              );
            }) : <EmptyState title="Memberships open soon">{profile.display_name} has not published a membership yet.</EmptyState>}
            <div className="panel member-panel"><strong>Already a member?</strong><Link className="secondary-button" href="/login">Log in to manage membership</Link></div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
