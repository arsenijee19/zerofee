import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { query } from "@/lib/server/db";

export default async function AdminCreatorsPage() {
  const user = await requireRole("ADMIN");
  const rows = (await query<{ display_name: string; slug: string; country_code: string; published: boolean; onboarding_state: string | null }>("SELECT cp.display_name,cp.slug,cp.country_code,cp.published,cca.onboarding_state FROM creator_profiles cp LEFT JOIN creator_connected_accounts cca ON cca.creator_id=cp.id ORDER BY cp.created_at DESC")).rows;
  return <ProductShell kind="admin" title="Creators" user={user}><Panel title="Creator registry"><DataTable headings={["Name", "Slug", "Country", "Public", "Payments"]} rows={rows.map((row) => [row.display_name, row.slug, row.country_code, row.published ? "PUBLISHED" : "PRIVATE", row.onboarding_state ?? "NOT_CONNECTED"])} /></Panel></ProductShell>;
}
