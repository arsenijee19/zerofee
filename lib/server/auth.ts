import type pg from "pg";
import { cookies } from "next/headers";
import { hashPassword, hashToken, normalizeEmail, randomToken, verifyPassword } from "@/lib/server/crypto";
import { one, query, transaction } from "@/lib/server/db";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
};

const sessionCookie = "zf_session";

export async function signup(email: string, password: string, name: string, role: "MEMBER" | "CREATOR" = "MEMBER") {
  const normalized = normalizeEmail(email);
  const passwordHash = await hashPassword(password);
  return transaction(async (client) => {
    const user = await client.query<{ id: string }>(
      "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [normalized, name, passwordHash]
    );
    await client.query("INSERT INTO user_roles (user_id, role) VALUES ($1, $2)", [user.rows[0].id, role]);
    const token = randomToken("verify");
    await client.query(
      "INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval '1 day')",
      [user.rows[0].id, hashToken(token)]
    );
    await client.query("INSERT INTO notifications (user_id, kind, title, body) VALUES ($1, 'email_verification', 'Verify your email', $2)", [
      user.rows[0].id,
      `Mock verification token: ${token}`
    ]);
    return { userId: user.rows[0].id, verificationToken: token };
  });
}

export async function verifyEmail(token: string) {
  return transaction(async (client) => {
    const found = await client.query<{ id: string; user_id: string }>(
      "SELECT id, user_id FROM email_verification_tokens WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()",
      [hashToken(token)]
    );
    if (!found.rowCount) throw new Error("Invalid or expired verification token");
    await client.query("UPDATE email_verification_tokens SET used_at = now() WHERE id = $1", [found.rows[0].id]);
    await client.query("UPDATE users SET email_verified = true WHERE id = $1", [found.rows[0].user_id]);
    return true;
  });
}

export async function login(email: string, password: string) {
  const user = await one<{ id: string; email: string; name: string; password_hash: string }>("SELECT * FROM users WHERE email = $1", [normalizeEmail(email)]);
  if (!user || !(await verifyPassword(password, user.password_hash))) throw new Error("Invalid email or password");
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

export async function createPasswordReset(email: string) {
  const user = await one<{ id: string }>("SELECT id FROM users WHERE email = $1", [normalizeEmail(email)]);
  if (!user) return { token: null };
  const token = randomToken("reset");
  await query("INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval '1 hour')", [user.id, hashToken(token)]);
  await query("INSERT INTO notifications (user_id, kind, title, body) VALUES ($1, 'password_reset', 'Reset your password', $2)", [user.id, `Mock reset token: ${token}`]);
  return { token };
}

export async function resetPassword(token: string, newPassword: string) {
  const passwordHash = await hashPassword(newPassword);
  return transaction(async (client) => {
    const found = await client.query<{ id: string; user_id: string }>(
      "SELECT id, user_id FROM password_reset_tokens WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()",
      [hashToken(token)]
    );
    if (!found.rowCount) throw new Error("Invalid or expired reset token");
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
