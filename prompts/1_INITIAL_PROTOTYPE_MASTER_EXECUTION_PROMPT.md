# ZeroFee — Complete Initial Prototype Master Execution Prompt

**Prompt version:** 1.3  
**Status:** AUTHORITATIVE MASTER SPECIFICATION FOR THE COMPLETE INITIAL PROTOTYPE  
**Repository:** `arsenijee19/zerofee`

---

# 0. EXECUTION DIRECTIVE

START EXECUTION NOW.

Work directly from the CURRENT default branch of the `arsenijee19/zerofee` repository.

Read this file COMPLETELY before making architecture, payment, pricing, tax, UX, compliance, data-model or provider decisions.

Until the owner explicitly says otherwise, **Prompt 1 is the living master specification for the ENTIRE initial ZeroFee prototype**. Do not create Prompt 2 simply because this scope is large. If this file has changed since a previous implementation run, the newest version is authoritative and supersedes earlier assumptions.

The goal is a serious, functional, visually polished, technically coherent, end-to-end prototype of the complete core platform. This is not merely a landing page, checkout proof of concept, dashboard mockup or static prototype.

Do not:

- summarize this specification instead of executing it;
- stop after scaffolding;
- leave core buttons dead;
- fake successful KYC, payment, payout, tax or compliance states in live mode;
- invent Stripe/provider capabilities;
- hardcode one country's payment fee and pretend it applies globally;
- use one ambiguous `country` field for all payment logic;
- claim an earnings guarantee where the active payment route cannot mathematically support it;
- silently subsidize creator processing costs from ZeroFee SaaS revenue;
- silently keep any excess created by conservative payment-cost pricing;
- claim production readiness before external Stripe, legal, tax and guarantee-validation dependencies are actually satisfied;
- ask the owner questions that can safely be resolved from this specification, repository state, current official provider documentation or a reasonable reversible implementation decision.

Where live credentials, provider approvals or production capabilities are unavailable, implement deterministic mock/test providers behind the SAME domain interfaces required for production. The complete product must remain demonstrable and testable without live money movement, while the real Stripe integration boundary must be implemented as far as credentials and account configuration permit.

The implementation must preserve this economic identity:

> **ZeroFee is software, not a percentage tax on creator success. Creators choose what they want to earn. ZeroFee takes 0% of creator membership revenue and 0% platform markup on payouts. Real payment-provider costs are incorporated into buyer-facing economics. ZeroFee makes money from fixed SaaS subscriptions.**

---

# 1. PRODUCT THESIS

ZeroFee is a creator membership, subscription and community SaaS platform with a fundamentally different economic model from percentage-revenue creator platforms.

The central product concept is:

# Choose what you earn.

The creator does not begin by asking:

> “What should my fan pay, and how much will remain after platform and payment deductions?”

The creator begins by deciding:

> **“How much do I want to earn per successful member payment?”**

ZeroFee then determines whether that payment route is eligible for Guaranteed Earnings and, if it is, calculates the minimum buyer-facing retail price required to preserve at least that creator earnings target under the verified provider/tax model.

Conceptual example only:

- Creator Earnings Target: `€10.00`;
- eligible buyer context resolves to a retail price such as `€10.xx/month`;
- buyer sees and approves that final recurring price before payment;
- payment provider charges its real processing cost;
- ZeroFee membership transaction fee is `€0.00`;
- creator receives at least the guaranteed `€10.00` for that successful eligible non-refunded/non-disputed earnings event;
- if actual processing is cheaper than the amount conservatively allowed by the quote, the excess remains with the creator;
- ZeroFee never captures that excess as a hidden fee.

The exact retail examples in documentation/demo data are illustrative only. Never hardcode them as globally valid Stripe pricing.

The core positioning is not merely “Patreon but cheaper.”

Preferred positioning:

> **The membership platform that doesn't tax your success.**

> **Set what you earn.**

> **What you earn is yours.**

> **Don't trust us. Verify it.**

---

# 2. TARGET CUSTOMER

Primary acquisition target:

- established YouTubers;
- podcasters;
- newsletter writers;
- educators;
- developers/open-source creators;
- gaming communities;
- Discord/Telegram communities;
- analysts/research creators;
- professional niche communities;
- permitted coaches/experts;
- creators already using Patreon-like membership platforms;
- creators earning hundreds, thousands, tens of thousands or more per month from recurring audience revenue.

ZeroFee may be usable by small creators, but the strongest value proposition begins when percentage platform fees materially exceed a predictable SaaS subscription.

---

# 3. NON-NEGOTIABLE ECONOMIC INVARIANTS

These are hard product invariants and must be enforced in domain logic, not only marketing copy.

1. `creator_membership_gmv != zerofee_saas_revenue`.
2. `zerofee_membership_platform_fee_bps = 0`.
3. `zerofee_membership_application_fee = 0`.
4. `zerofee_processing_markup = 0`.
5. `zerofee_payout_markup = 0`.
6. ZeroFee earns money from fixed/configurable creator SaaS plans.
7. ZeroFee does not subsidize variable creator processing from SaaS revenue in the initial product.
8. Creator payment funds should live on the creator connected payment account, not in a ZeroFee custodial wallet.
9. Guaranteed Earnings is enabled only for verified eligible payment routes.
10. A buyer must approve the final recurring retail price before charge.
11. Real provider financial data is reconciled after charge.
12. `actual_creator_earnings < creator_earnings_target` is a guarantee breach.
13. `actual_creator_earnings > creator_earnings_target` is NOT ZeroFee revenue. The surplus belongs to the creator.
14. The pricing engine must minimize unnecessary buyer overpayment while never intentionally targeting a creator shortfall.
15. Refunds/disputes can reverse previously earned amounts.
16. Creator Earnings, provider balance and bank payout are separate concepts.
17. Provider/bank payout costs do not retroactively redefine historical Creator Earnings.
18. Tax is not a ZeroFee platform fee.
19. SaaS plan upgrades are based on product/resource usage, not GMV percentage.
20. Creator data must be portable.
21. Exact Stripe fees/capabilities/responsibility are provider/account facts, never assumptions.

Do not implement Stripe `application_fee` on creator membership sales unless the owner later explicitly changes this economic model.

---

# 4. PRECISE FINANCIAL DEFINITIONS

Use these terms consistently in DB, code, UI, docs and analytics.

## 4.1 Creator Earnings Target

The amount the creator chooses as the guaranteed minimum economic proceeds for one successful eligible membership payment.

Example:

`€10.00 per successful monthly membership payment`

This is the primary input in Guaranteed Earnings mode.

## 4.2 Customer Retail Price

The final recurring selling price shown to and approved by the buyer for the resolved payment context, with tax presentation according to the configured legal/tax model.

Processing economics are already accounted for in this price. It is not displayed as a late ZeroFee surcharge.

## 4.3 Creator-Borne Provider Cost

A real provider cost that actually reduces the creator connected account's economic proceeds for the specific charge, such as an applicable payment-processing fee or other connected-account-borne provider component.

Do not gross up costs that are actually paid by ZeroFee at the platform level unless the commercial model explicitly says they must be passed through.

## 4.4 ZeroFee Transaction Fee

Always `0` for creator membership charges in Prompt 1.

## 4.5 Creator Earnings

For a successful Guaranteed Earnings payment, Creator Earnings are the actual creator economic proceeds attributable to that membership payment after creator-borne payment-provider costs and applicable indirect-tax treatment, but before later payout/bank costs and before creator income/corporate taxes.

## 4.6 Surplus Earnings

If the buyer retail price was conservatively calculated and the actual provider cost is lower than the permitted upper bound, creator proceeds can exceed the target.

Example:

- buyer pays `€12.00`;
- actual creator-borne processing/tax deductions attributable to the calculation total `€1.50`;
- creator proceeds are `€10.50`;
- creator target was `€10.00`;
- ZeroFee fee is `€0.00`;
- creator keeps `€10.50`;
- `€0.50` is `Surplus Earnings`, not ZeroFee revenue.

The system must NEVER transfer or classify this surplus as a ZeroFee application fee, platform fee or hidden spread.

## 4.7 Provider Account Balance

The creator's actual connected-account balance as reported by Stripe/provider.

It can differ from lifetime Creator Earnings because of pending funds, prior payouts, refunds, disputes, reserves, tax movements and other provider adjustments.

## 4.8 Payout

Movement of funds already present on the creator connected account to the creator's external payout destination.

Payout is not a new earning event.

## 4.9 Amount Sent vs Amount Landed

ZeroFee may show the amount instructed/sent by the provider when known.

Do not claim the exact bank-landed amount if downstream intermediary/receiving-bank fees are not visible.

---

# 5. TWO CREATOR PRICING MODES

## 5.1 Guaranteed Earnings — default/recommended where eligible

Creator chooses what they want to earn.

Example:

`I want to earn €10.00 per successful member payment.`

ZeroFee resolves the buyer/payment context and calculates the buyer retail price required to guarantee **at least** that amount under a verified deterministic or verified upper-bound provider-cost rule.

The guarantee is a minimum, not a cap:

`actual_creator_earnings >= creator_earnings_target`

for a successful eligible payment before later refund/dispute reversal.

