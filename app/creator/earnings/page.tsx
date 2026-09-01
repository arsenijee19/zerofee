import { ProductShell, Panel, DataTable, MoneyCell, Metric } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function CreatorEarningsPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  const rows = (await query<{ provider_transaction_reference: string; actual_creator_proceeds_minor: string; status: string; currency: "EUR" | "USD"; created_at: Date }>("SELECT gr.provider_transaction_reference,gr.actual_creator_proceeds_minor,gr.status,gr.currency,gr.created_at FROM guarantee_reconciliations gr JOIN membership_price_quotes q ON q.id=gr.quote_id WHERE q.creator_id=$1 ORDER BY gr.created_at DESC", [creator.id])).rows;
  const total = rows.reduce((sum, row) => sum + Number(row.actual_creator_proceeds_minor), 0);
  return <ProductShell kind="creator" title="Earnings" user={user}><Metric title="Creator proceeds" value={`€${(total / 100).toFixed(2)}`} tone="success" /><Panel title="Provider-authoritative earnings"><DataTable headings={["Provider reference", "Proceeds", "Reconciliation", "Date"]} rows={rows.map((row) => [row.provider_transaction_reference, <MoneyCell amount={row.actual_creator_proceeds_minor} currency={row.currency} />, row.status, new Date(row.created_at).toLocaleDateString()])} /></Panel></ProductShell>;
}
