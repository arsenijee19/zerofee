import { describe, expect, it } from "vitest";
import { money } from "@/lib/money";
import { demoContexts, eligibilityProfiles, pricingRules } from "@/lib/domain/seed";
import { modeledCreatorProceeds, reconcilePayment, solveGuaranteedRetailPrice } from "@/lib/domain/pricing";

describe("GuaranteePricingEngine", () => {
  it("solves the lowest eligible retail amount with minor-unit money", () => {
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
    expect(quote.modeledCreatorProceeds.amountMinor).toBeGreaterThanOrEqual(1000);
    const previous = modeledCreatorProceeds(money(quote.retail.amountMinor - 1, "EUR"), pricingRules[0], demoContexts.euConsumer, 1900, true);
    expect(previous.proceeds.amountMinor).toBeLessThan(1000);
    expect(quote.platformFee.amountMinor).toBe(0);
  });

  it("blocks unknown or unverified routes from Guaranteed Earnings", () => {
    expect(() =>
      solveGuaranteedRetailPrice({
        target: money(1000, "EUR"),
        context: demoContexts.unknownWallet,
        rules: pricingRules,
        profiles: eligibilityProfiles,
        taxBps: 0,
        taxInclusive: false,
        creatorId: "creator_nova",
        tierId: "tier_signal"
      })
    ).toThrow(/No current provider pricing rule/);
  });

  it("keeps creator surplus with the creator and creates shortfall incidents", () => {
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
    const surplus = reconcilePayment(quote, money(quote.providerCost.amountMinor - 50, "EUR"), "txn_surplus");
    expect(surplus.status).toBe("VERIFIED_WITH_SURPLUS");
    expect(surplus.surplus.amountMinor).toBe(50);
    expect(surplus.zeroFeePlatformFee.amountMinor).toBe(0);

    const shortfall = reconcilePayment(quote, money(quote.providerCost.amountMinor + 180, "EUR"), "txn_shortfall");
    expect(shortfall.status).toBe("GUARANTEE_SHORTFALL");
    expect(shortfall.shortfall.amountMinor).toBeGreaterThan(0);
  });

  it("covers a deterministic matrix and fuzzes target amounts", () => {
    const fixedTargets = [100, 199, 500, 1000, 1234, 5000, 9999, 25000];
    const fuzzTargets = Array.from({ length: 200 }, (_, index) => 50 + ((index * 7919) % 50000));
    for (const target of [...fixedTargets, ...fuzzTargets]) {
      for (const context of [demoContexts.euConsumer, demoContexts.usCommercialFx]) {
        const quote = solveGuaranteedRetailPrice({
          target: money(target, "EUR"),
          context,
          rules: pricingRules,
          profiles: eligibilityProfiles,
          taxBps: context.buyerTaxCountry === "DE" ? 1900 : 0,
          taxInclusive: context.buyerTaxCountry === "DE",
          creatorId: "creator_nova",
          tierId: "tier_signal"
        });
        const rule = pricingRules.find((item) => item.version === quote.pricingRuleVersion);
        if (!rule) throw new Error("missing rule for quote");
        const previous = modeledCreatorProceeds(money(quote.retail.amountMinor - 1, "EUR"), rule, context, context.buyerTaxCountry === "DE" ? 1900 : 0, context.buyerTaxCountry === "DE");
        expect(quote.modeledCreatorProceeds.amountMinor).toBeGreaterThanOrEqual(target);
        expect(previous.proceeds.amountMinor).toBeLessThan(target);
        expect(quote.retail.currency).toBe("EUR");
        expect(quote.platformFee.amountMinor).toBe(0);
      }
    }
  });
});