If actual creator earnings exceed the target because real processing is cheaper than the conservative quote assumption, the entire surplus remains with the creator.

## 5.2 Simple Price

Creator chooses the exact buyer-facing recurring amount.

Provider costs then reduce creator proceeds according to actual provider rules.

No Creator Earnings guarantee applies.

UI must clearly distinguish:

- `Guaranteed Earnings — choose what you earn`;
- `Simple Price — choose what the member pays`.

---

# 6. GUARANTEE SCOPE

A Guaranteed Earnings promise applies only when all of these are true:

- payment route is explicitly Guarantee Eligible;
- payment is successfully captured/settled according to provider semantics;
- buyer approved the specific quote/recurring amount;
- provider/tax context matches the accepted quote contract;
- transaction is not subsequently refunded;
- transaction is not subsequently charged back/reversed;
- target is measured before later creator-selected payout/bank/FX costs;
- target excludes creator income/corporate tax;
- indirect tax treatment is included correctly in the quote model;
- fee/tax rule versions used by the quote were valid at acceptance.

The guarantee does not mean:

- every payment method is supported;
- every country is supported;
- refunds do not reverse earnings;
- disputes do not reverse earnings;
- reserves cannot affect payout availability;
- creator bank fees disappear;
- ZeroFee insures fraud;
- lifetime earnings always equal currently withdrawable provider balance.

Prefer supporting fewer routes over making a false guarantee.

---

# 7. COUNTRY IS NOT ONE FIELD — PAYMENT CONTEXT MODEL

This is a critical implementation requirement.

Do NOT create one generic `country` variable and use it for all calculations.

The calculation system must distinguish at least:

1. **Platform legal/account country** — e.g. the ZeroFee operating Stripe platform may be a US entity/account.
2. **Creator connected-account country** — determines connected-account capabilities, settlement behavior and often the applicable local Stripe pricing schedule for direct charges when Stripe collects fees from the connected account.
3. **Creator business/individual tax residence/country** — compliance/tax dimension; may or may not equal payout bank country.
4. **Buyer billing/tax country** — used for indirect-tax determination.
5. **Payment-method/card issuer country** — used for domestic/cross-border processing classification where relevant.
6. **Buyer IP/location signal** — may be relevant for fraud/tax evidence but must never be treated as authoritative card issuer country.
7. **Payout bank country** — payout capability/cost dimension; not membership processing country.
8. **Presentment currency** — what buyer is charged.
9. **Creator target/ledger currency** — currency in which Creator Earnings Target is defined.
10. **Settlement currency** — currency in which the connected account settles.

Never assume the ZeroFee platform's US pricing applies to every creator merely because the platform company/account is in the USA.

For direct charges where Stripe collects payment fees from the connected account, resolve economics from the actual connected-account pricing/responsibility context.

---

# 8. PROVIDER PRICING CATALOG — SOURCE OF TRUTH

Implement a versioned `ProviderPricingCatalog` rather than scattered constants.

The catalog must support provider/account-specific fee rules and provenance.

Required rule dimensions where applicable:

- provider;
- connected-account country;
- provider account/pricing-plan identifier where available;
- fee payer: `CONNECTED_ACCOUNT`, `PLATFORM`, `OTHER`;
- payment method family;
- card network/brand where relevant;
- card funding/category where provider pricing differentiates it;
- standard/premium/commercial classification where provider exposes/uses it;
- issuer country;
- issuer region group;
- domestic/cross-border classification;
- presentment currency;
- settlement currency;
- FX required boolean;
- recurring Billing product fee if creator-borne;
- other creator-borne Stripe product fees if truly charged per transaction;
- percentage fee component;
- fixed fee component;
- additional percentage/fixed components;
- minimum fee;
- maximum/capped fee;
- tiered rule support;
- provider-specific rounding rule;
- effective start/end;
- status;
- source/provenance.

Provenance fields:

- `source_type`: `PROVIDER_CONTRACT`, `PROVIDER_ACCOUNT_PRICING`, `OFFICIAL_PUBLIC_PRICING`, `MANUAL_VERIFIED`, `TEST_FIXTURE`;
- official source/reference URL or internal contract reference;
- `verified_at`;
- `verified_by`;
- `effective_from`;
- `expires_at` or mandatory re-verification date;
- evidence notes;
- production approval state.

Do not scrape a public pricing page on every checkout.

Do not silently auto-promote newly scraped/public pricing into production guarantee rules.

A human/admin approval or provider-authoritative configuration sync must activate production pricing rule versions.

If a pricing rule is stale, expired, conflicting or cannot be verified, Guaranteed Earnings for the affected route must fail closed.

---

# 9. GUARANTEE ELIGIBILITY PROFILE

Create versioned `GuaranteeEligibilityProfile` records that connect provider pricing rules to actual supported transaction contexts.

Fields must include at minimum:

- provider;
- connected-account country;
- buyer/issuer region class;
- allowed issuer countries/region group;
- payment method family;
- required card/category metadata if applicable;
- presentment currency;
- settlement currency;
- target earnings currency;
- FX policy;
- tax compatibility;
- provider pricing rule version;
- deterministic-fee confidence;
- production-tested state;
- owner approval;
- effective dates;
- last real reconciliation date;
- status;
- evidence/reference.

Guarantee strategy enum:

- `EXACT_FORMULA` — provider cost can be deterministically calculated from context known before charge;
- `VERIFIED_UPPER_BOUND` — exact fee may vary but a contractually/operationally verified maximum cost for the allowed route is known before charge;
- `TEST_ONLY`;
- `DISABLED`;
- `PAUSED`.

## 9.1 EXACT_FORMULA

Use the exact verified provider fee formula.

Goal: quote the smallest buyer retail amount that leaves creator proceeds at or just above target after provider rounding.

A one-minor-unit surplus caused by rounding belongs to creator.

## 9.2 VERIFIED_UPPER_BOUND

Use only when the route has a genuinely verified maximum provider cost within the allowed classification.

Calculate retail price using the verified upper bound.

If actual fee is cheaper, surplus goes 100% to creator.

This is permitted because the guarantee is a minimum.

Do not use a guessed “safety buffer” and call it guaranteed.

An upper bound must have evidence and a bounded eligible route.

## 9.3 No verified bound

If cost can vary in an unknown/unbounded way before charge:

- Guaranteed Earnings is not available for that route;
- offer another eligible payment method, another currency or Simple Price;
- never estimate and label it guaranteed.

---

# 10. PAYMENT CONTEXT RESOLUTION

The quote engine needs trustworthy payment context before guaranteeing a price.

Use current secure Stripe/provider mechanisms to collect payment method information without ZeroFee touching raw PAN/CVC.

Where provider APIs expose safe metadata, resolve only what is required, such as:

- payment method type;
- card issuer country;
- brand/network;
- funding/category;
- wallet type/underlying card classification where relevant;
- billing address/country for tax;
- supported currency;
- connected-account context.

Never store raw card number or CVC.

Do not use IP geolocation as a substitute for issuer country.

Do not use a homemade BIN database as the sole guarantee authority when provider metadata is available.

If the provider cannot reveal enough context before charge to select a verified pricing rule, that route cannot be Guaranteed Earnings unless a verified upper-bound strategy covers the uncertainty.

---

# 11. GUARANTEE PRICING ENGINE — EXACT INTEGER ALGORITHM

Implement a dedicated server-side `GuaranteePricingEngine`.

Financial correctness is more important than a clever closed-form formula.

Never use binary floating-point money arithmetic.

Use:

- integer minor units;
- exact decimal/rational rate representation;
- explicit ISO currency metadata;
- provider-specific rounding;
- immutable rule/quote snapshots.

## 11.1 Creator proceeds function

For each candidate buyer retail amount, calculate modeled creator proceeds from the exact active context.

Conceptually:

`creator_proceeds(gross) = gross - indirect_tax_creator_liability - creator_borne_provider_costs - creator_borne_fx_costs`

Only subtract costs that actually reduce the creator's proceeds under the configured payment responsibility model.

Do NOT subtract ZeroFee SaaS subscription from an individual fan payment.

Do NOT include platform-level ZeroFee infrastructure cost as creator transaction deduction.

## 11.2 Do not rely only on a closed-form percentage formula

A simple profile may mathematically resemble:

`gross = (target + fixed_fee) / (1 - percentage_fee)`

but the production algorithm must support:

- multiple fee components;
- caps/minimums;
- provider rounding;
- tax-inclusive pricing;
- fee-on-tax behavior;
- FX components;
- currency minor-unit constraints;
- price endings/rounding policy;
- future tiered fee formulas.

Therefore implement a provider-rule evaluation function plus an integer solver.

## 11.3 Minimal-safe-price solver

For Guaranteed Earnings, find the **smallest valid customer retail price in currency minor units** such that:

`modeled_creator_proceeds >= creator_earnings_target`

Use a deterministic monotonic search/binary search or another proven integer algorithm.

Invariant:

`modeled_creator_proceeds(quoted_price) >= target`

Minimality test:

for the previous allowed price step/minor unit, either:

`modeled_creator_proceeds(previous_price) < target`

or the previous price is invalid because of explicit configured retail price-step/psychological rounding policy.

