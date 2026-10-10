import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePostAction, setPostStateAction } from "@/app/actions";
import { PostForm } from "@/components/post-form";
import { Panel, ProductShell, StateBadge } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getPostForEdit } from "@/lib/server/content-service";
import { listCreatorMedia } from "@/lib/server/media-service";
import { getCreatorForUser, listCreatorTiers } from "@/lib/server/route-data";

export const metadata: Metadata = { title: "Edit post" };

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator || !uuid.test(postId)) notFound();
  const post = await getPostForEdit(creator.id, postId);
  if (!post) notFound();
  const [tiers, assets] = await Promise.all([listCreatorTiers(creator.id), listCreatorMedia(creator.id)]);
  return (
    <ProductShell kind="creator" title="Edit post" user={user}>
      <Panel title={post.title} eyebrow="Status">
        <div className="cta-row">
          <StateBadge state={post.state} />
          <Link className="secondary-button" href={`/c/${creator.slug}/posts/${post.slug}`}>Preview</Link>
          {post.state !== "PUBLISHED" && post.state !== "UNPUBLISHED_BY_MODERATION" && <StateForm creatorId={creator.id} postId={post.id} state="PUBLISHED" label="Publish" primary />}
          {post.state === "PUBLISHED" && <StateForm creatorId={creator.id} postId={post.id} state="DRAFT" label="Move to drafts" />}
          {post.state !== "ARCHIVED" && post.state !== "UNPUBLISHED_BY_MODERATION" && <StateForm creatorId={creator.id} postId={post.id} state="ARCHIVED" label="Archive" />}
        </div>
        {post.state === "UNPUBLISHED_BY_MODERATION" && <p className="muted">This post was unpublished by moderation. Contact support to appeal.</p>}
      </Panel>
      <Panel title="Edit content"><PostForm creatorId={creator.id} tiers={tiers} assets={assets} post={post} /></Panel>
      <Panel title="Danger zone" eyebrow="Permanent">
        <p>Deleting a post removes it for everyone. Archive it instead if you may want it back.</p>
        <form action={deletePostAction}><input type="hidden" name="creatorId" value={creator.id} /><input type="hidden" name="postId" value={post.id} /><button className="danger-button">Delete post</button></form>
      </Panel>
    </ProductShell>
  );
}

function StateForm({ creatorId, postId, state, label, primary }: { creatorId: string; postId: string; state: string; label: string; primary?: boolean }) {
  return <form action={setPostStateAction}><input type="hidden" name="creatorId" value={creatorId} /><input type="hidden" name="postId" value={postId} /><input type="hidden" name="state" value={state} /><button className={primary ? "primary-button" : "secondary-button"}>{label}</button></form>;
}
