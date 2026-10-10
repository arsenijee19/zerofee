import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { reportPostAction } from "@/app/actions";
import { Avatar, Panel, PublicHeader, SiteFooter } from "@/components/route-ui";
import { currentUserFromCookies } from "@/lib/server/auth";
import { canAccessPost } from "@/lib/server/membership-service";
import { getPostAttachments } from "@/lib/server/content-service";
import { getPublishedProfile, getCreatorProfileByUser } from "@/lib/server/profile-service";
import { renderBodyHtml } from "@/lib/server/rich-text";
import { formatBytes } from "@/lib/server/media-service";
import { one } from "@/lib/server/db";
import { youtubeEmbedUrl } from "@/lib/server/youtube";

type Props = { params: Promise<{ creatorSlug: string; postSlug: string }> };

type PostRow = { id: string; title: string; excerpt: string; body: string; visibility: string; state: string; youtube_video_id: string | null; cover_asset_id: string | null; published_at: Date | null };

async function loadPost(creatorId: string, slug: string) {
  return one<PostRow>("SELECT id,title,excerpt,body,visibility,state,youtube_video_id,cover_asset_id,published_at FROM posts WHERE creator_id=$1 AND slug=$2", [creatorId, slug]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { creatorSlug, postSlug } = await params;
  const profile = await getPublishedProfile(creatorSlug);
  const post = profile ? await loadPost(profile.id, postSlug) : null;
  if (!profile || !post || post.state !== "PUBLISHED") return { title: "Post not found", robots: { index: false } };
  const isPublic = post.visibility === "PUBLIC";
  return {
    title: `${post.title} · ${profile.display_name}`,
    description: post.excerpt || undefined,
    robots: isPublic ? undefined : { index: false },
    // Members-only posts must not leak titles to scrapers beyond the page title; no cover in previews.
    openGraph: isPublic && post.cover_asset_id ? { images: [`/api/media/${post.cover_asset_id}`] } : undefined
  };
}

export default async function PublicPostPage({ params }: Props) {
  const { creatorSlug, postSlug } = await params;
  const user = await currentUserFromCookies();
  let profile = await getPublishedProfile(creatorSlug);
  if (!profile && user) {
    const own = await getCreatorProfileByUser(user.id);
    if (own?.slug === creatorSlug) profile = own;
  }
  const post = profile ? await loadPost(profile.id, postSlug) : null;
  if (!profile || !post) notFound();
  const access = await canAccessPost(user, post.id);
  if (post.state !== "PUBLISHED" && !access.allowed) notFound();
  const attachments = access.allowed ? await getPostAttachments(post.id) : [];

  return (
    <>
      <PublicHeader user={user} />
      <main id="main-content" className="section post-page">
        {post.state !== "PUBLISHED" && <div className="flash info" role="note"><span aria-hidden="true">i</span><p>Preview: this post is {post.state.toLowerCase().replaceAll("_", " ")} and only visible to you.</p></div>}
        <nav aria-label="Breadcrumb" className="breadcrumb"><Link href={`/c/${profile.slug}`}>{profile.display_name}</Link><span aria-hidden="true">/</span><span>{post.title}</span></nav>
        <article className="post-reader">
          <header>
            <span className={`status ${post.visibility === "PUBLIC" ? "success" : "info"}`}>{post.visibility === "PUBLIC" ? "Free post" : "Members only"}</span>
            <h1>{post.title}</h1>
            <div className="byline"><Avatar assetId={profile.avatar_asset_id} name={profile.display_name} size={36} /><div><Link href={`/c/${profile.slug}`}>{profile.display_name}</Link>{post.published_at && <time dateTime={post.published_at.toISOString()}>{post.published_at.toLocaleDateString("en", { dateStyle: "long" })}</time>}</div></div>
          </header>
          {post.cover_asset_id && access.allowed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="post-cover" src={`/api/media/${post.cover_asset_id}`} alt="" />
          )}
          {access.allowed ? (
            <>
              {post.youtube_video_id && (
                <div className="video-frame"><iframe src={youtubeEmbedUrl(post.youtube_video_id)} title={`Video: ${post.title}`} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /></div>
              )}
              <div className="prose post-body-text" dangerouslySetInnerHTML={{ __html: renderBodyHtml(post.body) }} />
              {attachments.length > 0 && (
                <section aria-labelledby="files-heading" className="file-section">
                  <h2 id="files-heading">Downloads</h2>
                  <ul className="file-list">
                    {attachments.map((file) => <li key={file.id}><a href={`/api/media/${file.id}`} download>{file.original_name}</a><span>{file.mime_type.split("/")[1].toUpperCase()} · {formatBytes(Number(file.size_bytes))}</span></li>)}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <Panel title="Members-only content" eyebrow="Locked">
              {post.excerpt && <p>{post.excerpt}</p>}
              <p>{user ? "Your current membership does not include this post." : "Join to unlock this post and everything else from this creator."}</p>
              <div className="cta-row"><Link className="primary-button" href={`/c/${profile.slug}`}>Choose a membership</Link>{!user && <Link className="secondary-button" href={`/login?next=${encodeURIComponent(`/c/${profile.slug}/posts/${postSlug}`)}`}>Log in</Link>}</div>
            </Panel>
          )}
        </article>
        {access.allowed && post.state === "PUBLISHED" && user && !user.roles.includes("CREATOR") && (
          <details className="report-box">
            <summary>Report this post</summary>
            <form className="form-stack" action={reportPostAction}>
              <input type="hidden" name="postId" value={post.id} />
              <label>What is wrong with this post?<textarea name="reason" required minLength={3} maxLength={1000} /></label>
              <button className="secondary-button" type="submit">Send report</button>
            </form>
          </details>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
