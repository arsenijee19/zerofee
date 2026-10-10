import { randomBytes } from "node:crypto";
import { createHash } from "node:crypto";
import type { AuthUser } from "@/lib/server/auth";
import { one, query, transaction } from "@/lib/server/db";
import { requireCreatorOwner } from "@/lib/server/policies";
import { assertWithinRateLimit, recordAttempt } from "@/lib/server/rate-limit";
import { getStorage } from "@/lib/server/storage";
import { UserError } from "@/lib/server/validation";

export type MediaPurpose = "AVATAR" | "BANNER" | "POST_COVER" | "ATTACHMENT";

const signatures: Record<string, { ext: string; check: (bytes: Buffer) => boolean }> = {
  "image/png": { ext: "png", check: (b) => b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])) },
  "image/jpeg": { ext: "jpg", check: (b) => b.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) },
  "image/webp": { ext: "webp", check: (b) => b.length > 12 && b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
  "application/pdf": { ext: "pdf", check: (b) => b.subarray(0, 4).equals(Buffer.from([0x25, 0x50, 0x44, 0x46])) }
};

const purposeRules: Record<MediaPurpose, { maxBytes: number; mimes: string[]; label: string }> = {
  AVATAR: { maxBytes: 2 * 1024 * 1024, mimes: ["image/png", "image/jpeg", "image/webp"], label: "Profile photo" },
  BANNER: { maxBytes: 5 * 1024 * 1024, mimes: ["image/png", "image/jpeg", "image/webp"], label: "Banner" },
  POST_COVER: { maxBytes: 5 * 1024 * 1024, mimes: ["image/png", "image/jpeg", "image/webp"], label: "Cover image" },
  ATTACHMENT: { maxBytes: 10 * 1024 * 1024, mimes: ["image/png", "image/jpeg", "image/webp", "application/pdf"], label: "Attachment" }
};

export function validateMediaUpload(input: { name: string; mimeType: string; bytes: Buffer; purpose: MediaPurpose }) {
  const rule = purposeRules[input.purpose];
  if (!input.bytes.byteLength) throw new UserError("The file is empty");
  if (input.bytes.byteLength > rule.maxBytes) throw new UserError(`${rule.label} must be under ${rule.maxBytes / 1024 / 1024} MB`);
  if (input.name.includes("..") || input.name.includes("/") || input.name.includes("\\")) throw new UserError("Unsafe filename");
  const sig = signatures[input.mimeType];
  if (!sig || !rule.mimes.includes(input.mimeType)) throw new UserError(`${rule.label} must be ${rule.mimes.map((m) => signatures[m].ext.toUpperCase()).join(", ")}`);
  if (!sig.check(input.bytes)) throw new UserError("File contents do not match the declared type");
  return sig.ext;
}

export async function uploadMedia(user: AuthUser, creatorId: string, file: File, options: { purpose?: MediaPurpose; altText?: string } = {}) {
  await requireCreatorOwner(user, creatorId);
  const purpose = options.purpose ?? "ATTACHMENT";
  if (file.size > purposeRules[purpose].maxBytes) throw new UserError(`${purposeRules[purpose].label} is too large`);
  await assertWithinRateLimit("upload", user.id);
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = validateMediaUpload({ name: file.name, mimeType: file.type, bytes, purpose });
  await assertStorageQuota(creatorId, bytes.byteLength);
  await recordAttempt("upload", user.id);
  const storage = getStorage();
  const objectKey = `media/${creatorId}/${randomBytes(18).toString("base64url")}.${ext}`;
  await storage.put(objectKey, bytes, file.type);
  const visibility = purpose === "AVATAR" || purpose === "BANNER" ? "PUBLIC" : "PRIVATE";
  const altText = (options.altText ?? "").trim().slice(0, 200);
  const saved = await one<{ id: string }>(
    `INSERT INTO media_assets (creator_id,object_key,original_name,mime_type,size_bytes,visibility,purpose,alt_text,sha256,storage_provider)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
    [creatorId, objectKey, file.name.slice(0, 120), file.type, bytes.byteLength, visibility, purpose, altText, createHash("sha256").update(bytes).digest("hex"), storage.provider]
  );
  return { id: saved!.id, objectKey };
}

async function assertStorageQuota(creatorId: string, incomingBytes: number) {
  const used = await one<{ total: string }>("SELECT COALESCE(SUM(size_bytes),0) AS total FROM media_assets WHERE creator_id = $1", [creatorId]);
  const plan = await one<{ storage_mb_limit: number }>(
    `SELECT ppv.storage_mb_limit FROM platform_subscriptions ps JOIN platform_plan_versions ppv ON ppv.id = ps.plan_version_id WHERE ps.creator_id = $1`,
    [creatorId]
  );
  const limitBytes = (plan?.storage_mb_limit ?? 100) * 1024 * 1024;
  if (Number(used!.total) + incomingBytes > limitBytes) throw new UserError("Your plan's storage limit has been reached");
}

export async function deleteMedia(user: AuthUser, creatorId: string, assetId: string) {
  await requireCreatorOwner(user, creatorId);
  const asset = await one<{ object_key: string }>("SELECT object_key FROM media_assets WHERE id = $1 AND creator_id = $2", [assetId, creatorId]);
  if (!asset) throw new UserError("File not found");
  await transaction(async (client) => {
    await client.query("DELETE FROM media_assets WHERE id = $1 AND creator_id = $2", [assetId, creatorId]);
    await client.query("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id) VALUES ($1,'media_deleted','media_asset',$2)", [user.id, assetId]);
  });
  await getStorage().delete(asset.object_key).catch(() => undefined);
}

export async function listCreatorMedia(creatorId: string) {
  return (await query<{ id: string; original_name: string; mime_type: string; size_bytes: string; purpose: MediaPurpose; alt_text: string; created_at: Date }>(
    "SELECT id, original_name, mime_type, size_bytes, purpose, alt_text, created_at FROM media_assets WHERE creator_id = $1 ORDER BY created_at DESC",
    [creatorId]
  )).rows;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
