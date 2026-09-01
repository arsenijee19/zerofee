import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { query } from "@/lib/server/db";

export default async function AdminPricingCatalogPage() {
  const user = await requireRole("ADMIN");
  const rows = (await query<{ version: string; creator_account_country: string; issuer_region: string; payment_method_family: string; fee_confidence: string; status: string; revalidate_by: Date }>("SELECT version,creator_account_country,issuer_region,payment_method_family,fee_confidence,status,revalidate_by FROM provider_pricing_rules ORDER BY version")).rows;
  return <ProductShell kind="admin" title="Provider pricing catalog" user={user}><Panel title="Versioned fee rules"><DataTable headings={["Version", "Creator country", "Issuer", "Method", "Confidence", "State", "Revalidate"]} rows={rows.map((row) => [row.version, row.creator_account_country, row.issuer_region, row.payment_method_family, row.fee_confidence, row.status, new Date(row.revalidate_by).toLocaleDateString()])} /></Panel></ProductShell>;
}
