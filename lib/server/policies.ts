import type { AuthUser } from "@/lib/server/auth";
import { one } from "@/lib/server/db";

export function requireRole(user: AuthUser | null, role: "ADMIN" | "CREATOR" | "MEMBER") {
  if (!user) throw new Error("UNAUTHENTICATED");
  if (!user.roles.includes(role)) throw new Error("FORBIDDEN");
}

export async function requireCreatorOwner(user: AuthUser | null, creatorId: string) {
  requireRole(user, "CREATOR");
  const profile = await one<{ id: string }>("SELECT id FROM creator_profiles WHERE id = $1 AND user_id = $2", [creatorId, user?.id]);
  if (!profile) throw new Error("FORBIDDEN");
}

export function assertAdmin(user: AuthUser | null) {
  requireRole(user, "ADMIN");
}
