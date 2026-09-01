import type { AuthUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";

export async function search(user: AuthUser, term: string) {
  const q = `%${term.toLowerCase()}%`;
  if (user.roles.includes("ADMIN")) {
    const users = await query("SELECT 'Users' AS grp, name AS label, email AS meta FROM users WHERE lower(name) LIKE $1 OR lower(email) LIKE $1 LIMIT 10", [q]);
    const creators = await query("SELECT 'Creators' AS grp, display_name AS label, slug AS meta FROM creator_profiles WHERE lower(display_name) LIKE $1 OR lower(slug) LIKE $1 LIMIT 10", [q]);
    const incidents = await query("SELECT 'Guarantee incidents' AS grp, status AS label, severity AS meta FROM guarantee_incidents LIMIT 10");
    return [...users.rows, ...creators.rows, ...incidents.rows];
  }
  const profile = await query<{ id: string }>("SELECT id FROM creator_profiles WHERE user_id = $1", [user.id]);
  if (!profile.rowCount) return [];
  const creatorId = profile.rows[0].id;
  const tiers = await query("SELECT 'Tiers' AS grp, name AS label, state AS meta FROM creator_tiers WHERE creator_id = $1 AND lower(name) LIKE $2 LIMIT 10", [creatorId, q]);
  const posts = await query("SELECT 'Posts' AS grp, title AS label, state AS meta FROM posts WHERE creator_id = $1 AND lower(title) LIKE $2 LIMIT 10", [creatorId, q]);
  const members = await query(
    `SELECT 'Members' AS grp, u.name AS label, ms.state AS meta
     FROM membership_subscriptions ms JOIN users u ON u.id = ms.member_user_id
     WHERE ms.creator_id = $1 AND lower(u.name) LIKE $2 LIMIT 10`,
    [creatorId, q]
  );
  return [...tiers.rows, ...posts.rows, ...members.rows];
}
