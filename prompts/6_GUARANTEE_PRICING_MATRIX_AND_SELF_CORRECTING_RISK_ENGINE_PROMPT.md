# ZeroFee — Guarantee Pricing Matrix, Grandfathering & Self-Correcting Risk Engine Execution Prompt

**Prompt version:** 6.0  
**Status:** AUTHORITATIVE FINANCIAL-RISK / PRICING CONTINUATION SPECIFICATION  
**Repository:** `arsenijee19/zerofee`  
**Created:** 2026-09-01

---

# 0. START EXECUTION NOW

Work from the CURRENT `main` branch.

Read completely before implementation:

1. `prompts/README.md`
2. Prompts 1–5
3. this Prompt 6
4. `docs/PLATFORM_OPERATING_MODEL.md`
5. payment/pricing/guarantee/Stripe/tax/security docs
6. current implementation and current tests.

Do not summarize this prompt instead of executing it.

Do not stop after planning.

Do not redesign the application.

Do not weaken the ZeroFee operating model.

This prompt adds/clarifies several HARD product decisions:

- existing-member grandfathering is a first-class optional tier behavior;
- Guaranteed Earnings means ZeroFee actually covers a valid eligible shortfall;
- every guarantee top-up is immutable, idempotent and fully auditable;
- Stripe fee prediction must be route-aware and versioned;
- buyer IP is only an early pricing hint, never the authoritative payment-fee classifier;
- the final pre-payment price must be based on the strongest pre-charge payment context available;
- pricing rules automatically learn/correct bounded deterministic shortfalls so the same known case is not allowed to repeat indefinitely;
- unexplained/anomalous fee behavior trips a circuit breaker rather than repeatedly spending platform money;
- creator surplus always remains creator-owned;
- ZeroFee never turns shortfall recovery into a hidden transaction fee.

---

# 1. CREATOR-FIRST PRODUCT PRINCIPLE

ZeroFee must behave like a creator's ally.

Core trust principle:

> If ZeroFee tells an eligible creator they will earn at least a target amount from a successful covered membership payment, ZeroFee stands behind that promise.

Do not shift a ZeroFee pricing-model mistake onto the creator after the payment succeeds.

If a valid eligible payment produces less than the promised Creator Earnings Target, ZeroFee must create and fund a Guarantee Top-Up for the covered difference, subject only to the explicitly documented guarantee scope.

The creator must be able to see exactly what happened.

Example:

```text
Member paid                         €12.00
Actual covered provider costs        €2.50
Creator proceeds before guarantee    €9.50
ZeroFee Guarantee Top-Up             €0.50
------------------------------------------
Final guaranteed creator earnings   €10.00
```

Creator-facing trust copy may state:

> We said you'd earn €10. You did.

Do not hide the top-up.

The top-up is evidence that the guarantee is real.

---

# 2. GUARANTEE SCOPE MUST BE PRECISE

Guaranteed Earnings is NOT a guarantee against every possible future cost, business loss or creator action.

Define `CoveredGuaranteeCosts` explicitly.

Initial covered scope should be limited to provider/payment costs that the active quote promised to cover, for example where applicable:

- card/payment processing cost;
- Stripe Billing recurring-volume cost if borne by the creator transaction/account under the selected provider setup;
- cross-border card pricing that was part of the eligible route;
- provider FX cost if the quote explicitly priced it;
- tax only if the active Commerce Responsibility / quote model explicitly treats tax as part of the guarantee calculation.

Do NOT automatically treat these as guarantee shortfalls:

- creator-initiated refunds;
- chargeback principal loss;
- dispute penalties outside the explicit quote guarantee;
- reserves/holds;
- instant payout fees;
- bank receiving fees;
- creator tax debts outside the quoted tax calculation;
- unrelated negative Stripe balance;
- fraud caused by creator misconduct;
- payment route that was not guarantee-eligible;
- creator configuration changes made after immutable quote creation;
- costs explicitly disclosed as outside guarantee scope.

Document these distinctions in product/legal architecture for counsel review.

---

# 3. GRANDFATHERING IS A FIRST-CLASS TIER OPTION

This is a HARD V1 product requirement.

Whenever a creator creates a new tier pricing version or changes the price/Creator Earnings Target of an existing tier, provide an explicit member-pricing migration choice.

At minimum:

## Option A — Keep existing members at their current price

Recommended/default label:

> **Keep existing members at their current price**

Behavior:

- existing active subscriptions remain pinned to their current `tier_price_version_id` / provider recurring price;
- new members receive the newly published price version;
- historical members do not silently reprice;
- creator sees counts/MRR impact before confirmation;
- renewals continue under the grandfathered price until the creator later explicitly migrates them or the subscription ends according to policy.

Example:

```text
Existing members: €10/month
New members:      €11/month
```

