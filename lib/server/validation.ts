import { z } from "zod";

export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}

const reservedSlugs = new Set(["admin", "api", "app", "login", "logout", "signup", "creator", "member", "checkout", "demo", "pricing", "safety", "migration", "how-it-works", "creators", "terms", "privacy", "refunds", "acceptable-use", "c", "static", "_next", "support"]);

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9](?:[a-z0-9-]{1,38})[a-z0-9]$/, "Use 3-40 lowercase letters, numbers or hyphens")
  .refine((slug) => !slug.includes("--") && !reservedSlugs.has(slug), "This address is reserved");

export const httpsUrlSchema = z
  .string()
  .trim()
  .max(300, "Links must be under 300 characters")
  .refine((raw) => {
    try {
      const url = new URL(raw);
      return url.protocol === "https:" && !url.username && !url.password && url.hostname.includes(".");
    } catch {
      return false;
    }
  }, "Links must be full https:// addresses")
  .transform((raw) => new URL(raw).toString());

export const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password must be at most 128 characters")
  .refine((value) => /[a-z]/i.test(value) && /\d/.test(value), "Password must include letters and a number");

export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address").max(254);

export function parse<T>(schema: z.ZodType<T, z.ZodTypeDef, unknown>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new UserError(result.error.issues[0]?.message ?? "Invalid input");
  return result.data;
}

/** Only same-site relative paths are allowed as post-login destinations. */
export function safeRedirectPath(input: string | null | undefined, fallback: string) {
  if (!input || !input.startsWith("/") || input.startsWith("//") || input.includes("\\") || /[\u0000-\u001f]/.test(input)) return fallback;
  try {
    const url = new URL(input, "http://zerofee.local");
    if (url.origin !== "http://zerofee.local") return fallback;
    return url.pathname + url.search;
  } catch {
    return fallback;
  }
}
