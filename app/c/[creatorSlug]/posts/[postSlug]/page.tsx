import Link from "next/link";
import { PublicHeader, Panel } from "@/components/route-ui";
import { getPublicCreator } from "@/lib/server/route-data";
import { currentUserFromCookies } from "@/lib/server/auth";
import { canAccessPost } from "@/lib/server/membership-service";
import { query } from "@/lib/server/db";

export default async function PublicPostPage({ params }: { params: Promise<{ creatorSlug: string; postSlug: string }> }) {
  const { creatorSlug, postSlug } = await params;
  const creator = await getPublicCreator(creatorSlug);
  const post = creator ? await query<{ id: string; title: string; body: string }>("SELECT id,title,body FROM posts WHERE creator_id=$1 AND slug=$2 AND state='PUBLISHED'", [creator.id, postSlug]) : null;
  const user = await currentUserFromCookies();
  if (!creator || !post?.rowCount) return <><PublicHeader user={user} /><main className="section"><Panel title="Post not found"><p>This post is not published.</p></Panel></main></>;
  const access = await canAccessPost(user, post.rows[0].id);
  return <><PublicHeader user={user} /><main className="section"><article className="post-reader"><p className="eyebrow">{creator.display_name}</p><h1>{post.rows[0].title}</h1>{access.allowed ? <p className="hero-text">{post.rows[0].body}</p> : <Panel title="Members-only content"><p>Your active membership unlocks this post.</p><Link className="primary-button" href={`/c/${creator.slug}`}>Choose a membership</Link></Panel>}</article></main></>;
}