This is a signature creator-friendly feature.

## Option B — Move existing members to the new price

Label:

> **Move existing members to the new price**

Behavior must account for:

- provider subscription price update mechanics;
- effective date;
- proration policy;
- recurring-billing notice requirements;
- country/legal restrictions;
- member communication;
- explicit creator confirmation;
- audit history.

If legal/consumer rules require advance notice or consent, schedule the change rather than silently applying it.

Do not treat price-version updates as destructive mutation of historical prices.

---

# 4. PRICE VERSIONS MUST BE IMMUTABLE

Every membership subscription must reference the exact price version under which it operates.

Store at minimum:

- `tier_id`
- `tier_price_version_id`
- pricing mode
- Creator Earnings Target or Simple Price
- currency
- interval
- effective date
- publication date
- grandfather policy
- provider price/subscription reference
- current member count using that version.

Never rewrite historical financial truth after a creator changes a tier.

---

# 5. CURRENT STRIPE PRICING RESEARCH BASELINE — CAPTURED 2026-09-01

The following values were verified from current official Stripe pricing pages on 2026-09-01 and are a BASELINE SEED, not a forever-hardcoded truth.

The implementation MUST revalidate current official Stripe pricing before enabling a rule as live guarantee-eligible.

Every fee rule must retain source URL/reference, captured date, effective dates and verification status.

## 5.1 EEA connected account / merchant, EUR card processing baseline

Current official Stripe EEA pricing pages such as Germany/Ireland show:

- Standard EEA cards: `1.5% + €0.25`
- Premium EEA cards: `2.8% + €0.25`
- UK cards: `2.5% + €0.25`
- Other international cards: `3.15% + €0.25`
- Additional Stripe currency-conversion cost when required: `+2%`

Current official source examples:

- `https://stripe.com/de/pricing`
- `https://stripe.com/ie/pricing`

Do not assume all EEA account contracts are identical if Stripe gives a creator custom pricing.

The connected account's actual contract/pricing profile must override generic standard pricing once known.

## 5.2 Stripe Billing recurring subscription cost

Current Stripe Billing Pay-As-You-Go pricing is:

- `0.7% of Billing volume`

Official source examples:

- `https://stripe.com/de/billing/pricing`
- `https://stripe.com/billing/pricing`

This cost must only be included in the creator quote if the selected subscription architecture actually causes this Billing cost to be borne by the creator's connected-account commerce under that account's pricing contract.

Never double-count it.

Never assume a creator with negotiated/custom Billing pricing still pays exactly 0.7%.

## 5.3 US connected account / merchant baseline

Current US standard Stripe card pricing:

- domestic card: `2.9% + $0.30`
- international card surcharge: `+1.5%`
- Stripe currency conversion when required: `+1%`
- Stripe Billing PAYG baseline: `+0.7% of Billing volume`

Official sources:

- `https://stripe.com/pricing`
- `https://stripe.com/billing/pricing`

## 5.4 UK connected account / merchant baseline

Current UK pricing:

- standard UK cards: `1.5% + £0.20`
- premium UK cards: `2.8% + £0.20`
- EEA cards: `2.5% + £0.20`
- other international cards: `3.15% + £0.20`
- additional currency conversion when required: `+2%`
- Stripe Billing PAYG baseline: `+0.7% of Billing volume`

Official source:

- `https://stripe.com/gb/pricing`

---

# 6. EXAMPLE GUARANTEED-EARNINGS RETAIL MATRIX

The following examples assume:

- Creator Earnings Target = `10.00` in the shown currency;
- no tax is deducted in these illustrative rows;
- Stripe standard pricing applies;
- recurring membership uses Stripe Billing PAYG at `0.7%`;
- fixed fee and percentage are both included;
- price is rounded UP to the smallest currency unit;
- no ZeroFee transaction/application fee exists.

General solver:

```text
retail = ceil_minor_unit(
  (creator_target + fixed_provider_fee)
  / (1 - total_percentage_fee)
)
```

Where percentage components include all covered percentage costs applicable to that route.

## 6.1 EEA creator account, EUR target €10

| Buyer/card route | Payments fee | Billing | Combined modeled cost | Minimum illustrative retail for €10 target |
|---|---:|---:|---:|---:|
| Standard EEA card, no FX | 1.5% + €0.25 | 0.7% | 2.2% + €0.25 | **€10.49** |
| Premium EEA card, no FX | 2.8% + €0.25 | 0.7% | 3.5% + €0.25 | **€10.63** |
| UK card, no FX | 2.5% + €0.25 | 0.7% | 3.2% + €0.25 | **€10.59** |
| Other international card, no FX | 3.15% + €0.25 | 0.7% | 3.85% + €0.25 | **€10.67** |
| Other international + Stripe FX required | 3.15% + €0.25 + 2% | 0.7% | 5.85% + €0.25 | **€10.89** |

