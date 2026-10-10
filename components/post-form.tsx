import Link from "next/link";
import { createPostAction, updatePostAction } from "@/app/actions";
import { formatBytes } from "@/lib/server/media-service";

type Tier = { id: string; name: string };
type Asset = { id: string; original_name: string; mime_type: string; size_bytes: string; purpose: string };
type Initial = { id: string; title: string; slug: string; body: string; excerpt: string; visibility: string; youtube_video_id: string | null; cover_asset_id: string | null; tierIds: string[]; attachmentIds: string[]; state: string };

export function PostForm({ creatorId, tiers, assets, post }: { creatorId: string; tiers: Tier[]; assets: Asset[]; post?: Initial }) {
  const attachments = assets.filter((asset) => asset.purpose === "ATTACHMENT");
  return (
    <form className="form-stack wide-form" action={post ? updatePostAction : createPostAction}>
      <input type="hidden" name="creatorId" value={creatorId} />
      {post && <input type="hidden" name="postId" value={post.id} />}
      {post && <input type="hidden" name="existingCoverId" value={post.cover_asset_id ?? ""} />}
      <label>Title<input name="title" required minLength={2} maxLength={140} defaultValue={post?.title ?? ""} /></label>
      {post ? (
        <div className="detail-list"><div><span>Address</span><strong>/{post.slug}</strong></div></div>
      ) : (
        <label>Slug<input name="slug" maxLength={40} pattern="[a-z0-9\-]*" placeholder="auto-generated from the title" aria-describedby="slug-help" /><small id="slug-help">Lowercase letters, numbers and hyphens. Leave empty to generate it.</small></label>
      )}
      <label>Summary<input name="excerpt" maxLength={300} defaultValue={post?.excerpt ?? ""} placeholder="Shown on your page and in previews. Leave empty to auto-generate." /></label>
      <label>Body<textarea name="body" required rows={12} maxLength={50000} defaultValue={post?.body ?? ""} aria-describedby="body-help" /><small id="body-help">Plain text, or basic HTML: paragraphs, bold, italic, headings, lists, quotes and links. Scripts and unsafe markup are removed.</small></label>
      <fieldset>
        <legend>Who can read it</legend>
        <label className="check"><input type="radio" name="visibility" value="ALL_PAID" defaultChecked={!post || post.visibility === "ALL_PAID"} /> All paying members</label>
        <label className="check"><input type="radio" name="visibility" value="SELECTED_TIERS" defaultChecked={post?.visibility === "SELECTED_TIERS"} /> Selected tiers only</label>
        <label className="check"><input type="radio" name="visibility" value="PUBLIC" defaultChecked={post?.visibility === "PUBLIC"} /> Everyone (free preview)</label>
        {tiers.length > 0 ? (
          <div className="tier-picks" role="group" aria-label="Tiers with access">
            {tiers.map((tier) => <label className="check" key={tier.id}><input type="checkbox" name="tierId" value={tier.id} defaultChecked={post?.tierIds.includes(tier.id)} /> {tier.name}</label>)}
          </div>
        ) : <p className="muted">Create a tier to restrict posts to specific memberships.</p>}
      </fieldset>
      <label>YouTube video (optional)<input name="youtubeUrl" type="url" defaultValue={post?.youtube_video_id ? `https://youtu.be/${post.youtube_video_id}` : ""} placeholder="https://youtu.be/..." /></label>
      <fieldset>
        <legend>Cover image (optional)</legend>
        {post?.cover_asset_id && (
          <div className="cover-current">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/media/${post.cover_asset_id}`} alt="Current cover" />
            <label className="check"><input type="checkbox" name="removeCover" /> Remove cover</label>
          </div>
        )}
        <label>Upload cover<input name="cover" type="file" accept="image/png,image/jpeg,image/webp" /></label>
        <label>Cover description (for screen readers)<input name="coverAlt" maxLength={200} /></label>
      </fieldset>
      {attachments.length > 0 && (
        <fieldset>
          <legend>Downloads from your library</legend>
          <div className="tier-picks">
            {attachments.map((asset) => <label className="check" key={asset.id}><input type="checkbox" name="attachmentId" value={asset.id} defaultChecked={post?.attachmentIds.includes(asset.id)} /> {asset.original_name} <small>({formatBytes(Number(asset.size_bytes))})</small></label>)}
          </div>
        </fieldset>
      )}
      <div className="cta-row">
        {post ? <button className="primary-button" type="submit">Save changes</button> : (
          <>
            <button className="primary-button" type="submit" name="intent" value="publish">Publish post</button>
            <button className="secondary-button" type="submit" name="intent" value="draft">Save as draft</button>
          </>
        )}
        <Link className="text-button" href="/creator/content">Cancel</Link>
      </div>
    </form>
  );
}
