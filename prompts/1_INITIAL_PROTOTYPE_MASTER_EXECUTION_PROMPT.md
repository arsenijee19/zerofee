# ZeroFee — Complete Initial Prototype Master Execution Prompt

**Prompt version:** 1.4  
**Status:** AUTHORITATIVE MASTER SPECIFICATION FOR THE COMPLETE INITIAL PROTOTYPE  
**Repository:** `arsenijee19/zerofee`

---

# 0. PRECISE GOAL

## GOAL

Build the **complete first working ZeroFee prototype** as a coherent end-to-end creator membership SaaS, not as a landing-page mockup, isolated payment demo, or collection of unfinished modules.

At the end of this prompt a reviewer must be able to run the application locally in deterministic test/mock mode and execute the complete business journey:

**visitor → creator signup → country eligibility → creator application → ZeroFee approval → embedded payout/KYC onboarding → ZeroFee SaaS plan → creator profile → membership tier → Guaranteed Earnings pricing → buyer-specific final quote → buyer subscription → provider-authoritative payment confirmation → Creator Earnings reconciliation → gated content entitlement → renewal/dunning → refund/dispute → payout → financial verification → creator analytics → migration from Patreon → integrations → support → admin oversight.**

The prototype must prove the central economic promise:

> **Creators choose what they want to earn. ZeroFee takes 0% of creator membership revenue and 0% platform markup on payouts. Real payment-provider costs are incorporated into buyer-facing economics. ZeroFee makes money from fixed SaaS subscriptions, not from taxing creator success.**

The first version must be broad enough that subsequent work is refinement, production verification, and iteration, not repeated reimplementation of missing core flows.

## SUCCESS DEFINITION

Prompt 1 is successful only when:

1. the core platform is functionally connected to a real database and server-side domain model;
2. every critical UI action has working behavior rather than a dead button;
3. financial state is provider/server authoritative, never trusted from client UI;
4. Guaranteed Earnings calculations are deterministic and covered by tests;
5. Stripe Connect integration boundaries are real and current, while mock mode remains fully demonstrable without credentials;
6. user, creator, and admin panels are coherent and searchable;
7. migration from Patreon is a real acquisition flow, not a future note;
8. mobile and desktop flows both work;
9. screenshots of the actual running product are captured and visually reviewed;
10. all material defects discovered in the bounded QA pass are fixed before completion;
11. build, typecheck, lint, tests, and core E2E journeys are green;
12. remaining external Stripe/legal/tax dependencies are documented honestly rather than simulated as complete.

---

# 0A. EXECUTION DIRECTIVE

START EXECUTION NOW.

Work directly from the CURRENT default branch of the `arsenijee19/zerofee` repository.

Read this file COMPLETELY before making architecture, payment, pricing, tax, UX, compliance, database, or provider decisions.

Until the owner explicitly says otherwise, **Prompt 1 is the living master specification for the ENTIRE first prototype**. Do not create Prompt 2 because implementation is large. Prompt 2, if present, is a visual/design specification only and must never override Prompt 1 business logic, financial invariants, security rules, or data behavior.

Do not:

- summarize this specification instead of executing it;
- stop after scaffolding;
- stop after a pretty homepage;
- stop after a mock Stripe button;
- leave core buttons or navigation dead;
- fake successful KYC/payment/payout/tax/compliance state in live mode;
- invent Stripe capabilities;
- hardcode one country's Stripe fee and pretend it applies globally;
- use one ambiguous `country` field for all payment logic;
- claim a creator earnings guarantee when the payment route cannot mathematically support it;
- silently subsidize creator processing costs from ZeroFee SaaS revenue;
- silently retain a processing-cost surplus that belongs to the creator;
- rewrite already-correct code merely because the prompt is being rerun;
- restart execution from Phase 0 after every minor defect;
- enter an infinite “audit → rewrite → audit → rewrite” loop;
- claim production readiness before external Stripe, legal, tax, and live guarantee validation are complete.

Where credentials/approvals are unavailable, use deterministic mock/test providers behind the same production domain interfaces. The whole product must be demonstrable without live money while the production Stripe integration boundary remains real and implementation-ready.

---

# 0B. ANTI-LOOP EXECUTION CONTRACT

The purpose of this section is to prevent repeated prompt execution, duplicate rewrites, and wasted cycles.

## 0B.1 Execution ledger

Create and maintain:

`docs/EXECUTION_STATE.md`

It must contain one row per implementation phase with:

- phase number/name;
- `NOT_STARTED`, `IN_PROGRESS`, `COMPLETE`, or `BLOCKED_EXTERNAL`;
- key implementation commits/files;
- test evidence;
- screenshot evidence where applicable;
- known non-blocking follow-ups;
- external blockers.

On every future run:

1. read `docs/EXECUTION_STATE.md`;
2. verify the repository reality against it;
3. resume from the first genuinely incomplete phase;
4. do NOT redo completed phases unless a regression is proven.

## 0B.2 One primary implementation pass

Each phase gets one primary implementation pass followed by targeted verification.

When verification finds defects:

- fix only the affected subsystem;
- rerun the affected tests/screenshots;
- do not restart unrelated phases.

## 0B.3 Bounded visual QA

For each major surface, perform:

1. implementation;
2. first screenshot review;
3. targeted fixes;
4. second verification screenshot if fixes were needed.

Do not endlessly redesign a page after it satisfies the design system, usability, responsiveness, and acceptance criteria.

Security/financial correctness blockers must be fixed until correct, but use targeted remediation rather than restarting the prompt.

## 0B.4 Current-state preservation

Before modifying any existing feature:

1. inspect current implementation;
2. preserve what already satisfies this spec;
3. identify exact gap;
4. implement only what is missing/incorrect;
5. test regression-sensitive behavior.

Never replace a functioning implementation merely for stylistic coding preference.

---

# 1. PRODUCT THESIS

ZeroFee is a creator membership, subscription, and community SaaS with a different economic model from percentage-revenue creator platforms.

Central concept:

# Choose what you earn.

A creator starts by deciding:

> **How much do I want to earn per successful member payment?**

ZeroFee then determines whether the buyer/payment context is eligible for Guaranteed Earnings and calculates the minimum buyer-facing retail price required to preserve at least that creator earnings target under the verified payment/tax model.

Conceptual example only:

- Creator Earnings Target: `€10.00`;
- eligible final buyer price: `€10.xx/month`;
- buyer sees and explicitly approves the final recurring price;
- processor receives its real payment cost;
- ZeroFee membership transaction fee is `€0.00`;
- creator receives at least `€10.00` from that successful eligible non-refunded/non-disputed earning event;
- if the real provider cost is lower than the conservative amount priced into the quote, the surplus belongs to the creator;
- ZeroFee never keeps that surplus as a hidden transaction fee.

The exact sample retail numbers are illustrative and must never be treated as global Stripe pricing.

Primary positioning:

> **The membership platform that doesn't tax your success.**

Supporting positioning:

- **Choose what you earn.**
- **0% ZeroFee platform fee on membership revenue.**
- **0% ZeroFee payout markup.**
- **Payment processing at provider cost.**
- **Your money lives with your connected payment provider, not a ZeroFee wallet.**
- **Don't trust us. Verify it.**

---

# 2. TARGET CREATOR

Primary target is not a hobby creator earning $20/month.

Prioritize creators who already have meaningful recurring audience revenue:

- YouTubers;
- podcasters;
- newsletter writers;
- educators;
- developers/open-source creators;
- gaming communities;
- Discord/Telegram communities;
- analysts/research creators;
- professional niche communities;
- permitted coaches/experts;
- existing Patreon/Buy Me a Coffee-type creators;
- creators making hundreds to tens of thousands of dollars per month or more.

Small creators may still use ZeroFee, but acquisition messaging should focus on creators for whom percentage platform fees are materially expensive.

---

# 3. NON-NEGOTIABLE ECONOMIC INVARIANTS

These are hard domain rules, not marketing suggestions.

1. `creator_membership_gmv != zerofee_saas_revenue`.
2. `zerofee_membership_platform_fee_bps = 0`.
3. `zerofee_membership_application_fee = 0`.
4. `zerofee_processing_markup = 0`.
5. `zerofee_payout_markup = 0`.
6. ZeroFee does not silently pay creator processing costs from flat SaaS revenue.
7. ZeroFee does not silently retain processing-cost surplus.
8. Guaranteed Earnings is enabled only for verified eligible payment routes.
9. Buyer approves the final price before payment.
10. Tax is distinct from processor cost and distinct from ZeroFee fee.
11. Refund/dispute can reverse previously recognized creator earnings.
12. Creator Earnings, provider balance, and payout are different concepts.
13. Provider/bank payout costs do not retroactively redefine historical Creator Earnings.
14. Direct charges are the preferred creator-payment topology subject to Stripe approval.
15. No custodial internal creator wallet in Prompt 1.
16. ZeroFee SaaS plans scale by usage/features/member count, not a revenue percentage.
17. Provider pricing/liability/tax/country capability is provider truth, not a hardcoded assumption.
18. Creator data is portable.