### Germany vs Serbia example

If the creator has an EEA connected Stripe account settling EUR:

- German-issued standard consumer card → EEA standard route → approximately **€10.49** retail for a €10 target under the assumptions above.
- Serbian-issued card → Serbia is outside the EEA card bucket → international route → approximately **€10.67** when no Stripe currency conversion is required.
- Serbian/international route where Stripe currency conversion is required → approximately **€10.89**.

This difference is based on the CARD/PAYMENT ROUTE, not the buyer's nationality.

## 6.2 US creator account, USD target $10

| Buyer/card route | Combined modeled cost incl. 0.7% Billing | Minimum illustrative retail for $10 target |
|---|---:|---:|
| US domestic | 3.6% + $0.30 | **$10.69** |
| International, no Stripe FX | 5.1% + $0.30 | **$10.86** |
| International + Stripe FX | 6.1% + $0.30 | **$10.97** |

## 6.3 UK creator account, GBP target £10

| Buyer/card route | Combined modeled cost incl. 0.7% Billing | Minimum illustrative retail for £10 target |
|---|---:|---:|
| Standard UK | 2.2% + £0.20 | **£10.43** |
| Premium UK | 3.5% + £0.20 | **£10.57** |
| EEA | 3.2% + £0.20 | **£10.54** |
| Other international, no FX | 3.85% + £0.20 | **£10.61** |
| Other international + Stripe FX | 5.85% + £0.20 | **£10.84** |

These examples are acceptance-test fixtures for the currently captured standard-pricing baseline, not legal/contractual promises.

---

# 7. IP-BASED PRICING — IMPORTANT CORRECTION

Buyer IP must NOT be the authoritative source for payment pricing.

Stripe exposes IP-country information, but that represents geolocation of the request/payment origin.

Stripe card/payment economics depend on factors such as:

- creator/connected-account country;
- connected-account pricing contract;
- card issuer/card country;
- card class/product where pricing differs;
- payment method;
- presentment currency;
- settlement currency;
- whether Stripe currency conversion is required;
- recurring Billing pricing;
- potentially custom provider terms.

A buyer can:

- live in Germany and use a Serbian card;
- travel abroad;
- use a VPN;
- use a company card from another country;
- use a wallet whose originating IP is obscured.

Therefore:

> **IP = PREVIEW SIGNAL ONLY. PAYMENT METHOD / CARD ROUTE = FINAL FINANCIAL SIGNAL.**

Stripe `PaymentMethod.card.country` exposes the country of the card.

Official API reference:

`https://docs.stripe.com/api/payment_methods/object`

Stripe Radar also distinguishes `ip_country` from payment/card attributes.

Official reference:

`https://docs.stripe.com/radar/rules/supported-attributes`

Never make Guaranteed Earnings depend solely on IP geolocation.

---

# 8. TWO-STAGE BUYER PRICING EXPERIENCE

Implement a two-stage quote experience.

## Stage A — Early preview

Before payment method collection, show a provisional price using:

- creator connected-account country;
- target currency;
- creator settlement currency;
- buyer IP country;
- buyer selected display currency;
- conservative route assumptions.

Label internally as:

`PROVISIONAL_PRICE`

Do not lock a guarantee against this incomplete context.

UI can show:

> Estimated membership price

or simply defer exact price until the payment method step if changing the visible number would be confusing.

## Stage B — Final pre-payment quote

Before buyer confirms the recurring subscription:

1. collect/select the payment method using a Stripe-supported pre-payment mechanism;
2. obtain the strongest pre-charge payment attributes available, including card country for cards;
3. resolve final payment route;
4. apply the correct verified provider pricing rule / safe upper bound;
5. generate immutable final quote;
6. display exact final recurring price;
7. buyer explicitly confirms that price;
8. only then create/confirm the provider subscription/payment.

The buyer must never learn the final recurring amount only after payment.

---

# 9. CARD CLASS / PREMIUM UNCERTAINTY

Current EEA/UK standard pricing distinguishes standard vs premium cards.

Do not assume that every card's final network pricing classification is perfectly knowable before charge.

Where the exact card pricing class is not reliably known pre-charge:

- use a VERIFIED SAFE UPPER BOUND for the applicable card-country group;
- for an EEA card under the currently captured standard pricing, this may require using the premium-card percentage as the conservative guarantee basis unless current Stripe APIs/provider evidence can reliably identify a lower class before charge;
- if actual processing is cheaper, creator receives the surplus;
- ZeroFee receives none of it.

Do not underprice merely to make the displayed membership look cheaper.

---

# 10. ROUTE KEY — NO AMBIGUOUS `country`

Create an explicit `GuaranteeRouteKey` / equivalent persisted dimensions.

