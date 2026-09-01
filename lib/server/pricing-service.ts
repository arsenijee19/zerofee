import type { PaymentContext, ProviderPricingRule, GuaranteeEligibilityProfile } from "@/lib/domain/types";
import type { AuthUser } from "@/lib/server/auth";
import { money, mulBpsRoundUp } from "@/lib/money";
import { findRule, isRuleCurrent, modeledCreatorProceeds, solveGuaranteedRetailPrice } from "@/lib/domain/pricing";
import { query, transaction } from "@/lib/server/db";
import { requireCreatorOwner } from "@/lib/server/policies";

export function rowToRule(row: Record<string, unknown>): ProviderPricingRule {
  return {
    id: String(row.id),
    version: String(row.version),
    provider: String(row.provider) as "mock",
    sourceType: String(row.source_type) as ProviderPricingRule["sourceType"],
    sourceReference: String(row.source_reference),
    verifiedDate: new Date(String(row.verified_at)).toISOString(),
    revalidateBy: new Date(String(row.revalidate_by)).toISOString(),
    creatorAccountCountry: String(row.creator_account_country),
    issuerRegion: String(row.issuer_region) as ProviderPricingRule["issuerRegion"],
    paymentMethodFamily: String(row.payment_method_family) as ProviderPricingRule["paymentMethodFamily"],
    cardClass: String(row.card_class) as ProviderPricingRule["cardClass"],
    presentmentCurrency: String(row.presentment_currency) as ProviderPricingRule["presentmentCurrency"],
    settlementCurrency: String(row.settlement_currency) as ProviderPricingRule["settlementCurrency"],
    percentageBps: Number(row.percentage_bps),
    fixedFee: money(Number(row.fixed_fee_minor), String(row.presentment_currency) as ProviderPricingRule["presentmentCurrency"]),
    billingFee: money(Number(row.billing_fee_minor), String(row.presentment_currency) as ProviderPricingRule["presentmentCurrency"]),
    crossBorderBps: Number(row.cross_border_bps),
    fxBps: Number(row.fx_bps),
    feePayer: "creator_connected_account",
    feeConfidence: String(row.fee_confidence) as ProviderPricingRule["feeConfidence"],
    status: String(row.status) as ProviderPricingRule["status"],
    productionEnabled: Boolean(row.production_enabled),
    reviewedBy: "db-admin"
  };
}

export function rowToProfile(row: Record<string, unknown>): GuaranteeEligibilityProfile {
  return {
    id: String(row.id),
    version: String(row.version),
    provider: String(row.provider) as "mock",
    creatorCountry: String(row.creator_country),
    issuerRegion: String(row.issuer_region) as GuaranteeEligibilityProfile["issuerRegion"],
    presentmentCurrency: String(row.presentment_currency) as GuaranteeEligibilityProfile["presentmentCurrency"],
    settlementCurrency: String(row.settlement_currency) as GuaranteeEligibilityProfile["settlementCurrency"],
    paymentMethodFamily: String(row.payment_method_family) as GuaranteeEligibilityProfile["paymentMethodFamily"],
    cardClass: String(row.card_class) as GuaranteeEligibilityProfile["cardClass"],
    pricingRuleVersion: String(row.pricing_rule_version),
    feeConfidence: String(row.fee_confidence) as GuaranteeEligibilityProfile["feeConfidence"],
    status: String(row.status) as GuaranteeEligibilityProfile["status"],
    evidence: String(row.evidence),
    effectiveFrom: new Date(String(row.effective_from)).toISOString(),
    effectiveTo: new Date(String(row.effective_to)).toISOString(),
    approvedBy: "db-admin"
  };
}

export async function createTier(user: AuthUser, creatorId: string, input: { name: string; description: string; benefits: string; pricingMode: "GUARANTEED_EARNINGS" | "SIMPLE_PRICE"; targetMinor: number; currency: "EUR" | "USD"; interval: "monthly" | "annual" }) {
  await requireCreatorOwner(user, creatorId);
  return transaction(async (client) => {
    const tier = await client.query<{ id: string }>(
      "INSERT INTO creator_tiers (creator_id, name, description, benefits, state) VALUES ($1,$2,$3,$4,'DRAFT') RETURNING id",
      [creatorId, input.name, input.description, input.benefits]
    );
    const version = await client.query<{ id: string }>(
      "INSERT INTO tier_price_versions (tier_id, version, pricing_mode, billing_interval, currency, creator_target_minor, simple_retail_minor) VALUES ($1,1,$2,$3,$4,$5,$6) RETURNING id",
      [tier.rows[0].id, input.pricingMode, input.interval, input.currency, input.targetMinor, input.pricingMode === "SIMPLE_PRICE" ? input.targetMinor : null]
    );
    return { tierId: tier.rows[0].id, priceVersionId: version.rows[0].id };
  });
}

export async function publishTier(user: AuthUser, creatorId: string, tierId: string) {
  await requireCreatorOwner(user, creatorId);
  await query("UPDATE creator_tiers SET state = 'PUBLISHED' WHERE id = $1 AND creator_id = $2", [tierId, creatorId]);
}