---

# 4. ZERO FEE SAAS BUSINESS MODEL

ZeroFee makes money from fixed SaaS subscriptions.

Support multiple configurable plans from the first prototype.

Seed DEMO plans, editable by admin, such as:

| Plan | Demo monthly price | Example active-member allowance |
|---|---:|---:|
| Starter | $19 | 100 |
| Creator | $49 | 1,000 |
| Pro | $99 | 5,000 |
| Business | $199 | 25,000 |

These are prototype defaults, not permanent commercial decisions.

Plans may differ by:

- active members;
- storage;
- bandwidth/resource use;
- email/broadcast quota;
- API quota;
- analytics retention;
- integrations;
- team-seat architecture;
- custom domain entitlement;
- automations;
- support level;
- advanced community features.

They must not scale directly with GMV/revenue.

Admin must manage plan versions and entitlements without code deployment.

Implement separate `PlatformBillingProvider` and platform subscription states:

- `NONE`;
- `TRIALING`;
- `ACTIVE`;
- `PAST_DUE`;
- `GRACE`;
- `SUSPENDED`;
- `CANCEL_AT_PERIOD_END`;
- `CANCELLED`.

Keep creator data after a billing lapse. Apply a clear grace/suspension policy.

Create `docs/UNIT_ECONOMICS.md` covering SaaS MRR vs creator GMV, major variable-cost risks, support/moderation costs, storage/email/API costs, and suggested gross-margin telemetry.

---

# 5. PRECISE FINANCIAL DEFINITIONS

Use these consistently across code, DB, dashboard, API, and copy.

## 5.1 Creator Earnings Target

Amount the creator chooses to receive as the **minimum economic proceeds** for one successful eligible membership payment before later creator-selected payout/bank/FX costs and before creator income/corporate tax.

Example: `€10.00`.

## 5.2 Customer Retail Price

Final membership selling price presented to the buyer for the resolved payment context, subject to configured tax presentation rules.

The buyer sees a normal final price, not a surprise `+ ZeroFee processing fee` line item.

## 5.3 Payment Provider Cost

Real cost charged by Stripe/provider for processing the transaction.

## 5.4 ZeroFee Platform Transaction Fee

Always `0` for creator membership sales in this business model.

## 5.5 Verified Creator Earnings

For a successful Guaranteed Earnings event:

`actual creator proceeds after creator-borne provider transaction costs and configured indirect-tax treatment`.

If Verified Creator Earnings > Creator Earnings Target, the difference is **Creator Surplus** and belongs to the creator.

## 5.6 Creator Surplus

If buyer pays €12, provider actual cost is €1.50, and creator target is €10:

- actual creator proceeds = €10.50;
- Creator Earnings Target = €10.00;
- Creator Surplus = €0.50;
- ZeroFee transaction fee = €0.00.

Creator Surplus is not a ZeroFee fee and must not be transferred to ZeroFee.

## 5.7 Provider Account Balance

Actual connected-account pending/available balance from provider. It is not identical to lifetime Creator Earnings due to payouts, reserves, refunds, tax movements, timing, or other provider activity.

## 5.8 Payout

Movement of already-earned funds from provider balance to creator payout destination.

## 5.9 Amount Sent vs Amount Landed

If provider confirms it sent €1,000, show `Amount sent: €1,000`.

Do not claim `€1,000 landed in bank` if receiving/intermediary bank costs are outside provider visibility.

---

# 6. GUARANTEED EARNINGS MODEL

Guaranteed Earnings is the defining pricing mode where technically eligible.

Creator chooses:

`Creator Earnings Target = X`

System calculates the minimum buyer price that produces:

`modelled_creator_proceeds >= X`

under a verified payment context and pricing rule set.

## 6.1 Guarantee is a minimum

The correct invariant is:

`verified_creator_earnings >= creator_earnings_target`

not necessarily strict equality.

Outcomes:

- `verified == target` → exact match;
- `verified > target` → Creator Surplus, belongs entirely to creator;
- `verified < target` → Guarantee Breach.

A surplus is NOT an incident merely because it exists. However, persistent or material surplus indicates over-conservative buyer pricing and must be monitored so buyers are not systematically overcharged.

## 6.2 Guarantee scope

Guarantee applies only to:

- successfully captured/settled provider payments according to provider semantics;
- payment routes marked Guaranteed-Earnings eligible;
- the quote accepted by the buyer;
- transactions not subsequently refunded or reversed;
- transactions not subsequently lost through chargeback;
- creator earnings before later payout/bank/creator-selected FX costs;
- configured indirect tax treatment;
- the fee/tax rule versions active for that quote.

It does NOT promise:

- no refund risk;
- no chargeback risk;
- no reserves;
- no taxes;
- no bank costs;
- identical immediate payout availability;
- every country/payment method is supported.

## 6.3 Simple Price fallback

Support a separate mode:

`SIMPLE_PRICE`

Creator chooses what buyer pays, processor costs are deducted according to provider rules, and there is no Guaranteed Earnings promise.

UI must distinguish clearly:

- **Guaranteed Earnings — choose what you earn**;
- **Simple Price — choose what the member pays**.

---

# 7. GUARANTEE PRICING ENGINE — FINANCIAL CORE

Implement a dedicated server-side `GuaranteePricingEngine`.

This is one of the most important technical assets of the product.

Never calculate money with binary floating point.

Use:

- integer minor units;
- ISO currency metadata;
- fixed/decimal rates;
- explicit rounding rules;
- immutable pricing snapshots;
- versioned provider fee rules;
- versioned guarantee eligibility rules;
- versioned tax rules/results.

## 7.1 Do not use one country field

The calculation context must distinguish at minimum:

- platform legal entity country;
- ZeroFee Stripe platform account country;
- creator connected-account country;
- creator legal type where relevant;
- creator settlement currency;
- buyer billing/tax country;
- payment instrument issuer country/region where provider exposes relevant category;
- presentment currency;
- settlement currency;
- payment method family;
- card/payment classification if provider pricing varies and legally/provider-available;
- domestic/cross-border relationship;
- FX required/not required;
- recurring/Billing cost component if borne by creator;
- indirect tax context;
- pricing rule version;
- provider capability version.

Never infer buyer payment-country economics solely from IP geolocation.

## 7.2 Provider Pricing Catalog

Implement a versioned `ProviderPricingCatalog` / equivalent domain.

A pricing rule must contain:

- provider;
- source type: official public pricing, contractual pricing, verified provider account config, or test-only;
- source/reference URL or internal evidence reference;
- source captured/verified date;
- creator/account country scope;
- issuer/buyer region classification;
- presentment/settlement currency scope;
- payment method family;
- card class if relevant;
- percentage fee;
- fixed fee;
- recurring/Billing fee if relevant;
- cross-border modifier;
- FX modifier;
- fee payer;
- tax-on-fee behavior if relevant;
- rounding rule;
- minimum/maximum fee if applicable;
- effective from/to;
- status `DRAFT`, `TEST_ONLY`, `VERIFIED`, `EXPIRED`, `PAUSED`;
- reviewer/approval metadata.

Never scrape or hardcode stale fee tables as permanent truth.

## 7.3 Fee confidence types

A guarantee route may use:

### `EXACT_FORMULA`

A deterministic fee formula is known for the resolved context.

### `VERIFIED_UPPER_BOUND`

A verified maximum creator-borne provider cost is known for a tightly defined context. Price using that upper bound. If real cost is lower, creator receives the surplus.

### `UNKNOWN_OR_VARIABLE`

No sufficiently reliable formula or upper bound is known. Guaranteed Earnings must be disabled for that route.

## 7.4 Minimal retail price solver

Do not merely add an arbitrary buffer.

Implement an integer/minor-unit solver that finds the **lowest permitted Customer Retail Price** satisfying:

`modelled_creator_proceeds >= creator_earnings_target`

The solver must account for the complete configured model, including percentage fees, fixed fees, Billing fees, cross-border modifiers, FX, taxes, and rounding.

Property requirement:

