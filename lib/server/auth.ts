import { randomUUID } from "node:crypto";
import type pg from "pg";
import { cookies } from "next/headers";
import { hashPassword, hashToken, normalizeEmail, randomToken, verifyPassword } from "@/lib/server/crypto";
import { one, query, transaction } from "@/lib/server/db";
import { assertWithinRateLimit, clearAttempts, recordAttempt } from "@/lib/server/rate-limit";
import { emailSchema, parse, passwordSchema, UserError } from "@/lib/server/validation";
import { z } from "zod";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
};

const sessionCookie = "zf_session";

const nameSchema = z.string().trim().min(2, "Enter your name").max(80, "Name is too long");

export async function signup(email: string, password: string, name: string, role: "MEMBER" | "CREATOR" = "MEMBER", clientKey = `local-${randomUUID()}`) {
  const normalized = parse(emailSchema, email);
  const cleanName = parse(nameSchema, name);
  parse(passwordSchema, password);
  await assertWithinRateLimit("signup", clientKey);
  await recordAttempt("signup", clientKey);
  const passwordHash = await hashPassword(password);
  return transaction(async (client) => {
    const existing = await client.query("SELECT 1 FROM users WHERE email = $1", [normalized]);
    if (existing.rowCount) throw new UserError("An account with this email already exists. Try logging in instead.");
    const user = await client.query<{ id: string }>(
      "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [normalized, cleanName, passwordHash]
    );
    await client.query("INSERT INTO user_roles (user_id, role) VALUES ($1, $2)", [user.rows[0].id, role]);
    const token = randomToken("verify");
    await client.query(
      "INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval '1 day')",
      [user.rows[0].id, hashToken(token)]
    );
    return { userId: user.rows[0].id, verificationToken: token };
  });
}

export async function verifyEmail(token: string) {
  return transaction(async (client) => {
    const found = await client.query<{ id: string; user_id: string }>(
      "SELECT id, user_id FROM email_verification_tokens WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()",
      [hashToken(token)]
    );
    if (!found.rowCount) throw new UserError("This verification link is invalid or has expired");
    await client.query("UPDATE email_verification_tokens SET used_at = now() WHERE id = $1", [found.rows[0].id]);
    await client.query("UPDATE users SET email_verified = true WHERE id = $1", [found.rows[0].user_id]);
    return true;
  });
}

let dummyHash: Promise<string> | undefined;

export async function login(email: string, password: string, clientKey = `local-${randomUUID()}`) {
  const normalized = normalizeEmail(email);
  const throttles = [["login", `email:${normalized}`], ["login_ip", `ip:${clientKey}`]] as const;
  for (const [bucket, key] of throttles) await assertWithinRateLimit(bucket, key);
  const user = await one<{ id: string; email: string; name: string; password_hash: string }>("SELECT * FROM users WHERE email = $1", [normalized]);
  // Unknown accounts still pay for one scrypt run so response time does not reveal registration.
  dummyHash ??= hashPassword("zerofee-dummy-password");
  const valid = await verifyPassword(password, user?.password_hash ?? (await dummyHash));
  if (!user || !valid) {
    for (const [bucket, key] of throttles) await recordAttempt(bucket, key);
    throw new UserError("Invalid email or password");
  }
  await clearAttempts("login", throttles[0][1]);
  const verified = await one<{ email_verified: boolean }>("SELECT email_verified FROM users WHERE id = $1", [user.id]);
  if (!verified?.email_verified) throw new UserError("Please verify your email address first. Check your inbox for the verification link.");
  const token = randomToken("session");
  await query("INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval '7 days')", [user.id, hashToken(token)]);
  await query("INSERT INTO security_events (user_id, event_type) VALUES ($1, 'login')", [user.id]);
  return { token, userId: user.id };
}

export async function getUserBySessionToken(token: string): Promise<AuthUser | null> {
  const rows = await query<{ id: string; email: string; name: string; role: string }>(
    `SELECT u.id, u.email, u.name, ur.role
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     JOIN user_roles ur ON ur.user_id = u.id
     WHERE s.token_hash = $1 AND s.invalidated_at IS NULL AND s.expires_at > now()`,
    [hashToken(token)]
  );
  if (!rows.rowCount) return null;
  return { id: rows.rows[0].id, email: rows.rows[0].email, name: rows.rows[0].name, roles: rows.rows.map((row) => row.role) };
}

