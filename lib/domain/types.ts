import type { Currency, Money } from "@/lib/money";

export type Role = "VISITOR" | "MEMBER" | "CREATOR" | "ADMIN";
export type FeeConfidence = "EXACT_FORMULA" | "VERIFIED_UPPER_BOUND" | "UNKNOWN_OR_VARIABLE";
export type RuleStatus = "DRAFT" | "TEST_ONLY" | "VERIFIED" | "EXPIRED" | "PAUSED";
export type EligibilityStatus = "DISABLED" | "TEST_ONLY" | "ELIGIBLE" | "PAUSED";
export type ReconciliationStatus =
  | "PENDING_PROVIDER_DATA"
  | "VERIFIED_TARGET_MET"
  | "VERIFIED_WITH_SURPLUS"
  | "GUARANTEE_SHORTFALL"
  | "REFUNDED"
  | "DISPUTED"
  | "REVERSED"
  | "MANUAL_REVIEW";

export type PaymentContext = {
  platformEntityCountry: string;
  platformStripeCountry: string;
  creatorAccountCountry: string;
  creatorBusinessType: "individual" | "company";
  creatorSettlementCurrency: Currency;
  buyerTaxCountry: string;
  issuerRegion: "domestic" | "eea" | "international";
  paymentMethodFamily: "card" | "sepa_debit" | "unknown_wallet";
  cardClass: "consumer" | "commercial" | "unknown";
  presentmentCurrency: Currency;
  settlementCurrency: Currency;
  domestic: boolean;
  fxRequired: boolean;
  billingInterval: "monthly" | "annual";
};

export type ProviderPricingRule = {
  id: string;
  version: string;
  provider: "stripe" | "mock";
  sourceType: "official_public_pricing" | "contractual" | "verified_provider_account_config" | "test_only";
  sourceReference: string;
  verifiedDate: string;
  revalidateBy: string;
  creatorAccountCountry: string;
  issuerRegion: PaymentContext["issuerRegion"];
  paymentMethodFamily: PaymentContext["paymentMethodFamily"];
  cardClass: PaymentContext["cardClass"];
  presentmentCurrency: Currency;
  settlementCurrency: Currency;
  percentageBps: number;
  fixedFee: Money;
  billingFee: Money;
  crossBorderBps: number;
  fxBps: number;
  feePayer: "creator_connected_account";
  feeConfidence: FeeConfidence;
  status: RuleStatus;
  productionEnabled: boolean;
  reviewedBy: string;
};

export type GuaranteeEligibilityProfile = {
  id: string;
  version: string;
  provider: "stripe" | "mock";
  creatorCountry: string;
  issuerRegion: PaymentContext["issuerRegion"];
  presentmentCurrency: Currency;
  settlementCurrency: Currency;
  paymentMethodFamily: PaymentContext["paymentMethodFamily"];
  cardClass: PaymentContext["cardClass"];
  pricingRuleVersion: string;
  feeConfidence: FeeConfidence;
  status: EligibilityStatus;
  evidence: string;
  effectiveFrom: string;
  effectiveTo: string;
  approvedBy: string;
};

export type Quote = {
  id: string;
  creatorId: string;
  tierId: string;
  target: Money;
  retail: Money;
  tax: Money;
  providerCost: Money;
  billingCost: Money;
  fxCost: Money;
  modeledCreatorProceeds: Money;
  platformFee: Money;
  pricingRuleVersion: string;
  eligibilityProfileVersion: string;
  paymentContext: PaymentContext;
  expiresAt: string;
  status: "ACTIVE" | "ACCEPTED" | "EXPIRED";
};

export type Reconciliation = {
  id: string;
  quoteId: string;
  target: Money;
  customerCharged: Money;
  actualTax: Money;
  actualProviderFee: Money;
  zeroFeePlatformFee: Money;
  actualCreatorProceeds: Money;
  surplus: Money;
  shortfall: Money;
  status: ReconciliationStatus;
  providerTransactionReference: string;
};

export type SeedState = {
  mode: "TEST_MODE";
  users: Array<{ id: string; name: string; email: string; roles: Role[]; emailVerified: boolean }>;
  countries: Array<{ code: string; status: "BETA" | "WAITLIST" | "UNSUPPORTED"; guaranteedRoutes: number }>;
  applications: Array<{ id: string; creatorId: string; state: string; country: string; offering: string }>;
  creator: {
    id: string;
    name: string;
    slug: string;
    country: string;
    applicationState: string;
    kycState: string;
    saasPlan: string;
    platformBillingState: string;
  };
  tiers: Array<{ id: string; name: string; mode: "GUARANTEED_EARNINGS" | "SIMPLE_PRICE"; target: Money; interval: "monthly" | "annual"; members: number }>;
  quotes: Quote[];
  reconciliations: Reconciliation[];
  migrations: Array<{ name: string; email: string; externalTier: string; mappedTier: string; status: string; recoveredMrrMinor: number }>;
  integrations: Array<{ name: string; status: string; details: string }>;
  supportTickets: Array<{ id: string; title: string; owner: string; state: string; category: string }>;
};