For a valid guaranteed quote:

1. calculated price must satisfy the target;
2. if the price is reduced by the smallest currency unit, it should no longer satisfy the target, unless price-step/business rules explain otherwise.

This proves we are not unnecessarily padding buyer price.

## 7.5 Unknown context

If required payment context is unknown before final confirmation, use a secure two-stage checkout:

1. provider component obtains the minimum payment-method context without exposing raw card data to ZeroFee;
2. server resolves payment route and guarantee eligibility;
3. server calculates final retail price;
4. buyer reviews the final recurring amount;
5. buyer explicitly confirms;
6. provider creates/confirms payment/subscription;
7. webhook activates entitlement;
8. authoritative provider fee data is reconciled afterward.

If a route cannot be classified safely before charge, do not offer Guaranteed Earnings for that route.

## 7.6 Quote object

Create immutable `MembershipPriceQuote` containing:

- quote ID;
- creator/tier/price version;
- user/session/member reference;
- Creator Earnings Target;
- Customer Retail Price;
- tax amount/behavior;
- provider pricing rule version;
- Guarantee Eligibility Profile version;
- normalized payment-context classification, not raw PAN/card data;
- currencies;
- billing interval;
- quote expiry;
- status;
- acceptance timestamp;
- provider references;
- reconciliation reference.

Expired quotes must be recalculated.

---

# 8. GUARANTEE ELIGIBILITY

Implement a versioned `GuaranteeEligibilityProfile` with:

- provider;
- creator country;
- buyer/issuer region class;
- presentment currency;
- settlement currency;
- payment method family;
- payment/card classification if needed;
- pricing rule version;
- tax compatibility;
- fee confidence type;
- deterministic/upper-bound evidence;
- provider-contract verification;
- production-test status;
- effective from/to;
- status `DISABLED`, `TEST_ONLY`, `ELIGIBLE`, `PAUSED`;
- owner/admin approval;
- evidence notes/reference.

Live Guaranteed Earnings requires `ELIGIBLE`.

Stale or expired provider pricing automatically prevents new guaranteed quotes until reverified.

---

# 9. GUARANTEE RECONCILIATION

Every successful Guaranteed Earnings payment must reconcile against authoritative provider data.

Implement `GuaranteeReconciliationService`.

Store:

- Creator Earnings Target;
- Customer Retail Price;
- actual gross charge;
- actual tax;
- actual provider fee;
- provider balance-transaction net where available;
- ZeroFee platform/application fee = 0;
- actual creator proceeds;
- Creator Surplus;
- shortfall;
- provider transaction IDs;
- rule/profile versions;
- reconciliation status.

Statuses:

- `PENDING_PROVIDER_DATA`;
- `VERIFIED_TARGET_MET`;
- `VERIFIED_WITH_SURPLUS`;
- `GUARANTEE_SHORTFALL`;
- `REFUNDED`;
- `DISPUTED`;
- `REVERSED`;
- `MANUAL_REVIEW`.

On `GUARANTEE_SHORTFALL`:

- immediate admin alert;
- preserve evidence;
- optionally auto-pause affected eligibility profile;
- do not hide/round away the difference;
- do not automatically fund the difference from ZeroFee SaaS revenue;
- require targeted review of the affected pricing route.

On surplus:

- creator keeps 100% of surplus;
- ZeroFee receives 0;
- monitor average surplus percentage to detect systematic overpricing;
- allow admin to refine the provider pricing rule after evidence/testing.

Create an admin `Guarantee Health` center.

---

# 10. RENEWALS AND REPRICING

Recurring guarantees must remain valid beyond the first payment.

Create versioned `GuaranteedMembershipContract` containing:

- Creator Earnings Target;
- recurring Customer Retail Price;
- currency;
- payment route classification;
- Guarantee Eligibility Profile version;
- pricing rule version;
- tax model version;
- effective date;
- buyer acceptance reference.

If provider pricing changes and the old buyer price no longer protects the creator target:

- mark `REPRICE_REQUIRED`;
- calculate new retail price;
- notify creator;
- follow legally/provider-valid buyer notice/consent workflow;
- do not silently raise buyer price;
- do not silently underpay creator;
- if repricing cannot legally/operationally occur, pause/cancel future renewal according to policy.

If buyer changes payment method, resolve guarantee eligibility again and obtain confirmation for any required recurring-price change.

Preserve historical price versions and grandfathering.

---

# 11. STRIPE CONNECT ARCHITECTURE

Use current official Stripe documentation at implementation time.

Preferred production topology:

buyer → Stripe/provider → creator connected account

NOT:

buyer → ordinary ZeroFee wallet → ZeroFee manually redistributes creator funds.

## 11.1 Platform operating entity

The code/domain must support a configurable `PlatformOperatingEntity`.

The owner currently expects the ZeroFee platform to operate under a US entity and use a dedicated ZeroFee Stripe account rather than mixing unrelated business payment flows. Do not hardwire business/legal assumptions throughout the code; expose them through configuration/docs and confirm them before production.

## 11.2 Connected account onboarding

Creator should not need to manually create a Stripe account at stripe.com first.

Flow:

1. ZeroFee application approved;
2. creator selects `Set up payouts`;
3. backend creates/retrieves connected account;
4. ZeroFee prefills legally permitted data;
5. Stripe embedded onboarding collects KYC/legal/bank details;
6. creator personally accepts provider agreements;
7. ZeroFee synchronizes capabilities/requirements;
8. creator sales only enable when ZeroFee and provider requirements pass.

Support individuals and companies according to country/provider capability.

Do not store raw KYC documents if Stripe can collect them directly.

## 11.3 Embedded UX + independent verification

Normal creator workflow should remain inside ZeroFee using supported embedded components for onboarding, account management, balances, payments, disputes, payouts, etc.

Where the chosen connected-account configuration supports it, also provide:

`Verify in Stripe` / `Open Stripe Dashboard`

This supports:

> **Don't trust us. Verify it.**

## 11.4 Provider responsibility flags

Admin must expose real capability/configuration facts, not assumptions:

- `CONTENT_PLATFORM_APPROVAL_CONFIRMED`;
- `DIRECT_CHARGES_ENABLED`;
- `STRIPE_FEES_COLLECTED_FROM_CONNECTED_ACCOUNT`;
- `STRIPE_MANAGED_LOSS_LIABILITY_CONFIRMED`;
- `FULL_STRIPE_DASHBOARD_AVAILABLE`;
- `EMBEDDED_ONBOARDING_AVAILABLE`;
- `EMBEDDED_BALANCES_AVAILABLE`;
- `EMBEDDED_PAYOUTS_AVAILABLE`;
- `GUARANTEED_EARNINGS_LIVE_ALLOWED`;
- `STRIPE_TAX_ENABLED`;
- `LIVE_CHARGES_ALLOWED`.

Mock flags must be visibly labelled TEST/DEMO.

---

# 12. PAYOUT SYSTEM

Payout is a first-class creator experience.

Use Stripe/provider embedded Payouts/Balances or supported APIs.

Where available support:

- automatic scheduled payouts;
- manual standard payouts;
- instant payouts.

Creator payout screen must separate:

- pending provider balance;
- available provider balance;
- payout destination summary;
- next scheduled payout;
- recent payouts;
- provider restrictions;
- provider payout cost;
- `ZeroFee payout fee = 0`;
- amount sent.

If provider payout cost is unknown until processing, label an estimate honestly and replace it with actual result afterward.

If downstream bank/intermediary costs are unobservable, show:

> **We sent €X. Receiving or intermediary banks may apply their own fees.**

Payout must never rewrite historical Creator Earnings.

---

# 13. FINANCIAL VERIFICATION

Transparency must be functional.

Build `Financial Verification` views for creators and admin.

For each membership payment show:

- buyer-facing charged amount;
- tax amount/status;
- actual provider processing cost;
- ZeroFee platform fee = 0;
- Creator Earnings Target;
- Verified Creator Earnings;
- Creator Surplus if any;
- reconciliation status;
- provider transaction reference;
- Stripe verification/deep link when supported.

Provide downloadable reconciliation export.

Do not claim lifetime Creator Earnings must equal current Stripe available balance; prove each attributable payment instead.

---

# 14. COUNTRY / MARKET CAPABILITY REGISTRY

Do not pretend global support.

Implement `CountryCapabilityRegistry` with, per country/market:

