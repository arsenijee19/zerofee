import type { AuthUser } from "@/lib/server/auth";
import { query, transaction } from "@/lib/server/db";
import { requireCreatorOwner } from "@/lib/server/policies";

export async function activateMockPlan(user: AuthUser, creatorId: string, planCode: string) {
  await requireCreatorOwner(user, creatorId);
  return transaction(async (client) => {
    const plan = await client.query<{ id: string }>("SELECT id FROM platform_plans WHERE code = $1", [planCode]);
    if (!plan.rowCount) throw new Error("Unknown plan");
    const version = await client.query<{ id: string }>("SELECT id FROM platform_plan_versions WHERE plan_id = $1 ORDER BY version DESC LIMIT 1", [plan.rows[0].id]);
    const sub = await client.query<{ id: string }>(
      `INSERT INTO platform_subscriptions (creator_id, plan_version_id, provider, state, current_period_end)
       VALUES ($1,$2,'mock','ACTIVE',now() + interval '1 month')
       ON CONFLICT (creator_id) DO UPDATE SET plan_version_id = EXCLUDED.plan_version_id, state = 'ACTIVE', updated_at = now()
       RETURNING id`,
      [creatorId, version.rows[0].id]
    );
    await client.query("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id) VALUES ($1,'platform_plan_activated','platform_subscription',$2)", [user.id, sub.rows[0].id]);
    return sub.rows[0];
  });
}

export async function setBillingStateForTest(creatorId: string, state: "PAST_DUE" | "GRACE" | "SUSPENDED" | "ACTIVE") {
  await query("UPDATE platform_subscriptions SET state = $1, updated_at = now() WHERE creator_id = $2", [state, creatorId]);
}

export async function assertCreatorEntitlement(creatorId: string, feature: "tiers" | "broadcasts" | "api") {
  const result = await query<{ state: string }>("SELECT state FROM platform_subscriptions WHERE creator_id = $1", [creatorId]);
  if (!result.rowCount || ["SUSPENDED", "CANCELLED", "NONE"].includes(result.rows[0].state)) throw new Error(`Creator feature ${feature} is not available`);
}