This minimizes unnecessary buyer overpayment while preserving the guarantee.

## 11.4 Surplus handling

Post-charge:

- if actual proceeds == target → perfect match;
- if actual proceeds > target → creator keeps full surplus;
- if actual proceeds < target → guarantee breach.

Never skim surplus.

Never classify surplus as ZeroFee revenue.

Track surplus because persistent large surplus means the pricing profile may be too conservative and should be optimized for buyer fairness.

## 11.5 Optional retail-price psychology

Creator may choose an approved retail rounding/display policy such as a `.99` ending only if the final result still satisfies the minimum earnings guarantee.

If psychological rounding increases price, that extra amount also remains creator proceeds after real provider costs.

The UI must clearly show creator:

- target earnings;
- calculated minimum safe retail;
- optional chosen public retail;
- modeled minimum creator proceeds;
- expected possible surplus behavior.

Do not automatically raise to attractive endings without creator knowledge.

---

# 12. MULTI-CURRENCY AND FX POLICY

FX is one of the easiest ways to break a guarantee.

Initial safe default:

- prefer Guaranteed Earnings where presentment currency, target currency and settlement currency are the same;
- allow cross-currency Guaranteed Earnings only when provider FX cost and rate behavior can be locked or conservatively bounded before buyer confirmation;
- otherwise disable guarantee and use Simple Price/alternative currency.

Model separately:

- buyer presentment currency;
- creator target currency;
- connected-account settlement currency;
- conversion direction;
- FX provider markup/cost;
- rate/quote expiry;
- who bears FX cost.

Never use a stale generic exchange rate to promise exact creator earnings.

---

# 13. TAX + GUARANTEED EARNINGS

Tax is first-class and separate from payment processing.

Implement `TaxProvider = mock | stripe_tax | disabled` or equivalent provider abstraction.

Creator Earnings Target is creator economic proceeds before creator income/corporate tax. Indirect VAT/GST/sales tax collected for authorities is not creator earnings.

The quote model must know:

- creator/seller jurisdiction;
- buyer tax location/evidence;
- product tax code/category;
- registration state;
- tax-inclusive vs tax-exclusive presentation;
- tax amount;
- whether processor fees apply to tax-inclusive total;
- collection/remittance responsibility;
- receipt/invoice behavior.

For tax-inclusive required pricing, solve the gross buyer price so that after tax liability and creator-borne processing the creator still receives at least the earnings target.

If tax cannot be determined before final confirmation for a guaranteed route, guarantee must fail closed until the required tax context is known.

Do not build homemade global tax law.

Create creator Tax Center and admin tax/merchant configuration.

---

# 14. QUOTE LIFECYCLE

Create immutable `MembershipPriceQuote` records.

Required fields:

- quote ID;
- creator/tier/price version;
- buyer/session/user;
- Creator Earnings Target;
- minimum safe retail price;
- selected customer retail price;
- presentment currency;
- target currency;
- settlement currency;
- tax snapshot;
- payment context classification/fingerprint without raw card data;
- connected-account country;
- issuer country/region classification;
- payment method family;
- ProviderPricingCatalog rule versions;
- GuaranteeEligibilityProfile version;
- calculation trace/hash;
- created/expires timestamps;
- accepted timestamp;
- status;
- provider references;
- final reconciliation link.

Quote states:

- `CONTEXT_REQUIRED`;
- `CALCULATED`;
- `INELIGIBLE`;
- `EXPIRED`;
- `ACCEPTED`;
- `PAYMENT_PENDING`;
- `PAID`;
- `RECONCILED`;
- `INVALIDATED`.

If buyer changes payment method, relevant address, currency or any fee-determining context before payment:

- invalidate the old quote;
- recalculate server-side;
- show new final recurring price;
- require explicit confirmation again.

Never trust a client-submitted retail amount or guarantee flag.

---

# 15. BUYER CHECKOUT — TWO-STAGE CONTEXT THEN CONFIRMATION

If final price depends on payment method/region, use a two-stage secure checkout flow.

Conceptual flow:

1. buyer chooses creator tier;
2. buyer signs in/registers;
3. provider component securely collects payment method and billing context;
4. server obtains safe provider metadata required for classification;
5. server resolves tax;
6. server resolves ProviderPricingCatalog rule;
7. server resolves GuaranteeEligibilityProfile;
8. GuaranteePricingEngine calculates minimum safe retail price;
9. quote is persisted/versioned;
10. buyer sees the final recurring price and tax treatment;
11. buyer explicitly confirms;
12. server creates/confirms provider subscription/payment using the accepted quote;
13. webhook/provider event, not browser redirect, activates membership;
14. actual provider financial data is reconciled after processing.

Public tier page before full context may show:

- a context-resolved final amount when genuinely known;
- a truthful `from €X/month` when mathematically justified;
- or `Your final recurring price is confirmed before payment based on payment method, region and taxes.`

Do not advertise one universal price if the same tier intentionally has context-dependent retail prices.

Do not add a surprise `ZeroFee fee` at final checkout.

---

# 16. GUARANTEE RECONCILIATION ENGINE

Every successful Guaranteed Earnings charge must reconcile against authoritative provider financial data.

For Stripe direct charges, query the relevant objects in the connected-account scope and retrieve authoritative balance transaction/fee data when available.

Store:

- quote and guarantee contract IDs;
- target creator earnings;
- actual gross charged;
- actual tax;
- actual creator-borne provider fee;
- actual provider net/balance transaction data;
- ZeroFee transaction fee = 0;
- actual creator earnings;
- surplus amount;
- shortfall amount;
- provider transaction IDs;
- rule/profile versions;
- reconciliation timestamp;
- status.

Statuses:

- `PENDING_PROVIDER_DATA`;
- `VERIFIED_AT_TARGET`;
- `VERIFIED_SURPLUS`;
- `SHORTFALL`;
- `REFUNDED`;
- `DISPUTED`;
- `REVERSED`;
- `MANUAL_REVIEW`.

Rules:

### VERIFIED_AT_TARGET

`actual_creator_earnings == creator_earnings_target`

### VERIFIED_SURPLUS

`actual_creator_earnings > creator_earnings_target`

This is valid. Creator keeps the surplus.

Track surplus rate/amount for buyer-price optimization.

### SHORTFALL

`actual_creator_earnings < creator_earnings_target`

This is a hard financial correctness incident.

On SHORTFALL:

- alert admin immediately;
- preserve evidence;
- do not hide/round away the difference;
- do not automatically charge the buyer extra after the fact;
- do not silently deduct from creator elsewhere;
- do not silently pay from ZeroFee SaaS revenue;
- pause affected GuaranteeEligibilityProfile automatically according to configured zero-tolerance policy;
- require investigation and new verified pricing rule before resuming.

Create `/admin/guarantee-health`.

---

# 17. GUARANTEE HEALTH / ACCURACY TELEMETRY

This is a financial control system, not ordinary analytics.

For each active pricing/eligibility profile track:

- payment count;
- target earnings total;
- actual earnings total;
- exact-match count/rate;
- surplus count/rate;
- average surplus;
- maximum surplus;
- surplus basis points of retail;
- shortfall count/rate;
- maximum shortfall;
- prediction vs actual provider fee error;
- last successful reconciliation;
- last shortfall;
- last provider pricing verification;
- rule expiry;
- connected-account-country breakdown;
- issuer-country/region breakdown;
- payment-method breakdown;
- currency breakdown.

Shortfall tolerance for Guaranteed Earnings is zero minor units unless a currency/provider technical reason is explicitly documented and legally/commercially approved. Do not invent a hidden tolerance.

Persistent large surplus is not theft because creator receives it, but it is a pricing-quality warning because buyers may be overpaying. Surface it for optimization.

---

# 18. PRICING RULE CHANGE CONTROL

Financial rules require controlled deployment.

No production pricing rule can be edited in place.

Use versioning:

`DRAFT → VERIFIED_TEST → APPROVED → ACTIVE → SUPERSEDED/PAUSED/EXPIRED`

Required before ACTIVE:

- source/provenance present;
- effective dates known;
- calculation tests pass;
- creator country/payment route capability valid;
- tax compatibility known;
- owner/admin approval;
- no unresolved conflicting rule.

Changing a fee rule creates a new version.

Historical quotes/contracts continue referencing old immutable versions.

Do not automatically activate a new provider pricing rule solely because a web page changed.

---

# 19. CALCULATION TESTING — EXTREME RIGOR REQUIRED

The algorithm is one of the most important assets in ZeroFee.

## 19.1 Golden fixtures

For each production-intended rule create verified test fixtures derived from provider contract/account pricing/official documentation.

Fixture includes:

- connected account country;
- payment method;
- issuer country/region;
- card/category where relevant;
- currencies;
- tax setup;
- target;
- expected provider fee model;
- expected minimum-safe retail;
- expected modeled creator proceeds.

## 19.2 Property-based/fuzz tests

For every active guarantee rule, generate large sets of target amounts across supported ranges.

Verify:

- calculated retail is valid currency minor units;
- modeled creator proceeds are never below target;
- previous valid price step fails target unless explicit retail rounding policy explains the difference;
- no overflow;
- no negative values;
- rate caps/minimums behave correctly;
- zero-decimal currencies behave correctly if supported;
- extreme but permitted amounts behave correctly.

