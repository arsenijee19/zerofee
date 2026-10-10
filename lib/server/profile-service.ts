import { z } from "zod";
import type { AuthUser } from "@/lib/server/auth";
import { one, query, transaction } from "@/lib/server/db";
import { requireCreatorOwner } from "@/lib/server/policies";
import { httpsUrlSchema, parse, UserError } from "@/lib/server/validation";

export type CreatorLink = { id: string; label: string; url: string; sort_order: number };

export type CreatorProfile = {
  id: string;
  slug: string;
  display_name: string;
  tagline: string;
  bio: string;
  category: string;
  country_code: string;
  support_email: string | null;
  website_url: string | null;
  avatar_asset_id: string | null;
  banner_asset_id: string | null;
  published: boolean;
  links: CreatorLink[];
};

const profileColumns = "id, slug, display_name, tagline, bio, category, country_code, support_email, website_url, avatar_asset_id, banner_asset_id, published";

async function withLinks(row: Omit<CreatorProfile, "links"> | undefined): Promise<CreatorProfile | null> {
  if (!row) return null;
  const links = await query<CreatorLink>("SELECT id, label, url, sort_order FROM creator_links WHERE creator_id = $1 ORDER BY sort_order, created_at", [row.id]);
  return { ...row, links: links.rows };
}

export async function getCreatorProfileByUser(userId: string) {
  return withLinks(await one<Omit<CreatorProfile, "links">>(`SELECT ${profileColumns} FROM creator_profiles WHERE user_id = $1`, [userId]));
}

export async function getPublishedProfile(slug: string) {
  return withLinks(await one<Omit<CreatorProfile, "links">>(`SELECT ${profileColumns} FROM creator_profiles WHERE slug = $1 AND published = true`, [slug]));
}

const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Display name is too short").max(80, "Display name is too long"),
  tagline: z.string().trim().max(140, "Tagline must be 140 characters or fewer"),
  bio: z.string().trim().max(2000, "About section must be 2000 characters or fewer"),
  category: z.string().trim().min(2, "Choose a category").max(40),
  supportEmail: z.union([z.literal(""), z.string().trim().toLowerCase().email("Enter a valid support email").max(254)]),
  websiteUrl: z.union([z.literal(""), httpsUrlSchema])
});

const linksSchema = z
  .array(z.object({ label: z.string().trim().min(1, "Every link needs a label").max(40, "Link labels must be 40 characters or fewer"), url: httpsUrlSchema }))
  .max(8, "You can add up to 8 links");

export async function updateCreatorProfile(
  user: AuthUser,
  creatorId: string,
  input: { displayName: string; tagline: string; bio: string; category: string; supportEmail: string; websiteUrl: string; links: Array<{ label: string; url: string }> }
) {
  await requireCreatorOwner(user, creatorId);
  const data = parse(profileSchema, input);
  const links = parse(linksSchema, input.links.filter((link) => link.label.trim() || link.url.trim()));
  await transaction(async (client) => {
    await client.query(
      `UPDATE creator_profiles SET display_name=$2, tagline=$3, bio=$4, category=$5, support_email=NULLIF($6,''), website_url=NULLIF($7,''), updated_at=now() WHERE id=$1`,
      [creatorId, data.displayName, data.tagline, data.bio, data.category, data.supportEmail, data.websiteUrl]
    );
    await client.query("DELETE FROM creator_links WHERE creator_id = $1", [creatorId]);
    for (const [index, link] of links.entries()) {
      await client.query("INSERT INTO creator_links (creator_id,label,url,sort_order) VALUES ($1,$2,$3,$4)", [creatorId, link.label, link.url, index]);
    }
    await client.query("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id) VALUES ($1,'creator_profile_updated','creator_profile',$2)", [user.id, creatorId]);
  });
}

export async function setProfileImage(user: AuthUser, creatorId: string, kind: "avatar" | "banner", assetId: string | null) {
  await requireCreatorOwner(user, creatorId);
  if (assetId) {
    const asset = await one("SELECT id FROM media_assets WHERE id = $1 AND creator_id = $2 AND purpose = $3", [assetId, creatorId, kind === "avatar" ? "AVATAR" : "BANNER"]);
    if (!asset) throw new UserError("Image not found");
  }
  const column = kind === "avatar" ? "avatar_asset_id" : "banner_asset_id";
  const previous = await one<{ id: string | null }>(`SELECT ${column} AS id FROM creator_profiles WHERE id = $1`, [creatorId]);
  await query(`UPDATE creator_profiles SET ${column} = $2, updated_at = now() WHERE id = $1`, [creatorId, assetId]);
  return previous?.id ?? null;
}