export async function currentUserFromCookies() {
  const jar = await cookies();
  const token = jar.get(sessionCookie)?.value;
  return token ? getUserBySessionToken(token) : null;
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(sessionCookie, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function logout(token: string) {
  await query("UPDATE sessions SET invalidated_at = now() WHERE token_hash = $1", [hashToken(token)]);
}

export async function createPasswordReset(email: string, clientKey = `local-${randomUUID()}`) {
  await assertWithinRateLimit("reset", clientKey);
  await recordAttempt("reset", clientKey);
  const user = await one<{ id: string }>("SELECT id FROM users WHERE email = $1", [normalizeEmail(email)]);
  if (!user) return { token: null, userId: null, email: normalizeEmail(email) };
  const token = randomToken("reset");
  await query("INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval '1 hour')", [user.id, hashToken(token)]);
  return { token, userId: user.id, email: normalizeEmail(email) };
}

export async function resetPassword(token: string, newPassword: string) {
  parse(passwordSchema, newPassword);
  const passwordHash = await hashPassword(newPassword);
  return transaction(async (client) => {
    const found = await client.query<{ id: string; user_id: string }>(
      "SELECT id, user_id FROM password_reset_tokens WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()",
      [hashToken(token)]
    );
    if (!found.rowCount) throw new UserError("This reset link is invalid or has expired");
    await client.query("UPDATE password_reset_tokens SET used_at = now() WHERE id = $1", [found.rows[0].id]);
    await client.query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, found.rows[0].user_id]);
    await client.query("UPDATE sessions SET invalidated_at = now() WHERE user_id = $1", [found.rows[0].user_id]);
    return true;
  });
}

export async function seedUser(client: pg.PoolClient, email: string, password: string, name: string, roles: string[]) {
  const result = await client.query<{ id: string }>(
    "INSERT INTO users (email, name, password_hash, email_verified) VALUES ($1, $2, $3, true) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id",
    [normalizeEmail(email), name, await hashPassword(password)]
  );
  for (const role of roles) await client.query("INSERT INTO user_roles (user_id, role) VALUES ($1, $2) ON CONFLICT DO NOTHING", [result.rows[0].id, role]);
  return result.rows[0].id;
}

export async function changePassword(user: AuthUser, currentPassword: string, newPassword: string, keepSessionToken?: string) {
  parse(passwordSchema, newPassword);
  const row = await one<{ password_hash: string }>("SELECT password_hash FROM users WHERE id = $1", [user.id]);
  if (!row || !(await verifyPassword(currentPassword, row.password_hash))) throw new UserError("Current password is incorrect");
  const passwordHash = await hashPassword(newPassword);
  await query("UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2", [passwordHash, user.id]);
  await query("UPDATE sessions SET invalidated_at = now() WHERE user_id = $1 AND token_hash <> $2 AND invalidated_at IS NULL", [user.id, keepSessionToken ? hashToken(keepSessionToken) : ""]);
  await query("INSERT INTO security_events (user_id, event_type) VALUES ($1, 'password_changed')", [user.id]);
}

export async function updateAccountName(user: AuthUser, name: string) {
  const clean = parse(nameSchema, name);
  await query("UPDATE users SET name = $1, updated_at = now() WHERE id = $2", [clean, user.id]);
}

export async function activeSessionCount(user: AuthUser) {
  const result = await query<{ count: string }>("SELECT COUNT(*) FROM sessions WHERE user_id = $1 AND invalidated_at IS NULL AND expires_at > now()", [user.id]);
  return Number(result.rows[0].count);
}

export async function signOutEverywhere(user: AuthUser) {
  await query("UPDATE sessions SET invalidated_at = now() WHERE user_id = $1 AND invalidated_at IS NULL", [user.id]);
}

export async function reissueVerificationToken(email: string, clientKey = `local-${randomUUID()}`) {
  await assertWithinRateLimit("reset", clientKey);
  await recordAttempt("reset", clientKey);
  const user = await one<{ id: string; email_verified: boolean }>("SELECT id, email_verified FROM users WHERE email = $1", [normalizeEmail(email)]);
  if (!user || user.email_verified) return null;
  const token = randomToken("verify");
  await query("INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval '1 day')", [user.id, hashToken(token)]);
  return { token, userId: user.id, email: normalizeEmail(email) };
}
