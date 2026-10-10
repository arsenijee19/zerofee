import { z } from "zod";
import type { AuthUser } from "@/lib/server/auth";
import { one, query, transaction } from "@/lib/server/db";
import { requireCreatorOwner } from "@/lib/server/policies";
import { plainTextPreview, sanitizeRichText } from "@/lib/server/rich-text";
import { parse, slugSchema, UserError } from "@/lib/server/validation";
import { parseYouTubeVideoId } from "@/lib/server/youtube";

export { sanitizeRichText };

/** Legacy synchronous media validation kept for callers that already hold the bytes. */
export function validateMedia(input: { name: string; mimeType: string; sizeBytes: number; bytes: Buffer }) {
  const allowed = new Map([
    ["image/png", Buffer.from([0x89, 0x50, 0x4e, 0x47])],
    ["image/jpeg", Buffer.from([0xff, 0xd8, 0xff])],
    ["application/pdf", Buffer.from([0x25, 0x50, 0x44, 0x46])]
  ]);
  if (input.sizeBytes > 10 * 1024 * 1024) throw new Error("File exceeds V1 size limit");
  const magic = allowed.get(input.mimeType);
  if (!magic) throw new Error("Unsupported MIME type");
  if (input.name.includes("..") || input.name.includes("/")) throw new Error("Unsafe filename");
  if (!input.bytes.subarray(0, magic.length).equals(magic)) throw new Error("MIME/content mismatch");
}

export type PostInput = {
  title: string;
  slug: string;
  body: string;
  excerpt?: string;
  visibility: "PUBLIC" | "ALL_PAID" | "SELECTED_TIERS";
  tierIds?: string[];
  youtubeUrl?: string;
  coverAssetId?: string | null;
  attachmentIds?: string[];
  state?: "DRAFT" | "PUBLISHED";
};

const postSchema = z.object({
  title: z.string().trim().min(2, "Give your post a title").max(140, "Title must be 140 characters or fewer"),
  slug: slugSchema,
  body: z.string().trim().min(1, "Write something for your members").max(50_000, "Post is too long"),
  excerpt: z.string().trim().max(300, "Summary must be 300 characters or fewer").optional()
});

function slugify(text: string) {
  return text.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "post";
}

export function suggestSlug(title: string) {
  return slugify(title);
}

type Queryable = { query: (text: string, params?: unknown[]) => Promise<{ rowCount: number | null }> };

async function assertOwnedTiers(client: Queryable, creatorId: string, tierIds: string[]) {
  if (!tierIds.length) return;
  const owned = await client.query("SELECT id FROM creator_tiers WHERE creator_id = $1 AND id = ANY($2::uuid[])", [creatorId, tierIds]);
  if (owned.rowCount !== new Set(tierIds).size) throw new UserError("One of the selected tiers does not belong to your page");
}

async function assertOwnedAssets(client: Queryable, creatorId: string, assetIds: string[]) {
  if (!assetIds.length) return;
  const owned = await client.query("SELECT id FROM media_assets WHERE creator_id = $1 AND id = ANY($2::uuid[])", [creatorId, assetIds]);
  if (owned.rowCount !== new Set(assetIds).size) throw new UserError("One of the selected files was not found");
}

export async function createPost(user: AuthUser, creatorId: string, input: PostInput) {
  await requireCreatorOwner(user, creatorId);
  const data = parse(postSchema, input);
  const tierIds = [...new Set(input.tierIds ?? [])];
  if (input.visibility === "SELECTED_TIERS" && !tierIds.length) throw new UserError("Choose at least one tier for this post");
  const youtubeVideoId = input.youtubeUrl?.trim() ? parseYouTubeVideoId(input.youtubeUrl.trim()) : null;
  const state = input.state ?? "PUBLISHED";
  const body = sanitizeRichText(data.body);
  if (!plainTextPreview(body)) throw new UserError("Write something for your members");
  return transaction(async (client) => {
    await assertOwnedTiers(client, creatorId, input.visibility === "SELECTED_TIERS" ? tierIds : []);
    await assertOwnedAssets(client, creatorId, [...(input.coverAssetId ? [input.coverAssetId] : []), ...(input.attachmentIds ?? [])]);
    const duplicate = await client.query("SELECT 1 FROM posts WHERE creator_id = $1 AND slug = $2", [creatorId, data.slug]);
    if (duplicate.rowCount) throw new UserError("You already have a post with this address");
    const post = await client.query<{ id: string }>(
      `INSERT INTO posts (creator_id,title,slug,body,excerpt,visibility,state,youtube_video_id,cover_asset_id,published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CASE WHEN $7 = 'PUBLISHED' THEN now() END) RETURNING id`,
      [creatorId, data.title, data.slug, body, data.excerpt || plainTextPreview(body, 200), input.visibility, state, youtubeVideoId, input.coverAssetId || null]
    );
    if (input.visibility === "SELECTED_TIERS") for (const tierId of tierIds) await client.query("INSERT INTO post_tier_access (post_id,tier_id) VALUES ($1,$2)", [post.rows[0].id, tierId]);
    for (const assetId of new Set(input.attachmentIds ?? [])) await client.query("INSERT INTO post_attachments (post_id,asset_id) VALUES ($1,$2)", [post.rows[0].id, assetId]);
    await client.query("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id) VALUES ($1,$2,'post',$3)", [user.id, state === "PUBLISHED" ? "post_published" : "post_drafted", post.rows[0].id]);
    return post.rows[0];
  });
}

