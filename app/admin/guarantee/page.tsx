import { disputePaymentAction } from "@/app/actions";
import { ProductShell, Panel, DataTable, MoneyCell } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { query } from "@/lib/server/db";

export default async function AdminGuaranteePage() {
  const user = await requireRole("ADMIN");
  const rows = (await query<{ payment_id: string; provider_transaction_reference: string; status: string; shortfall_minor: string; surplus_minor: string; currency: "EUR" | "USD" }>("SELECT payment_id,provider_transaction_reference,status,shortfall_minor,surplus_minor,currency FROM guarantee_reconciliations ORDER BY created_at DESC")).rows;
  return <ProductShell kind="admin" title="Guarantee health" user={user}><Panel title="Reconciliation incidents"><DataTable headings={["Provider ref", "State", "Shortfall", "Surplus", "Test dispute"]} rows={rows.map((row) => [row.provider_transaction_reference, row.status, <MoneyCell amount={row.shortfall_minor} currency={row.currency} />, <MoneyCell amount={row.surplus_minor} currency={row.currency} />, <form action={disputePaymentAction}><input type="hidden" name="paymentId" value={row.payment_id} /><button className="secondary-button">Mark dispute</button></form>])} /></Panel></ProductShell>;
}
