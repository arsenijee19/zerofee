import { redirect } from "next/navigation";
import { currentUserFromCookies, type AuthUser } from "@/lib/server/auth";

export async function requireUser(): Promise<AuthUser> {
  const user = await currentUserFromCookies();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(role: "MEMBER" | "CREATOR" | "ADMIN") {
  const user = await requireUser();
  if (!user.roles.includes(role)) redirect("/login?error=forbidden");
  return user;
}
