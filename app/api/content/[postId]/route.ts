import { NextRequest, NextResponse } from "next/server";
import { getUserBySessionToken } from "@/lib/server/auth";
import { canAccessPost } from "@/lib/server/membership-service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  const user = request.cookies.get("zf_session")?.value ? await getUserBySessionToken(request.cookies.get("zf_session")!.value) : null;
  const access = await canAccessPost(user, (await params).postId);
  if (!access.allowed) return NextResponse.json({ error: "FORBIDDEN", body: null }, { status: 403 });
  return NextResponse.json({ body: access.body });
}