export async function updatePost(user: AuthUser, creatorId: string, postId: string, input: Omit<PostInput, "slug" | "state">) {
  await requireCreatorOwner(user, creatorId);
  const data = parse(postSchema.omit({ slug: true }), input);
  const tierIds = [...new Set(input.tierIds ?? [])];
  if (input.visibility === "SELECTED_TIERS" && !tierIds.length) throw new UserError("Choose at least one tier for this post");
  const youtubeVideoId = input.youtubeUrl?.trim() ? parseYouTubeVideoId(input.youtubeUrl.trim()) : null;
  const body = sanitizeRichText(data.body);
  await transaction(async (client) => {
    const existing = await client.query("SELECT id FROM posts WHERE id = $1 AND creator_id = $2 FOR UPDATE", [postId, creatorId]);
    if (!existing.rowCount) throw new UserError("Post not found");
    await assertOwnedTiers(client, creatorId, input.visibility === "SELECTED_TIERS" ? tierIds : []);
    await assertOwnedAssets(client, creatorId, [...(input.coverAssetId ? [input.coverAssetId] : []), ...(input.attachmentIds ?? [])]);
    await client.query(
      `UPDATE posts SET title=$3, body=$4, excerpt=$5, visibility=$6, youtube_video_id=$7, cover_asset_id=$8, updated_at=now() WHERE id=$1 AND creator_id=$2`,
      [postId, creatorId, data.title, body, data.excerpt || plainTextPreview(body, 200), input.visibility, youtubeVideoId, input.coverAssetId || null]
    );
    await client.query("DELETE FROM post_tier_access WHERE post_id = $1", [postId]);
    if (input.visibility === "SELECTED_TIERS") for (const tierId of tierIds) await client.query("INSERT INTO post_tier_access (post_id,tier_id) VALUES ($1,$2)", [postId, tierId]);
    await client.query("DELETE FROM post_attachments WHERE post_id = $1", [postId]);
    for (const assetId of new Set(input.attachmentIds ?? [])) await client.query("INSERT INTO post_attachments (post_id,asset_id) VALUES ($1,$2)", [postId, assetId]);
    await client.query("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id) VALUES ($1,'post_updated','post',$2)", [user.id, postId]);
  });
}

export async function setPostState(user: AuthUser, creatorId: string, postId: string, state: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  await requireCreatorOwner(user, creatorId);
  const current = await one<{ state: string }>("SELECT state FROM posts WHERE id = $1 AND creator_id = $2", [postId, creatorId]);
  if (!current) throw new UserError("Post not found");
  if (current.state === "UNPUBLISHED_BY_MODERATION") throw new UserError("This post was unpublished by moderation. Contact support to appeal.");
  await query("UPDATE posts SET state = $3, published_at = CASE WHEN $3 = 'PUBLISHED' THEN COALESCE(published_at, now()) ELSE published_at END, updated_at = now() WHERE id = $1 AND creator_id = $2", [postId, creatorId, state]);
  await query("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id, metadata) VALUES ($1,'post_state_changed','post',$2,$3)", [user.id, postId, { state }]);
}

export async function deletePost(user: AuthUser, creatorId: string, postId: string) {
  await requireCreatorOwner(user, creatorId);
  const result = await query("DELETE FROM posts WHERE id = $1 AND creator_id = $2", [postId, creatorId]);
  if (!result.rowCount) throw new UserError("Post not found");
  await query("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id) VALUES ($1,'post_deleted','post',$2)", [user.id, postId]);
}

export type PostRow = { id: string; title: string; slug: string; excerpt: string; visibility: string; state: string; youtube_video_id: string | null; cover_asset_id: string | null; published_at: Date | null; created_at: Date };

export async function listCreatorPostsDetailed(creatorId: string) {
  return (await query<PostRow>(
    "SELECT id,title,slug,excerpt,visibility,state,youtube_video_id,cover_asset_id,published_at,created_at FROM posts WHERE creator_id = $1 ORDER BY created_at DESC",
    [creatorId]
  )).rows;
}