- creator onboarding enabled;
- individual supported;
- company supported;
- charges enabled;
- payouts enabled;
- supported presentment currencies;
- supported settlement currencies;
- payment methods;
- connected-account/dashboard capabilities;
- Guaranteed Earnings routes;
- tax readiness;
- legal/terms readiness;
- provider approval state;
- manual review requirement;
- launch status `UNSUPPORTED`, `WAITLIST`, `BETA`, `AVAILABLE`, `PAUSED`;
- evidence/reference/verified date.

Registration must gate creator onboarding based on this registry.

Never hardcode current country availability from memory.

Create `docs/COUNTRY_AND_CURRENCY_STRATEGY.md`.

---

# 15. MERCHANT / TAX RESPONSIBILITY

ZeroFee's intended model is creator-side sales rather than ZeroFee acting as Merchant of Record for creator content, subject to actual legal/provider confirmation.

Implement `CommerceResponsibilityProfile` containing:

- intended seller;
- platform operating entity;
- provider;
- merchant-of-record status: `UNKNOWN`, `CONFIRMED_FALSE`, `CONFIRMED_TRUE`;
- tax calculation provider;
- tax collection responsibility;
- tax remittance responsibility;
- receipt/invoice issuer;
- statement descriptor policy;
- jurisdiction scope;
- legal-review status;
- effective date.

Do not infer merchant status from marketing copy.

---

# 16. VAT / GST / SALES TAX

Tax is first-class from Prompt 1.

Implement `TaxProvider = mock | stripe_tax | disabled` or equivalent.

Support:

- seller/creator country;
- buyer billing/tax location obtained through legitimate payment flow;
- product/service tax category;
- tax-inclusive/exclusive presentation;
- creator registration references;
- tax calculation snapshot;
- tax jurisdiction;
- tax amount;
- collection/remittance owner/status;
- receipt/invoice metadata;
- exemption/tax-ID architecture;
- `UNKNOWN/NOT_CONFIGURED` states.

Do not build homemade global tax law.

Guaranteed Earnings solver must account correctly for tax-inclusive/exclusive treatment so indirect tax does not silently reduce creator target.

Create creator Tax Center and `docs/TAX_ARCHITECTURE.md`.

ZeroFee's own SaaS tax is separate from creator-to-fan tax.

---

# 17. CREATOR APPLICATION / COMPLIANCE

Stripe KYC answers who the creator is. ZeroFee separately decides whether the offering is allowed.

Collect only necessary information:

- creator display name;
- individual/business;
- country;
- category;
- detailed paid offering;
- examples of paid content/benefits;
- public website/social links;
- audience range;
- expected membership revenue range;
- content formats;
- planned integrations;
- rights/ownership confirmation;
- Creator Terms acceptance;
- Acceptable Use acceptance;
- prohibited-content acknowledgement.

States:

- `DRAFT`;
- `SUBMITTED`;
- `UNDER_REVIEW`;
- `NEEDS_INFORMATION`;
- `APPROVED_FOR_PAYOUT_ONBOARDING`;
- `REJECTED`;
- `SUSPENDED_POST_APPROVAL`.

Admin can review, request info, approve, reject with reason, suspend, add private notes, and inspect immutable history.

Creator cannot self-approve.

---

# 18. STRIPE CONTENT-PLATFORM APPROVAL

Treat Stripe approval for creator-content memberships as a launch dependency.

Create `docs/STRIPE_APPROVAL_READINESS.md` covering:

- business model;
- creator categories;
- adult/prohibited-content policy;
- creator review;
- direct charges;
- connected-account responsibility/dashboard configuration;
- Guaranteed Earnings concept;
- 0% application/platform fee;
- moderation/reporting;
- KYC division;
- refunds/disputes;
- payout UX;
- tax architecture;
- target countries;
- exact questions needing Stripe confirmation.

Do not mark approval confirmed until real confirmation exists.

---

# 19. PROHIBITED CONTENT / MODERATION / DSA READINESS

ZeroFee Stripe-based product is not an adult-content payment workaround.

Conservatively prohibit at minimum:

- illegal goods/services;
- pornography/sexual services prohibited by provider;
- sexual exploitation/CSAM/non-consensual sexual content;
- prohibited extremist/terrorist activity;
- illegal weapons;
- controlled drugs;
- stolen goods;
- scams/fraud;
- pyramid/money-circulation abuse;
- disguised money transmission;
- phishing/malware/credential theft;
- piracy/copyright infringement;
- doxxing/private-data sale;
- impersonation;
- current provider-prohibited categories.

Implement:

- Acceptable Use;
- Creator Terms;
- Terms;
- Privacy placeholder;
- report creator/content;
- copyright report;
- fraud/scam report;
- moderation queue;
- takedown/suspension;
- creator notice;
- appeal/contact path;
- evidence/history;
- audit.

Do not label prototype legally compliant without professional review.

---

# 20. USERS / ROLES / AUTHORIZATION

## Visitor

Marketing, public creators/posts, signup/login.

## Member/Fan

Profile/security, memberships, checkout, final quote review, billing actions, entitlement access, comments, support/refund, reporting, data export/deletion architecture.

## Creator

Application, KYC/payouts, SaaS billing, profile, tiers/pricing, content, member management, Creator Earnings, financial verification, provider balance/payouts, tax, migration, integrations, broadcasts, API/webhooks, refunds/disputes where provider permits, export.

## Admin/Owner

Applications, creator suspension, moderation, support, SaaS plans, fee catalog, Guarantee Eligibility, Guarantee Health, country registry, merchant/tax configuration, provider capabilities, webhooks, audit, platform metrics, feature flags, mock controls, manual entitlements with reason.

Authorization is server-side. Hiding navigation is not authorization.

---

# 21. AUTHENTICATION / SECURITY

Implement real authentication:

- secure email/password or equivalent first-party flow;
- strong password hashing;
- normalized email;
- secure sessions/cookies;
- session invalidation;
- login/register rate limits;
- password reset;
- email verification with mock-email provider;
- CSRF protection appropriate to stack;
- safe auth errors;
- no secrets client-side;
- server RBAC.

Security review must include:

- IDOR;
- role escalation;
- CSRF;
- XSS/rich text;
- SQL injection/raw queries;
- SSRF;
- unsafe redirects;
- file MIME spoofing;
- oversized uploads;
- path traversal;
- webhook spoof/replay;
- quote tampering;
- creator-target/retail-price tampering;
- guarantee-profile bypass;
- duplicate earnings events;
- payout action for wrong connected account;
- session/cookie issues;
- KYC/PII leakage;
- API-key abuse;
- OAuth token storage;
- cross-creator data leakage.

Create `docs/SECURITY.md` with threat model/trust boundaries and known production hardening work.

---

# 22. CREATOR PROFILE / MEMBERSHIP PRODUCT

Creator profile:

- display name;
- unique slug;
- avatar/banner;
- short bio/about;
- social links;
- category;
- constrained theme/accent;
- featured tier/posts;
- support preference;
- honest approval indicator if defined.

Membership tier:

- name;
- description;
- benefits;
- draft/published/archived;
- sort order;
- monthly/annual;
- currency;
- `GUARANTEED_EARNINGS` or `SIMPLE_PRICE`;
- Creator Earnings Target when guaranteed;
- price/contract versions;
- eligible payment-route constraints;
- member count;
- content mapping;
- trial;
- coupon eligibility;
- grandfathering/migration status.

Do not implement unrestricted peer-to-peer cash transfer disguised as memberships.

---

# 23. CONTENT / COMMUNITY CONTENT

Support posts with:

- title;
- slug;
- excerpt;
- body;
- cover;
- safe attachments/downloads;
- visibility: public/all paid/selected tiers;
- draft/published/archived;
- publish time;
- creator ownership.

Use storage abstraction and quotas.

Do not build proprietary large-scale video transcoding/CDN in Prompt 1. Support external video/embed or a provider abstraction.

Never publicly/offline cache private paid content.

Comments:

- creator enable/disable;
- authenticated comments;
- delete own;
- creator moderation;
- reports;
- admin moderation;
- rate limits.

---

# 24. MEMBER SUBSCRIPTION LIFECYCLE

Statuses:

- `PENDING_QUOTE`;
- `QUOTE_ACCEPTED`;
- `PENDING_PAYMENT`;
- `TRIALING`;
- `ACTIVE`;
- `PAST_DUE`;
- `GRACE`;
- `REPRICE_REQUIRED`;
- `PAUSED` where supported;
- `CANCEL_AT_PERIOD_END`;
- `CANCELLED`;
- `EXPIRED`;
- `REVOKED`;
- `REFUNDED` where relevant.

Member can:

