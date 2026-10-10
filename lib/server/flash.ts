import { cookies } from "next/headers";

export type Flash = { type: "success" | "error"; message: string };

const cookieName = "zf_flash";

/** One-shot, server-authored notice shown after a redirect. HttpOnly so page scripts cannot forge or read it. */
export async function setFlash(flash: Flash) {
  const jar = await cookies();
  jar.set(cookieName, encodeURIComponent(JSON.stringify(flash)), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 20 });
}

export async function readFlash(): Promise<Flash | null> {
  const raw = (await cookies()).get(cookieName)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Flash;
    if ((parsed.type === "success" || parsed.type === "error") && typeof parsed.message === "string") return { type: parsed.type, message: parsed.message.slice(0, 240) };
  } catch {
    // ignore malformed cookie
  }
  return null;
}