## 19.3 Cross-product matrix tests

Test relevant combinations of:

- creator country;
- issuer country/region;
- payment method;
- card class;
- presentment currency;
- settlement currency;
- tax mode;
- billing interval;
- fee-profile version.

Do not manually test only one US Visa example and call the engine complete.

## 19.4 Reconciliation tests

Mock provider must support:

- exact fee;
- cheaper-than-upper-bound fee resulting in creator surplus;
- unexpected higher fee resulting in shortfall;
- tax difference;
- FX difference;
- fee schedule changed;
- issuer region changed;
- card category changed;
- payment method changed.

## 19.5 Beta shadow validation

Before enabling live Guaranteed Earnings publicly:

- run Stripe test-mode scenarios;
- run closed-beta live transactions only after approvals;
- compare predicted vs actual provider fees;
- require zero shortfalls across the approved validation sample;
- investigate all material surplus patterns;
- only then enable `GUARANTEED_EARNINGS_LIVE_ALLOWED` for specific profiles.

Do not globally enable guarantee based on one successful transaction.

---

# 20. RENEWALS / PAYMENT-METHOD CHANGES / FEE CHANGES

A recurring guarantee must survive renewals.

Each Guaranteed membership has immutable/versioned `GuaranteedMembershipContract` containing:

- Creator Earnings Target;
- accepted buyer retail price;
- currencies;
- resolved payment-route class;
- GuaranteeEligibilityProfile version;
- pricing-rule version;
- tax model version;
- effective date;
- buyer consent/acceptance reference.

Before future renewal where possible:

- validate the current payment method context;
- validate current pricing rule/country capability;
- validate tax context;
- determine whether existing retail price still guarantees target.

If yes → renew and reconcile.

If provider costs increased or route changed so current retail is unsafe:

- do not silently underpay creator;
- do not silently increase buyer's recurring price;
- set `REPRICE_REQUIRED`;
- calculate new retail;
- notify creator;
- follow legally/provider-valid buyer notice/consent process;
- only apply new price when permitted;
- otherwise pause/cancel future renewal according to policy.

If a card network updater or payment-method replacement changes issuer/category in a way that cannot be reliably pre-evaluated, that route requires a verified upper-bound strategy or must not remain Guaranteed Earnings.

---

# 21. STRIPE CONNECT — PREFERRED PAYMENT ARCHITECTURE

Use current official Stripe documentation at implementation time.

Preferred production architecture, subject to Stripe approval/configuration:

- ZeroFee is operated by the platform legal entity/account;
- creators receive their own connected accounts through ZeroFee onboarding;
- direct charges are created on creator connected accounts;
- Stripe collects direct-charge payment fees from connected accounts where configured/approved;
- Stripe/provider owns connected-account losses where configured/approved;
- ZeroFee membership application fee is zero;
- creator has independent provider visibility;
- ZeroFee provides primary embedded UX.

Important: the platform company being US-based does not make every creator charge a US domestic charge. Resolve fees/capabilities from actual Connect configuration and connected-account payment context.

## 21.1 Embedded onboarding

Creator should not be forced to manually create a Stripe account at stripe.com first.

Flow:

1. ZeroFee application;
2. ZeroFee content/business review;
3. approved → `Set up payouts`;
4. ZeroFee creates/retrieves connected account server-side;
5. prefill legally permitted data;
6. Stripe embedded onboarding collects KYC/bank/agreement requirements;
7. creator personally performs required verification/consent;
8. ZeroFee syncs capabilities;
9. sales enabled only when ZeroFee + provider requirements are satisfied.

Do not store raw KYC documents if Stripe can collect them directly.

## 21.2 Creator independent verification

Normal UX remains inside ZeroFee, but where supported provide:

`Verify in Stripe` / `Open Stripe Dashboard`

Creator should be able to independently inspect provider truth.

## 21.3 Provider capability registry

Admin-visible capabilities at minimum:

- `CONTENT_PLATFORM_APPROVAL_CONFIRMED`;
- `DIRECT_CHARGES_ENABLED`;
- `STRIPE_FEES_COLLECTED_FROM_CONNECTED_ACCOUNT`;
- `STRIPE_MANAGED_LOSS_LIABILITY_CONFIRMED`;
- `FULL_STRIPE_DASHBOARD_AVAILABLE`;
- `EMBEDDED_ONBOARDING_AVAILABLE`;
- `EMBEDDED_PAYMENTS_AVAILABLE`;
- `EMBEDDED_PAYOUTS_AVAILABLE`;
- `STRIPE_TAX_ENABLED`;
- `GUARANTEED_EARNINGS_LIVE_ALLOWED`;
- `LIVE_CHARGES_ALLOWED`.

Mock/test flags visibly labeled.

---

# 22. PAYOUT SYSTEM

Payout is first-class but financially separate from Creator Earnings.

Use embedded/provider payout capabilities where available.

Support provider-permitted:

- automatic scheduled payouts;
- manual standard payout;
- instant payout.

Creator payout view:

- pending balance;
- available balance;
- next scheduled payout;
- payout destination summary;
- provider restrictions;
- recent payouts;
- provider payout fee if known;
- ZeroFee payout fee = `0`;
- amount sent;
- `Verify in Stripe`.

If provider fee is not known before initiation, show an honest estimate/unknown state and update with provider truth afterward.

If downstream bank fee is unobservable, say that amount sent is known but bank-landed amount may differ.

Payout cost never rewrites historical Creator Earnings.

---

# 23. ZERO FEE SAAS PLANS / UNIT ECONOMICS

ZeroFee monetizes software, not creator GMV.

Build configurable SaaS plans.

Seed DEMO plans such as:

| Plan | Demo monthly price | Example active-member allowance |
|---|---:|---:|
| Starter | $19 | 100 |
| Creator | $49 | 1,000 |
| Pro | $99 | 5,000 |
| Business | $199 | 25,000 |

These are prototypes, not final pricing.

Plans can differ by:

- active member count;
- storage;
- bandwidth/resource allowance;
- email quota;
- API quota;
- analytics retention;
- team seats;
- integrations;
- custom domain;
- automation;
- support level.

Never price the plan as a percentage of creator revenue.

Create separate `PlatformBillingProvider` from `CreatorPaymentsProvider`.

Platform subscription states:

- NONE;
- TRIALING;
- ACTIVE;
- PAST_DUE;
- GRACE;
- SUSPENDED;
- CANCEL_AT_PERIOD_END;
- CANCELLED.

Keep creator data after billing lapse; enforce clear grace/suspension policy.

Create `docs/UNIT_ECONOMICS.md`.

---

# 24. COUNTRY / MARKET CAPABILITY REGISTRY

Implement `CountryCapabilityRegistry`.

For every creator market store:

- creator onboarding enabled;
- individual supported;
- company supported;
- charges enabled;
- payouts enabled;
- dashboard type availability;
- supported presentment currencies;
- supported settlement currencies;
- payment methods;
- guarantee eligible routes;
- tax readiness;
- terms/legal readiness;
- Stripe/provider approval state;
- manual review requirement;
- launch state `UNSUPPORTED | WAITLIST | BETA | AVAILABLE | PAUSED`;
- evidence/reference date.

Do not hardcode country support from memory.

Provider docs/account configuration is authoritative.

Creator registration:

1. select country;
2. registry resolves status;
3. AVAILABLE/BETA → continue;
4. WAITLIST → capture interest, no fake payment onboarding;
5. UNSUPPORTED → explain and stop.

Create `docs/COUNTRY_AND_CURRENCY_STRATEGY.md`.

---

# 25. MERCHANT / SELLER / TAX RESPONSIBILITY

Intended model: creator-side sales, not ZeroFee Merchant of Record for creator content.

Exact legal/merchant/tax treatment depends on jurisdiction/provider configuration.

Create versioned `CommerceResponsibilityProfile` containing:

- intended seller;
- provider;
- merchant-of-record status;
- jurisdiction scope;
- tax calculation provider;
- tax collection responsibility;
- tax remittance responsibility;
- receipt/invoice issuer;
- statement descriptor policy;
- legal review state;
- effective dates.

Do not infer legal status from marketing copy.

Create `docs/MERCHANT_AND_TAX_RESPONSIBILITY.md` and `docs/TAX_ARCHITECTURE.md`.

---

# 26. CREATOR APPLICATION / PRE-SCREENING / KYC

ZeroFee content/business review and Stripe KYC are separate.

Creator application collects only necessary information:

- display name;
- individual/business;
- country;
- category;
- detailed paid offering;
- examples of paid benefits/content;
- website/social links;
- audience range;
- expected membership revenue range;
- content formats;
- community integrations;
- ownership/rights confirmation;
- Acceptable Use;
- Creator Terms;
- prohibited-content acknowledgement.

Application states:

- DRAFT;
- SUBMITTED;
- UNDER_REVIEW;
- NEEDS_INFORMATION;
- APPROVED_FOR_PAYOUT_ONBOARDING;
- REJECTED;
- SUSPENDED_POST_APPROVAL.

