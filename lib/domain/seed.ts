import { money } from "@/lib/money";
import { reconcilePayment, solveGuaranteedRetailPrice } from "@/lib/domain/pricing";
import type { GuaranteeEligibilityProfile, PaymentContext, ProviderPricingRule, SeedState } from "@/lib/domain/types";

export const demoContexts: Record<string, PaymentContext> = {
  euConsumer: {
    platformEntityCountry: "US",
    platformStripeCountry: "US",
    creatorAccountCountry: "IE",
    creatorBusinessType: "individual",
    creatorSettlementCurrency: "EUR",
    buyerTaxCountry: "DE",
    issuerRegion: "eea",
    paymentMethodFamily: "card",
    cardClass: "consumer",
    presentmentCurrency: "EUR",
    settlementCurrency: "EUR",
    domestic: false,
    fxRequired: false,
    billingInterval: "monthly"
  },
  usCommercialFx: {
    platformEntityCountry: "US",
    platformStripeCountry: "US",
    creatorAccountCountry: "US",
    creatorBusinessType: "company",
    creatorSettlementCurrency: "USD",
    buyerTaxCountry: "US",
    issuerRegion: "domestic",
    paymentMethodFamily: "card",
    cardClass: "commercial",
    presentmentCurrency: "EUR",
    settlementCurrency: "USD",
    domestic: true,
    fxRequired: true,
    billingInterval: "monthly"
  },
  unknownWallet: {
    platformEntityCountry: "US",
    platformStripeCountry: "US",
    creatorAccountCountry: "IE",
    creatorBusinessType: "individual",
    creatorSettlementCurrency: "EUR",
    buyerTaxCountry: "BR",
    issuerRegion: "international",
    paymentMethodFamily: "unknown_wallet",
    cardClass: "unknown",
    presentmentCurrency: "EUR",
    settlementCurrency: "EUR",
    domestic: false,
    fxRequired: false,
    billingInterval: "monthly"
  }
};

export const pricingRules: ProviderPricingRule[] = [
  {
    id: "rule_mock_ie_eea_card_consumer_eur",
    version: "mock-ie-eea-card-consumer-eur-v1",
    provider: "mock",
    sourceType: "test_only",
    sourceReference: "Deterministic mock catalog for local prototype QA",
    verifiedDate: "2026-09-01",
    revalidateBy: "2027-01-01",
    creatorAccountCountry: "IE",
    issuerRegion: "eea",
    paymentMethodFamily: "card",
    cardClass: "consumer",
    presentmentCurrency: "EUR",
    settlementCurrency: "EUR",
    percentageBps: 150,
    fixedFee: money(25, "EUR"),
    billingFee: money(10, "EUR"),
    crossBorderBps: 35,
    fxBps: 0,
    feePayer: "creator_connected_account",
    feeConfidence: "VERIFIED_UPPER_BOUND",
    status: "VERIFIED",
    productionEnabled: false,
    reviewedBy: "seed-admin"
  },
  {
    id: "rule_mock_us_domestic_commercial_fx",
    version: "mock-us-domestic-commercial-fx-v1",
    provider: "mock",
    sourceType: "test_only",
    sourceReference: "Deterministic mock catalog for FX/commercial QA",
    verifiedDate: "2026-09-01",
    revalidateBy: "2027-01-01",
    creatorAccountCountry: "US",
    issuerRegion: "domestic",
    paymentMethodFamily: "card",
    cardClass: "commercial",
    presentmentCurrency: "EUR",
    settlementCurrency: "USD",
    percentageBps: 290,
    fixedFee: money(30, "EUR"),
    billingFee: money(12, "EUR"),
    crossBorderBps: 0,
    fxBps: 100,
    feePayer: "creator_connected_account",
    feeConfidence: "EXACT_FORMULA",
    status: "VERIFIED",
    productionEnabled: false,
    reviewedBy: "seed-admin"
  }
];

export const eligibilityProfiles: GuaranteeEligibilityProfile[] = pricingRules.map((rule) => ({
  id: `gep_${rule.id}`,
  version: `${rule.version}-eligibility`,
  provider: "mock",
  creatorCountry: rule.creatorAccountCountry,
  issuerRegion: rule.issuerRegion,
  presentmentCurrency: rule.presentmentCurrency,
  settlementCurrency: rule.settlementCurrency,
  paymentMethodFamily: rule.paymentMethodFamily,
  cardClass: rule.cardClass,
  pricingRuleVersion: rule.version,
  feeConfidence: rule.feeConfidence,
  status: "ELIGIBLE",
  evidence: rule.sourceReference,
  effectiveFrom: "2026-09-01",
  effectiveTo: "2027-01-01",
  approvedBy: "seed-admin"
}));

