import { createHash } from "node:crypto";
import { query } from "@/lib/server/db";
import { UserError } from "@/lib/server/validation";

const limits = {
  login: { max: 8, windowSeconds: 15 * 60 },
  login_ip: { max: 40, windowSeconds: 15 * 60 },
  signup: { max: 20, windowSeconds: 60 * 60 },
  reset: { max: 10, windowSeconds: 60 * 60 },
  upload: { max: 40, windowSeconds: 60 * 60 }
} as const;

export type RateBucket = keyof typeof limits;

function hashKey(key: string) {
  return createHash("sha256").update(key.toLowerCase()).digest("hex");
}

/** Throws when the key already used its budget; call recordAttempt on the failure path. */
export async function assertWithinRateLimit(bucket: RateBucket, key: string) {
  const { max, windowSeconds } = limits[bucket];
  const result = await query<{ count: string }>(
    "SELECT COUNT(*) FROM auth_attempts WHERE bucket = $1 AND key_hash = $2 AND created_at > now() - make_interval(secs => $3)",
    [bucket, hashKey(key), windowSeconds]
  );
  if (Number(result.rows[0].count) >= max) throw new UserError("Too many attempts. Please wait a few minutes and try again.");
}

export async function recordAttempt(bucket: RateBucket, key: string) {
  await query("INSERT INTO auth_attempts (bucket, key_hash) VALUES ($1, $2)", [bucket, hashKey(key)]);
}

export async function clearAttempts(bucket: RateBucket, key: string) {
  await query("DELETE FROM auth_attempts WHERE bucket = $1 AND key_hash = $2", [bucket, hashKey(key)]);
}

export async function pruneAttempts() {
  await query("DELETE FROM auth_attempts WHERE created_at < now() - interval '1 day'");
}
