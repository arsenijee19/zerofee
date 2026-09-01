import { add, money, mulBpsRoundNearest, mulBpsRoundUp, subtract, type Money } from "@/lib/money";
import type { GuaranteeEligibilityProfile, PaymentContext, ProviderPricingRule, Quote, Reconciliation } from "@/lib/domain/types";

export function isRuleCurrent(rule: ProviderPricingRule, now = new Date("2026-09-01T00:00:00Z")) {
  return rule.status !== "EXPIRED" && rule.status !== "PAUSED" && new Date(rule.revalidateBy) >= now;
}

export function findRule(rules: ProviderPricingRule[], context: PaymentContext) {
  return rules.find(
    (rule) =>
      rule.creatorAccountCountry === context.creatorAccountCountry &&
      rule.issuerRegion === context.issuerRegion &&
      rule.paymentMethodFamily === context.paymentMethodFamily &&
      rule.cardClass === context.cardClass &&
      rule.presentmentCurrency === context.presentmentCurrency &&
      rule.settlementCurrency === context.settlementCurrency &&
      isRuleCurrent(rule)
  );
}

function findEligibleRoute(rules: ProviderPricingRule[], profiles: GuaranteeEligibilityProfile[], context: PaymentContext) {
  for (const rule of rules) {
    if (
      rule.creatorAccountCountry === context.creatorAccountCountry &&
      rule.issuerRegion === context.issuerRegion &&
      rule.paymentMethodFamily === context.paymentMethodFamily &&
      rule.cardClass === context.cardClass &&
      rule.presentmentCurrency === context.presentmentCurrency &&
      rule.settlementCurrency === context.settlementCurrency &&
      isRuleCurrent(rule)
    ) {
      const profile = findEligibility(profiles, rule, context);
      if (profile) return { rule, profile };
    }
  }
  return null;
}

export function findEligibility(profiles: GuaranteeEligibilityProfile[], rule: ProviderPricingRule, context: PaymentContext) {
  return profiles.find(
    (profile) =>
      profile.status === "ELIGIBLE" &&
      profile.pricingRuleVersion === rule.version &&
      profile.creatorCountry === context.creatorAccountCountry &&
      profile.issuerRegion === context.issuerRegion &&
      profile.paymentMethodFamily === context.paymentMethodFamily &&
      profile.cardClass === context.cardClass &&
      profile.presentmentCurrency === context.presentmentCurrency &&
      profile.settlementCurrency === context.settlementCurrency &&
      profile.feeConfidence !== "UNKNOWN_OR_VARIABLE"
  );
}

export function calculateTax(retail: Money, taxBps: number, taxInclusive: boolean): Money {
  if (taxBps === 0) return money(0, retail.currency);
  if (!taxInclusive) return mulBpsRoundNearest(retail, taxBps);
  const tax = Math.floor((retail.amountMinor * taxBps) / (10000 + taxBps));
  return money(tax, retail.currency);
}

export function calculateProviderCost(retail: Money, rule: ProviderPricingRule, context: PaymentContext): Money {
  let total = add(mulBpsRoundUp(retail, rule.percentageBps), rule.fixedFee);
  total = add(total, rule.billingFee);
  if (!context.domestic) total = add(total, mulBpsRoundUp(retail, rule.crossBorderBps));
  if (context.fxRequired) total = add(total, mulBpsRoundUp(retail, rule.fxBps));
  return total;
}

export function modeledCreatorProceeds(retail: Money, rule: ProviderPricingRule, context: PaymentContext, taxBps: number, taxInclusive: boolean) {
  const tax = calculateTax(retail, taxBps, taxInclusive);
  const providerCost = calculateProviderCost(retail, rule, context);
  const platformFee = money(0, retail.currency);
  return {
    tax,
    providerCost,
    platformFee,
    proceeds: subtract(subtract(subtract(retail, tax), providerCost), platformFee)
  };
}

export function solveGuaranteedRetailPrice(args: {
  target: Money;
  context: PaymentContext;
  rules: ProviderPricingRule[];
  profiles: GuaranteeEligibilityProfile[];
  taxBps: number;
  taxInclusive: boolean;
  creatorId: string;
  tierId: string;
}): Quote {
  const route = findEligibleRoute(args.rules, args.profiles, args.context);
  if (!route) {
    if (!findRule(args.rules, args.context)) throw new Error("No current provider pricing rule for this payment context");
    throw new Error("Guaranteed Earnings is not eligible for this payment route");
  }
  const { rule, profile } = route;
  if (rule.feeConfidence === "UNKNOWN_OR_VARIABLE") throw new Error("Unknown provider fee cannot power Guaranteed Earnings");

  let low = args.target.amountMinor;
  let high = args.target.amountMinor * 3 + 1000;
  while (modeledCreatorProceeds(money(high, args.target.currency), rule, args.context, args.taxBps, args.taxInclusive).proceeds.amountMinor < args.target.amountMinor) {
    high *= 2;
  }
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const result = modeledCreatorProceeds(money(mid, args.target.currency), rule, args.context, args.taxBps, args.taxInclusive);
    if (result.proceeds.amountMinor >= args.target.amountMinor) high = mid;
    else low = mid + 1;
  }

  const retail = money(low, args.target.currency);
  const result = modeledCreatorProceeds(retail, rule, args.context, args.taxBps, args.taxInclusive);
  return {
    id: `quote_${args.tierId}_${args.context.issuerRegion}_${retail.amountMinor}`,
    creatorId: args.creatorId,
    tierId: args.tierId,
    target: args.target,
    retail,
    tax: result.tax,
    providerCost: result.providerCost,
    billingCost: rule.billingFee,
    fxCost: args.context.fxRequired ? mulBpsRoundUp(retail, rule.fxBps) : money(0, retail.currency),
    modeledCreatorProceeds: result.proceeds,
    platformFee: result.platformFee,
    pricingRuleVersion: rule.version,
    eligibilityProfileVersion: profile.version,
    paymentContext: args.context,
    expiresAt: "2026-09-02T00:00:00.000Z",
    status: "ACTIVE"
  };
}

export function reconcilePayment(quote: Quote, actualProviderFee: Money, providerRef: string): Reconciliation {
  const actualCreatorProceeds = subtract(subtract(subtract(quote.retail, quote.tax), actualProviderFee), quote.platformFee);
  const surplusMinor = Math.max(0, actualCreatorProceeds.amountMinor - quote.target.amountMinor);
  const shortfallMinor = Math.max(0, quote.target.amountMinor - actualCreatorProceeds.amountMinor);
  return {
    id: `recon_${quote.id}_${providerRef}`,
    quoteId: quote.id,
    target: quote.target,
    customerCharged: quote.retail,
    actualTax: quote.tax,
    actualProviderFee,
    zeroFeePlatformFee: quote.platformFee,
    actualCreatorProceeds,
    surplus: money(surplusMinor, quote.retail.currency),
    shortfall: money(shortfallMinor, quote.retail.currency),
    status: shortfallMinor > 0 ? "GUARANTEE_SHORTFALL" : surplusMinor > 0 ? "VERIFIED_WITH_SURPLUS" : "VERIFIED_TARGET_MET",
    providerTransactionReference: providerRef
  };
}