export function getSeedState(): SeedState {
  const quote = solveGuaranteedRetailPrice({
    target: money(1000, "EUR"),
    context: demoContexts.euConsumer,
    rules: pricingRules,
    profiles: eligibilityProfiles,
    taxBps: 1900,
    taxInclusive: true,
    creatorId: "creator_nova",
    tierId: "tier_signal"
  });
  const exact = reconcilePayment(quote, quote.providerCost, "txn_exact_001");
  const surplus = reconcilePayment(quote, money(Math.max(0, quote.providerCost.amountMinor - 50), "EUR"), "txn_surplus_001");
  const shortfall = reconcilePayment(quote, money(quote.providerCost.amountMinor + 175, "EUR"), "txn_shortfall_001");

  return {
    mode: "TEST_MODE",
    users: [
      { id: "user_creator", name: "Mila Novak", email: "mila@example.test", roles: ["CREATOR"], emailVerified: true },
      { id: "user_member", name: "Ana Member", email: "ana@example.test", roles: ["MEMBER"], emailVerified: true },
      { id: "user_admin", name: "ZeroFee Ops", email: "ops@example.test", roles: ["ADMIN"], emailVerified: true }
    ],
    countries: [
      { code: "US", status: "BETA", guaranteedRoutes: 1 },
      { code: "IE", status: "BETA", guaranteedRoutes: 1 },
      { code: "GB", status: "WAITLIST", guaranteedRoutes: 0 },
      { code: "BR", status: "UNSUPPORTED", guaranteedRoutes: 0 }
    ],
    applications: [
      { id: "app_001", creatorId: "creator_nova", state: "APPROVED_FOR_PAYOUT_ONBOARDING", country: "IE", offering: "Paid research briefings, Discord office hours, downloadable templates" },
      { id: "app_002", creatorId: "creator_rejected", state: "REJECTED", country: "BR", offering: "Unsupported payment route and missing rights attestation" }
    ],
    creator: {
      id: "creator_nova",
      name: "Mila Novak",
      slug: "mila-nova",
      country: "IE",
      applicationState: "APPROVED_FOR_PAYOUT_ONBOARDING",
      kycState: "REQUIREMENTS_DUE",
      saasPlan: "Creator",
      platformBillingState: "ACTIVE"
    },
    tiers: [
      { id: "tier_signal", name: "Signal Room", mode: "GUARANTEED_EARNINGS", target: money(1000, "EUR"), interval: "monthly", members: 186 },
      { id: "tier_archive", name: "Archive Access", mode: "SIMPLE_PRICE", target: money(700, "EUR"), interval: "monthly", members: 42 }
    ],
    quotes: [quote],
    reconciliations: [exact, surplus, shortfall],
    migrations: [
      { name: "Iva P.", email: "iva@example.test", externalTier: "Patreon Pro", mappedTier: "Signal Room", status: "CONVERTED", recoveredMrrMinor: 1000 },
      { name: "Marko T.", email: "marko@example.test", externalTier: "Backer", mappedTier: "Archive Access", status: "INVITED", recoveredMrrMinor: 0 },
      { name: "Lea K.", email: "lea@example.test", externalTier: "Patreon Pro", mappedTier: "Signal Room", status: "CLICKED", recoveredMrrMinor: 0 }
    ],
    integrations: [
      { name: "Stripe Connect", status: "TEST MODE: onboarding required", details: "Direct-charge boundary, embedded onboarding, payouts, refunds, disputes, webhooks" },
      { name: "Discord", status: "Connected in mock mode", details: "Signal Room maps to Research role with entitlement grant/revoke audit" },
      { name: "Telegram", status: "Mock provider ready", details: "Private-channel invite and revoke flow behind provider interface" },
      { name: "Signed Webhooks", status: "Active", details: "HMAC signing, SSRF guard, retry log, endpoint disable policy" }
    ],
    supportTickets: [
      { id: "sup_001", title: "Member cannot access Discord", owner: "creator_nova", state: "CREATOR_FIRST", category: "missing_creator_benefit" },
      { id: "sup_002", title: "Guarantee shortfall review", owner: "admin", state: "ZERO_FEE_ESCALATED", category: "guarantee_reconciliation_issue" }
    ]
  };
}
