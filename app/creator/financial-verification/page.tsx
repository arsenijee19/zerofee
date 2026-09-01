import { refundPaymentAction } from "@/app/actions";
import { ProductShell, Panel, DataTable, MoneyCell } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function FinancialVerificationPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  const rows = (await query<{ payment_id: string; provider_transaction_reference: string; customer_charged_minor: string; actual_provider_fee_minor: string; actual_creator_proceeds_minor: string; surplus_minor: string; status: string; currency: "EUR" | "USD" }>(
    `SELECT gr.payment_id, gr.provider_transaction_reference, gr.customer_charged_minor, gr.actual_provider_fee_minor, gr.actual_creator_proceeds_minor, gr.surplus_minor, gr.status, gr.currency
     FROM guarantee_reconciliations gr JOIN membership_price_quotes q ON q.id = gr.quote_id WHERE q.creator_id = $1 ORDER BY gr.created_at DESC`,
    [creator.id]
  )).rows;
  return <ProductShell kind="creator" title="Financial Verification" user={user}><Panel title="Provider-authoritative records"><DataTable headings={["Provider ref", "Charged", "Provider fee", "Creator proceeds", "Surplus", "Status", "Action"]} rows={rows.map((r) => [r.provider_transaction_reference, <MoneyCell amount={r.customer_charged_minor} currency={r.currency} />, <MoneyCell amount={r.actual_provider_fee_minor} currency={r.currency} />, <MoneyCell amount={r.actual_creator_proceeds_minor} currency={r.currency} />, <MoneyCell amount={r.surplus_minor} currency={r.currency} />, r.status, <form action={refundPaymentAction}><input type="hidden" name="paymentId" value={r.payment_id} /><button className="secondary-button">Refund</button></form>])} /></Panel></ProductShell>;
}
