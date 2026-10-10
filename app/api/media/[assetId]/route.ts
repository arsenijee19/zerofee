import { NextRequest, NextResponse } from "next/server";
import { getUserBySessionToken } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { canAccessPost } from "@/lib/server/membership-service";
import { getStorage } from "@/lib/server/storage";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const hardening = {
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy": "default-src 'none'; sandbox",
  "Cross-Origin-Resource-Policy": "same-origin"
};

function safeFilename(name: string) {
  return name.replace(/[^\w.\- ]+/g, "_").slice(0, 100) || "download";
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  if (!uuid.test(assetId)) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404, headers: hardening });
  const asset = await query<{ creator_id: string; owner_user_id: string; object_key: string; mime_type: string; original_name: string; purpose: string; creator_published: boolean }>(
    `SELECT ma.creator_id, cp.user_id AS owner_user_id, ma.object_key, ma.mime_type, ma.original_name, ma.purpose, cp.published AS creator_published
     FROM media_assets ma JOIN creator_profiles cp ON cp.id = ma.creator_id WHERE ma.id = $1`,
    [assetId]
  );
  if (!asset.rowCount) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404, headers: hardening });
  const row = asset.rows[0];

  const token = request.cookies.get("zf_session")?.value;
  const user = token ? await getUserBySessionToken(token) : null;
  let allowed = Boolean(user && (user.id === row.owner_user_id || user.roles.includes("ADMIN")));
  let publicCache = false;

  if (!allowed && (row.purpose === "AVATAR" || row.purpose === "BANNER")) {
    // Profile images are public only while the seller page is published.
    allowed = row.creator_published;
    publicCache = allowed;
  }
  if (!allowed) {
    // Cover images and attachments follow the access rules of the post that uses them.
    const posts = await query<{ id: string }>(
      `SELECT p.id FROM posts p WHERE p.creator_id = $1 AND p.state = 'PUBLISHED' AND (p.cover_asset_id = $2 OR EXISTS (SELECT 1 FROM post_attachments pa WHERE pa.post_id = p.id AND pa.asset_id = $2))`,
      [row.creator_id, assetId]
    );
    for (const post of posts.rows) {
      if ((await canAccessPost(user, post.id)).allowed) {
        allowed = true;
        break;
      }
    }
  }
  if (!allowed) return NextResponse.json({ error: user ? "FORBIDDEN" : "UNAUTHENTICATED" }, { status: user ? 403 : 401, headers: hardening });

  let bytes: Buffer;
  try {
    bytes = await getStorage().get(row.object_key);
  } catch {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404, headers: hardening });
  }
  const isImage = row.mime_type.startsWith("image/");
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      ...hardening,
      "Content-Type": row.mime_type,
      "Content-Length": String(bytes.byteLength),
      "Content-Disposition": `${isImage ? "inline" : "attachment"}; filename="${safeFilename(row.original_name)}"`,
      "Cache-Control": publicCache ? "public, max-age=300, stale-while-revalidate=600" : "private, no-store"
    }
  });
}