At minimum:

- provider
- provider pricing contract/profile ID
- creator connected-account country
- creator legal country if separately required
- creator settlement currency
- buyer IP country (preview metadata only)
- buyer billing country if collected
- card/payment instrument country
- issuer region bucket
- payment method family
- card class/product bucket
- presentment currency
- settlement currency
- FX required true/false/unknown
- recurring Billing pricing profile/version
- tax model/profile version
- pricing rule version
- guarantee eligibility version
- quote engine version.

Never use a generic `country` field to mean several different things.

---

# 11. PROVIDER PRICING CATALOG MUST SUPPORT CONTRACT OVERRIDES

A generic Stripe standard-pricing matrix is only the starting point.

Connected accounts can have custom pricing.

Therefore Provider Pricing Catalog must support:

- standard published pricing source;
- creator/account-specific provider contract override;
- exact formula;
- safe upper-bound formula;
- unknown/variable route;
- effective dates;
- revalidation date;
- source URL;
- source captured timestamp;
- manual/automatic verification metadata;
- observed actual-fee calibration.

Priority order should be explicit, e.g.:

1. exact creator/account contract if verified;
2. exact provider standard rule for that account geography;
3. verified safe upper bound;
4. no Guaranteed Earnings.

Never silently apply German standard Stripe pricing to a connected account whose actual contract differs.

---

# 12. GUARANTEE TOP-UP LEDGER

Create a real immutable `GuaranteeTopUp` domain model/table.

At minimum store:

- id
- creator_id
- membership_payment_id
- reconciliation_id
- provider_payment_id
- provider_balance_transaction/reference
- quote_id
- pricing_rule_version
- guarantee_profile_version
- target_minor
- actual_creator_proceeds_before_topup_minor
- shortfall_minor
- topup_amount_minor
- currency
- reason_code
- status
- funding_source/reference
- provider_transfer/reference if applicable
- idempotency_key
- created_at
- funded_at
- transferred_at
- failed_at
- reversed_at where applicable
- audit metadata.

Recommended states:

- `PENDING`
- `FUNDED`
- `TRANSFER_PENDING`
- `TRANSFERRED`
- `FAILED`
- `REVERSED`

Hard database idempotency:

- one active guarantee top-up per reconciliation;
- same provider payment/event can never create the same top-up twice;
- webhook replay must be safe.

Use UNIQUE constraints and transactions, not in-memory flags.

---

# 13. TOP-UP FUNDING PROVIDER ABSTRACTION

Implement a provider-neutral boundary such as:

`GuaranteeFundingProvider`

Methods should support:

- record obligation;
- check ZeroFee guarantee reserve/available funding;
- initiate top-up to the correct creator connected account where supported;
- idempotent retry;
- query transfer/funding status;
- reconcile completed transfer;
- fail safely.

Implement deterministic mock funding provider.

Implement the Stripe-capable boundary according to the selected current Connect architecture.

Do NOT destroy the Direct Charges / creator-owned merchant model just to simplify top-ups.

If the final Stripe platform-to-connected-account funding mechanism requires a configuration/approval decision, implement the real boundary and mark only the actual live transfer as `BLOCKED_EXTERNAL`.

The financial obligation/ledger must still exist in test mode.

---

# 14. PLATFORM OWNER ACCESS VS CREATOR ACCESS

Implement the Stripe access model according to current Stripe Connect behavior.

Current official Stripe Accounts v2 documentation supports:

- `dashboard = full`: connected account logs into the full Stripe Dashboard with its OWN Stripe credentials;
- `fees_collector = stripe`: Stripe collects payment fees directly from the connected account for direct charges;
- `losses_collector = stripe`: where available/approved, Stripe is liable for connected-account negative balances;
- platform can still make API calls for connected accounts using the platform secret key plus the connected account context (`Stripe-Account` header / SDK `stripeAccount`).

Official references:

- `https://docs.stripe.com/connect/accounts-v2/connected-account-configuration`
- `https://docs.stripe.com/connect/saas/tasks/dashboard`
- `https://docs.stripe.com/connect/authentication`

Therefore the desired UX/security model is:

## Creator

- logs into their own full Stripe Dashboard where supported;
- sees/manages their Stripe financial account according to Stripe permissions;
- can independently verify payments, refunds, disputes, balance, payouts and reports.

## ZeroFee owner/admin

- does NOT impersonate the creator or silently log in using creator credentials;
- has platform-level visibility and approved operational controls through Connect APIs/platform Dashboard/embedded components;
- can retrieve/query relevant connected-account objects needed to operate ZeroFee;
- can inspect payment/reconciliation/provider state from ZeroFee admin;
- sensitive administrative operations require RBAC, reason and audit logging;
- creator secrets/API keys must never be exposed to ZeroFee owner merely for convenience.

