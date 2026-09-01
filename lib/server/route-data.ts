import { query } from "@/lib/server/db";
import type { AuthUser } from "@/lib/server/auth";

export async function getCreatorForUser(user: AuthUser) {
  const result = await query<{ id: string; slug: string; display_name: string; country_code: string }>(
    "SELECT id, slug, display_name, country_code FROM creator_profiles WHERE user_id = $1",
    [user.id]
  );
  return result.rows[0] ?? null;
}

export async function getPublicCreator(slug: string) {
  const result = await query<{ id: string; slug: string; display_name: string; bio: string; country_code: string; category: string }>(
    "SELECT id, slug, display_name, bio, country_code, category FROM creator_profiles WHERE slug = $1 AND published = true",
    [slug]
  );
  return result.rows[0] ?? null;
}

export async function listCreatorTiers(creatorId: string) {
  return (await query<{ id: string; name: string; description: string; benefits: string; state: string; pricing_mode: string; billing_interval: string; currency: "EUR" | "USD"; creator_target_minor: string; simple_retail_minor: string | null }>(
    `SELECT ct.id, ct.name, ct.description, ct.benefits, ct.state, tpv.pricing_mode, tpv.billing_interval, tpv.currency, tpv.creator_target_minor, tpv.simple_retail_minor
     FROM creator_tiers ct
     JOIN tier_price_versions tpv ON tpv.tier_id = ct.id AND tpv.active = true
     WHERE ct.creator_id = $1
     ORDER BY ct.sort_order, ct.created_at`,
    [creatorId]
  )).rows;
}

export async function listMyMemberships(user: AuthUser) {
  return (await query<{ id: string; state: string; current_period_end: Date | null; provider_subscription_id: string | null; tier_name: string; creator_name: string }>(
    `SELECT ms.id, ms.state, ms.current_period_end, ms.provider_subscription_id, ct.name AS tier_name, cp.display_name AS creator_name
     FROM membership_subscriptions ms
     JOIN creator_tiers ct ON ct.id = ms.tier_id
     JOIN creator_profiles cp ON cp.id = ms.creator_id
     WHERE ms.member_user_id = $1
     ORDER BY ms.updated_at DESC`,
    [user.id]
  )).rows;
}

export async function listCreatorApplications() {
  return (await query<{ id: string; creator_id: string; display_name: string; country_code: string; state: string; offering: string; created_at: Date }>(
    `SELECT ca.id, ca.creator_id, cp.display_name, ca.country_code, ca.state, ca.offering, ca.created_at
     FROM creator_applications ca
     JOIN creator_profiles cp ON cp.id = ca.creator_id
     ORDER BY ca.created_at DESC`
  )).rows;
}

export async function listCreatorPosts(creatorId: string) {
  return (await query<{ id: string; title: string; slug: string; visibility: string; state: string; youtube_video_id: string | null }>(
    "SELECT id,title,slug,visibility,state,youtube_video_id FROM posts WHERE creator_id = $1 ORDER BY created_at DESC",
    [creatorId]
  )).rows;
}