Admin can approve/reject/request info/suspend/add private notes with immutable history and audit.

Creator cannot self-approve.

---

# 27. CONTENT PLATFORM APPROVAL / SAFETY / LEGAL

Treat Stripe content-platform approval as a launch dependency.

ZeroFee's Stripe-based product is not an adult-content payment workaround.

Conservative prohibited categories include:

- illegal goods/services;
- provider-prohibited pornography/sexual services;
- exploitation/CSAM/non-consensual content;
- terrorism/extremist prohibited activity;
- illegal weapons/drugs;
- stolen goods;
- scams/fraud/pyramids;
- disguised money transmission;
- phishing/malware/credential theft;
- piracy/IP infringement;
- doxxing/private-data sale;
- impersonation;
- any current provider-prohibited category.

Implement:

- acceptable use;
- creator terms;
- terms/privacy;
- content/creator/copyright/fraud reports;
- moderation queue;
- takedown;
- suspension;
- creator notice;
- appeal;
- evidence/history/audit.

Architect DSA/copyright notice-and-action readiness but do not claim legal compliance without professional review.

Create `docs/STRIPE_APPROVAL_READINESS.md` and `docs/LEGAL_AND_COMPLIANCE_OPEN_ITEMS.md`.

---

# 28. USER ROLES / AUTH / SECURITY

Roles:

- Visitor;
- Member/Fan;
- Creator;
- Admin/Owner.

RBAC is server-enforced. Hiding UI is not authorization.

Implement real auth with secure password hashing, sessions/cookies, reset, email verification/mock email, rate limits, safe errors and CSRF-appropriate framework protections.

Security review/tests must include:

- IDOR;
- role escalation;
- cross-creator access;
- XSS/rich text;
- SQL/raw-query injection;
- SSRF;
- unsafe redirects;
- upload MIME/size/path abuse;
- webhook spoof/replay;
- quote tampering;
- retail-price tampering;
- target tampering;
- guarantee-profile bypass;
- stale/expired quote reuse;
- payout wrong-account attack;
- API-key abuse;
- OAuth token handling;
- KYC/private-data leakage;
- race conditions.

Create `docs/SECURITY.md`.

---

# 29. CREATOR PROFILE / TIERS / CONTENT

Creator profile:

- display name;
- slug;
- avatar/banner;
- bio/about;
- social links;
- category;
- constrained theme;
- featured tier/posts;
- support preference.

Tier:

- name;
- benefits;
- draft/published/archived;
- monthly/annual;
- currency;
- pricing mode;
- Creator Earnings Target when guaranteed;
- price/contract versions;
- guarantee eligible methods/constraints;
- trial/coupon eligibility;
- grandfathering.

Content:

- posts;
- safe downloads;
- public/all-paid/selected-tier visibility;
- draft/published/archived;
- comments/moderation/reporting;
- storage abstraction/quotas.

Do not build proprietary large-scale video transcoding/CDN in Prompt 1. Support safe external video/embed/provider abstraction.

Never publicly/offline-cache private paid content.

---

# 30. SUBSCRIPTION LIFECYCLE / DUNNING / CHANGES

Membership states:

- PENDING_QUOTE;
- QUOTE_ACCEPTED;
- PENDING_PAYMENT;
- TRIALING;
- ACTIVE;
- PAST_DUE;
- GRACE;
- REPRICE_REQUIRED;
- PAUSED where supported;
- CANCEL_AT_PERIOD_END;
- CANCELLED;
- EXPIRED;
- REVOKED;
- REFUNDED.

Member can:

- subscribe;
- see final quote;
- update payment method;
- confirm repricing;
- cancel/resume;
- switch tier;
- monthly/annual switch;
- view receipts/history;
- request support/refund;
- rejoin.

Implement provider-driven failed-payment recovery:

failed renewal → PAST_DUE → notification → update payment → provider retries → recovered or expired.

Track recovery rate/involuntary churn.

Do not invent retry logic where Stripe owns it.

Price/tier changes must have explicit effective date/proration/consent and preserve grandfathered history.

---

# 31. COUPONS / TRIALS

Support coupons:

- code;
- percent/fixed;
- tiers;
- intervals;
- duration;
- dates;
- redemption limit;
- per-user limit;
- state.

Trials:

- duration;
- eligible tiers;
- anti-abuse;
- payment-method requirement configurable;
- ending notification;
- conversion analytics.

Guaranteed tiers must explicitly define who funds a discount.

Never silently make ZeroFee fund it.

If creator discount reduces creator earnings during promo, show it clearly. If creator wants target preserved, GuaranteePricingEngine must calculate a retail promotion that still preserves target and is legally/provider-valid.

---

# 32. WEBHOOKS / PROVIDER EVENT CORRECTNESS

Provider state is authoritative. Browser success redirect is not payment proof.

Implement:

- raw signature verification;
- platform/connected-account routing;
- event scope;
- unique IDs;
- idempotency;
- persistent event store;
- attempts/status/errors;
- replay;
- correlation IDs;
- transaction-safe transitions;
- no duplicate membership;
- no duplicate entitlement;
- no duplicate Creator Earnings event;
- no duplicate reconciliation;
- no duplicate notification.

Important events:

- connected-account requirements;
- payment/subscription success/failure;
- renewals;
- refunds;
- disputes;
- balance transaction/actual fee data;
- payouts;
- platform SaaS billing.

Direct-charge objects must be queried in connected-account scope where required.

---

# 33. CREATOR EARNINGS LEDGER / FINANCIAL VERIFICATION

Create append-only economic event model and `CreatorEarningsLedgerService`.

For every membership payment show:

- customer charged amount;
- tax;
- actual creator-borne provider fee;
- ZeroFee fee = `0`;
- Creator Earnings Target;
- actual Creator Earnings;
- surplus if any;
- reconciliation state;
- provider reference;
- `Verify in Stripe` when supported.

Refund/dispute events must preserve history:

- originally earned;
- later refunded/reversed;
- current net earned.

Do not erase historical facts.

Provide downloadable reconciliation report.

---

# 34. CREATOR DASHBOARD

Financial hierarchy must be explicit.

## Creator Earnings

- earnings target per member/tier;
- verified successful earnings events;
- current Creator Earnings;
- surplus earnings;
- refunds/disputes;
- ZeroFee transaction fees = 0.

## Provider account

- pending balance;
- available balance;
- reserves/restrictions;
- sync time.

## Payouts

- next payout;
- manual/instant options;
- provider fee;
- ZeroFee fee = 0;
- amount sent;
- history.

## Verification

- reconciliation health;
- actual provider fees;
- provider links;
- export.

Also show application/KYC, SaaS plan, members, cancellations, dunning, top tiers, migration, integrations, quota usage and next actions.

Never mix creator GMV with ZeroFee MRR.

---

# 35. MIGRATION / ANTI-LOCK-IN

Migration Center is core acquisition functionality.

Support Patreon-style/generic CSV import:

- member name/email/external ID;
- tier;
- status;
- frequency;
- amount;
- join/last-charge dates where available;
- safe metadata.

Flow:

upload → validate → map tiers/intervals → choose pricing/earnings migration strategy → import → create invite campaign → member authorizes new subscription → conversion tracked.

Never pretend card/payment credentials migrated if they did not.

Only use provider-assisted credential migration when officially supported/configured.

Migration statuses:

- IMPORTED;
- INVITE_READY;
- INVITED;
- CLICKED;
- NEW_SUBSCRIPTION_STARTED;
- CONVERTED;
- DECLINED/EXPIRED;
- ERROR.

Creator data export must include legally permitted members, tiers/prices/earnings config, posts metadata, subscription history, analytics, migration/integration metadata, excluding raw cards, secrets, private admin notes and prohibited data.

Create `docs/MIGRATION_ARCHITECTURE.md`.

---

# 36. SUPPORT / REFUNDS / DISPUTES

Structured Support Center categories:

- access;
- payment failed;
- billing;
- refund;
- benefit not delivered;
- fraud/scam;
- content report;
- account/security;
- ZeroFee technical issue;
- guarantee/reconciliation issue.

Creator-first where appropriate for content/benefit/ordinary refund issues.

ZeroFee-first for platform/security/prohibited-content/fraud/privacy/payment integration/guarantee incidents.

Never tell user “not our problem” just because creator is connected merchant.

Refund/dispute support:

- full refund;
- partial architecture;
- dispute opened/won/lost;
- provider evidence/status UI where available;
- membership entitlement policy;
- creator/admin/member visibility;
- mock simulation.

ZeroFee does not automatically insure chargebacks from SaaS revenue.

---

# 37. INTEGRATIONS / API / BROADCASTS

## Discord

- OAuth/bot;
- tier→role;
- member link;
- grant/revoke;
- retry/reconciliation;
- manual resync;
- least privilege;
- audit;
- deterministic mock.

## Telegram

Provider architecture for bot/community access and entitlement lifecycle, with mock mode.

## Outbound webhooks

- creator endpoint;
- URL validation/SSRF protection;
- HMAC;
- secret rotation;
- retries/backoff;
- delivery logs;
- failure disable policy.

## Creator API

Scoped API keys, hashed/one-time-secret pattern, rate limits, revoke/rotation, audit.