- subscribe;
- resolve/confirm payment context;
- review final recurring price;
- see seller/renewal;
- update payment method;
- accept repricing where needed;
- cancel/resume;
- change tier/monthly/annual;
- see receipts/history;
- support/refund request;
- rejoin.

Creator can view lifecycle/financial state without raw card data and refund/cancel where policy/provider permits.

---

# 25. DUNNING / FAILED PAYMENT RECOVERY

Provider-driven dunning is required.

Flow:

renewal fails → `PAST_DUE` → member notified → payment update/retry → creator sees recovery state → grace → recovered or expired.

Track:

- failed renewals;
- recovered renewals;
- recovery rate;
- involuntary churn.

Do not invent retry algorithms when provider owns retries.

---

# 26. CANCELLATION / PAUSE / TIER CHANGE / PRORATION

Support:

- cancel at period end;
- resume;
- cancellation reason;
- upgrade/downgrade;
- effective date;
- central proration policy;
- preview before change;
- annual/monthly transitions;
- grandfathering;
- pause architecture where provider supports;
- guarantee/repricing recalculation when economics change.

Never silently charge a changed recurring amount without valid notice/confirmation.

---

# 27. COUPONS / TRIALS

Coupons:

- code;
- fixed/percentage discount;
- tiers;
- interval applicability;
- duration;
- date window;
- redemption cap;
- per-user restriction;
- active state.

Trials:

- duration;
- tier eligibility;
- anti-abuse;
- payment-method requirement configurable;
- ending notification;
- conversion analytics.

For Guaranteed Earnings explicitly define who funds promotions. Never silently make ZeroFee fund a creator coupon.

---

# 28. REFUNDS / DISPUTES / REVERSALS

Support:

- full refund;
- partial-refund architecture where provider supports;
- dispute opened/won/lost;
- evidence/status through provider components/APIs;
- reversal;
- membership access policy;
- creator/admin/member visibility;
- mock simulation.

If a previously recognized earning is refunded/reversed, preserve history but update current net earned totals honestly.

ZeroFee does not provide implicit chargeback insurance.

---

# 29. MIGRATE FROM PATREON — CORE ACQUISITION FEATURE

This is required in Prompt 1.

Build a real `Migration Center`, prominently accessible from creator onboarding/dashboard.

## 29.1 CSV import

Support Patreon-oriented preset plus generic CSV mapping for:

- member name;
- email;
- external member ID;
- external tier;
- status;
- billing frequency;
- amount;
- join date;
- last charge where exported;
- paid/entitlement status;
- safe useful metadata.

Never scrape private Patreon data or bypass access controls.

## 29.2 Wizard

1. upload;
2. validation/errors;
3. field mapping;
4. tier mapping;
5. monthly/annual mapping;
6. choose ZeroFee pricing/Creator Earnings strategy;
7. choose grandfathering;
8. import non-payment records;
9. generate migration campaign.

## 29.3 Payment migration truth

Do not pretend existing card credentials can automatically move.

Only implement provider-assisted payment credential/subscription migration when officially supported and explicitly configured.

Otherwise imported members must authorize a new ZeroFee/creator subscription.

Statuses:

- `IMPORTED`;
- `INVITE_READY`;
- `INVITED`;
- `CLICKED`;
- `NEW_SUBSCRIPTION_STARTED`;
- `CONVERTED`;
- `DECLINED_OR_EXPIRED`;
- `ERROR`.

## 29.4 Campaign/dashboard

Provide:

- tokenized migration landing link;
- creator message templates;
- optional creator-authorized incentive;
- grandfathering;
- switch date;
- imported/invited/clicked/converted metrics;
- conversion rate;
- recovered MRR estimate;
- errors/unconverted export.

Create `docs/MIGRATION_ARCHITECTURE.md`.

---

# 30. CREATOR DATA OWNERSHIP / EXPORT

Creator can export legally permissible machine-readable data:

- members/contact data subject to law/permissions;
- tiers/prices/earnings-target settings;
- posts/content metadata;
- subscription lifecycle history;
- analytics summary;
- migration data;
- integration metadata excluding secrets.

Never export raw cards, provider secrets, private admin notes, or data creator is not entitled to.

---

# 31. SUPPORT RESPONSIBILITY SPLIT

Build structured Support Center.

Ticket categories:

- access problem;
- failed payment;
- billing question;
- refund request;
- missing creator benefit;
- suspected fraud/scam;
- content report;
- account/security;
- ZeroFee technical issue;
- guarantee/reconciliation issue.

Creator-first where appropriate: benefit fulfillment, ordinary creator content support, ordinary refund, community access.

ZeroFee-first: platform bug, security, prohibited content, scam escalation, moderation, payment integration malfunction, privacy, guarantee incident.

Admin escalation and full ticket history required.

---

# 32. INTEGRATIONS

## Discord

- creator OAuth/bot connect;
- tier → role mapping;
- member Discord identity;
- active entitlement grants role;
- cancel/expire revokes;
- reconciliation/retry;
- manual resync;
- least privilege;
- audit;
- deterministic mock provider.

## Telegram

Provider architecture for identity link, private community access/invite, revoke/expire where supported, mock provider.

## Signed outbound webhooks

- URL validation;
- SSRF protection;
- HMAC signing;
- secret rotation;
- retry/backoff;
- delivery logs;
- failing endpoint disable policy.

---

# 33. CREATOR API / BROADCASTS

Creator API for entitled plans:

- scoped API keys;
- hashed secret where appropriate;
- one-time secret display;
- scopes;
- created/last-used/revoked;
- rotation;
- rate limits;
- audit.

Safe endpoints: profile, tiers, entitlement lookup, membership events/lists, post metadata, financial reconciliation summary without sensitive provider payloads.

Broadcasts:

- all active members;
- tier;
- payment-recovery group;
- migration contacts where consent/law permits;
- composer;
- recipient preview/count;
- in-app delivery;
- EmailProvider abstraction/mock;
- quota;
- unsubscribe/compliance architecture;
- logs/audit.

---

# 34. GLOBAL SEARCH — USER, CREATOR, ADMIN

Search must be simple, fast, and role-safe.

Implement a unified search experience with server-side authorization.

## 34.1 Creator search

Creator can search within their own scope for:

- members by name/email;
- tiers;
- posts;
- payments/reference/status;
- payouts;
- support tickets;
- migration members;
- integration events where useful.

Never leak another creator's data through search suggestions or counts.

## 34.2 Admin search

Admin can search across:

- users;
- creators;
- creator applications;
- members/subscriptions;
- payments/provider refs;
- payouts;
- support tickets;
- reports/moderation;
- webhooks;
- guarantee incidents;
- country/fee/guarantee profiles.

Provide result groups, keyboard navigation, filters, and direct navigation to the relevant record.

## 34.3 UX

Use a consistent top-bar/global search pattern, optionally `Cmd/Ctrl + K`, plus page-specific table filters.

Search must have:

- debounce/server query limits;
- pagination;
- exact-ID/reference lookup;
- useful empty state;
- accessible keyboard behavior;
- no unauthorized result metadata.

---

# 35. CREATOR DASHBOARD INFORMATION ARCHITECTURE

Dashboard must be clean and operational, not card clutter.

Primary navigation groups:

### Overview
- Home/Overview
- Earnings
- Financial Verification
- Payouts

### Business
- Members
- Membership Tiers
- Content
- Migration
- Broadcasts

### Growth / Integrations
- Analytics
- Integrations
- API/Webhooks

### Account / Compliance
- Payout setup/KYC
- Tax
- ZeroFee Billing
- Support
- Settings
- Export

Top dashboard hierarchy:

1. Creator Earnings;
2. successful earning events;
3. ZeroFee transaction fees = 0;
4. pending/available provider balance separately;
5. next payout separately;
6. guarantee/reconciliation health;
7. member growth/churn;
8. actionable warnings.

Avoid presenting dozens of equal-priority cards.

---

# 36. ADMIN PANEL INFORMATION ARCHITECTURE

Admin must operate the platform efficiently.

Navigation groups:

### Platform
- Overview
- Search
- Users
- Creators
- Applications

### Money / Provider
- Payments overview
- Payout/provider status
- Guarantee Health
- Fee Catalog
- Guarantee Eligibility Profiles
- Webhooks

### Commerce / Compliance
- Countries
- Merchant/Tax
- Reports/Moderation
- Support escalations

### SaaS Operations
- Plans
- Usage/quotas
- Integrations health
- Notifications

### System
- Audit
- Feature flags
- Provider capabilities
- Settings

Admin tables require:

