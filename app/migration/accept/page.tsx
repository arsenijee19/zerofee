import Link from "next/link";
import { PublicHeader, Panel } from "@/components/route-ui";
import { hashToken } from "@/lib/server/crypto";
import { query } from "@/lib/server/db";

export default async function MigrationAcceptPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const result = await query<{ id: string; member_name: string; creator_slug: string; creator_name: string; tier_name: string }>(
    "SELECT mi.id,mr.member_name,cp.slug AS creator_slug,cp.display_name AS creator_name,ct.name AS tier_name " +
    "FROM migration_invitations mi JOIN migration_import_rows mr ON mr.id=mi.import_row_id " +
    "JOIN migration_projects mp ON mp.id=mr.project_id JOIN creator_profiles cp ON cp.id=mp.creator_id " +
    "LEFT JOIN creator_tiers ct ON ct.id=mr.mapped_tier_id " +
    "WHERE mi.token_hash=$1 AND mi.status IN ('INVITE_READY','INVITE_CLICKED') AND mi.expires_at > now()",
    [hashToken(token)]
  );
  if (!result.rowCount) return <><PublicHeader /><main className="section"><Panel title="Migration link unavailable"><p>This invitation is expired or has already been used.</p></Panel></main></>;
  await query("UPDATE migration_invitations SET clicked_at=COALESCE(clicked_at,now()), status='INVITE_CLICKED' WHERE id=$1", [result.rows[0].id]);
  const row = result.rows[0];
  return <><PublicHeader /><main className="section"><Panel title={"Welcome, " + row.member_name}><p>Your audience record was imported from Patreon. Payment credentials were not transferred.</p><p>Choose the new ZeroFee membership and authorize payment yourself.</p><Link className="primary-button" href={"/c/" + row.creator_slug}>Continue to {row.creator_name} / {row.tier_name}</Link></Panel></main></>;
}
