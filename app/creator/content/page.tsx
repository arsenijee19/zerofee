import { createCourseAction, createPostAction, uploadMediaAction } from "@/app/actions";
import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser, listCreatorPosts, listCreatorTiers } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function CreatorContentPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  const [posts, tiers, courses] = await Promise.all([
    listCreatorPosts(creator.id),
    listCreatorTiers(creator.id),
    query<{ title: string; slug: string; state: string }>("SELECT title,slug,state FROM courses WHERE creator_id = $1 ORDER BY created_at DESC", [creator.id])
  ]);
  const tier = tiers[0];
  const assets = (await query<{ original_name: string; mime_type: string; size_bytes: string; visibility: string }>("SELECT original_name,mime_type,size_bytes,visibility FROM media_assets WHERE creator_id=$1 ORDER BY created_at DESC", [creator.id])).rows;
  return <ProductShell kind="creator" title="Content" user={user}>
    <Panel title="Upload media" eyebrow="Validated local storage"><form className="form-stack" action={uploadMediaAction} encType="multipart/form-data"><input type="hidden" name="creatorId" value={creator.id} /><label>File<input name="file" type="file" accept="image/png,image/jpeg,application/pdf" required /></label><button className="primary-button">Upload asset</button></form></Panel>
    <Panel title="Create post" eyebrow="Server CRUD">
      <form className="form-stack" action={createPostAction}><input type="hidden" name="creatorId" value={creator.id} /><input type="hidden" name="tierId" value={tier?.id ?? ""} /><label>Title<input name="title" required defaultValue={`Post ${Date.now()}`} /></label><label>Slug<input name="slug" required defaultValue={`post-${Date.now()}`} /></label><label>Visibility<select name="visibility"><option>ALL_PAID</option><option>PUBLIC</option><option>SELECTED_TIERS</option></select></label><label>YouTube URL<input name="youtubeUrl" defaultValue="https://youtu.be/dQw4w9WgXcQ" /></label><label>Body<textarea name="body" required defaultValue="<p>Member content body.</p>" /></label><button className="primary-button">Publish post</button></form>
    </Panel>
    <Panel title="Create course lesson" eyebrow="YouTube only"><form className="form-stack" action={createCourseAction}><input type="hidden" name="creatorId" value={creator.id} /><label>Course title<input name="courseTitle" required defaultValue={`Course ${Date.now()}`} /></label><label>Lesson title<input name="lessonTitle" required defaultValue="Lesson one" /></label><label>YouTube URL<input name="youtubeUrl" required defaultValue="https://youtube.com/watch?v=dQw4w9WgXcQ" /></label><label>Body<textarea name="body" required defaultValue="Lesson text" /></label><button className="primary-button">Create course</button></form></Panel>
    <DataTable headings={["Title", "Slug", "Visibility", "State", "Video"]} rows={posts.map((p) => [p.title, p.slug, p.visibility, p.state, p.youtube_video_id ?? "none"])} />
    <DataTable headings={["Course", "Slug", "State"]} rows={courses.rows.map((c) => [c.title, c.slug, c.state])} />
    <DataTable headings={["Asset", "Type", "Bytes", "Visibility"]} rows={assets.map((asset) => [asset.original_name, asset.mime_type, asset.size_bytes, asset.visibility])} />
  </ProductShell>;
}