export async function applicationState(creatorId: string) {
  const row = await one<{ state: string }>("SELECT state FROM creator_applications WHERE creator_id = $1 ORDER BY created_at DESC LIMIT 1", [creatorId]);
  return row?.state ?? null;
}

export async function setProfilePublished(user: AuthUser, creatorId: string, published: boolean) {
  await requireCreatorOwner(user, creatorId);
  if (published) {
    const state = await applicationState(creatorId);
    if (state !== "APPROVED_FOR_PAYOUT_ONBOARDING") throw new UserError("Your public page can go live after your creator application is approved");
    const profile = await one<{ bio: string; tagline: string }>("SELECT bio, tagline FROM creator_profiles WHERE id = $1", [creatorId]);
    if (!profile?.bio.trim() || !profile.tagline.trim()) throw new UserError("Add a tagline and an About section before publishing");
  }
  await query("UPDATE creator_profiles SET published = $2, updated_at = now() WHERE id = $1", [creatorId, published]);
  await query("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id) VALUES ($1,$2,'creator_profile',$3)", [user.id, published ? "creator_page_published" : "creator_page_unpublished", creatorId]);
}

export async function listPublishedCreators(limit = 24) {
  return (await query<{ slug: string; display_name: string; tagline: string; category: string; avatar_asset_id: string | null; banner_asset_id: string | null; tier_count: string }>(
    `SELECT cp.slug, cp.display_name, cp.tagline, cp.category, cp.avatar_asset_id, cp.banner_asset_id,
            (SELECT COUNT(*) FROM creator_tiers ct WHERE ct.creator_id = cp.id AND ct.state = 'PUBLISHED') AS tier_count
     FROM creator_profiles cp WHERE cp.published = true ORDER BY cp.created_at LIMIT $1`,
    [limit]
  )).rows;
}

export type OnboardingStep = { key: string; label: string; done: boolean; href: string; hint: string };

export async function creatorOnboarding(creatorId: string): Promise<OnboardingStep[]> {
  const row = await one<{ profile_done: boolean; app_state: string | null; payments: boolean; plan: boolean; tier: boolean; post: boolean; published: boolean }>(
    `SELECT
       (cp.tagline <> '' AND cp.bio <> '' AND cp.avatar_asset_id IS NOT NULL) AS profile_done,
       (SELECT state FROM creator_applications WHERE creator_id = cp.id ORDER BY created_at DESC LIMIT 1) AS app_state,
       EXISTS (SELECT 1 FROM creator_connected_accounts a WHERE a.creator_id = cp.id AND a.charges_enabled) AS payments,
       EXISTS (SELECT 1 FROM platform_subscriptions s WHERE s.creator_id = cp.id AND s.state IN ('ACTIVE','TRIALING')) AS plan,
       EXISTS (SELECT 1 FROM creator_tiers t WHERE t.creator_id = cp.id AND t.state = 'PUBLISHED') AS tier,
       EXISTS (SELECT 1 FROM posts p WHERE p.creator_id = cp.id AND p.state = 'PUBLISHED') AS post,
       cp.published
     FROM creator_profiles cp WHERE cp.id = $1`,
    [creatorId]
  );
  if (!row) return [];
  return [
    { key: "profile", label: "Complete your seller profile", done: row.profile_done, href: "/creator/settings", hint: "Photo, tagline and About section" },
    { key: "application", label: "Get your application approved", done: row.app_state === "APPROVED_FOR_PAYOUT_ONBOARDING", href: "/creator/application", hint: row.app_state ? `Status: ${row.app_state.replaceAll("_", " ").toLowerCase()}` : "Submit your application" },
    { key: "payments", label: "Connect payouts", done: row.payments, href: "/creator/payments", hint: "Connect your payment account to receive earnings" },
    { key: "plan", label: "Activate a ZeroFee plan", done: row.plan, href: "/creator/billing", hint: "Fixed monthly plan, 0% of your revenue" },
    { key: "tier", label: "Publish a membership tier", done: row.tier, href: "/creator/tiers/new", hint: "Set your target earnings" },
    { key: "post", label: "Publish your first post", done: row.post, href: "/creator/content", hint: "Give members something to unlock" },
    { key: "live", label: "Go live with your public page", done: row.published, href: "/creator/settings", hint: "Share your page link" }
  ];
}
