import type { MetadataRoute } from "next";
import { query } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL || "http://localhost:3000";
  const staticPages = ["", "/how-it-works", "/pricing", "/migration", "/safety", "/creators", "/terms", "/privacy", "/refunds", "/acceptable-use"].map((path) => ({ url: `${base}${path}` }));
  try {
    const creators = await query<{ slug: string; updated_at: Date }>("SELECT slug, updated_at FROM creator_profiles WHERE published = true");
    const posts = await query<{ creator_slug: string; slug: string; updated_at: Date }>(
      "SELECT cp.slug AS creator_slug, p.slug, p.updated_at FROM posts p JOIN creator_profiles cp ON cp.id = p.creator_id WHERE cp.published = true AND p.state = 'PUBLISHED' AND p.visibility = 'PUBLIC'"
    );
    return [
      ...staticPages,
      ...creators.rows.map((row) => ({ url: `${base}/c/${row.slug}`, lastModified: row.updated_at })),
      ...posts.rows.map((row) => ({ url: `${base}/c/${row.creator_slug}/posts/${row.slug}`, lastModified: row.updated_at }))
    ];
  } catch {
    return staticPages;
  }
}