export async function getPostForEdit(creatorId: string, postId: string) {
  const post = await one<PostRow & { body: string }>("SELECT id,title,slug,body,excerpt,visibility,state,youtube_video_id,cover_asset_id,published_at,created_at FROM posts WHERE id = $1 AND creator_id = $2", [postId, creatorId]);
  if (!post) return null;
  const tiers = await query<{ tier_id: string }>("SELECT tier_id FROM post_tier_access WHERE post_id = $1", [postId]);
  const attachments = await query<{ asset_id: string }>("SELECT asset_id FROM post_attachments WHERE post_id = $1", [postId]);
  return { ...post, tierIds: tiers.rows.map((r) => r.tier_id), attachmentIds: attachments.rows.map((r) => r.asset_id) };
}

export async function listPublicPosts(creatorId: string, limit = 12) {
  return (await query<{ slug: string; title: string; excerpt: string; visibility: string; cover_asset_id: string | null; published_at: Date | null }>(
    "SELECT slug,title,excerpt,visibility,cover_asset_id,published_at FROM posts WHERE creator_id = $1 AND state = 'PUBLISHED' ORDER BY published_at DESC NULLS LAST, created_at DESC LIMIT $2",
    [creatorId, limit]
  )).rows;
}

export async function getPostAttachments(postId: string) {
  return (await query<{ id: string; original_name: string; mime_type: string; size_bytes: string; alt_text: string }>(
    "SELECT ma.id, ma.original_name, ma.mime_type, ma.size_bytes, ma.alt_text FROM post_attachments pa JOIN media_assets ma ON ma.id = pa.asset_id WHERE pa.post_id = $1 ORDER BY ma.created_at",
    [postId]
  )).rows;
}

export async function createCourseWithLesson(user: AuthUser, creatorId: string, input: { courseTitle: string; lessonTitle: string; body: string; youtubeUrl: string }) {
  await requireCreatorOwner(user, creatorId);
  const courseTitle = parse(z.string().trim().min(2, "Course title is required").max(120), input.courseTitle);
  const lessonTitle = parse(z.string().trim().min(2, "Lesson title is required").max(120), input.lessonTitle);
  const stamp = Date.now().toString(36);
  const courseSlug = slugify(courseTitle);
  const lessonSlug = slugify(lessonTitle);
  const videoId = input.youtubeUrl.trim() ? parseYouTubeVideoId(input.youtubeUrl.trim()) : null;
  return transaction(async (client) => {
    const course = await client.query<{ id: string }>("INSERT INTO courses (creator_id,title,slug,state) VALUES ($1,$2,$3,'PUBLISHED') RETURNING id", [creatorId, courseTitle, `${courseSlug}-${stamp}`]);
    const courseModule = await client.query<{ id: string }>("INSERT INTO course_modules (course_id,title,sort_order) VALUES ($1,'Start here',1) RETURNING id", [course.rows[0].id]);
    const lesson = await client.query<{ id: string }>(
      "INSERT INTO lessons (module_id,title,slug,body,youtube_video_id,visibility,state,sort_order) VALUES ($1,$2,$3,$4,$5,'ALL_PAID','PUBLISHED',1) RETURNING id",
      [courseModule.rows[0].id, lessonTitle, `${lessonSlug}-${stamp}`, sanitizeRichText(input.body), videoId]
    );
    return { courseId: course.rows[0].id, lessonId: lesson.rows[0].id };
  });
}

export async function reportContent(user: AuthUser, creatorId: string, postId: string, reason: string) {
  const cleanReason = parse(z.string().trim().min(3, "Tell us why you are reporting this").max(1000), reason);
  const post = await one("SELECT id FROM posts WHERE id = $1 AND creator_id = $2", [postId, creatorId]);
  if (!post) throw new UserError("Post not found");
  const result = await query<{ id: string }>("INSERT INTO content_reports (reporter_user_id, creator_id, post_id, reason, status) VALUES ($1,$2,$3,$4,'OPEN') RETURNING id", [user.id, creatorId, postId, cleanReason]);
  return result.rows[0];
}

export async function adminUnpublishReportedContent(admin: AuthUser, reportId: string) {
  if (!admin.roles.includes("ADMIN")) throw new Error("FORBIDDEN");
  return transaction(async (client) => {
    const report = await client.query<{ post_id: string; creator_id: string }>("SELECT post_id, creator_id FROM content_reports WHERE id = $1 FOR UPDATE", [reportId]);
    if (!report.rowCount || !report.rows[0].post_id) throw new Error("Report not found");
    await client.query("UPDATE posts SET state = 'UNPUBLISHED_BY_MODERATION' WHERE id = $1", [report.rows[0].post_id]);
    await client.query("UPDATE content_reports SET status = 'ACTIONED' WHERE id = $1", [reportId]);
    await client.query("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id) VALUES ($1,'content_unpublished','content_report',$2)", [admin.id, reportId]);
  });
}