- useful filters;
- saved/default views where simple;
- sorting;
- pagination;
- search;
- compact status badges;
- row-level detail pages;
- no horizontal-scroll disasters on common laptop widths.

---

# 37. WEBHOOKS / EVENT CORRECTNESS

Payment state is provider/server authoritative.

Browser redirect is not proof of payment.

Implement:

- raw-body signature verification;
- platform vs connected-account routing;
- unique provider event IDs;
- idempotent processing;
- persistent event store;
- attempt/status;
- safe errors;
- replay;
- correlation IDs;
- transaction-safe transitions;
- no duplicate membership;
- no duplicate entitlement;
- no duplicate notification;
- no duplicate Creator Earnings event;
- no duplicate guarantee reconciliation.

Handle relevant account, subscription, invoice/payment, refund, dispute, balance-transaction, payout, and platform SaaS billing events.

---

# 38. PROVIDER ABSTRACTIONS / MOCK MODE

Required abstractions:

- `CreatorPaymentsProvider`;
- `PlatformBillingProvider`;
- `TaxProvider`;
- `MediaStorageProvider`;
- `EmailProvider`;
- community integration providers.

Core financial services:

- `PaymentContextResolver`;
- `ProviderPricingCatalogService`;
- `GuaranteeEligibilityService`;
- `GuaranteePricingEngine`;
- `GuaranteeReconciliationService`;
- `CreatorEarningsLedgerService`;
- `PayoutPresentationService`;
- `EntitlementResolver`.

Support:

`CREATOR_PAYMENTS_PROVIDER=mock|stripe`

`PLATFORM_BILLING_PROVIDER=mock|stripe`

`TAX_PROVIDER=mock|stripe_tax|disabled`

Mock provider must deterministically simulate all major happy/error states, including exact guaranteed payment, creator surplus, guarantee shortfall, payout, KYC requirements, renewal, repricing, refund/dispute, dunning, and SaaS billing failure.

Prominently label TEST MODE.

---

# 39. DATA MODEL

Use PostgreSQL with real migrations.

Do not model the product as giant opaque JSON blobs.

Recommended entities, adapting naming to ORM:

### Identity/security
`User`, `Session`, `Role`, `UserRole`, `SecurityEvent`, `ApiKey`.

### Creator
`CreatorProfile`, `CreatorApplication`, `CreatorApplicationRevision`, `CreatorReviewNote`, `CreatorComplianceStatus`, `CreatorConnectedAccount`.

### ZeroFee SaaS
`PlatformOperatingEntity`, `PlatformPlan`, `PlatformPlanVersion`, `PlatformSubscription`, `PlatformEntitlement`, `UsageCounter`.

### Pricing/guarantee
`ProviderPricingRule`, `ProviderPricingRuleVersion`, `GuaranteeEligibilityProfile`, `GuaranteeEligibilityProfileVersion`, `CreatorTier`, `TierPriceVersion`, `MembershipPriceQuote`, `GuaranteedMembershipContract`, `PricingCalculationSnapshot`, `GuaranteeReconciliation`, `GuaranteeIncident`, `Coupon`.

### Tax/commerce
`CommerceResponsibilityProfile`, `CreatorTaxProfile`, `TaxRegistrationReference`, `TaxCalculationSnapshot`, `CountryCapability`.

### Content/community
`Post`, `PostTierAccess`, `MediaAsset`, `Comment`, `CommentReport`.

### Membership
`MembershipSubscription`, `MembershipPayment`, `MembershipEvent`, `CreatorEarningsEvent`, `ManualEntitlement`.

### Provider/payout
`ConnectedBalanceSnapshot`, `PayoutRecord`, `FinancialReconciliationRecord`, `ProviderCustomerReference`, `WebhookEvent`, `PaymentProviderEvent`.

### Migration
`MigrationProject`, `MigrationImportRow`, `MigrationTierMapping`, `MigrationInvite`, `MigrationConversion`.

### Integrations
`CreatorIntegration`, `IntegrationMapping`, `IntegrationSyncEvent`, `OutboundWebhookEndpoint`, `OutboundWebhookDelivery`.

### Safety/support/admin
`ContentReport`, `ModerationAction`, `SupportTicket`, `SupportMessage`, `AuditLog`, `Notification`, `FeatureFlag`, `AdminSetting`.

Required data principles:

- money in minor units;
- explicit currency on every monetary value;
- immutable quote/price/profile versions;
- correct unique constraints;
- external IDs indexed;
- provider event idempotency;
- no cross-creator foreign-key mistakes;
- audit preservation;
- import dedupe;
- secrets not plaintext where avoidable.

---

# 40. PRIVACY / PII MINIMIZATION

- provider collects KYC docs where possible;
- do not store raw bank credentials;
- minimize PII;
- redact provider payloads/logs;
- restrict creator application PII;
- protect migration/member data;
- never expose emails publicly;
- data export/deletion architecture;
- retention documented;
- payment classification stored without raw card/PAN secret data.

---

# 41. MARKETING SITE

Required pages:

- `/`;
- `/pricing`;
- `/how-it-works`;
- `/migration`;
- `/safety`;
- `/faq`;
- auth;
- legal.

Homepage must quickly communicate:

- Choose what you earn;
- 0% ZeroFee membership platform fee;
- 0% ZeroFee payout markup;
- processing at provider cost;
- fixed SaaS subscription;
- direct provider money flow;
- independent Stripe verification where supported;
- migration from existing platforms.

Never say payment processing is free or invent sensational competitor percentages.

Build a savings/break-even calculator separating competitor platform fee from payment processing unless user explicitly enables processing comparison.

---

# 42. PWA / MOBILE WEB

Build intentional high-quality mobile web and installable PWA where practical.

Requirements:

- manifest/installability;
- icons;
- deliberate mobile navigation;
- creator application on phone;
- embedded KYC on phone;
- pricing/quote confirmation on phone;
- creator earnings/payout dashboard on phone;
- no offline caching of paid/private/financial pages;
- no stale service-worker entitlement/payment state.

No native iOS/Android in Prompt 1.

---

# 43. BASELINE DESIGN / PROMPT 2 RELATIONSHIP

Prompt 1 must produce a usable, polished interface even before Prompt 2 is executed.

If `prompts/2_DESIGN_SYSTEM_AND_UX_MASTER_PROMPT.md` exists:

- read it before the design-system/visual implementation phases;
- treat it as authoritative for visual language, layout density, component styling, motion, and screenshot design QA;
- never allow it to change financial, permission, tax, provider, or business behavior defined here.

Prompt 2 is a design layer, not a second product specification.

---

# 44. TECHNICAL STACK

Preferred unless repository already establishes a better sound current decision:

- current stable Next.js App Router;
- TypeScript;
- PostgreSQL;
- mature TS ORM + migrations;
- pnpm;
- Tailwind CSS;
- accessible UI primitives;
- official Stripe SDK;
- current Stripe Connect embedded components;
- Playwright;
- unit/integration runner;
- ESLint/formatting;
- schema-based environment validation.

