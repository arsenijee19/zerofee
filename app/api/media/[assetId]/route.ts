import { NextRequest, NextResponse } from "next/server";
import { getUserBySessionToken } from "@/lib/server/auth";
import { query } from "@/lib/server/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ assetId: string }> }) {
  const token = request.cookies.get("zf_session")?.value;
  const user = token ? await getUserBySessionToken(token) : null;
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  const result = await query<{ mime_type: string; object_key: string }>(
    "SELECT ma.mime_type,ma.object_key FROM media_assets ma JOIN creator_profiles cp ON cp.id=ma.creator_id WHERE ma.id=$1 AND cp.user_id=$2",
    [(await params).assetId, user.id]
  );
  if (!result.rowCount) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  return NextResponse.json({ objectKey: result.rows[0].object_key, mimeType: result.rows[0].mime_type });
}