Safe profile/tier/entitlement/membership event/reconciliation endpoints only. No payment credentials/raw cards.

## Broadcasts

- recipient segments;
- preview/count;
- in-app;
- EmailProvider abstraction/mock;
- quotas;
- unsubscribe/compliance architecture;
- logs.

Create `docs/INTEGRATIONS.md` and `docs/API.md`.

---

# 38. ADMIN CONTROL PLANE

Required admin areas:

- dashboard;
- creator applications;
- creators;
- moderation/reports;
- support escalations;
- SaaS plans/quotas;
- CountryCapabilityRegistry;
- ProviderPricingCatalog;
- GuaranteeEligibilityProfiles;
- Guarantee Health;
- merchant/tax configuration;
- provider capability registry;
- webhook inspector/replay;
- audit;
- feature flags/settings.

Guarantee admin tooling must show:

- exact pricing rule source/version;
- connected account country applicability;
- issuer region/payment method applicability;
- exact vs upper-bound strategy;
- last verified date;
- expiry;
- test status;
- production status;
- exact/surplus/shortfall metrics;
- affected subscriptions;
- ability to pause route immediately;
- immutable history.

Do not expose raw secrets.

---

# 39. AUDIT / NOTIFICATIONS

Audit critical actions:

- creator application/review;
- connected account state;
- country/provider/pricing/tax config;
- pricing rule activation;
- guarantee route activation/pause;
- guarantee incident resolution;
- creator target/price version changes;
- refund;
- payout config/action references where safe;
- integration/API changes;
- suspension/moderation;
- support escalation;
- webhook replay;
- manual entitlement.

Never audit raw cards, bank credentials or KYC docs.

Notifications at minimum:

- application lifecycle;
- KYC action;
- payout state;
- SaaS failure/grace;
- new member;
- earnings event;
- failed/recovered renewal;
- repricing required;
- cancellation;
- refund/dispute;
- guarantee incident when policy requires creator notice;
- integration failure;
- migration milestone;
- moderation decision.

---

# 40. DATA MODEL

Use PostgreSQL with real migrations. Money is stored in integer minor units with explicit currency.

Recommended entities:

## Identity/security
- `User`
- `Session`
- `Role`
- `UserRole`
- `SecurityEvent`
- `ApiKey`

## Creator/compliance
- `CreatorProfile`
- `CreatorApplication`
- `CreatorApplicationRevision`
- `CreatorReviewNote`
- `CreatorComplianceStatus`
- `CreatorConnectedAccount`

## ZeroFee SaaS
- `PlatformPlan`
- `PlatformPlanVersion`
- `PlatformSubscription`
- `PlatformEntitlement`
- `UsageCounter`

## Pricing/guarantee
- `ProviderPricingCatalog`
- `ProviderPricingRuleVersion`
- `GuaranteeEligibilityProfile`
- `GuaranteeEligibilityProfileVersion`
- `CreatorTier`
- `TierPriceVersion`
- `MembershipPriceQuote`
- `GuaranteedMembershipContract`
- `PricingCalculationSnapshot`
- `GuaranteeReconciliation`
- `GuaranteeIncident`
- `CreatorEarningsEvent`
- `Coupon`

## Tax/commerce/country
- `CommerceResponsibilityProfile`
- `CreatorTaxProfile`
- `TaxRegistrationReference`
- `TaxCalculationSnapshot`
- `CountryCapability`

## Content/community
- `Post`
- `PostTierAccess`
- `MediaAsset`
- `Comment`
- `CommentReport`

## Membership/provider finance
- `MembershipSubscription`
- `MembershipPayment`
- `MembershipEvent`
- `ManualEntitlement`
- `ConnectedBalanceSnapshot`
- `PayoutRecord`
- `FinancialReconciliationRecord`
- `ProviderCustomerReference`
- `WebhookEvent`
- `PaymentProviderEvent`

## Migration/integrations/support/admin
- `MigrationProject`
- `MigrationImportRow`
- `MigrationTierMapping`
- `MigrationInvite`
- `MigrationConversion`
- `CreatorIntegration`
- `IntegrationMapping`
- `IntegrationSyncEvent`
- `OutboundWebhookEndpoint`
- `OutboundWebhookDelivery`
- `ContentReport`
- `ModerationAction`
- `SupportTicket`
- `SupportMessage`
- `AuditLog`
- `Notification`
- `FeatureFlag`
- `AdminSetting`

Apply strong foreign keys, unique constraints, indexes, immutable version semantics and cross-creator isolation.

---

# 41. PROVIDER / DOMAIN ABSTRACTIONS

Required abstractions:

- `CreatorPaymentsProvider`;
- `PlatformBillingProvider`;
- `TaxProvider`;
- `MediaStorageProvider`;
- `EmailProvider`;
- `CommunityIntegrationProvider` where sensible.

Core financial services:

- `PaymentContextResolver`;
- `ProviderPricingResolver`;
- `GuaranteeEligibilityService`;
- `GuaranteePricingEngine`;
- `MembershipQuoteService`;
- `GuaranteeReconciliationService`;
- `CreatorEarningsLedgerService`;
- `PayoutPresentationService`;
- `EntitlementResolver`.

Raw Stripe statuses/objects must not leak throughout UI.

---

# 42. MOCK PROVIDER MODE

Support:

`CREATOR_PAYMENTS_PROVIDER=mock|stripe`

`PLATFORM_BILLING_PROVIDER=mock|stripe`

`TAX_PROVIDER=mock|stripe_tax|disabled`

Mock mode must simulate:

- onboarding/KYC states;
- full-dashboard availability;
- exact domestic fee route;
- verified upper-bound route;
- guarantee-ineligible route;
- exact target reconciliation;
- creator surplus reconciliation;
- shortfall breach;
- card issuer country change;
- card category change;
- FX route change;
- tax change;
- fee schedule expiry/change;
- payment success/failure;
- renewal/repricing;
- cancellation/refund/dispute;
- payout standard/instant;
- bank landed amount unknown;
- negative/restricted account;
- SaaS billing/dunning.

Prominently display TEST MODE.

---

# 43. MARKETING / BUYER TRUST

Public pages:

- `/`;
- `/pricing`;
- `/how-it-works`;
- `/migration`;
- `/safety`;
- `/faq`;
- auth/legal.

Preferred messages:

> **Choose what you earn.**

> **Want €10 per member? Earn at least €10 per successful eligible membership payment.**

> **100 successful €10 earnings events = at least €1,000 Creator Earnings.**

> **0% ZeroFee platform fee on membership revenue.**

> **0% ZeroFee payout markup.**

> **Payment processing at provider cost.**

> **If processing costs less than our guaranteed pricing allowance, you keep the difference.**

> **Our financial transaction markup: €0.**

> **We don't tax your success.**

> **Don't trust us. Verify it in Stripe.**

Do not say:

- payment processing is free;
- no fees of any kind;
- guaranteed for every method/country;
- bank landing amount guaranteed;
- refunds/chargebacks do not matter;
- every tax is handled automatically;
- unsupported sensational competitor percentages.

Marketing guarantee definition must be visible and understandable, not contradicted by fine print.

---

# 44. SAVINGS CALCULATOR

Interactive calculator inputs:

- monthly creator revenue;
- competitor platform percentage;
- optional competitor flat fee;
- ZeroFee plan;
- optional active member count;
- optional processing comparison.

Outputs:

- competitor platform fee;
- ZeroFee SaaS cost;
- monthly/annual difference;
- break-even revenue;
- plan eligibility.

Do not mix platform fees with processing unless explicitly selected.

---

# 45. PWA / DESIGN / ACCESSIBILITY

Build premium responsive mobile web and installable PWA where practical.

No native iOS/Android Prompt 1 apps.

Do not offline-cache private paid content or financial pages.

Design goals:

- premium minimal financial SaaS;
- excellent typography;
- strong numerical hierarchy;
- clear earnings vs balance vs payout distinction;
- restrained cards/gradients;
- original brand;
- excellent phone UX;
- polished forms/tables/statuses;
- accessible WCAG 2.1 AA fundamentals.

Critical mobile flows:

- application;
- KYC;
- creator target setup;
- buyer quote/payment;
- dashboard;
- payouts;
- financial verification.

---

# 46. INFORMATION ARCHITECTURE

## Public
- `/`
- `/pricing`
- `/how-it-works`
- `/migration`
- `/safety`
- `/faq`
- `/login`
- `/signup`
- `/c/[creatorSlug]`
- `/c/[creatorSlug]/posts/[postSlug]`
- legal pages

## Member
- `/app`
- `/app/memberships`
- `/app/billing`
- `/app/support`
- `/app/account`
- `/app/security`

## Creator
- `/creator`
- `/creator/apply`
- `/creator/application-status`
- `/creator/onboarding`
- `/creator/profile`
- `/creator/tiers`
- `/creator/content`
- `/creator/members`
- `/creator/earnings`
- `/creator/financial-verification`
- `/creator/payouts`
- `/creator/tax`
- `/creator/billing`
- `/creator/migration`
- `/creator/integrations`
- `/creator/broadcasts`
- `/creator/api`
- `/creator/support`
- `/creator/settings`
- `/creator/export`

