import { NextRequest, NextResponse } from "next/server";
import { getUserBySessionToken } from "@/lib/server/auth";
import { search } from "@/lib/server/search-service";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("zf_session")?.value;
  const user = token ? await getUserBySessionToken(token) : null;
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  return NextResponse.json({ results: await search(user, request.nextUrl.searchParams.get("q") ?? "") });
}
