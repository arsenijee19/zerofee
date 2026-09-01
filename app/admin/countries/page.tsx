import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { query } from "@/lib/server/db";

export default async function AdminCountriesPage() {
  const user = await requireRole("ADMIN");
  const rows = (await query<{ code: string; launch_status: string; individual_supported: boolean; company_supported: boolean; guaranteed_earnings_enabled: boolean }>("SELECT code,launch_status,individual_supported,company_supported,guaranteed_earnings_enabled FROM country_capabilities ORDER BY code")).rows;
  return <ProductShell kind="admin" title="Countries" user={user}><Panel title="Country capability registry"><DataTable headings={["Code", "Launch", "Individual", "Company", "Guarantee"]} rows={rows.map((row) => [row.code, row.launch_status, row.individual_supported ? "YES" : "NO", row.company_supported ? "YES" : "NO", row.guaranteed_earnings_enabled ? "ENABLED" : "DISABLED"])} /></Panel></ProductShell>;
}
