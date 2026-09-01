import { ProductShell, Panel, Metric } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";
import { getCreatorPaymentsProvider } from "@/lib/server/providers";

export default async function CreatorPayoutsPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  const account = await query<{ external_account_id: string; onboarding_state: string }>("SELECT external_account_id,onboarding_state FROM creator_connected_accounts WHERE creator_id=$1", [creator.id]);
  const balance = account.rowCount ? await getCreatorPaymentsProvider().getBalances({ connectedAccountId: account.rows[0].external_account_id }) : null;
  return <ProductShell kind="creator" title="Payouts" user={user}><Panel title="Connected-account balance"><section className="metric-grid"><Metric title="Available" value={balance ? `${(balance.availableMinor / 100).toFixed(2)} ${balance.currency}` : "Not connected"} tone="success" /><Metric title="Pending" value={balance ? `${(balance.pendingMinor / 100).toFixed(2)} ${balance.currency}` : "Not connected"} /><Metric title="Payout state" value={account.rows[0]?.onboarding_state ?? "REQUIREMENTS_DUE"} /></section><p className="muted">Payouts are provider-owned. ZeroFee does not hold creator membership revenue.</p></Panel></ProductShell>;
}
