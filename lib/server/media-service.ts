import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AuthUser } from "@/lib/server/auth";
import { randomToken } from "@/lib/server/crypto";
import { query } from "@/lib/server/db";
import { requireCreatorOwner } from "@/lib/server/policies";
import { validateMedia } from "@/lib/server/content-service";

export async function uploadMedia(user: AuthUser, creatorId: string, file: File) {
  await requireCreatorOwner(user, creatorId);
  const bytes = Buffer.from(await file.arrayBuffer());
  validateMedia({ name: file.name, mimeType: file.type, sizeBytes: bytes.byteLength, bytes });
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const objectKey = "media/" + creatorId + "/" + randomToken("asset").replace(/[^a-zA-Z0-9_-]/g, "") + "." + extension;
  const root = join(process.cwd(), "storage", "mock");
  await mkdir(join(root, "media", creatorId), { recursive: true });
  await writeFile(join(root, objectKey), bytes, { flag: "wx" });
  const saved = await query<{ id: string }>(
    "INSERT INTO media_assets (creator_id,object_key,original_name,mime_type,size_bytes,visibility) VALUES ($1,$2,$3,$4,$5,'PRIVATE') RETURNING id",
    [creatorId, objectKey, file.name, file.type, bytes.byteLength]
  );
  return { id: saved.rows[0].id, objectKey };
}