In short:

> Creator has their own Stripe Dashboard. ZeroFee has Connect platform/API control and visibility necessary to provide the service. These are different forms of access.

---

# 15. AUTOMATIC SHORTFALL DETECTION

For every successful guarantee-eligible payment:

1. load immutable quote;
2. ingest provider-authoritative actual cost data;
3. compute actual covered creator proceeds;
4. compare to Creator Earnings Target;
5. if proceeds >= target: no top-up;
6. creator keeps all surplus;
7. if proceeds < target: create Guarantee Breach + Guarantee Top-Up atomically/idempotently;
8. immediately trigger Route Correction Engine.

Do not wait for manual accounting to notice repeated losses.

---

# 16. SELF-CORRECTING ROUTE PRICING ENGINE

A valid shortfall means the active pricing model was unsafe for that observed route.

Implement `GuaranteeRouteCorrection` / equivalent.

Store at minimum:

- affected route key;
- old pricing rule/profile version;
- predicted cost;
- actual cost;
- residual/delta;
- cause classification;
- correction type;
- proposed new rule/version;
- automatic/manual decision;
- applied_at;
- validation status.

## 16.1 First objective

Prevent the SAME KNOWN UNDERPRICING CONDITION from repeatedly producing shortfalls.

## 16.2 Deterministic known residual

If authoritative provider data proves a bounded deterministic missing component, for example:

- fixed fee difference;
- known percentage component omitted;
- known Billing fee omitted;
- known cross-border bucket misclassified;
- known FX bucket misclassified;

then:

1. create a NEW pricing rule version;
2. never rewrite historical rule;
3. include observed correction plus a minimal safe rounding margin;
4. rerun minimum-price solver/property tests;
5. activate the corrected route according to configured auto-correction policy;
6. monitor subsequent payments.

## 16.3 Unknown/unexplained residual

If the fee delta cannot be explained confidently:

- immediately pause Guaranteed Earnings for the affected exact route/profile;
- Simple Price may remain available;
- do NOT keep issuing unsafe guarantees;
- create admin incident;
- require verification/new rule before re-enabling.

Reliability is more important than pretending every route is supported.

---

# 17. AUTO-CORRECTION GUARDRAILS

Do not allow one anomalous transaction to poison a global pricing matrix.

Automatic correction may only occur when:

- the affected route key is sufficiently specific;
- provider actuals are authoritative;
- correction magnitude is within configured sane bounds;
- the fee component can be classified;
- the new rule still passes guarantee property tests;
- no unrelated creator/account pricing contract would be affected.

Otherwise pause and escalate.

Never globally increase prices for every creator because one creator has custom pricing.

---

# 18. CRITICAL ECONOMIC TRUTH — PRICE CORRECTION DOES NOT RECOVER OLD TOP-UPS

Because creator surplus belongs 100% to the creator and ZeroFee takes 0% transaction fee:

> Raising future buyer prices prevents FUTURE guarantee losses but does not reimburse ZeroFee for a top-up already paid.

Do NOT violate creator-surplus ownership to recover past losses.

Past valid top-ups are a ZeroFee operating/risk cost.

ZeroFee recovers those costs economically through its SaaS subscription pricing/reserve model, not by silently taking future creator surplus.

This principle must remain explicit in code/docs/analytics.

---

# 19. GUARANTEE RESERVE / RISK BUDGET

Implement platform risk accounting.

Admin must be able to see:

- total Guarantee Top-Ups today;
- month-to-date top-ups;
- top-up count;
- average top-up;
- largest top-up;
- affected creators;
- affected route profiles;
- repeat shortfall rate;
- guarantee cost / ZeroFee SaaS revenue;
- guarantee reserve available;
- pending obligations;
- failed funding transfers.

Configurable circuit breakers:

- max automatic top-up per payment;
- max shortfall percentage;
- max loss per route/profile over rolling window;
- max daily platform guarantee exposure;
- max monthly platform guarantee exposure;
- repeat-shortfall threshold;
- reserve-low threshold.

Important:

- these limits stop NEW guarantees when risk becomes unsafe;
- they must not erase an already-valid guarantee obligation merely because the reserve threshold was reached.

---

# 20. BUYER PRICE POLICY — KEEP IT CLEAN

Do not show the fan a Ticketmaster-like fee breakdown by default.

The member is purchasing a creator membership at a final recurring retail price.

Recommended buyer-facing presentation:

```text
Membership
€10.67 / month

Provided by Creator Name
Payment processed by Stripe
Technology provided by ZeroFee
```

Do not present:

```text
Creator wants €10
Stripe fee €x
ZeroFee adjustment €y
```

unless a legally required disclosure or optional transparency panel requires it.

Creator-facing dashboard remains fully transparent.

---