export async function createServerQuote(args: { user: AuthUser | null; creatorId: string; tierId: string; context: PaymentContext; taxBps: number; taxInclusive: boolean }) {
  const tier = await query<{ id: string; creator_target_minor: string; simple_retail_minor: string | null; pricing_mode: "GUARANTEED_EARNINGS" | "SIMPLE_PRICE"; currency: "EUR" | "USD"; price_version_id: string }>(
    `SELECT ct.id, tpv.creator_target_minor, tpv.simple_retail_minor, tpv.pricing_mode, tpv.currency, tpv.id AS price_version_id
     FROM creator_tiers ct JOIN tier_price_versions tpv ON tpv.tier_id = ct.id
     WHERE ct.id = $1 AND ct.creator_id = $2 AND tpv.active = true`,
    [args.tierId, args.creatorId]
  );
  if (!tier.rowCount) throw new Error("Tier not found");
  const rules = await loadProviderPricingRules();
  const profiles = await loadGuaranteeEligibilityProfiles();
  if (tier.rows[0].pricing_mode === "SIMPLE_PRICE") {
    const rule = findRule(rules, args.context);
    if (!rule || !isRuleCurrent(rule)) throw new Error("No current provider pricing rule for this payment context");
    const retail = money(Number(tier.rows[0].simple_retail_minor ?? tier.rows[0].creator_target_minor), tier.rows[0].currency);
    const result = modeledCreatorProceeds(retail, rule, args.context, args.taxBps, args.taxInclusive);
    const simpleQuote = {
      id: `quote_${args.tierId}_${args.context.issuerRegion}_${retail.amountMinor}`,
      creatorId: args.creatorId,
      tierId: args.tierId,
      target: result.proceeds,
      retail,
      tax: result.tax,
      providerCost: result.providerCost,
      billingCost: rule.billingFee,
      fxCost: args.context.fxRequired ? mulBpsRoundUp(retail, rule.fxBps) : money(0, retail.currency),
      modeledCreatorProceeds: result.proceeds,
      platformFee: money(0, retail.currency),
      pricingRuleVersion: rule.version,
      eligibilityProfileVersion: "SIMPLE_PRICE_NOT_GUARANTEED",
      paymentContext: args.context,
      expiresAt: "2026-09-02T00:00:00.000Z",
      status: "ACTIVE" as const
    };
    const saved = await query<{ id: string }>(
      `INSERT INTO membership_price_quotes
       (creator_id,tier_id,tier_price_version_id,user_id,target_minor,retail_minor,tax_minor,provider_cost_minor,modeled_creator_proceeds_minor,platform_fee_minor,currency,pricing_rule_version,eligibility_profile_version,payment_context,status,expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,0,$10,$11,$12,$13,'ACTIVE',now() + interval '15 minutes') RETURNING id`,
      [args.creatorId, args.tierId, tier.rows[0].price_version_id, args.user?.id ?? null, simpleQuote.target.amountMinor, simpleQuote.retail.amountMinor, simpleQuote.tax.amountMinor, simpleQuote.providerCost.amountMinor, simpleQuote.modeledCreatorProceeds.amountMinor, simpleQuote.retail.currency, simpleQuote.pricingRuleVersion, simpleQuote.eligibilityProfileVersion, simpleQuote.paymentContext]
    );
    return { ...simpleQuote, id: saved.rows[0].id };
  }
  const solved = solveGuaranteedRetailPrice({
    target: money(Number(tier.rows[0].creator_target_minor), tier.rows[0].currency),
    context: args.context,
    rules,
    profiles,
    taxBps: args.taxBps,
    taxInclusive: args.taxInclusive,
    creatorId: args.creatorId,
    tierId: args.tierId
  });
  const saved = await query<{ id: string }>(
    `INSERT INTO membership_price_quotes
     (creator_id,tier_id,tier_price_version_id,user_id,target_minor,retail_minor,tax_minor,provider_cost_minor,modeled_creator_proceeds_minor,platform_fee_minor,currency,pricing_rule_version,eligibility_profile_version,payment_context,status,expires_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,0,$10,$11,$12,$13,'ACTIVE',now() + interval '15 minutes') RETURNING id`,
    [args.creatorId, args.tierId, tier.rows[0].price_version_id, args.user?.id ?? null, solved.target.amountMinor, solved.retail.amountMinor, solved.tax.amountMinor, solved.providerCost.amountMinor, solved.modeledCreatorProceeds.amountMinor, solved.retail.currency, solved.pricingRuleVersion, solved.eligibilityProfileVersion, solved.paymentContext]
  );
  return { ...solved, id: saved.rows[0].id };
}

export async function loadProviderPricingRules() {
  return (await query("SELECT * FROM provider_pricing_rules ORDER BY created_at")).rows.map(rowToRule);
}

export async function loadGuaranteeEligibilityProfiles() {
  return (await query("SELECT * FROM guarantee_eligibility_profiles ORDER BY effective_from")).rows.map(rowToProfile);
}

export async function versionPricingRuleForAdmin(user: AuthUser, oldVersion: string, changes: { percentageBps: number; newVersion: string }) {
  if (!user.roles.includes("ADMIN")) throw new Error("FORBIDDEN");
  const old = await query("SELECT * FROM provider_pricing_rules WHERE version = $1", [oldVersion]);
  if (!old.rowCount) throw new Error("Rule not found");
  const row = old.rows[0];
  await query(
    `INSERT INTO provider_pricing_rules
    (version,provider,source_type,source_reference,creator_account_country,issuer_region,payment_method_family,card_class,presentment_currency,settlement_currency,percentage_bps,fixed_fee_minor,billing_fee_minor,cross_border_bps,fx_bps,fee_payer,fee_confidence,status,production_enabled,verified_at,revalidate_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'VERIFIED',false,now(),now()+interval '120 days')`,
    [changes.newVersion, row.provider, row.source_type, row.source_reference, row.creator_account_country, row.issuer_region, row.payment_method_family, row.card_class, row.presentment_currency, row.settlement_currency, changes.percentageBps, row.fixed_fee_minor, row.billing_fee_minor, row.cross_border_bps, row.fx_bps, row.fee_payer, row.fee_confidence]
  );
}
