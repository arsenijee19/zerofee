import { importMigrationAction } from "@/app/actions";
import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser, listCreatorTiers } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function CreatorMigrationPage({ searchParams }: { searchParams: Promise<{ imported?: string; invite?: string }> }) {
  const user = await requireRole("CREATOR");
  const params = await searchParams;
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  const tiers = await listCreatorTiers(creator.id);
  const imports = (await query<{ email: string; member_name: string; external_tier: string; status: string }>("SELECT member_name,email,external_tier,status FROM migration_import_rows mr JOIN migration_projects mp ON mp.id = mr.project_id WHERE mp.creator_id = $1 ORDER BY mr.created_at DESC", [creator.id])).rows;
  return <ProductShell kind="creator" title="Migration" user={user}>{params.invite && <p className="status-pill success">Secure invite ready: <a href={"/migration/accept?token=" + encodeURIComponent(params.invite)}>Open member migration link</a></p>}<Panel title="Upload Patreon CSV"><form className="form-stack" action={importMigrationAction}><input type="hidden" name="creatorId" value={creator.id} /><label>Map to tier<select name="tierId">{tiers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label><label>CSV<textarea name="csv" required defaultValue={"Name,Email,Patreon ID,Tier,Status,Billing Frequency,Amount\nIva,iva@example.test,p1,Patreon Pro,active,monthly,10"} /></label><button className="primary-button">Import migration</button></form></Panel><DataTable headings={["Name", "Email", "External tier", "Status"]} rows={imports.map((i) => [i.member_name, i.email, i.external_tier, i.status])} /></ProductShell>;
}
