import type { AuthUser } from "@/lib/server/auth";
import { query, transaction } from "@/lib/server/db";
import { requireCreatorOwner } from "@/lib/server/policies";
import { parseYouTubeVideoId } from "@/lib/server/youtube";

export function sanitizeRichText(input: string) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
}

export function validateMedia(input: { name: string; mimeType: string; sizeBytes: number; bytes: Buffer }) {
  const allowed = new Map([
    ["image/png", Buffer.from([0x89, 0x50, 0x4e, 0x47])],
    ["image/jpeg", Buffer.from([0xff, 0xd8, 0xff])],
    ["application/pdf", Buffer.from([0x25, 0x50, 0x44, 0x46])]
  ]);
  if (input.sizeBytes > 5 * 1024 * 1024) throw new Error("File exceeds V1 size limit");
  const magic = allowed.get(input.mimeType);
  if (!magic) throw new Error("Unsupported MIME type");
  if (input.name.includes("..") || input.name.includes("/")) throw new Error("Unsafe filename");
  if (!input.bytes.subarray(0, magic.length).equals(magic)) throw new Error("MIME/content mismatch");
}

export async function createPost(user: AuthUser, creatorId: string, input: { title: string; slug: string; body: string; visibility: "PUBLIC" | "ALL_PAID" | "SELECTED_TIERS"; tierIds?: string[]; youtubeUrl?: string }) {
  await requireCreatorOwner(user, creatorId);
  const youtubeVideoId = input.youtubeUrl ? parseYouTubeVideoId(input.youtubeUrl) : null;
  return transaction(async (client) => {
    const post = await client.query<{ id: string }>(
      "INSERT INTO posts (creator_id,title,slug,body,visibility,state,youtube_video_id) VALUES ($1,$2,$3,$4,$5,'PUBLISHED',$6) RETURNING id",
      [creatorId, input.title, input.slug, sanitizeRichText(input.body), input.visibility, youtubeVideoId]
    );
    for (const tierId of input.tierIds ?? []) await client.query("INSERT INTO post_tier_access (post_id,tier_id) VALUES ($1,$2)", [post.rows[0].id, tierId]);
    await client.query("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id) VALUES ($1,'post_published','post',$2)", [user.id, post.rows[0].id]);
    return post.rows[0];
  });
}

export async function createCourseWithLesson(user: AuthUser, creatorId: string, input: { courseTitle: string; lessonTitle: string; body: string; youtubeUrl: string }) {
  await requireCreatorOwner(user, creatorId);
  const stamp = Date.now().toString(36);
  const courseSlug = input.courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64) || `course-${stamp}`;
  const lessonSlug = input.lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64) || `lesson-${stamp}`;
  return transaction(async (client) => {
    const course = await client.query<{ id: string }>("INSERT INTO courses (creator_id,title,slug,state) VALUES ($1,$2,$3,'PUBLISHED') RETURNING id", [creatorId, input.courseTitle, `${courseSlug}-${stamp}`]);
    const courseModule = await client.query<{ id: string }>("INSERT INTO course_modules (course_id,title,sort_order) VALUES ($1,'Start here',1) RETURNING id", [course.rows[0].id]);
    const lesson = await client.query<{ id: string }>(
      "INSERT INTO lessons (module_id,title,slug,body,youtube_video_id,visibility,state,sort_order) VALUES ($1,$2,$3,$4,$5,'ALL_PAID','PUBLISHED',1) RETURNING id",
      [courseModule.rows[0].id, input.lessonTitle, `${lessonSlug}-${stamp}`, sanitizeRichText(input.body), parseYouTubeVideoId(input.youtubeUrl)]
    );
    return { courseId: course.rows[0].id, lessonId: lesson.rows[0].id };
  });
}

export async function reportContent(user: AuthUser, creatorId: string, postId: string, reason: string) {
  const result = await query<{ id: string }>("INSERT INTO content_reports (reporter_user_id, creator_id, post_id, reason, status) VALUES ($1,$2,$3,$4,'OPEN') RETURNING id", [user.id, creatorId, postId, reason]);
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
