import { connectPaymentsAction } from "@/app/actions";
import { ProductShell, Panel, DataTable } from "@/components/route-ui";
import { requireRole } from "@/lib/server/route-guards";
import { getCreatorForUser } from "@/lib/server/route-data";
import { query } from "@/lib/server/db";

export default async function CreatorPaymentsPage() {
  const user = await requireRole("CREATOR");
  const creator = await getCreatorForUser(user);
  if (!creator) return null;
  const accounts = (await query<{ provider: string; external_account_id: string; onboarding_state: string; charges_enabled: boolean; payouts_enabled: boolean }>("SELECT provider,external_account_id,onboarding_state,charges_enabled,payouts_enabled FROM creator_connected_accounts WHERE creator_id = $1", [creator.id])).rows;
  return (
    <ProductShell kind="creator" title="Payments Setup" user={user}>
      <Panel title="Connect Stripe" eyebrow="Provider">
        <form className="form-stack" action={connectPaymentsAction}>
          <input type="hidden" name="creatorId" value={creator.id} />
          <label><span><input name="existingStripe" type="checkbox" /> I already have Stripe</span></label>
          <button className="primary-button" type="submit">Connect Stripe</button>
        </form>
      </Panel>
      <DataTable headings={["Provider", "Account", "Onboarding", "Charges", "Payouts"]} rows={accounts.map((a) => [a.provider, a.external_account_id, a.onboarding_state, String(a.charges_enabled), String(a.payouts_enabled)])} />
    </ProductShell>
  );
}