## Admin
- `/admin`
- `/admin/applications`
- `/admin/creators`
- `/admin/reports`
- `/admin/support`
- `/admin/plans`
- `/admin/provider-pricing`
- `/admin/guarantee-profiles`
- `/admin/guarantee-health`
- `/admin/countries`
- `/admin/commerce-tax`
- `/admin/webhooks`
- `/admin/audit`
- `/admin/settings`

Exact paths may differ; capabilities may not.

---

# 47. TECHNICAL STACK / CONFIGURATION

Preferred unless repo already establishes a better sound choice:

- current stable Next.js App Router;
- TypeScript;
- PostgreSQL;
- mature TS ORM + migrations;
- pnpm;
- Tailwind;
- accessible UI primitives;
- official Stripe SDK;
- current Stripe Connect embedded components;
- Playwright;
- unit/integration test runner;
- ESLint/formatting;
- schema-validated environment.

Suggested structure:

```text
/app
/components
/components/ui
/lib/auth
/lib/db
/lib/domain
/lib/payments
/lib/platform-billing
/lib/pricing
/lib/guarantee
/lib/payouts
/lib/tax
/lib/compliance
/lib/entitlements
/lib/migration
/lib/integrations
/lib/security
/lib/observability
/db-or-prisma
/tests
/docs
/scripts
/prompts
```

`.env.example` must include all provider/database/auth/tax/storage/email/integration settings. No real secrets committed.

Production fails safely when critical settings are missing.

---

# 48. PERFORMANCE / OBSERVABILITY / PRIVACY

Performance:

- pagination;
- indexes;
- query limits;
- no obvious N+1;
- optimized images;
- efficient entitlement checks;
- batched imports;
- bounded retries.

Observability:

- structured logs;
- correlation IDs;
- provider event refs;
- quote/reconciliation refs;
- redaction;
- health endpoint;
- pricing/guarantee health status.

Privacy:

- Stripe/provider collects KYC docs where possible;
- no raw bank/card credentials;
- minimal PII;
- redact provider payloads;
- protect migration/member data;
- payment classification without PAN/CVC;
- export/deletion architecture;
- retention documented.

---

# 49. SEED / DEMO DATA

Seed deterministic demo data:

- admin;
- approved/payment-ready creator;
- creator under review;
- creator needing info;
- waitlist country;
- fan;
- Guaranteed Earnings exact-formula tier;
- Guaranteed Earnings upper-bound tier;
- Simple Price tier;
- monthly/annual;
- public/paid posts;
- active/past-due/recovered/cancelled membership;
- exact reconciliation;
- surplus reconciliation;
- shortfall incident;
- standard payout;
- instant payout with provider fee;
- unknown downstream bank fee state;
- coupon/trial;
- migration project;
- Discord mock;
- failed webhook;
- support/report;
- provider pricing rules from several clearly labeled DEMO markets;
- guarantee profiles;
- country capabilities;
- mock tax state.

Never seed production secrets.

---

# 50. CORE END-TO-END JOURNEYS

All must work in deterministic mock mode.

## A — Creator onboarding
landing → calculator → signup → country eligibility → application → admin approval → embedded KYC/payout setup → provider ready → SaaS plan → profile → tier → creator chooses earnings target → guarantee routes shown → publish → gated content.

## B — Guaranteed buyer payment
public tier → secure payment context → issuer/payment classification → tax → pricing rule → guarantee eligibility → final quote → buyer confirms → provider charge → webhook activates → actual provider fee retrieved → reconciliation → target or surplus creator earnings → content unlock → Stripe verification.

## C — Different countries/payment methods
same creator target, buyers from multiple supported contexts receive the correct context-specific final retail price using different pricing rule versions; creator target remains minimum.

## D — Surplus
quote uses verified upper bound; real provider fee lower; creator receives target + surplus; ZeroFee receives zero transaction revenue; reconciliation is `VERIFIED_SURPLUS`.

## E — Shortfall
mock actual fee exceeds permitted model; reconciliation `SHORTFALL`; profile pauses; admin alert; no hidden subsidy.

## F — Ineligible route
insufficient fee certainty → guarantee refused → eligible alternative or Simple Price.

## G — Renewal/repricing
same route renews; changed fee/payment method creates `REPRICE_REQUIRED`; no silent creator loss or buyer price hike.

## H — Payout
creator balance → standard/instant payout → provider fee separated → ZeroFee payout fee zero → amount sent shown → earnings history unchanged.

## I — Dunning
failed renewal → past due → update payment/retry → recovered/expired.

## J — Cancellation/tier change
cancel/resume/upgrade/downgrade with price/guarantee contract correctness.

## K — Migration
CSV → validate/map → invite → member authorizes → converted.

## L — Refund/dispute
original earning → refund/dispute → economic history reversal/state → no ZeroFee insurance.

## M — Discord entitlement
connect → tier map → member link → grant/revoke/reconcile.

## N — Support escalation
creator issue routed creator-first; fraud/platform/guarantee issue ZeroFee-first.

## O — Export
creator exports authorized data without secrets.

---

# 51. TESTING — COMPLETION REQUIRES FINANCIAL PROOFS

A green build alone is not completion.

## Unit

- ProviderPricingResolver;
- country/region classification;
- fee-payer logic;
- exact fee components;
- caps/minimums;
- minor-unit rounding;
- minimal-safe-price solver;
- exact-formula route;
- upper-bound route;
- surplus logic;
- shortfall detection;
- tax inclusive/exclusive;
- FX gating;
- guarantee eligibility;
- quote expiry;
- contract versioning;
- reconciliation;
- earnings ledger;
- payout separation;
- entitlements;
- state machines;
- dunning;
- promotions;
- migration;
- webhook idempotency;
- auth/RBAC.

## Integration

- creator approval gate;
- connected-account-country pricing;
- buyer issuer-country pricing;
- payment method classification;
- quote server authority;
- tamper rejection;
- tax resolution;
- charge/webhook activation;
- balance transaction actual-fee reconciliation;
- exact target;
- creator surplus;
- shortfall auto-pause;
- duplicate webhook no duplicate earnings;
- renewal/repricing;
- refund/dispute;
- payout;
- migration/integration/support;
- cross-creator IDOR denial.

## E2E

Automate representative Journeys A–O on desktop and critical phone flows.

Optional Stripe test-mode suite separated from deterministic CI.

---

# 52. REQUIRED SCREENSHOT / VISUAL QA

Capture actual rendered screenshots:

- homepage desktop/mobile;
- pricing/calculator;
- country eligibility;
- creator application/admin review;
- KYC/payout setup;
- creator Guaranteed Earnings builder;
- payment-context/quote review;
- exact reconciliation;
- surplus reconciliation;
- shortfall admin incident;
- creator earnings dashboard;
- provider balance/payout screen;
- financial verification;
- public creator page;
- member dashboard;
- paid content locked/unlocked;
- migration;
- tax;
- integrations;
- support;
- admin dashboard/guarantee health.

Inspect/fix clipping, overflow, spacing, hierarchy, typography, misleading labels, money readability, status clarity and mobile usability.

---

# 53. REQUIRED DOCUMENTATION