# 21. PRICE-CHANGE COMMUNICATION UX

When creator changes an existing tier price:

Show preview such as:

```text
Current active members: 428
Current member price: €10.00
New member price: €11.00

(*) Keep existing members at €10.00
( ) Move existing members to €11.00
```

If moving existing members:

- show effective date;
- affected member count;
- projected MRR/Creator Earnings effect;
- communication preview;
- legal notice state;
- provider update state.

Creator should not need to manually explain Stripe fee math.

ZeroFee may provide optional creator communication templates, but the final public membership retail price is simply the creator's membership price.

---

# 22. PAYMENT CONTEXT BEFORE FINAL QUOTE

Implement the strongest feasible pre-payment context without charging the customer prematurely.

For cards, collect/select a PaymentMethod through the current supported Stripe flow and use available properties such as `card.country` before final quote confirmation.

Do not store raw card data.

Do not use BIN databases outside Stripe unless separately justified, licensed and security-reviewed.

If some pricing classifier is unavailable pre-charge:

- use a verified safe upper bound;
- or disable Guaranteed Earnings for that route;
- never guess optimistically.

---

# 23. TAX REMAINS A SEPARATE DIMENSION

This Prompt 6 matrix is primarily about Stripe/provider cost prediction.

Do not conflate it with creator VAT/sales-tax liability.

The final retail solver must still integrate the applicable `CommerceResponsibilityProfile` and tax model where tax must be collected.

A €10 target with 19% VAT can require a different retail amount from the payment-fee-only examples above.

Keep these separately versioned:

- payment provider pricing rule;
- Billing pricing rule;
- tax rule/profile;
- guarantee eligibility profile.

---

# 24. REFUNDS / DISPUTES AND TOP-UP REVERSALS

A later creator refund must not create a second guarantee top-up.

Define explicit accounting treatment for:

- full refund after top-up;
- partial refund after top-up;
- dispute after top-up;
- dispute won/lost;
- payment reversal.

Preserve immutable history.

Never simply delete the original Guarantee Top-Up row.

Use compensating/reversal records where business policy requires them.

Final legal/refund policy remains subject to external review.

---

# 25. DATA MODEL / LEDGER REQUIREMENTS

Ensure accounting/event history can answer:

For any payment:

- what creator requested;
- what buyer was quoted;
- why that exact retail price was chosen;
- IP preview country;
- actual card/payment country;
- payment method;
- price rule/version;
- expected provider cost;
- actual provider cost;
- target creator earnings;
- actual pre-guarantee creator earnings;
- creator surplus;
- shortfall;
- ZeroFee top-up;
- final creator guaranteed earnings;
- route correction triggered;
- provider references;
- whether future route pricing changed as a result.

Everything must be queryable by owner/admin and creator at the appropriate permission level.

---

# 26. OWNER / ADMIN GUARANTEE OPERATIONS UI

Add real admin views for:

## Guarantee Payments

- payment
- creator
- route
- target
- actual
- top-up
- status
- provider references.

## Route Corrections

- affected route
- old model
- observed actual
- residual
- correction
- new model
- automatic/manual
- health after correction.

## Pricing Matrix

Filter by:

- connected-account country;
- card country/region;
- payment method;
- card class;
- presentment/settlement currency;
- FX;
- Billing profile;
- contract/standard pricing;
- confidence;
- effective date;
- observed shortfall rate.

## Risk Reserve

Display exposure and circuit-breaker state.

---

# 27. CREATOR FINANCIAL VERIFICATION UI

Creator must see top-ups in Financial Verification.

Example:

```text
Creator target                   €10.00
Member charged                   €12.00
Actual provider cost              €2.50
Creator before guarantee          €9.50
ZeroFee Guarantee Top-Up         +€0.50
Final Creator Earnings           €10.00
ZeroFee transaction fee           €0.00
```

Also show:

- provider reference;
- rule version;
- top-up status;
- Verify in Stripe where relevant.

Do not call the top-up creator surplus.

---

# 28. TEST MATRIX — REQUIRED

Expand financial tests substantially.

Test at minimum across:

## Account countries/families

- EEA/EUR baseline;
- UK/GBP baseline;
- US/USD baseline.

## Buyer routes

- domestic/standard;
- premium where pricing differs;
- neighboring region (EEA↔UK);
- international;
- international + FX;
- IP country matches card country;
- IP country differs from card country;
- VPN-like mismatch;
- unknown card class;
- custom account pricing override.

## Targets

At minimum deterministic property testing over many amounts including:

- 1.00
- 2.00
- 5.00
- 10.00
- 19.99
- 49.00
- 99.00
- 250.00
- upper allowed tier target.

For every eligible quote assert:

`modeled_creator_proceeds >= target`

and minimality for the selected safe pricing model.

---