Prefer a coherent single full-stack app over unnecessary monorepo complexity.

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
/lib/search
/lib/security
/lib/observability
/db or /prisma
/tests
/docs
/scripts
/prompts
```

Create `docs/ARCHITECTURE.md` describing actual implementation.

---

# 45. ENVIRONMENT / OBSERVABILITY / PERFORMANCE / ACCESSIBILITY

Create `.env.example` and runtime validation for database, auth, Stripe, Connect, webhooks, platform Billing, tax, storage, email, integrations, feature flags, and dev seed credentials.

No real secrets committed.

Production mode must fail safely when required configuration is missing.

Performance:

- pagination;
- indexes;
- query limits;
- avoid N+1;
- optimized images;
- no giant provider payloads to client;
- efficient entitlement/search queries;
- batched migration;
- resilient webhook processing.

Observability:

- structured logs;
- correlation ID;
- provider event ID;
- guarantee reconciliation ID;
- redaction;
- health endpoint for app/DB/provider/guarantee health.

Accessibility target: WCAG 2.1 AA fundamentals.

---

# 46. REQUIRED EXECUTION PLAN

Execute in this order. Update `docs/EXECUTION_STATE.md` after each phase.

## Phase 0 — repository audit / bootstrap

- sync current branch;
- inspect every existing file;
- identify what already exists and preserve correct work;
- bootstrap/fix app foundation;
- DB/migrations;
- env validation;
- lint/typecheck/test/build harness;
- initial README;
- execution state ledger.

**Exit evidence:** clean startup, migration runs, checks execute.

## Phase 1 — identity / domain / RBAC

- auth;
- sessions/security;
- roles;
- domain state machines;
- core schema;
- audit;
- deterministic seed framework.

**Exit evidence:** auth/RBAC integration tests green.

## Phase 2 — country / compliance / creator application

- country registry;
- creator pre-screening;
- admin review;
- legal/safety/reporting foundation.

**Exit evidence:** approval/reject/needs-info journeys green.

## Phase 3 — payment provider / Stripe Connect foundation

- provider interfaces;
- mock Connect;
- Stripe implementation boundary;
- embedded onboarding;
- connected-account capabilities;
- webhooks;
- provider readiness;
- Stripe verification/deep-link architecture.

**Exit evidence:** approved creator can become payment-ready in mock mode; Stripe mode fails safely without credentials.

## Phase 4 — SaaS plans / platform billing

- multiple plans;
- quotas;
- platform billing provider;
- grace/suspension;
- admin plan management.

**Exit evidence:** creator entitlement changes correctly with billing states.

## Phase 5 — Provider Pricing Catalog / Guarantee Engine

- payment-context resolver;
- provider pricing catalog;
- fee confidence types;
- Guarantee Eligibility Profiles;
- integer pricing solver;
- quote lifecycle;
- Guaranteed Earnings;
- Simple Price;
- versioning;
- admin catalog/eligibility controls.

**Exit evidence:** financial calculation/property tests green across test matrix.

## Phase 6 — tax / merchant / commerce

- commerce responsibility;
- TaxProvider mock/boundary;
- Stripe Tax boundary;
- tax + guarantee interaction;
- receipt/invoice/descriptor architecture;
- Tax Center.

## Phase 7 — creator product / public page

- profile;
- tiers;
- monthly/annual;
- coupons/trials;
- content/downloads/comments;
- public creator page.

## Phase 8 — buyer subscriptions

- payment context;
- quote;
- final-price review;
- payment;
- webhook activation;
- entitlement;
- renewal;
- dunning;
- cancellation/resume;
- tier change;
- repricing.

## Phase 9 — reconciliation / earnings / payouts

- actual provider fee retrieval;
- guarantee reconciliation;
- Creator Earnings ledger;
- Creator Surplus;
- Financial Verification;
- balances;
- standard/instant payout UX;
- provider deep links.

## Phase 10 — refunds / disputes

- refund/reversal/dispute state;
- economic history updates;
- support/admin visibility.

## Phase 11 — Patreon migration

- CSV importer;
- Patreon mapping preset;
- tier mapping;
- campaign/invite;
- conversion tracking;
- grandfathering;
- exports.

## Phase 12 — integrations / API / broadcasts

- Discord;
- Telegram boundary;
- outbound webhooks;
- creator API;
- broadcasts.

## Phase 13 — search / creator dashboard / admin operations

- global scoped search;
- creator IA;
- admin IA;
- admin Guarantee Health;
- support routing;
- analytics;
- creator export.

## Phase 14 — security / performance / accessibility / observability

- focused security audit;
- abuse tests;
- accessibility;
- performance;
- health/telemetry;
- clean migration run.

## Phase 15 — full functional E2E verification

Run all core journeys against deterministic mock providers.

Fix only failing subsystems. Do not restart completed phases.

## Phase 16 — screenshot visual QA

Run seeded application and capture required screenshots listed below.

Perform one review/fix pass and one verification pass where necessary.

## Phase 17 — documentation / finalization

- README final;
- required docs;
- owner next steps;
- execution state all complete/external-blocked;
- final tests/checks;
- clean working tree;
- commit/push;
- final completion report.

---

# 47. FINANCIAL TEST MATRIX — MANDATORY

Do not test Guaranteed Earnings with only one $10 US-card example.

Create parameterized/property/fuzz tests covering combinations of:

- creator account country classes;
- buyer/issuer region classes;
- payment method families;
- supported card classes where relevant;
- presentment currency;
- settlement currency;
- FX on/off;
- tax-inclusive/exclusive;
- monthly/annual;
- small/normal/large target amounts;
- fixed fee variations;
- percentage fee variations;
- cross-border modifiers;
- upper-bound pricing rules;
- zero-decimal currencies where supported;
- rounding boundaries.

Hard properties:

1. Every guaranteed quote satisfies `modelled_creator_proceeds >= target`.
2. No `UNKNOWN_OR_VARIABLE` route can produce a Guaranteed Earnings quote.
3. Reducing solved retail price by one minor unit must fail target unless a configured price step explains otherwise.
4. Surplus always belongs to creator.
5. ZeroFee transaction/application fee remains zero.
6. A shortfall creates a Guarantee Breach, never a silent write-off.
7. Expired provider pricing cannot issue new guaranteed quotes.

Post-payment reconciliation tests must simulate actual provider fee being:

- exactly predicted;
- lower than predicted → Creator Surplus;
- higher than allowed → Guarantee Breach.

---

# 48. CORE E2E JOURNEYS

Automate representative journeys in Playwright/mock mode:

A. new creator signup → country → application → admin approval → embedded payout setup → SaaS plan → tier → publish;

B. Guaranteed Earnings buyer checkout → payment context → final quote → confirmation → webhook → reconciliation → entitlement;

C. guarantee-ineligible payment method blocked/fallback;

D. Creator Surplus reconciliation;

E. Guarantee Breach → admin alert/profile pause;

F. renewal exact/with surplus;

G. fee/payment-method change → repricing required;

H. standard/instant payout presentation;

I. failed renewal → dunning → recovery;

J. cancellation/resume/tier change;

K. refund/dispute/reversal;

L. Patreon CSV migration → tier mapping → invite → member conversion;

M. creator rejected;

N. KYC extra-info required;

O. SaaS billing past-due/grace/suspend/recover;

P. Discord entitlement grant/revoke;

Q. support escalation;

R. creator export;

S. creator scoped search;

T. admin global search and Guarantee Health.

Critical journeys must run at desktop and phone viewport where meaningful.

---

# 49. SCREENSHOT QA — REQUIRED EVIDENCE

Screenshots must be from the actual running seeded application, not Figma/static concept files.

Capture at minimum:

## Marketing

1. Homepage desktop.
2. Homepage mobile.
3. Pricing + savings calculator.
4. How it works / Guaranteed Earnings explanation.
5. Migration from Patreon page.

## Creator onboarding

6. Country eligibility.
7. Creator application.
8. Application status.
9. Admin application review.
10. Embedded/mock payout onboarding.

## Creator product

11. Creator dashboard desktop.
12. Creator dashboard mobile.
13. Guaranteed Earnings tier builder.
14. Payment-route eligibility/price preview.
15. Members/search view.
16. Content management.
17. Migration wizard.
18. Migration dashboard.
19. Integrations page.
20. Tax Center.

## Financial

21. Earnings page.
22. Financial Verification payment detail.
23. Creator Surplus example.
24. Guarantee Breach/admin incident state.
25. Payout page with standard/instant options.

## Fan

26. Public creator page.
27. Final buyer quote/checkout review.
28. Member dashboard.
29. Paid content locked state.
30. Paid content unlocked state.

## Admin

31. Admin overview.
32. Global search.
33. Creator detail.
34. Provider Pricing Catalog.
35. Guarantee Eligibility Profiles.
36. Guarantee Health.
37. Country registry.
38. Webhook inspector.
39. Moderation/support.

Review each screenshot for:

- overflow/clipping;
- mobile horizontal scroll;
- bad typography hierarchy;
- giant dead space;
- inconsistent spacing;
- too many equal-priority cards;
- unreadable financial numbers;
- ambiguous labels (`revenue`, `balance`, `earnings`, `payout`);
- weak CTA hierarchy;
- poor search/table density;
- confusing status colors;
- missing empty/error states;
- embedded Stripe component framing inconsistency;
- accessibility/contrast issues.

Store screenshot evidence in a sensible non-production artifact folder and reference it in `docs/EXECUTION_STATE.md` / final report.

---

# 50. REQUIRED DOCUMENTATION

Create/update at minimum:

- `README.md`
- `docs/EXECUTION_STATE.md`
- `docs/ARCHITECTURE.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/GUARANTEED_EARNINGS_MODEL.md`
- `docs/PRICING_ENGINE.md`
- `docs/PROVIDER_PRICING_CATALOG.md`
- `docs/PAYOUTS_AND_BALANCES.md`
- `docs/STRIPE_APPROVAL_READINESS.md`
- `docs/COUNTRY_AND_CURRENCY_STRATEGY.md`
- `docs/MERCHANT_AND_TAX_RESPONSIBILITY.md`
- `docs/TAX_ARCHITECTURE.md`
- `docs/MIGRATION_ARCHITECTURE.md`
- `docs/INTEGRATIONS.md`
- `docs/API.md`
- `docs/SEARCH_AND_INFORMATION_ARCHITECTURE.md`
- `docs/LEGAL_AND_COMPLIANCE_OPEN_ITEMS.md`
- `docs/SECURITY.md`
- `docs/UNIT_ECONOMICS.md`
- `docs/PROTOTYPE_LIMITATIONS.md`
- `docs/OWNER_NEXT_STEPS.md`

Docs must describe implementation reality, not aspirational fiction.

---

# 51. OWNER NEXT STEPS CHECKLIST

At completion create `docs/OWNER_NEXT_STEPS.md` in dependency order.

Must separate coding from external owner actions.

Include:

### Company/legal
- final operating entity/jurisdiction;
- legal review of Terms/Creator Agreement/Acceptable Use/Privacy;
- recurring billing/refund policy;
- copyright/DSA process;
- legal review of `Guaranteed Earnings` language.

### Stripe/payment
- dedicated ZeroFee Stripe platform account decision;
- content-platform approval;
- Connect configuration;
- direct charges;
- connected-account fee responsibility;
- loss-liability model;
- embedded/full Dashboard capability;
- supported countries/legal types;
- payout modes/costs;
- statement descriptors;
- platform Billing;
- webhooks;
- test charges/refunds/disputes/payouts.

### Guaranteed Earnings
- authoritative pricing source for launch markets;
- validate exact/upper-bound fee rules;
- approve launch Guarantee Eligibility Profiles;
- closed-beta transaction matrix;
- confirm no shortfalls;
- monitor surplus/overpricing;
- define repricing notices;
- legal signoff on guarantee wording;
- enable `GUARANTEED_EARNINGS_LIVE_ALLOWED` only after validation.

### Tax
- seller/merchant confirmation;
- ZeroFee SaaS tax;
- creator-to-fan tax;
- Stripe Tax decision;
- registrations;
- invoices/receipts;
- reporting forms;
- retention;
- advisor signoff.

### Commercial
- final plan prices/quotas;
- launch countries;
- launch creator verticals;
- migration incentive;
- support/refund policy.

### Infrastructure
- production DB;
- domain/DNS;
- storage;
- email;
- observability;
- backups;
- secrets;
- WAF/CDN/rate limiting;
- security review;
- disaster recovery.

### Closed beta
- real creator onboarding;
- KYC;
- guaranteed pricing validation;
- tax;
- Patreon migration;
- dunning;
- refund/dispute;
- payouts;
- support load;
- infrastructure cost;
- conversion/churn;
- guarantee shortfall rate = zero before public guarantee launch;
- unit economics recalculation.

---

# 52. FINAL COMPLETION REPORT

When Prompt 1 is complete, report:

- final commit SHA;
- branch;
- push status;
- clean/dirty working tree;
- completed phases from `docs/EXECUTION_STATE.md`;
- major implemented flows;
- architecture summary;
- schema/migration state;
- unit/integration/E2E test counts/results;
- lint/typecheck/build;
- screenshot QA evidence and fixes;
- mock provider status;
- Stripe integration status;
- Stripe approval status;
- provider pricing catalog status;
- Guarantee Eligibility Profile status;
- guarantee test matrix result;
- reconciliation/shortfall/surplus test result;
- payout integration state;
- migration from Patreon state;
- search/user/admin panel state;
- country capability state;
- tax state;
- security findings fixed;
- remaining external blockers;
- remaining prototype limitations;
- path to `docs/OWNER_NEXT_STEPS.md`.

Do not say `production ready` unless external legal/payment/tax/guarantee validation is genuinely complete.

---

# 53. PRODUCT ACCEPTANCE CHECKLIST

Prompt 1 is complete only when materially applicable items are true:

1. visitor understands `Choose what you earn`;
2. ZeroFee membership platform fee is 0%;
3. ZeroFee payout markup is 0;
4. processing is never described as free;
5. SaaS revenue and creator GMV are separate;
6. multiple SaaS plans exist;
7. country gating exists;
8. creator application/admin review works;
9. embedded/mock Connect onboarding works;
10. Stripe production integration boundary is real;
11. direct charges are intended topology;
12. no custodial creator wallet;
13. Guaranteed Earnings and Simple Price are distinct;
14. provider pricing catalog is versioned/provenanced;
15. payment context distinguishes creator/buyer/issuer/currency/payment route correctly;
16. guaranteed quotes cannot use unknown/stale pricing routes;
17. minimum-price solver is tested;
18. buyer sees/approves final recurring price;
19. no late ZeroFee fee is added;
20. actual provider fees reconcile after payment;
21. creator surplus goes 100% to creator;
22. shortfall creates Guarantee Breach;
23. admin Guarantee Health exists;
24. renewal/repricing works;
25. Creator Earnings ledger exists;
26. financial verification exists;
27. earnings/balance/payout are clearly separated;
28. payouts can be managed from ZeroFee where provider allows;
29. tax is first-class and separate;
30. monthly/annual tiers work;
31. coupons/trials have explicit economics;
32. webhook-authoritative membership activation works;
33. paid content is server-gated;
34. dunning/recovery works;
35. cancellation/resume/tier change works;
36. refund/dispute accounting works;
37. Patreon migration center works;
38. migration does not fake payment-token transfer;
39. creator export works;
40. support routing works;
41. moderation/reporting works;
42. Discord mock integration works;
43. outbound webhook signing/retry works;
44. creator API is scoped;
45. creator broadcasts respect quotas;
46. creator global search works within scope;
47. admin global search works;
48. admin panel contains plan/country/fee/guarantee/webhook/audit operations;
49. PWA/mobile is intentional;
50. security tests cover quote/price/guarantee/search/IDOR risks;
51. build/lint/typecheck/tests are green;
52. core E2E journeys are green;
53. screenshot QA is completed and defects fixed;
54. docs match implementation;
55. execution state is complete or explicitly external-blocked;
56. no known core feature is left as a dead prototype placeholder.

---

# 54. SCOPE EXCLUSIONS

Do not dilute Prompt 1 with unrelated features unless a dependency requires them:

- native iOS/Android apps;
- Apple/Google IAP;
- adult-content workaround;
- crypto;
- crowdfunding;
- peer-to-peer cash transfer;
- creator-to-creator money transfer;
- proprietary large-scale video CDN/transcoding;
- full newsletter replacement;
- livestreaming;
- AI content generation;
- payroll/accounting suite;
- homemade global tax engine;
- custodial wallet;
- affiliate marketplace;
- general ecommerce marketplace;
- complex multi-PSP smart routing.

Build clean extension points but protect coherence.

---

# 55. DECISION PRINCIPLES

When ambiguous:

1. protect financial correctness;
2. protect guarantee truthfulness;
3. protect authorization/security;
4. protect tax/payment truth;
5. protect creator/buyer clarity;
6. support fewer financial routes rather than lie about exactness;
7. prefer reversible configuration over hardcoded commercial assumptions;
8. prefer provider abstractions over Stripe strings spread throughout UI;
9. preserve history/versioning;
10. preserve auditability;
11. prefer `not supported/not configured` over fake success;
12. never solve UX by lying about money movement;
13. never create revenue share through the back door;
14. never keep creator surplus;
15. never redefine payout cost as lost Creator Earnings;
16. never claim bank landing amount without evidence;
17. never trap creator data;
18. never assume global country/payment support;
19. do not restart completed phases without proven regression;
20. do not call legal/compliance work complete without professional verification.

---

# 56. NORTH STAR

> **ZeroFee is the membership platform where creators choose what they earn, eligible successful membership payments produce at least that Creator Earnings target, any processing-cost surplus stays with the creator, ZeroFee takes 0% of membership revenue and 0% payout markup, provider costs are incorporated into buyer-facing economics instead of hidden from creators, creator funds live with the connected payment provider rather than a ZeroFee wallet, and every important financial claim can be independently verified against provider records. ZeroFee makes money from fixed software subscriptions, not from taxing creator success.**

Shortest product statement:

# You choose your earnings.

# We take 0% of your membership revenue.

# Don't trust us. Verify it.

EXECUTE THE ENTIRE SPECIFICATION ONCE, PHASE BY PHASE, WITH BOUNDED TARGETED QA AND A COMPLETE FIRST PROTOTYPE AS THE OUTPUT.