Create/update:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/GUARANTEED_EARNINGS_MODEL.md`
- `docs/PROVIDER_PRICING_CATALOG.md`
- `docs/PRICING_ENGINE.md`
- `docs/PAYOUTS_AND_BALANCES.md`
- `docs/STRIPE_APPROVAL_READINESS.md`
- `docs/COUNTRY_AND_CURRENCY_STRATEGY.md`
- `docs/MERCHANT_AND_TAX_RESPONSIBILITY.md`
- `docs/TAX_ARCHITECTURE.md`
- `docs/MIGRATION_ARCHITECTURE.md`
- `docs/INTEGRATIONS.md`
- `docs/API.md`
- `docs/LEGAL_AND_COMPLIANCE_OPEN_ITEMS.md`
- `docs/SECURITY.md`
- `docs/UNIT_ECONOMICS.md`
- `docs/PROTOTYPE_LIMITATIONS.md`
- `docs/OWNER_NEXT_STEPS.md`

`docs/GUARANTEED_EARNINGS_MODEL.md` must document the exact minimum-guarantee definition, surplus ownership, country/payment context dimensions, exact vs upper-bound routes, integer solver, quote lifecycle, renewal/repricing, tax, FX, reconciliation, refunds/disputes and conditions required before live `Guaranteed` marketing.

`docs/PROVIDER_PRICING_CATALOG.md` must document source provenance, verification/expiry, fee payer, country/issuer/payment-method dimensions and how a new provider pricing version becomes production-active.

Docs must describe actual implementation, not aspirational fiction.

---

# 54. IMPLEMENTATION ORDER

Execute all phases.

## Phase 0 — audit/bootstrap
sync/read repo → bootstrap → DB/migrations → env validation → lint/typecheck/test/build → README.

## Phase 1 — auth/domain/audit
users/RBAC → schema → state machines → audit → seeds.

## Phase 2 — design/marketing/PWA
system → marketing → pricing/savings → shells → PWA.

## Phase 3 — country/compliance/application
CountryCapabilityRegistry → creator application → review → safety/legal/reporting.

## Phase 4 — provider/Connect foundation
provider interfaces → mock Connect → Stripe connected-account boundary → embedded onboarding → dashboard verification → webhooks → capabilities.

## Phase 5 — SaaS plans/billing
plans → quotas → platform billing → grace/suspension → admin.

## Phase 6 — ProviderPricingCatalog/payment context
country dimensions → fee payer → provider rule model/versioning → context resolver → admin catalog.

## Phase 7 — Guaranteed Earnings algorithm
GuaranteeEligibilityProfile → exact/upper-bound strategies → integer minimal-safe-price solver → quote lifecycle → surplus/shortfall model → rule change control → unit/property tests.

## Phase 8 — tax/commerce
merchant profile → TaxProvider → guarantee/tax equations → receipts/invoices → Tax Center.

## Phase 9 — creator product/content
profile → tiers → monthly/annual → promotions → posts/downloads/comments → public page.

## Phase 10 — buyer subscriptions
payment context → final quote → confirmation → payment → webhook activation → entitlements → renewal/dunning/cancellation/tier change/repricing.

## Phase 11 — reconciliation/earnings/payouts
actual provider fee retrieval → reconciliation → earnings ledger → surplus → shortfall incidents → Financial Verification → balances/payouts → Stripe verify links.

## Phase 12 — migration/refunds/disputes
reversals → disputes → importer/campaign/conversion.

## Phase 13 — integrations/API/broadcast/support
Discord → Telegram boundary → outbound webhooks → API → broadcasts → support.

## Phase 14 — full admin/analytics/export
Guarantee Health → admin operations → creator/platform analytics → data export.

## Phase 15 — hardening
security → accessibility → performance → observability → clean migration → all tests → E2E.

## Phase 16 — visual QA/docs/finalization
seed → screenshots → inspect/fix → docs → owner checklist → clean tree → commit/push.

Do not stop because one live credential-dependent feature cannot be tested. Complete mock/provider boundaries and document the exact external blocker.

---

# 55. PRODUCT ACCEPTANCE CRITERIA

Prompt 1 is complete only when materially applicable requirements are met, including:

1. `Choose what you earn` is understandable.
2. ZeroFee membership transaction fee is 0%.
3. ZeroFee payout markup is 0.
4. Payment processing is never described as free.
5. SaaS vs creator GMV are separate.
6. Plans scale by usage/features, not revenue %.
7. Creator/payment countries are modeled distinctly.
8. Provider pricing is not one global constant.
9. ProviderPricingCatalog is versioned and sourced.
10. Stale/unverified pricing fails closed.
11. Guarantee eligibility is context-specific.
12. Exact and upper-bound strategies are distinct.
13. Buyer payment context is securely resolved.
14. Raw PAN/CVC never enters ZeroFee storage.
15. Guaranteed retail is server-calculated in minor units.
16. Algorithm returns minimal safe retail price.
17. Modeled proceeds are never below target for an eligible rule.
18. Buyer sees final recurring amount before charge.
19. Client cannot tamper with quote/target/price.
20. Actual provider fee is reconciled after charge.
21. Target match is verified.
22. Surplus belongs entirely to creator.
23. ZeroFee never skims surplus.
24. Shortfall is a hard incident.
25. Shortfall can auto-pause affected rule.
26. Large recurring surplus is visible as pricing-quality warning.
27. Fee/country/payment-method changes trigger re-evaluation.
28. Renewals cannot silently break guarantee.
29. FX routes fail closed unless safely modeled.
30. Tax cannot silently destroy guarantee.
31. Creator dashboard separates earnings/balance/payout.
32. Payout fees do not rewrite earnings.
33. Creator can verify provider records independently where supported.
34. Embedded KYC/payout UX works in mock mode and real boundary exists.
35. Direct charges remain intended topology.
36. No custodial creator wallet.
37. Creator application/review works.
38. Country waitlist/unsupported state works.
39. Dunning/cancellation/tier changes work.
40. Refund/dispute reversals are correct.
41. Migration Center works without fake card migration.
42. Creator export works.
43. Moderation/support routing works.
44. Discord mock integration works.
45. Outbound webhooks/API are secure.
46. Admin controls plans/countries/pricing/guarantees/tax/webhooks/audit.
47. Financial property tests cover cross-country/payment combinations.
48. Shortfall validation sample is zero before live guarantee is enabled.
49. Core flows work phone/desktop.
50. Security tests include financial tampering.
51. Build/lint/typecheck/tests/E2E are green.
52. Screenshot QA complete.
53. Docs reflect reality.
54. Live Stripe/content-platform/tax/legal/guarantee gaps are explicit.

---

# 56. OWNER NEXT STEPS

At completion generate `docs/OWNER_NEXT_STEPS.md` with dependency-ordered checkboxes.

## Company/legal
- final operating entity/jurisdiction;
- Terms/Creator Agreement/AUP/Privacy;
- recurring billing/refund review;
- DSA/copyright workflow review;
- exact `Guaranteed Earnings` marketing review.

## Stripe/Connect
- obtain content-platform approval;
- confirm direct charges;
- confirm connected-account fee payer;
- confirm loss liability;
- confirm embedded onboarding/dashboard/payouts;
- confirm individual/company/country availability;
- configure Billing/webhooks;
- run real test-mode charge/refund/dispute/payout flows.

## Pricing algorithm
- obtain authoritative pricing source for each launch connected-account country;
- confirm fee payer for every relevant Stripe product;
- model issuer-region/card-category rules;
- confirm domestic/cross-border definitions;
- confirm currency/FX rules;
- establish exact-formula or verified-upper-bound status per route;
- add verified fixtures;
- run property/fuzz test matrix;
- run Stripe test-mode reconciliation;
- run closed-beta live reconciliation after approvals;
- require zero shortfalls before enabling live guarantee;
- review surplus distribution to prevent buyer overpricing;
- set rule expiration/re-verification cadence;
- do not enable `GUARANTEED_EARNINGS_LIVE_ALLOWED` globally; enable only approved profile versions.

## Tax
- seller/merchant confirmation;
- ZeroFee SaaS tax;
- creator-to-fan VAT/GST/sales tax;
- Stripe Tax decision;
- registrations/reporting/invoices;
- professional tax signoff.

## Commercial
- final plans/quotas;
- launch countries;
- target creator verticals;
- migration incentive;
- support/refund policies.

## Infrastructure/beta
- production DB/domain/storage/email/observability/backups/secrets/WAF;
- security review;
- closed real-creator beta;
- KYC, migration, dunning, refunds/disputes, payouts;
- measure support/infrastructure cost/conversion/churn;
- recalculate unit economics;
- then public launch.

---

# 57. FINAL COMPLETION REPORT

When execution completes, report:

- final commit SHA;
- branch/push/clean-tree state;
- implemented flows;
- architecture/schema/migrations;
- tests/build/lint/typecheck/E2E;
- screenshot QA;
- mock-provider state;
- Stripe integration/approval state;
- connected-account fee/loss responsibility state;
- ProviderPricingCatalog countries/rules/status;
- GuaranteeEligibilityProfiles/status;
- exact/surplus/shortfall test results;
- live guarantee enablement state;
- payout/tax/country capability state;
- external credential/approval gaps;
- security findings fixed;
- remaining prototype limitations;
- owner checklist path.

Never say `production ready` unless external payment/legal/tax and guarantee-verification dependencies are actually satisfied.

---

# 58. DECISION PRINCIPLES

When ambiguous:

1. Protect creator earnings correctness.
2. Protect buyer pricing fairness.
3. Protect authorization/security.
4. Protect truthful payment/tax representation.
5. Treat each country/payment route as a separate verified financial context.
6. Prefer fewer supported routes over guessed fees.
7. Guarantee a minimum only when mathematically defensible.
8. Surplus belongs to creator.
9. Shortfall is an incident.
10. Never subsidize silently.
11. Never skim processing surplus.
12. Prefer provider-authoritative data over heuristics.
13. Prefer versioned configuration over hardcoded assumptions.
14. Preserve immutable financial history.
15. Preserve auditability.
16. Prefer `unsupported/not configured` over fake success.
17. Do not trap creator data.
18. Do not claim legal/compliance completion without professional verification.

---

# 59. CORE PRODUCT NORTH STAR

> **ZeroFee is the creator membership platform where creators choose the minimum amount they want to earn per successful eligible membership payment. ZeroFee calculates the smallest safe buyer-facing price using a verified country/payment/currency/tax context, takes 0% of membership revenue and 0% payout markup, and reconciles every real provider fee after payment. If processing costs less than the verified pricing allowance, the creator keeps the entire difference. If actual proceeds ever fall below the promised target, that is a financial correctness incident and the affected guarantee route is stopped until fixed. Creator funds live with the connected payment provider, not in a ZeroFee wallet, and every important financial claim can be independently verified. ZeroFee makes money from fixed software subscriptions, not from taxing creator success.**

Shortest product statement:

# You choose your earnings.

# We take 0% of your membership revenue.

# If processing costs less, you keep the difference.

# Don't trust us. Verify it.

EXECUTE THE ENTIRE SPECIFICATION.
