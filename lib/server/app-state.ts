import { money } from "@/lib/money";
import { reconcilePayment, solveGuaranteedRetailPrice } from "@/lib/domain/pricing";
import { demoContexts, getSeedState } from "@/lib/domain/seed";
import type { ReconciliationStatus, SeedState } from "@/lib/domain/types";
import { query } from "@/lib/server/db";
import { loadGuaranteeEligibilityProfiles, loadProviderPricingRules } from "@/lib/server/pricing-service";

export async function getRuntimeState(): Promise<SeedState> {
  try {
    const [users, countries, creatorRows, tiers, applications, reconciliations, migrations, integrations, supportTickets] = await Promise.all([
      query<{ id: string; name: string; email: string; roles: string[]; email_verified_at: Date | null }>(
        "SELECT u.id,u.name,u.email,array_remove(array_agg(ur.role), NULL) AS roles,u.email_verified_at FROM users u LEFT JOIN user_roles ur ON ur.user_id = u.id GROUP BY u.id ORDER BY u.created_at LIMIT 12"
      ),
      query<{ code: string; launch_status: "BETA" | "WAITLIST" | "UNSUPPORTED"; guaranteed_routes: string }>(
        "SELECT cc.code, cc.launch_status, COUNT(gep.id) FILTER (WHERE gep.status = 'ELIGIBLE') AS guaranteed_routes FROM country_capabilities cc LEFT JOIN guarantee_eligibility_profiles gep ON gep.creator_country = cc.code GROUP BY cc.code, cc.launch_status ORDER BY cc.code"
      ),
      query<{ id: string; display_name: string; slug: string; country_code: string; application_state: string | null; onboarding_state: string | null; plan_name: string | null; billing_state: string | null }>(
        `SELECT cp.id, cp.display_name, cp.slug, cp.country_code, ca.state AS application_state, cca.onboarding_state, pp.name AS plan_name, ps.state AS billing_state
         FROM creator_profiles cp
         LEFT JOIN creator_applications ca ON ca.creator_id = cp.id
         LEFT JOIN creator_connected_accounts cca ON cca.creator_id = cp.id
         LEFT JOIN platform_subscriptions ps ON ps.creator_id = cp.id
         LEFT JOIN platform_plan_versions ppv ON ppv.id = ps.plan_version_id
         LEFT JOIN platform_plans pp ON pp.id = ppv.plan_id
         WHERE cp.slug = 'mila-nova'
         ORDER BY ca.created_at DESC NULLS LAST
         LIMIT 1`
      ),
      query<{ id: string; name: string; pricing_mode: "GUARANTEED_EARNINGS" | "SIMPLE_PRICE"; creator_target_minor: string; currency: "EUR" | "USD"; billing_interval: "monthly" | "annual"; members: string }>(
        `SELECT ct.id, ct.name, tpv.pricing_mode, tpv.creator_target_minor, tpv.currency, tpv.billing_interval,
          COUNT(ms.id) FILTER (WHERE ms.state = 'ACTIVE') AS members
         FROM creator_tiers ct
         JOIN tier_price_versions tpv ON tpv.tier_id = ct.id AND tpv.active = true
         LEFT JOIN membership_subscriptions ms ON ms.tier_id = ct.id
         WHERE ct.state = 'PUBLISHED'
         GROUP BY ct.id, tpv.id
         ORDER BY ct.sort_order, ct.created_at
         LIMIT 8`
      ),
      query<{ id: string; creator_id: string; state: string; country_code: string; offering: string }>(
        "SELECT id, creator_id, state, country_code, offering FROM creator_applications ORDER BY created_at DESC LIMIT 6"
      ),
      query<{ id: string; quote_id: string; target_minor: string; customer_charged_minor: string; actual_tax_minor: string; actual_provider_fee_minor: string; actual_creator_proceeds_minor: string; zero_fee_platform_fee_minor: string; surplus_minor: string; shortfall_minor: string; currency: "EUR" | "USD"; status: ReconciliationStatus; provider_transaction_reference: string }>(
        "SELECT * FROM guarantee_reconciliations ORDER BY created_at DESC LIMIT 6"
      ),
      query<{ name: string; email: string; external_tier: string; mapped_tier: string | null; status: string; recovered_mrr_minor: string }>(
        `SELECT COALESCE(mr.raw->>'name','Imported member') AS name, mr.email, COALESCE(mr.external_tier,'External tier') AS external_tier,
          ct.name AS mapped_tier, mr.status, COALESCE(tpv.creator_target_minor,0) AS recovered_mrr_minor
         FROM migration_import_rows mr
         LEFT JOIN creator_tiers ct ON ct.id = mr.mapped_tier_id
         LEFT JOIN tier_price_versions tpv ON tpv.tier_id = ct.id AND tpv.active = true
         ORDER BY mr.created_at DESC LIMIT 6`
      ),
      query<{ name: string; status: string; details: string }>(
        "SELECT name, status, provider || ' integration boundary' AS details FROM outbound_webhook_endpoints ORDER BY created_at DESC LIMIT 4"
      ),
      query<{ id: string; title: string; owner: string; state: string; category: string }>(
        "SELECT id,title,COALESCE(creator_id::text,'admin') AS owner,state,category FROM support_tickets ORDER BY created_at DESC LIMIT 6"
      )
    ]);

    const base = getSeedState();
    const [rules, profiles] = await Promise.all([loadProviderPricingRules(), loadGuaranteeEligibilityProfiles()]);
    const creator = creatorRows.rows[0];
    const firstTier = tiers.rows[0];
    const quote = firstTier && creator
      ? solveGuaranteedRetailPrice({
          target: money(Number(firstTier.creator_target_minor), firstTier.currency),
          context: demoContexts.euConsumer,
          rules,
          profiles,
          taxBps: 1900,
          taxInclusive: true,
          creatorId: creator.id,
          tierId: firstTier.id
        })
      : base.quotes[0];

    return {
      mode: "TEST_MODE",
      users: users.rows.map((row) => ({ id: row.id, name: row.name, email: row.email, roles: row.roles as SeedState["users"][number]["roles"], emailVerified: Boolean(row.email_verified_at) })),
      countries: countries.rows.map((row) => ({ code: row.code, status: row.launch_status, guaranteedRoutes: Number(row.guaranteed_routes) })),
      applications: applications.rows.map((row) => ({ id: row.id, creatorId: row.creator_id, state: row.state, country: row.country_code, offering: row.offering })),
      creator: creator
        ? { id: creator.id, name: creator.display_name, slug: creator.slug, country: creator.country_code, applicationState: creator.application_state ?? "NOT_SUBMITTED", kycState: creator.onboarding_state ?? "NOT_STARTED", saasPlan: creator.plan_name ?? "Not subscribed", platformBillingState: creator.billing_state ?? "NOT_STARTED" }
        : base.creator,
      tiers: tiers.rows.map((row) => ({ id: row.id, name: row.name, mode: row.pricing_mode, target: money(Number(row.creator_target_minor), row.currency), interval: row.billing_interval, members: Number(row.members) })),
      quotes: [quote],
      reconciliations: reconciliations.rowCount
        ? reconciliations.rows.map((row) => ({
            id: row.id,
            quoteId: row.quote_id,
            target: money(Number(row.target_minor), row.currency),
            customerCharged: money(Number(row.customer_charged_minor), row.currency),
            actualTax: money(Number(row.actual_tax_minor), row.currency),
            actualProviderFee: money(Number(row.actual_provider_fee_minor), row.currency),
            zeroFeePlatformFee: money(Number(row.zero_fee_platform_fee_minor), row.currency),
            actualCreatorProceeds: money(Number(row.actual_creator_proceeds_minor), row.currency),
            surplus: money(Number(row.surplus_minor), row.currency),
            shortfall: money(Number(row.shortfall_minor), row.currency),
            status: row.status,
            providerTransactionReference: row.provider_transaction_reference
          }))
        : [reconcilePayment(quote, quote.providerCost, "txn_exact_001"), reconcilePayment(quote, money(Math.max(0, quote.providerCost.amountMinor - 50), quote.retail.currency), "txn_surplus_001"), reconcilePayment(quote, money(quote.providerCost.amountMinor + 175, quote.retail.currency), "txn_shortfall_001")],
      migrations: migrations.rowCount
        ? migrations.rows.map((row) => ({ name: row.name, email: row.email, externalTier: row.external_tier, mappedTier: row.mapped_tier ?? "Unmapped", status: row.status, recoveredMrrMinor: Number(row.recovered_mrr_minor) }))
        : base.migrations,
      integrations: integrations.rowCount ? integrations.rows : base.integrations,
      supportTickets: supportTickets.rowCount ? supportTickets.rows : base.supportTickets
    };
  } catch {
    return getSeedState();
  }
}