# 29. SPECIFIC BASELINE FIXTURE ASSERTIONS

Under the captured 2026-09-01 standard-pricing assumptions, with target 10.00 and Billing PAYG included, test fixtures should approximately assert the following exact minor-unit solver outputs unless newer verified official pricing changes them during execution:

### EEA EUR

- standard EEA → `1049`
- premium EEA → `1063`
- UK → `1059`
- international → `1067`
- international + FX → `1089`

### US USD

- domestic → `1069`
- international → `1086`
- international + FX → `1097`

### UK GBP

- standard UK → `1043`
- premium UK → `1057`
- EEA → `1054`
- international → `1061`
- international + FX → `1084`

If Stripe's current verified pricing differs when executing this prompt:

- update the catalog;
- update these fixtures;
- record source/effective date;
- do not preserve stale numbers merely because this prompt captured them.

---

# 30. TOP-UP / SELF-CORRECTION TESTS

Required tests:

1. exact target, no top-up;
2. creator surplus, no top-up;
3. €0.01 shortfall → exactly one €0.01 obligation;
4. repeated identical webhook → still one top-up;
5. concurrent processing → still one top-up;
6. €0.50 shortfall example → final creator guaranteed earnings = target;
7. deterministic missing fixed fee → new rule version created;
8. deterministic missing percentage → route correction created;
9. unknown anomalous fee → guarantee route paused;
10. next identical known corrected route no longer shortfalls;
11. correction for Creator A custom pricing does not alter Creator B;
12. reserve circuit breaker blocks new guarantees but preserves already-earned obligation;
13. top-up funding retry is idempotent;
14. refund/dispute does not create duplicate guarantee;
15. historical quote remains bound to old rule after correction.

---

# 31. GRANDFATHERING TESTS

Required:

- creator changes tier from €10 → €11 with KEEP_EXISTING;
- existing subscriptions remain pinned to €10 price version;
- new member receives €11 version;
- renewal for old member remains €10;
- creator later explicitly migrates old members;
- change creates audit trail;
- provider update is idempotent;
- failed provider update does not silently mark migration complete;
- legal notice scheduling state persists where required.

---

# 32. E2E JOURNEYS

Add/extend browser E2E:

## Dynamic route pricing

EEA creator
→ German/EEA card context
→ final guaranteed price
→ payment
→ reconciliation.

Then:

same creator
→ Serbian/international card context
→ final price differs appropriately
→ buyer sees exact recurring price before confirmation.

Mock provider should deterministically simulate payment instrument geography/class so CI does not need live cards.

## Top-up

creator target €10
→ buyer price generated
→ provider actual costs unexpectedly exceed modeled cost by €0.50
→ payment succeeds
→ creator receives €0.50 Guarantee Top-Up record/funding state
→ creator dashboard shows final €10 earnings
→ admin sees incident
→ affected route is corrected/paused according to classification
→ next applicable quote uses corrected pricing or is blocked safely.

## Grandfathering

creator has existing members at €10
→ changes tier/new target producing €11 price
→ chooses `Keep existing members at their current price`
→ existing members remain €10
→ new subscriber sees €11
→ reload/provider state confirms both versions.

---

# 33. OBSERVABILITY

Emit structured events/metrics for:

- quote generated;
- route selected;
- provisional IP route;
- final payment-method route;
- predicted cost;
- actual cost;
- surplus;
- shortfall;
- top-up created;
- top-up funded;
- top-up failed;
- route auto-corrected;
- route paused;
- reserve threshold hit;
- grandfathering decision;
- price migration scheduled/completed.

Redact sensitive payment data.

---

# 34. SECURITY

Top-up/funding endpoints are high risk.

Require:

- server-only execution;
- no client-submitted top-up amount;
- amount derived from immutable reconciliation;
- creator cannot trigger arbitrary top-up;
- admin cannot edit historical amount directly;
- owner manual override requires reason + audit;
- idempotency keys;
- provider account binding;
- no cross-creator transfer;
- rate/concurrency protection;
- secrets never exposed.

Pricing correction administration also requires strong RBAC/audit.

---

# 35. DOCUMENTATION

Create/update at minimum:

- `docs/GUARANTEE_TOPUP_AND_RISK_ENGINE.md`
- `docs/STRIPE_FEE_MATRIX.md`
- `docs/GUARANTEED_EARNINGS_MODEL.md`
- `docs/PRICING_ENGINE.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/STRIPE_CONNECT_IMPLEMENTATION_DECISION.md`
- `docs/V1_ACCEPTANCE_MATRIX.md`
- `docs/OWNER_NEXT_STEPS.md`
- `docs/EXECUTION_STATE.md`

`docs/STRIPE_FEE_MATRIX.md` must clearly state:

- captured date;
- official source;
- account country;
- card/payment country bucket;
- card class;
- payment method;
- percentage/fixed fee;
- Billing fee;
- FX component;
- confidence;
- test/live status;
- latest observed actuals;
- whether route is guarantee-enabled.

---

# 36. NO FALSE GLOBAL CLAIMS

Do not claim:

- these fee rates apply forever;
- IP determines card fee;
- Serbia/Germany always differ by the same amount;
- every Stripe connected account receives standard published pricing;
- every route can be guaranteed;
- Stripe exposes a perfect authoritative ex-ante fee quote for every card;
- ZeroFee never has any guarantee cost.

Truthful model:

> ZeroFee uses verified provider pricing rules or safe upper bounds before payment, reconciles against actual provider economics after payment, covers valid eligible shortfalls, and immediately learns/pauses unsafe routes so known pricing mistakes are not allowed to repeat indefinitely.

---

# 37. FINAL DEFINITION OF DONE

Prompt 6 is complete only when:

1. grandfather existing members is an actual tier price-change option;
2. existing/new member price versions coexist correctly;
3. IP is preview-only and cannot authorize an unsafe guarantee;
4. final pre-payment quote uses stronger payment-method route context;
5. current Stripe fee matrix is persisted and versioned;
6. EEA/UK/US baseline matrices are tested;
7. account-specific custom pricing override is supported;
8. unknown fee routes cannot guarantee;
9. Guarantee Top-Up ledger exists;
10. valid shortfall creates exactly one top-up;
11. creator final guaranteed earnings reaches target after top-up;
12. top-up funding provider abstraction exists;
13. deterministic mock funding works E2E;
14. live Stripe funding boundary is implemented as far as current Connect architecture allows;
15. shortfall automatically triggers route correction engine;
16. known deterministic pricing error produces a new rule version;
17. unknown anomaly pauses the route;
18. next known corrected case no longer repeats the same shortfall;
19. creator surplus always remains creator-owned;
20. pricing correction never captures future surplus to reimburse old ZeroFee losses;
21. reserve/risk admin telemetry exists;
22. owner/admin connected-account operational access follows Connect API permissions rather than creator impersonation;
23. creator retains own full Stripe Dashboard access where supported;
24. all financial mutations are server-authoritative/idempotent;
25. unit/integration/security/concurrency/E2E tests pass;
26. docs accurately reflect live/test/external states;
27. all work is committed and pushed.

---

# 38. FINAL REPORT

Only after completion report:

- final SHA;
- fee sources re-verified and captured date;
- current EEA/UK/US matrix;
- number of pricing route fixtures/property cases;
- grandfathering implementation and E2E evidence;
- pre-payment route classification behavior;
- IP preview behavior;
- Guarantee Top-Up schema/service/provider implementation;
- top-up idempotency/concurrency evidence;
- self-correcting route behavior;
- reserve/circuit-breaker behavior;
- creator financial verification UI;
- owner/admin Stripe access implementation;
- current Stripe Accounts v2/full-dashboard/direct-charge architecture state;
- exact tests and counts;
- remaining genuine external blockers only.

Do not say the guarantee system is production-ready until live Stripe fee behavior, top-up funding mechanics, provider approval and legal wording have been validated.

---

# 39. FINAL EXECUTION COMMAND

START NOW.

IMPLEMENT CREATOR-FRIENDLY GRANDFATHERING.

IMPLEMENT A CURRENT, VERSIONED STRIPE FEE MATRIX.

DO NOT PRICE GUARANTEES FROM IP ALONE.

USE IP ONLY FOR EARLY PREVIEW AND THE PAYMENT METHOD/CARD ROUTE FOR FINAL PRE-PAYMENT PRICING.

MAKE GUARANTEED EARNINGS A REAL GUARANTEE: COVER VALID ELIGIBLE SHORTFALLS.

MAKE EVERY TOP-UP IMMUTABLE, IDEMPOTENT AND AUDITABLE.

AFTER A SHORTFALL, CORRECT OR PAUSE THAT EXACT PRICING ROUTE SO THE SAME KNOWN UNDERPRICING DOES NOT REPEAT INDEFINITELY.

NEVER CAPTURE CREATOR SURPLUS.

KEEP ZEROFEE TRANSACTION FEE AT 0%.

PRESERVE THE CREATOR'S OWN STRIPE RELATIONSHIP AND FULL DASHBOARD WHERE CURRENT STRIPE CAPABILITIES ALLOW IT.

GIVE ZEROFEE OWNER/ADMIN THE CONNECT API/PLATFORM VISIBILITY NEEDED TO OPERATE THE SERVICE WITHOUT IMPERSONATING THE CREATOR.

TEST EVERYTHING AGAINST REAL PERSISTED APPLICATION STATE.

COMMIT AND PUSH ALL COMPLETED WORK.
