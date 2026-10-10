import type { Metadata } from "next";
import Link from "next/link";
import { createCourseAction, deleteMediaAction, setPostStateAction, uploadMediaAction } from "@/app/actions";
import { EmptyState, Panel, ProductShell, StateBadge } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { listCreatorPostsDetailed } from "@/lib/server/content-service";
import { formatBytes, listCreatorMedia } from "@/lib/server/media-service";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export const metadata: Metadata = { title: "Content" };

export default async function CreatorContentPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return <ProductShell kind="creator" title="Content" user={user}><Panel title="Create your profile first"><Link className="primary-button" href="/creator/application">Start application</Link></Panel></ProductShell>;
  const [posts, media, courses] = await Promise.all([
    listCreatorPostsDetailed(creator.id),
    listCreatorMedia(creator.id),
    query<{ title: string; slug: string; state: string }>("SELECT title,slug,state FROM courses WHERE creator_id = $1 ORDER BY created_at DESC", [creator.id])
  ]);
  const library = media.filter((asset) => asset.purpose === "ATTACHMENT");
  const usedBytes = media.reduce((sum, asset) => sum + Number(asset.size_bytes), 0);

  return (
    <ProductShell kind="creator" title="Content" user={user}>
      <Panel title="Posts" eyebrow="Publishing">
        <div className="section-header"><p className="muted">{posts.length} {posts.length === 1 ? "post" : "posts"}</p><Link className="primary-button" href="/creator/content/new">New post</Link></div>
        {posts.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Visibility</th><th>State</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td data-label="Title"><Link className="text-link" href={`/creator/content/${post.id}`}>{post.title}</Link><small className="cell-sub">/{post.slug}</small></td>
                    <td data-label="Visibility">{post.visibility === "PUBLIC" ? "Everyone" : post.visibility === "ALL_PAID" ? "All members" : "Selected tiers"}</td>
                    <td data-label="State"><StateBadge state={post.state} /></td>
                    <td data-label="Actions" className="row-actions">
                      <Link className="text-button" href={`/creator/content/${post.id}`}>Edit</Link>
                      {post.state === "PUBLISHED" ? <Link className="text-button" href={`/c/${creator.slug}/posts/${post.slug}`}>View</Link> : null}
                      {(post.state === "DRAFT" || post.state === "ARCHIVED") && (
                        <form action={setPostStateAction}><input type="hidden" name="creatorId" value={creator.id} /><input type="hidden" name="postId" value={post.id} /><input type="hidden" name="state" value="PUBLISHED" /><button className="text-button">Publish</button></form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="No posts yet" action={<Link className="primary-button" href="/creator/content/new">Write your first post</Link>}>Posts are how members get value. Start with a free preview and a members-only post.</EmptyState>}
      </Panel>

      <Panel title="File library" eyebrow="Downloads">
        <form className="form-stack" action={uploadMediaAction}>
          <input type="hidden" name="creatorId" value={creator.id} />
          <label>File<input name="file" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" required aria-describedby="file-help" /><small id="file-help">PNG, JPG, WebP or PDF up to 10 MB. Attach files to posts so only entitled members can download them.</small></label>
          <button className="primary-button">Upload file</button>
        </form>
        <p className="muted">Storage used: {formatBytes(usedBytes)}</p>
        {library.length ? (
          <ul className="file-list">
            {library.map((asset) => (
              <li key={asset.id}>
                <span><strong>{asset.original_name}</strong><small>{asset.mime_type} · {formatBytes(Number(asset.size_bytes))}</small></span>
                <form action={deleteMediaAction}><input type="hidden" name="creatorId" value={creator.id} /><input type="hidden" name="assetId" value={asset.id} /><button className="text-button danger">Delete</button></form>
              </li>
            ))}
          </ul>
        ) : <EmptyState title="Your library is empty">Uploaded files appear here and can be attached to any post.</EmptyState>}
      </Panel>

      <Panel title="Courses" eyebrow="YouTube lessons">
        {courses.rows.length > 0 && <ul className="file-list">{courses.rows.map((course) => <li key={course.slug}><span><strong>{course.title}</strong><small>/{course.slug}</small></span><StateBadge state={course.state} /></li>)}</ul>}
        <details className="disclosure">
          <summary>Create a course with a first lesson</summary>
          <form className="form-stack" action={createCourseAction}>
            <input type="hidden" name="creatorId" value={creator.id} />
            <label>Course title<input name="courseTitle" required minLength={2} maxLength={120} /></label>
            <label>Lesson title<input name="lessonTitle" required minLength={2} maxLength={120} /></label>
            <label>YouTube URL<input name="youtubeUrl" type="url" required placeholder="https://youtu.be/..." /></label>
            <label>Lesson notes<textarea name="body" required rows={5} /></label>
            <button className="primary-button">Create course</button>
          </form>
        </details>
      </Panel>
    </ProductShell>
  );
}
