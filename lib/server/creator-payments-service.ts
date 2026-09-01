import type { AuthUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { getCreatorPaymentsProvider } from "@/lib/server/providers";
import { requireCreatorOwner } from "@/lib/server/policies";

export async function startCreatorPaymentsOnboarding(user: AuthUser, creatorId: string, existingStripeAccount: boolean) {
  await requireCreatorOwner(user, creatorId);
  const creator = await query<{ email: string; country_code: string }>(
    "SELECT u.email, cp.country_code FROM creator_profiles cp JOIN users u ON u.id = cp.user_id WHERE cp.id = $1",
    [creatorId]
  );
  if (!creator.rowCount) throw new Error("Creator not found");
  const state = await getCreatorPaymentsProvider().createOrRetrieveConnectedAccount({
    creatorId,
    email: creator.rows[0].email,
    country: creator.rows[0].country_code,
    existingStripeAccount
  });
  await query(
    `INSERT INTO creator_connected_accounts (creator_id,provider,external_account_id,onboarding_state,charges_enabled,payouts_enabled,dashboard_url,requirements)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'{}'::jsonb)
     ON CONFLICT (creator_id) DO UPDATE SET provider = EXCLUDED.provider, external_account_id = EXCLUDED.external_account_id, onboarding_state = EXCLUDED.onboarding_state, charges_enabled = EXCLUDED.charges_enabled, payouts_enabled = EXCLUDED.payouts_enabled, dashboard_url = EXCLUDED.dashboard_url, updated_at = now()`,
    [creatorId, state.provider, state.externalAccountId, state.onboardingState, state.chargesEnabled, state.payoutsEnabled, state.dashboardUrl ?? null]
  );
  return state;
}
