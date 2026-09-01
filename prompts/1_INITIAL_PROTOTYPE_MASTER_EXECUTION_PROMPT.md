# ZeroFee — Complete Initial Prototype Master Execution Prompt

**Prompt version:** 1.2  
**Status:** AUTHORITATIVE MASTER SPECIFICATION FOR THE COMPLETE INITIAL PROTOTYPE  
**Repository:** `arsenijee19/zerofee`

---

# 0. EXECUTION DIRECTIVE

START EXECUTION NOW.

Work directly from the CURRENT default branch of the `arsenijee19/zerofee` repository.

Read this file COMPLETELY before making architecture, payment, pricing, tax, UX or data-model decisions.

Until the owner explicitly says otherwise, **Prompt 1 is the living master specification for the entire initial ZeroFee prototype**. Do not create Prompt 2 simply because the scope is large. If this file has changed since a previous implementation run, this newest version overrides earlier assumptions.

The goal is a serious, functional, visually polished, technically coherent, end-to-end prototype of the complete core platform. This is NOT only a landing page, payment proof of concept, dashboard mockup or static design exercise.

Do not:

- summarize this specification instead of executing it;
- stop after scaffolding;
- leave core buttons dead;
- fake KYC, payment, payout, tax or compliance success in live mode;
- invent payment-provider capabilities;
- claim exact financial guarantees where the active payment route cannot mathematically support them;
- claim production readiness before external Stripe, legal and tax dependencies have actually been satisfied;
- ask the owner questions that can safely be resolved from this specification, current repository state, current official provider documentation, or a reasonable reversible technical decision.

Where live credentials, provider approvals or production capabilities are unavailable, implement deterministic mock/test providers behind the SAME domain interfaces required for production. The complete product must remain demonstrable and testable in mock mode without pretending mock financial activity is real money.

The implementation must preserve the following non-negotiable economic identity:

> **ZeroFee is software, not a percentage tax on creator success. Creators choose what they want to earn. ZeroFee takes 0% of membership revenue and 0% platform markup on payouts. Payment-provider costs remain real and are incorporated transparently into the buyer-facing economics. ZeroFee earns money from fixed SaaS subscriptions.**

---

# 1. PRODUCT THESIS

ZeroFee is a creator membership, subscription and community SaaS platform built around a fundamentally different pricing philosophy from percentage-revenue membership platforms.

The central concept is:

# Choose what you earn.

The creator does not begin by asking:

> “What price should my fan see, and how much will eventually remain after everyone takes their cut?”

Instead, the creator begins by deciding:

> **“How much do I want to earn per successful member payment?”**

ZeroFee then calculates the buyer-facing retail price required to support that creator earnings amount on an eligible payment route.

Example product concept:

- creator selects `€10.00 creator earnings per monthly member`;
- ZeroFee determines an eligible final retail price for the buyer, for example `€10.41/month` in a configured demonstration context;
- buyer sees the FINAL retail price before confirmation;
- payment provider receives its actual processing cost;
- ZeroFee platform transaction fee is `€0.00`;
- creator's verified Creator Earnings for that successful eligible payment are `€10.00`;
- 100 such successful non-refunded/non-disputed earnings events produce `€1,000.00 Creator Earnings`.

The exact `€10.41` example is illustrative only. Never hardcode or market one sample fee as globally true.

The core differentiation is not merely:

> “Patreon but cheaper.”

The intended positioning is:

> **The membership platform that doesn't tax your success.**

and:

> **Set what you earn.**

---

# 2. TARGET CUSTOMER

The primary market is not a creator earning $20–$50/month.

Primary target creator profiles include:

- established YouTubers;
- podcasters;
- newsletter writers;
- educators;
- developers and open-source creators;
- gaming communities;
- Discord/Telegram communities;
- analysts/research creators;
- professional niche communities;
- permitted coaches and experts;
- creators already operating paid memberships elsewhere;
- creators earning hundreds, thousands, tens of thousands or more per month from recurring audience revenue.

ZeroFee should still be usable by smaller creators, but the acquisition story is strongest where a percentage-based platform fee becomes expensive.

---

# 3. NON-NEGOTIABLE PRODUCT PROMISES

The prototype, code, UX and marketing must be built around the following promises.

## 3.1 ZeroFee membership revenue fee

`ZeroFee platform transaction fee on creator membership revenue = 0%`

ZeroFee does not take an application/platform percentage from creator membership sales in the initial product.

## 3.2 ZeroFee payout fee

`ZeroFee platform markup on creator payouts = 0`

If Stripe, another processor, a payout network, an intermediary bank or receiving bank charges a real payout/FX/banking cost, that cost is not a ZeroFee markup.

## 3.3 ZeroFee financial transaction markup

For the initial business model:

`ZeroFee markup on payment processing = 0`

`ZeroFee markup on payout-provider cost = 0`

`ZeroFee application fee on creator membership charge = 0`

ZeroFee earns money from creator SaaS subscriptions, not from inserting a hidden spread into financial transactions.

Do not implement Stripe application fees on creator membership sales unless this master specification is explicitly changed by the owner later.

## 3.4 ZeroFee SaaS revenue

ZeroFee charges creators a fixed SaaS subscription according to their product/usage tier.

That SaaS subscription is a separate transaction and accounting relationship from fan membership revenue.

## 3.5 Money custody

The intended payment topology is creator-side direct charges to the creator's connected payment account.

ZeroFee should be able to truthfully say, subject to final provider/legal configuration:

> **We don't hold your membership money in a ZeroFee wallet.**

Do not build a custodial internal creator wallet for Prompt 1.

## 3.6 Data ownership

The anti-greed philosophy applies to data as well as money.

Creators must have meaningful exportability and must not be intentionally locked into ZeroFee.

---

# 4. PRECISE FINANCIAL DEFINITIONS

Financial wording must be consistent everywhere. Do not use `revenue`, `balance`, `earnings`, `payout` and `net` interchangeably.

Implement these domain concepts explicitly.

## 4.1 Creator Earnings Target

`Creator Earnings Target` is the amount the creator chooses to earn for one successful eligible membership payment.

Example:

`€10.00 per successful monthly membership payment`

This is the fundamental creator input in Guaranteed Earnings mode.

## 4.2 Customer Retail Price

`Customer Retail Price` is the final membership selling price presented to the buyer for the currently selected payment context, excluding or including indirect tax according to the legally configured tax model.

It already incorporates the amount needed to cover eligible processing cost according to the Guarantee Pricing Engine.

It is NOT displayed as:

`€10 + €0.41 ZeroFee fee`

Instead the buyer sees:

`€10.41/month`

where that amount is the approved retail price for that payment context.

## 4.3 Payment Provider Cost

The real fee/cost charged by Stripe or another provider for processing that payment.

ZeroFee does not pretend this cost does not exist.

## 4.4 ZeroFee Platform Transaction Fee

Always `0` for creator membership sales under this model.

## 4.5 Creator Earnings

For a Guaranteed Earnings payment event, Creator Earnings are the verified economic proceeds attributable to that successful membership payment after the configured payment-processing cost and relevant indirect-tax treatment, but before later creator-initiated payout/banking costs and before creator income/corporate taxes.

Creator Earnings must not be reduced merely because the creator later chooses an instant payout or incurs a bank/FX fee.

## 4.6 Payment Account Balance

The creator's actual connected-account balance as reported by Stripe/provider.

This is NOT necessarily identical at every moment to lifetime Creator Earnings because it can be affected by:

- pending vs available timing;
- prior payouts;
- refunds;
- disputes;
- reserves;
- tax movement;
- other provider adjustments;
- other permitted account activity.

Never falsely equate `lifetime earnings` with `current available Stripe balance`.

## 4.7 Payout Amount

The amount instructed/sent from the creator's connected account to the creator's payout destination.

Payout is movement of already-earned funds, not a new earning event.

## 4.8 Amount Sent vs Amount Landed

ZeroFee can truthfully report the amount the provider sent when that amount is known.

ZeroFee must not claim to know the exact amount that finally landed in a bank if intermediary/receiving-bank fees are outside ZeroFee/provider visibility.

Use:

- `Payout requested`;
- `Provider fee`;
- `ZeroFee fee = 0`;
- `Amount sent`;
- `Bank received amount = unknown` when not verifiable.

---

# 5. GUARANTEED CREATOR EARNINGS — CENTRAL PRODUCT LOGIC

The previous concept of a vague `Target Net estimate` is superseded by a stronger product design.

The desired core mode is:

# GUARANTEED EARNINGS

Creator chooses the amount they want to earn per successful eligible payment.

Example:

`Creator Earnings Target = €10.00`

For a payment route where ZeroFee has formally established Guarantee Eligibility, the system calculates the final buyer retail price so that the successful transaction can reconcile to exactly the configured creator earnings amount under the verified fee/tax model.

## 5.1 Guarantee wording

The product may say:

> **Want to earn €10 per member? You earn €10 per successful eligible membership payment.**

and:

> **100 successful €10 Creator Earnings events = €1,000 Creator Earnings.**

Only when the payment route is actually Guarantee Eligible.

## 5.2 Guarantee scope

The guarantee applies only to:

- successfully captured/settled payments according to provider semantics;
- a payment route explicitly marked Guarantee Eligible;
- the price/payment context the buyer accepted;
- transactions not subsequently refunded;
- transactions not subsequently reversed/charged back;
- Creator Earnings before later payout, bank and creator-selected FX costs;
- Creator Earnings excluding indirect taxes that are collected for/remitted to tax authorities according to the configured tax model;
- transactions processed under the fee/tax profile version used by the quote.

The guarantee does NOT mean:

- refunds do not reduce earnings;
- chargebacks do not reverse earnings;
- creator income tax disappears;
- bank fees disappear;
- Stripe reserves cannot affect payout availability;
- every payment method in every country is supported;
- ZeroFee insures fraud/disputes;
- creator always has the same amount immediately available to withdraw.

## 5.3 Guarantee must be mathematically real

Do not fake exactness.

Stripe's authoritative actual processing fee for a payment is generally available from the resulting Balance Transaction after the payment has processed. Therefore, ZeroFee MUST NOT assume that every future Stripe fee can always be known exactly before charging.

Implement Guarantee Eligibility as a hard capability gate.

A payment route may be offered in Guaranteed Earnings mode only when the active provider contract/configuration supplies a deterministic and operationally verified pricing model sufficient for ZeroFee to calculate the required retail price before buyer confirmation.

If exact ex-ante fee determination cannot be established for a payment route:

- that route MUST NOT be labeled Guaranteed Earnings;
- either disable that payment method for the guaranteed tier;
- or fall back to Simple Price mode for that route;
- never silently convert an exact guarantee into an estimate.

The product is allowed to support fewer payment methods/countries initially in order to keep the guarantee true.

## 5.4 Guarantee Eligibility Profile

Create a versioned `GuaranteeEligibilityProfile` domain model with at least:

- provider;
- creator country;
- buyer region/country class;
- presentment currency;
- settlement currency;
- payment method family;
- card classification assumptions if relevant;
- fee schedule/profile version;
- recurring billing fee rules;
- FX treatment;
- tax treatment compatibility;
- deterministic-fee confirmed boolean;
- provider-contract verified boolean;
- production-tested boolean;
- effective from/to;
- enabled state;
- owner/admin approval;
- notes/evidence/reference;
- guarantee mode: `DISABLED`, `TEST_ONLY`, `ELIGIBLE`, `PAUSED`.

Live checkout must not offer a route as guaranteed unless this profile is `ELIGIBLE`.

## 5.5 Guarantee Reconciliation Engine

Every successful Guaranteed Earnings payment must be reconciled against authoritative provider financial data after processing.

Store:

- creator target earnings;
- customer retail price;
- actual gross charge;
- indirect tax amount;
- actual provider fee;
- actual provider balance-transaction net;
- ZeroFee application/platform fee (`0`);
- calculated actual creator proceeds;
- expected creator earnings;
- difference;
- reconciliation status;
- provider transaction IDs;
- calculation/profile versions.

Statuses:

- `PENDING_PROVIDER_DATA`;
- `VERIFIED_EXACT`;
- `SHORTFALL`;
- `SURPLUS`;
- `REFUNDED`;
- `DISPUTED`;
- `REVERSED`;
- `MANUAL_REVIEW`.

For exact-guarantee routes, normal successful outcome must be:

`actual_creator_earnings == creator_earnings_target`

in minor units according to currency rules.

Any live `SHORTFALL` or unexpected `SURPLUS` is a financial correctness incident.

On breach:

- alert admin immediately;
- stop or pause the affected Guarantee Eligibility Profile automatically if configured;
- do not silently hide difference;
- preserve transaction evidence;
- do not automatically subsidize the creator from ZeroFee SaaS revenue unless a future explicit owner policy introduces such a mechanism;
- require review of provider pricing/profile before resuming guaranteed sales.

Create a dedicated admin `Guarantee Health` view.

## 5.6 Simple Price remains available

Keep a second pricing mode:

### SIMPLE PRICE

Creator sets the exact public amount the buyer pays.

Processor costs are then deducted according to provider rules.

This mode carries no exact Creator Earnings guarantee.

Creator UI must clearly distinguish:

- `Guaranteed Earnings — choose what you earn`;
- `Simple Price — choose what the member pays`.

Guaranteed Earnings is the product-defining recommended mode where eligible.

---

# 6. GUARANTEE PRICING / QUOTE ENGINE

Replace the old approximate Target Net implementation with a rigorous server-side `GuaranteePricingEngine` plus quote lifecycle.

Never perform money calculations with binary floating point.

Use:

- integer minor units;
- explicit ISO currency metadata;
- decimal/fixed-point rates;
- deterministic rounding;
- immutable calculation snapshots;
- versioned fee/tax/guarantee profiles.

## 6.1 Inputs

At minimum:

- creator earnings target;
- creator connected-account country;
- creator settlement currency;
- customer location context;
- presentment currency;
- billing interval;
- payment method family;
- card/payment classification where lawfully/provider-available;
- processor fee profile;
- billing fee component if applicable;
- FX quote/profile where applicable;
- tax behavior;
- tax-inclusive/exclusive rule;
- whether payment processing applies to tax-inclusive total;
- rounding rules;
- Guarantee Eligibility Profile.

## 6.2 Final retail price

The engine calculates the buyer-facing price needed to preserve the Creator Earnings Target under the eligible deterministic model.

For a simple percentage + fixed-cost processing profile with no tax complexity, the mathematical concept may resemble:

`retail = (creator_target + fixed_cost) / (1 - percentage_cost)`

followed by currency-aware exact rounding according to the guarantee algorithm.

However, do not scatter this formula through UI code.

Tax-inclusive pricing, recurring billing fees, FX and fee-on-tax behavior can require a different equation. Centralize all computation.

## 6.3 Buyer context can change retail price

Different buyers may legitimately see different final retail prices because real payment cost can depend on:

- buyer/card country;
- creator country;
- payment method;
- domestic vs cross-border route;
- presentment/settlement currency;
- FX;
- other provider pricing dimensions.

This is allowed and intentional.

The creator always sees their chosen Creator Earnings Target.

Example conceptual display:

`You earn: €10.00`

Buyer A eligible quote:

`€10.41/month`

Buyer B eligible quote:

`€10.58/month`

Buyer C eligible quote:

`€10.47/month`

Do not hardcode these numbers.

## 6.4 Buyer must approve final price

A buyer must see the final recurring price BEFORE final payment confirmation.

If payment method details are required to determine the exact eligible retail price, implement a two-stage quote/checkout flow using current supported provider APIs:

1. collect the minimum required payment context securely through provider components;
2. server determines Guarantee Eligibility and fee profile;
3. server calculates final retail price;
4. buyer sees a clear final recurring price review;
5. buyer explicitly confirms;
6. payment/subscription is created/confirmed;
7. authoritative webhook/provider events activate membership.

Do not charge a lower advertised amount and then secretly append a processing line item at the last step.

If the exact context cannot be known until after a charge for a specific payment rail, that rail is not eligible for Guaranteed Earnings unless another contractually sound mechanism exists.

## 6.5 Public tier pricing before payment context

When a final price depends on buyer context and the context is not yet known, public page must use honest presentation such as:

- a context-resolved price if country/currency can already be determined reliably;
- `from €X/month` only if truthful;
- or `Final membership price is confirmed before payment based on your payment method and region.`

Do not present a knowingly incomplete number as the universal final price.

## 6.6 Quote object

Create immutable `MembershipPriceQuote` records with:

- quote ID;
- creator/tier/price-version;
- member/user/session;
- Creator Earnings Target;
- Customer Retail Price;
- tax amount/behavior;
- fee profile version;
- Guarantee Eligibility Profile version;
- payment context fingerprint/category, not raw card data;
- currency;
- billing interval;
- expiry;
- status;
- accepted timestamp;
- provider references;
- final reconciliation link.

Expired quotes must be recalculated.

Never reuse stale payment-cost assumptions forever.

---

# 7. RENEWALS AND GUARANTEE CONTINUITY

A recurring product cannot guarantee only the first payment and ignore renewals.

Each membership must have a versioned `GuaranteedMembershipContract` containing:

- Creator Earnings Target;
- customer recurring retail price;
- currency;
- payment route classification;
- Guarantee Eligibility Profile version;
- fee-profile version;
- tax model version;
- effective date;
- consent/reference to buyer acceptance.

## 7.1 Normal renewal

If the same guarantee-compatible pricing context remains valid, renew at the agreed retail price and reconcile actual creator earnings.

## 7.2 Provider fee changes

If provider pricing changes such that the existing retail price can no longer preserve the guarantee:

- do not silently underpay creator;
- do not silently raise buyer price without required notice/consent;
- mark contract `REPRICE_REQUIRED`;
- calculate the new buyer price;
- notify creator;
- initiate legally appropriate buyer notice/consent workflow;
- apply new price only when legally/provider-valid;
- otherwise pause/cancel future renewal according to policy.

## 7.3 Payment method update

If a member changes payment method and the new route has a different cost profile:

- recalculate guarantee eligibility;
- show any new recurring retail price before confirmation;
- obtain buyer confirmation where required;
- create a new contract/price version;
- never silently break the creator guarantee.

## 7.4 Grandfathering

Historical prices and creator targets must remain explainable.

Never mutate existing price history in place.

---

# 8. TAX AND GUARANTEED EARNINGS INTERACTION

Indirect tax must not accidentally destroy the Creator Earnings guarantee.

Treat tax as a separate first-class domain.

Creator Earnings Target is economic creator proceeds before creator income/corporate tax, but indirect taxes collected for authorities are not creator earnings.

The Quote Engine must account for whether:

- tax is added on top of retail price;
- tax must be included in displayed retail price;
- processor fee is assessed on the tax-inclusive charge total;
- provider/tax service remits tax automatically or only calculates it;
- creator is legally the seller/merchant for the transaction.

If tax-inclusive pricing is required, solve the final price so the guarantee remains true rather than subtracting VAT/sales tax from the creator's chosen earnings without warning.

Never build homemade worldwide tax law.

Use provider-backed calculation where configured and retain `UNKNOWN/NOT_CONFIGURED` states.

---

# 9. STRIPE CONNECT — PREFERRED PRODUCTION CONFIGURATION

Use current official Stripe documentation at implementation time. Do not blindly rely on legacy Standard/Express/Custom names when controller/account configuration APIs provide more precise responsibility settings.

The preferred ZeroFee outcome is:

- direct charges on creator connected accounts;
- Stripe/provider collects its processing fees from the connected account;
- Stripe/provider owns connected-account loss liability where approved/configured;
- creator has independent access to Stripe financial data;
- ZeroFee provides the primary embedded UX;
- creator does not need a pre-existing Stripe account before joining ZeroFee;
- ZeroFee creates/onboards the connected account as part of `Set up payouts`.

## 9.1 Preferred dashboard/responsibility model

Where supported and approved, prefer a Stripe connected-account configuration equivalent to:

- `dashboard = full`;
- fees collected by Stripe/connected account, not ZeroFee platform;
- losses collected by Stripe/connected account responsibility model, not ZeroFee platform;
- KYC/requirements collection by Stripe;
- direct charges.

This is a preferred configuration, not a hardcoded universal assumption.

Admin must show actual capability/configuration truth.

## 9.2 Embedded first, independent verification available

Normal creator UX should remain inside ZeroFee through Stripe Connect embedded components wherever supported:

- Account Onboarding;
- Account Management;
- Notification Banner;
- Payments;
- Payment Details;
- Disputes;
- Balances;
- Payouts;
- Documents/reporting where relevant.

However, the creator should ALSO have independent Stripe Dashboard access where the chosen configuration supports it.

Provide a clear action such as:

`Verify in Stripe`

or:

`Open Stripe Dashboard`

This supports the brand principle:

# Don't trust us. Verify it.

The creator should be able to verify real provider records without relying exclusively on ZeroFee's internal ledger.

## 9.3 Embedded onboarding

ZeroFee application approval occurs before payout onboarding.

Flow:

1. creator applies to ZeroFee;
2. ZeroFee reviews what they plan to sell;
3. approved creator chooses `Set up payouts`;
4. ZeroFee creates/retrieves connected account server-side;
5. legally permissible profile fields are prefilled;
6. Stripe embedded onboarding collects KYC/legal/bank information;
7. creator personally accepts provider agreements and verification steps;
8. ZeroFee synchronizes provider requirements/capabilities;
9. selling is enabled only when both ZeroFee and provider requirements are satisfied.

Never impersonate the creator.

Never store raw identity documents if Stripe can collect them directly.

## 9.4 Individual creators

Architecture must support creators who are individuals where the target country/provider allows it.

Do not require a company globally unless country/provider law requires it.

## 9.5 No pre-existing Stripe requirement

Creator onboarding UX must not say:

`Go to stripe.com and create an account, then come back.`

ZeroFee should create/manage the Connect onboarding relationship from within ZeroFee.

---

# 10. DIRECT CHARGE FLOW

Preferred fan-payment topology:

buyer → Stripe/provider → creator connected account

NOT:

buyer → ZeroFee ordinary wallet/balance → ZeroFee manually pays creator.

ZeroFee records:

- membership contract;
- quote;
- payment event;
- guarantee reconciliation;
- entitlement;
- analytics;
- tax metadata;
- support/moderation context.

ZeroFee must not create an internal custodial wallet that pretends to be the source of creator funds.

If the final Stripe approval requires a materially different money-flow model, stop and document the conflict rather than silently changing the economic promise.

---

# 11. PAYMENT AND PROVIDER CAPABILITY REGISTRY

Create an admin-visible provider capability registry.

At minimum:

- `CONTENT_PLATFORM_APPROVAL_CONFIRMED`;
- `DIRECT_CHARGES_ENABLED`;
- `STRIPE_FEES_COLLECTED_FROM_CONNECTED_ACCOUNT`;
- `STRIPE_MANAGED_LOSS_LIABILITY_CONFIRMED`;
- `FULL_STRIPE_DASHBOARD_AVAILABLE`;
- `EMBEDDED_ONBOARDING_AVAILABLE`;
- `EMBEDDED_PAYMENTS_AVAILABLE`;
- `EMBEDDED_PAYOUTS_AVAILABLE`;
- `GUARANTEED_EARNINGS_LIVE_ALLOWED`;
- `STRIPE_TAX_ENABLED`;
- `LIVE_CHARGES_ALLOWED`.

Mock/test flags must be visibly labeled.

Do not infer contractual facts from code configuration alone.

---

# 12. PAYOUT SYSTEM

Payout is a first-class creator experience.

Creators should be able to manage payouts from ZeroFee using Stripe embedded Payouts/Balances components or equivalent provider APIs.

Support provider-permitted modes such as:

- automatic scheduled payout;
- manual standard payout;
- instant payout where eligible.

If standard manual payouts require a manual payout schedule, configure/guide the account correctly according to current Stripe documentation.

## 12.1 Creator payout screen

Show real provider data:

- pending balance;
- available balance;
- next scheduled payout;
- payout destination summary;
- recent payouts;
- payout eligibility;
- provider restrictions;
- manual/instant actions where allowed.

## 12.2 ZeroFee payout fee

Always show:

`ZeroFee payout fee: €0.00`

when relevant.

## 12.3 Provider payout fee

If provider offers a standard/instant payout fee quote or exposes the actual fee, show it explicitly as provider cost.

Example conceptual UI:

**Available**  
`€1,000.00`

**Standard payout**  
Provider cost: `€0.00`  
ZeroFee fee: `€0.00`  
Amount sent: `€1,000.00`

or:

**Instant payout**  
Provider cost: `€10.00`  
ZeroFee fee: `€0.00`  
Amount sent: `€990.00`

Do not hardcode these example fees.

If provider fee cannot be known before initiation, label estimates honestly and replace with actual provider result after processing.

## 12.4 Bank/intermediary fee

If ZeroFee/Stripe cannot observe a downstream bank/intermediary fee, say:

> **We sent €X. Receiving or intermediary banks may apply their own transfer or currency-conversion fees.**

Do not claim `€X landed` without evidence.

## 12.5 Payout does not rewrite earnings

Example:

Creator Earnings = `€1,000`

Creator chooses instant payout costing `€10`.

Creator Earnings remains `€1,000`.

Payout amount sent may be `€990`.

Do not rewrite historical earnings to `€990`.

---

# 13. VERIFIED MONEY / “DON'T TRUST US. VERIFY IT.”

Transparency must be product functionality, not only marketing copy.

Create a `Financial Verification` view that reconciles ZeroFee records with Stripe/provider truth.

For each membership payment show:

- buyer-facing charged amount;
- indirect tax amount/status;
- actual provider processing fee;
- ZeroFee platform transaction fee = `0`;
- Creator Earnings Target;
- verified Creator Earnings;
- reconciliation status;
- Stripe/provider transaction reference;
- direct `View/Verify in Stripe` action when supported.

Creator should be able to audit:

- what member paid;
- what processor charged;
- what amount constitutes Creator Earnings;
- what ZeroFee deducted (`0`);
- what payouts occurred.

Do not claim total Stripe account balance must always equal lifetime ZeroFee Creator Earnings because pending funds, payouts, taxes, reserves and other account activity can legitimately differ.

Instead prove equality at the attributable transaction/reconciliation level.

Create a downloadable reconciliation report.

---

# 14. PLATFORM SAAS PLANS AND UNIT ECONOMICS

ZeroFee earns money through fixed software subscriptions.

It must never reintroduce a percentage success tax through disguised GMV pricing.

Build multiple configurable SaaS plans.

Seed editable DEMO plans such as:

| Plan | Demo monthly price | Example member allowance |
|---|---:|---:|
| Starter | $19 | 100 |
| Creator | $49 | 1,000 |
| Pro | $99 | 5,000 |
| Business | $199 | 25,000 |

These values are not final commercial pricing.

Plans may vary by:

- active member count;
- storage;
- bandwidth/resource allocation;
- email/broadcast quota;
- API quota;
- analytics retention;
- team seats;
- integrations;
- automations;
- custom domain entitlement;
- support level;
- community features.

Plans must NOT vary directly by creator GMV/revenue percentage.

A creator earning $100,000/month should not be forced to pay a percentage merely because they are successful.

If their member count/resource usage fits a plan, revenue itself is not the upgrade trigger.

## 14.1 Platform SaaS billing

Creator → ZeroFee SaaS billing is a completely separate payment relationship from fan → creator memberships.

Implement separate `PlatformBillingProvider` and ledger/analytics concepts.

Platform billing states:

- NONE;
- TRIALING;
- ACTIVE;
- PAST_DUE;
- GRACE;
- SUSPENDED;
- CANCEL_AT_PERIOD_END;
- CANCELLED.

Keep creator data after billing lapse.

Use a clear grace/suspension policy.

## 14.2 No hidden payment revenue

For Prompt 1:

ZeroFee business revenue = SaaS subscription revenue.

Do not implement:

- membership application fees;
- payout markup;
- processing markup;
- FX markup;
- transaction revenue share.

If a future provider rebate/revenue-share model is ever considered, it requires an explicit owner decision and marketing/legal review because the current promise says ZeroFee makes money from software subscriptions.

Create `docs/UNIT_ECONOMICS.md`.

---

# 15. COUNTRY / MARKET ELIGIBILITY

Do not pretend Stripe or ZeroFee supports every creator country.

Implement `CountryCapabilityRegistry`.

For each country/market store:

- creator onboarding enabled;
- individual supported;
- company supported;
- charges enabled;
- payouts enabled;
- connected-account dashboard type availability;
- supported presentment currencies;
- supported settlement currencies;
- payment methods;
- Guaranteed Earnings eligible routes;
- tax readiness;
- legal/terms readiness;
- provider approval state;
- manual review requirement;
- launch state: `UNSUPPORTED`, `WAITLIST`, `BETA`, `AVAILABLE`, `PAUSED`;
- internal notes/evidence/reference date.

Do not hardcode claims about Serbia or any other country from memory.

Provider documentation/current platform contract is authoritative.

Creator registration flow:

1. creator chooses country;
2. system checks registry;
3. AVAILABLE/BETA → proceed according to policy;
4. WAITLIST → capture interest, no fake KYC/payment account;
5. UNSUPPORTED → stop payout onboarding clearly.

Create `docs/COUNTRY_AND_CURRENCY_STRATEGY.md`.

---

# 16. MERCHANT / SELLER / TAX RESPONSIBILITY

ZeroFee's intended model is creator-side sales, not ZeroFee acting as Merchant of Record for creator content.

Exact merchant/seller/tax treatment is jurisdiction/provider-contract dependent.

Create a first-class `CommerceResponsibilityProfile` including:

- intended seller: creator;
- provider;
- merchant-of-record status: false/unknown/confirmed;
- tax calculation provider;
- tax collection responsibility;
- tax remittance responsibility;
- receipt/invoice issuer policy;
- statement descriptor policy;
- legal review status;
- jurisdiction scope;
- effective date.

Never claim legal status because UI copy says so.

Create `docs/MERCHANT_AND_TAX_RESPONSIBILITY.md`.

---

# 17. VAT / GST / SALES TAX ARCHITECTURE

Tax is part of the prototype architecture from day one.

Implement a `TaxProvider` abstraction:

`mock | stripe_tax | disabled`

Support:

- creator/seller country;
- buyer billing country/location data obtained through legitimate payment flow;
- product/service tax category;
- tax-inclusive/exclusive display;
- creator tax registration references;
- calculation snapshot;
- jurisdiction;
- tax amount;
- collection owner;
- remittance owner/status;
- receipt/invoice metadata;
- exemption/tax-ID architecture;
- UNKNOWN/NOT_CONFIGURED states.

Do not build homemade global tax-law rules.

## 17.1 Creator Tax Center

Show configuration/status, not fake legal advice:

- tax provider state;
- registrations on file;
- warnings/actions from provider data;
- tax summaries;
- provider documents;
- clear professional-advice disclaimer.

## 17.2 Platform's own SaaS tax

ZeroFee's SaaS subscription tax is separate from creator-to-fan tax.

Model and document both.

## 17.3 Tax docs/checklist

Create:

- `docs/TAX_ARCHITECTURE.md`;
- owner checklist for VAT/GST/sales tax, 1099/W-8/W-9/equivalents where applicable, invoicing, record retention and professional review.

---

# 18. RECEIPTS / INVOICES / STATEMENT CLARITY

Buyers must clearly understand:

- which creator they joined;
- recurring price;
- billing interval;
- seller/merchant identity according to configured model;
- taxes;
- cancellation path;
- support/refund path;
- what descriptor may appear on statement.

Do not issue a receipt claiming ZeroFee sold creator content if the configured/legal model says creator is seller.

Statement clarity is part of chargeback prevention.

---

# 19. CREATOR APPLICATION / CONTENT PRE-SCREENING

Stripe KYC verifies identity/business information.

ZeroFee separately decides whether the creator and offering are acceptable for the platform.

Creator application collects:

- creator display name;
- individual/business selection;
- creator country;
- category;
- detailed paid-offering description;
- examples of paid content/benefits;
- website/social links;
- audience-size range;
- expected membership revenue range;
- content formats;
- community integrations planned;
- rights/ownership confirmation;
- Acceptable Use acceptance;
- Creator Terms acceptance;
- prohibited-content acknowledgement.

Avoid unnecessary sensitive PII.

Application states:

- DRAFT;
- SUBMITTED;
- UNDER_REVIEW;
- NEEDS_INFORMATION;
- APPROVED_FOR_PAYOUT_ONBOARDING;
- REJECTED;
- SUSPENDED_POST_APPROVAL.

Admin can:

- inspect application;
- request more information;
- approve;
- reject with reason;
- suspend later;
- add private notes;
- see immutable revision/history.

All important transitions audited.

Creator cannot self-approve.

---

# 20. STRIPE CONTENT-PLATFORM APPROVAL

Treat Stripe approval for the actual creator-content platform model as a real launch dependency.

Create `docs/STRIPE_APPROVAL_READINESS.md` covering:

- full product description;
- creator categories;
- prohibited/adult-content policy;
- content review;
- direct-charge model;
- proposed connected-account responsibility/dashboard model;
- Guaranteed Earnings pricing concept;
- 0% application/platform fee;
- moderation/reporting;
- KYC division of responsibility;
- disputes/refunds;
- payout UX;
- tax architecture;
- target markets;
- questions requiring Stripe written confirmation;
- live capability checklist.

Do not mark `CONTENT_PLATFORM_APPROVAL_CONFIRMED` until real approval exists.

---

# 21. PROHIBITED CONTENT / SAFETY

ZeroFee's Stripe-based product is NOT an adult-content/OnlyFans payment workaround.

Prototype Acceptable Use must conservatively prohibit at minimum:

- illegal products/services;
- pornography/sexual services prohibited by payment-provider rules;
- sexual exploitation;
- CSAM/minor sexual content;
- non-consensual sexual content;
- prohibited extremist/terrorist activity;
- illegal weapons sales;
- controlled-drug sales;
- stolen goods;
- scams/fraud;
- pyramid/money-circulation abuse;
- disguised money transmission;
- phishing;
- malware;
- credential theft;
- piracy/copyright infringement;
- doxxing/private-data sale;
- impersonation;
- any current provider-prohibited category.

Implement:

- `/legal/acceptable-use`;
- `/legal/creator-terms`;
- `/legal/terms`;
- `/legal/privacy`;
- report creator/content;
- copyright report;
- fraud/scam report;
- moderation queue;
- takedown;
- suspension;
- appeal/contact path;
- moderation evidence/history;
- audit.

Create `docs/LEGAL_AND_COMPLIANCE_OPEN_ITEMS.md`.

Do not call the prototype legally compliant without professional review.

---

# 22. DSA / COPYRIGHT / NOTICE-AND-ACTION READINESS

Architect for later legal review:

- structured illegal-content reporting;
- copyright/DMCA-style reporting where applicable;
- impersonation reporting;
- scam/fraud escalation;
- notice to creator;
- moderation decision;
- appeal;
- status tracking;
- evidence/history;
- retention policy placeholder.

Do not claim DSA compliance solely because these screens exist.

---

# 23. USERS / ROLES / AUTHORIZATION

## Visitor

Can:

- view marketing;
- view public creator pages;
- view public/free posts/previews;
- signup/login.

## Member/Fan

Can:

- manage profile/security;
- subscribe;
- see final quote before payment;
- manage memberships;
- update payment method through provider-safe flow;
- access entitled content;
- comment where enabled;
- support/refund request;
- report content/creator;
- data export/deletion request architecture.

## Creator

Can:

- apply;
- complete payout/KYC onboarding;
- manage ZeroFee SaaS subscription;
- configure profile;
- create tiers/prices;
- select Guaranteed Earnings or Simple Price where eligible;
- publish posts/downloads;
- manage members;
- view Creator Earnings and guarantee reconciliation;
- view actual provider payments/balances;
- initiate/manage payouts;
- open/verify Stripe Dashboard where supported;
- manage tax center;
- migrate members;
- integrations;
- broadcasts;
- refunds/disputes where provider permits;
- data export;
- API/webhooks according to plan.

## Admin/Owner

Can:

- creator reviews;
- creator suspensions;
- moderation;
- SaaS plans;
- fee profiles;
- Guarantee Eligibility Profiles;
- guarantee incident/reconciliation monitoring;
- country capabilities;
- merchant/tax config;
- provider capability config;
- webhook events;
- support escalations;
- audit;
- platform metrics;
- feature flags;
- mock/test controls;
- manual entitlement overrides with reason.

All authorization server-side.

UI hiding is not authorization.

---

# 24. AUTHENTICATION / SECURITY

Implement real authentication.

Minimum:

- secure email/password or appropriate first-party auth;
- strong password hashing;
- normalized email;
- secure sessions/cookies;
- session invalidation;
- login/register rate limits;
- password reset;
- email verification with mock-email support;
- CSRF protections appropriate to framework;
- safe auth errors;
- no client secrets;
- RBAC/server authorization.

Security review must cover:

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
- webhook spoofing/replay;
- payment quote tampering;
- creator-target/retail-price client tampering;
- guarantee-profile bypass;
- race conditions;
- session/cookie issues;
- KYC/private-data leakage;
- payout metadata exposure;
- API-key abuse;
- OAuth token storage;
- cross-creator data leakage.

Create `docs/SECURITY.md`.

---

# 25. CREATOR PUBLIC PROFILE

Creator can configure:

- display name;
- slug;
- avatar;
- banner;
- short bio;
- full about;
- social links;
- category;
- constrained theme/accent;
- featured tier;
- featured posts;
- support/contact preference;
- honest verification/approved indicator if defined.

Public page shows:

- creator identity/branding;
- about;
- membership tiers;
- creator earnings target is NOT necessarily shown to buyers;
- appropriate buyer-facing retail price/context;
- benefits;
- free posts;
- locked previews;
- recurring billing disclosure;
- tax language where required;
- seller/support information;
- report link.

Never expose legal/KYC private data.

---

# 26. MEMBERSHIP TIERS

Support:

- name;
- description;
- benefits;
- draft/published/archived;
- sort order;
- monthly;
- annual;
- currency;
- pricing mode: `GUARANTEED_EARNINGS` or `SIMPLE_PRICE`;
- Creator Earnings Target for guarantee mode;
- price/quote contract versions;
- member count;
- gated content mapping;
- trial;
- coupon eligibility;
- grandfathering/migration state;
- Guarantee Eligibility constraints/payment methods.

Do not implement unrestricted peer-to-peer cash transfer disguised as memberships.

---

# 27. CONTENT SYSTEM

Post fields:

- title;
- slug;
- excerpt;
- body;
- cover;
- safe attachments/downloads;
- visibility: public / all paid / selected tiers;
- draft/published/archived;
- publish timestamp;
- creator ownership.

Use storage abstraction and strict limits.

Do not build proprietary large-scale video transcoding/CDN in Prompt 1.

Support external video/embed providers or media-provider abstraction.

Never publicly cache private paid content.

Comments:

- creator enable/disable;
- authenticated comment;
- user delete own comment;
- creator moderation;
- comment reports;
- admin abuse moderation;
- rate limits.

---

# 28. MEMBER SUBSCRIPTION LIFECYCLE

Statuses:

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
- REFUNDED where applicable.

Member actions:

- subscribe;
- choose/confirm payment context;
- view final recurring price before confirmation;
- view Creator/seller and renewal date;
- update payment method;
- accept required repricing if context changes;
- cancel;
- resume;
- switch tier;
- switch monthly/annual;
- view invoices/receipts;
- support/refund request;
- rejoin.

Creator actions:

- view member;
- view financial lifecycle without raw card data;
- refund through provider-supported flow;
- cancel where policy permits;
- manual comp entitlement with audited permissions;
- see payment/guarantee state.

---

# 29. FAILED PAYMENT RECOVERY / DUNNING

Implement provider-driven dunning.

Flow:

1. renewal fails;
2. PAST_DUE;
3. member notified;
4. update-payment action;
5. creator sees recovery state;
6. grace period;
7. provider retry events;
8. successful retry restores/maintains entitlement;
9. exhausted recovery transitions according to policy;
10. no duplicate notification/event processing.

Metrics:

- failed renewals;
- recovered renewals;
- recovery rate;
- involuntary churn.

Do not invent card retry logic when Stripe/provider owns it.

---

# 30. CANCELLATION / PAUSE / TIER CHANGE / PRORATION

Support:

- cancel at period end;
- resume;
- cancellation reason;
- upgrade/downgrade;
- clear effective date;
- central proration policy;
- preview before change;
- annual/monthly transitions;
- grandfathering;
- pause architecture where supported;
- guarantee/repricing recalculation where new tier/payment method changes economics.

Never silently charge a new recurring amount without legally/provider-valid confirmation/notice.

---

# 31. COUPONS / TRIALS / PROMOTIONS

Coupon:

- code;
- percentage/fixed discount;
- tiers;
- billing interval applicability;
- duration;
- date window;
- redemption cap;
- per-user restriction;
- active state.

Trial:

- duration;
- eligible tiers;
- anti-abuse;
- payment method requirement configurable;
- ending notification;
- conversion analytics.

For Guaranteed Earnings tiers, clearly define who economically funds a creator promotion.

Default rule:

- creator-authorized coupon/trial can reduce creator earnings for discounted periods unless the creator explicitly configures a retail-price promotion that preserves Creator Earnings and the guarantee engine can support it;
- never silently make ZeroFee fund the discount.

Store promotional earnings/price logic explicitly.

---

# 32. ENTITLEMENTS

Implement server-authoritative `EntitlementResolver`.

Inputs:

- user;
- creator;
- tier;
- membership;
- membership state;
- grace policy;
- resource visibility;
- manual comp;
- effective dates.

Output:

- allow/deny;
- reason;
- expiry/effective time.

Client flags never override access.

---

# 33. REFUNDS / DISPUTES / REVERSALS

These alter Creator Earnings history and must be explicit.

Support:

- full refund;
- partial-refund architecture where provider supports;
- dispute opened;
- dispute evidence/status through provider UI/API;
- dispute won/lost;
- reversal;
- member access policy;
- creator/admin/member visibility;
- mock simulation.

If a previously verified €10 Creator Earnings payment is fully refunded, it is no longer a final earned transaction.

Do not keep marketing totals misleadingly unchanged.

Maintain event history so creator can see:

- originally earned;
- later refunded/reversed;
- current net earned.

ZeroFee does not automatically reimburse creator from SaaS revenue.

---

# 34. MIGRATION FROM PATREON / OTHER PLATFORMS

Migration is a CORE acquisition feature.

Build `Migration Center`.

## Import

Support CSV import/mapping for fields such as:

- member name;
- email;
- external ID;
- external tier;
- status;
- frequency;
- amount;
- join date;
- last charge where available;
- entitled/paid state;
- safe metadata.

Provide a Patreon preset based on currently exportable data at implementation time plus generic mapper.

Never scrape private accounts or bypass access controls.

## Tier mapping

1. upload;
2. validate/errors;
3. map tiers;
4. map billing interval;
5. choose migration pricing/Creator Earnings strategy;
6. import non-payment records;
7. generate campaign.

## Payment credentials

Do not pretend cards/subscriptions migrate automatically.

Only implement provider-assisted credential migration when the actual providers officially support it and owner configuration enables it.

Otherwise member must authorize a new ZeroFee/creator subscription.

Statuses:

- IMPORTED;
- INVITE_READY;
- INVITED;
- CLICKED;
- NEW_SUBSCRIPTION_STARTED;
- CONVERTED;
- DECLINED/EXPIRED;
- ERROR.

## Campaign

- landing page;
- signed/tokenized invite;
- messaging templates;
- optional creator-authorized incentive;
- grandfathered pricing/earnings option;
- switch date;
- analytics;
- unconverted export.

Create `docs/MIGRATION_ARCHITECTURE.md`.

---

# 35. CREATOR OWNERSHIP / ANTI-LOCK-IN

Creator export must include legally permissible machine-readable data such as:

- members/contact data subject to law/permissions;
- tiers/prices/Creator Earnings configurations;
- posts/content metadata;
- subscription/lifecycle history;
- analytics summary;
- migration data;
- integration metadata excluding secrets.

Never export:

- raw card data;
- secret provider credentials;
- Stripe secret data;
- private admin notes;
- data creator has no right to receive.

Marketing should eventually be able to truthfully say:

> **Your audience and data are not held hostage by ZeroFee.**

---

# 36. SUPPORT RESPONSIBILITY SPLIT

Fans will contact ZeroFee even when creator is seller/payment recipient.

Build structured Support Center.

Ticket categories:

- access problem;
- payment failed;
- billing question;
- refund request;
- promised benefit not delivered;
- suspected fraud/scam;
- content report;
- account/security;
- ZeroFee technical issue.

Creator-first where appropriate:

- benefit fulfillment;
- ordinary creator content support;
- ordinary refund request;
- community access.

ZeroFee-first:

- platform bug;
- account/security;
- prohibited content;
- scam escalation;
- moderation;
- payment integration malfunction;
- privacy request;
- guarantee/reconciliation incident.

Admin escalation exists.

Never say `not our problem` simply because creator is connected merchant.

---

# 37. COMMUNITY INTEGRATIONS

Build provider framework.

## Discord

Where credentials permit:

- OAuth/bot connect;
- map tier → Discord role;
- member links Discord identity;
- entitlement grants role;
- cancel/expire revokes;
- retries/reconciliation;
- manual resync;
- least privilege;
- audit.

Provide deterministic mock provider.

## Telegram

Architecture/prototype for:

- bot/community link;
- member identity link;
- entitlement-based access/invite;
- revoke/expire where API supports;
- mock provider.

## Outbound webhooks

Creator-configured, signed lifecycle webhooks:

- URL validation;
- SSRF protection;
- HMAC;
- secret rotation;
- retry/backoff;
- delivery logs;
- disable policy for repeatedly failing endpoint.

---

# 38. CREATOR API

Provide secure prototype API for entitled plans.

Scoped API keys:

- hashed-at-rest secret where appropriate;
- prefix/id;
- scopes;
- created/last-used/revoked;
- one-time secret display;
- rotation;
- rate limits;
- audit.

Safe endpoints can include:

- profile;
- tiers;
- member entitlement lookup;
- membership events/list;
- posts metadata;
- financial reconciliation summary without sensitive raw provider data.

No payment credentials/raw cards/unrestricted PII.

Create `docs/API.md`.

---

# 39. CREATOR BROADCASTS

Minimal real communication system.

Targets:

- all active members;
- tier;
- payment-recovery members;
- migration imports where consent/law permits.

Build:

- composer;
- recipient preview/count;
- in-app delivery;
- EmailProvider abstraction;
- mock email;
- quotas;
- unsubscribe/compliance architecture;
- logs/audit;
- no real bulk email without provider configuration.

---

# 40. CREATOR DASHBOARD — REQUIRED FINANCIAL UX

This dashboard is core to the product promise.

Top financial hierarchy should clearly separate:

## Creator Earnings

Example conceptual display:

**You earn per successful member payment**  
`€10.00`

**Verified successful earnings events**  
`100`

**Creator Earnings**  
`€1,000.00`

**ZeroFee membership transaction fees deducted**  
`€0.00`

## Payment account

Show separately:

- pending balance;
- available balance;
- provider reserves/restrictions where known;
- latest provider sync.

## Payouts

Show separately:

- next scheduled payout;
- manual/instant payout options;
- provider payout costs;
- ZeroFee payout fee = `0`;
- amount sent;
- payout history.

## Financial verification

Show:

- guarantee reconciliation health;
- actual provider processing costs;
- Stripe/provider deep links;
- export reconciliation report.

Never collapse all of these into one misleading `balance` number.

Also show:

- application/compliance status;
- KYC/payout readiness;
- ZeroFee SaaS plan/billing;
- members;
- new members;
- cancellations;
- failed/recovered payments;
- refunds/disputes;
- top tiers;
- public-page conversion;
- migration progress;
- integration health;
- quota usage;
- next required action.

Never mix creator GMV with ZeroFee SaaS MRR.

---

# 41. MEMBER / BUYER CHECKOUT UX

The checkout must reinforce trust.

Before final confirmation show:

- creator name;
- tier;
- final recurring retail price;
- billing interval;
- applicable indirect tax before confirmation according to law/config;
- renewal information;
- seller/support information;
- cancellation summary;
- payment method;
- clear final total.

Do not show a late `ZeroFee processing fee` line item.

The processing cost is part of the calculated retail economics, not a surprise platform surcharge.

If price depends on payment method/region, update and re-confirm before charging.

---

# 42. ADMIN CONTROL PLANE

Build a serious owner/admin system.

## Admin dashboard

- users;
- creators/application states;
- approved creators;
- connected-account readiness;
- ZeroFee SaaS subscriptions/MRR;
- creator GMV separate;
- active memberships;
- Creator Earnings totals separate;
- guarantee reconciliation health;
- guarantee incidents;
- failed payments/recovery;
- open reports;
- support escalations;
- failed webhooks;
- country availability;
- tax warnings;
- provider capability warnings;
- integration failures.

## Applications

Full review/history.

## Creators

- profile;
- compliance;
- provider account readiness;
- dashboard/responsibility config;
- SaaS billing;
- public page;
- member/tier counts;
- guarantee health;
- support/moderation;
- integration health;
- audit.

## SaaS plans

Versioned CRUD/entitlements/quotas.

## Processing fee profiles

Versioned, region/method/currency-aware profiles.

## Guarantee Eligibility Profiles

Critical admin area:

- create/edit/version;
- status;
- evidence/reference;
- pricing contract verification;
- test results;
- enable/pause;
- affected creators/subscriptions;
- incident history.

## Guarantee Health

- pending reconciliation;
- exact matches;
- shortfalls;
- surpluses;
- incident rate;
- profile breakdown;
- automatic profile pause state.

## Countries

Country registry UI.

## Tax/merchant

Safe config/status, no secrets.

## Webhooks

Inspector/replay.

## Moderation/reports

Queue/decision/notice/appeal.

## Support

Escalation queue.

## Audit

Filter actor/action/resource/date/creator.

---

# 43. WEBHOOKS / EVENT CORRECTNESS

Provider state is authoritative.

Browser success redirect is not proof of payment.

Implement:

- raw-body signature verification;
- platform/connected-account routing;
- provider scope;
- unique event IDs;
- idempotent processing;
- persistent event store;
- attempts/status;
- safe errors;
- replay;
- correlation IDs;
- transaction-safe transitions;
- no duplicate membership;
- no duplicate entitlement;
- no duplicate notification;
- no duplicate Creator Earnings event;
- no duplicate guarantee reconciliation.

Important domain events include:

- account requirements/update;
- payment/subscription success/failure;
- invoice renewals;
- refunds;
- disputes;
- balance transaction availability/fee data;
- payout status;
- SaaS billing lifecycle.

Guarantee reconciliation must wait for authoritative actual provider fee data where needed.

---

# 44. PAYMENT PROVIDER ABSTRACTION / MOCK MODE

Support:

`CREATOR_PAYMENTS_PROVIDER=mock|stripe`

`PLATFORM_BILLING_PROVIDER=mock|stripe`

`TAX_PROVIDER=mock|stripe_tax|disabled`

Mock provider must simulate:

- connected account creation;
- onboarding incomplete;
- identity pending;
- info required;
- approved;
- restricted;
- full-dashboard availability;
- guarantee-eligible domestic method;
- guarantee-ineligible method;
- successful exact-reconciled payment;
- fee mismatch/guarantee breach;
- failed payment;
- renewal;
- repricing required;
- payment-method change;
- cancellation;
- refund;
- dispute;
- payout;
- instant payout provider fee;
- receiving-bank fee unknown state;
- negative/restricted account;
- failed SaaS billing;
- dunning recovery.

TEST MODE must be prominent.

---

# 45. DATA MODEL

Use PostgreSQL with real migrations.

Do not put the whole product in giant JSON blobs.

Recommended entities, adapting names to chosen ORM:

## Identity/security

- `User`
- `Session`
- `Role`
- `UserRole`
- `SecurityEvent`
- `ApiKey`

## Creator

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

## Guarantee/pricing

- `PaymentFeeProfile`
- `PaymentFeeProfileVersion`
- `GuaranteeEligibilityProfile`
- `GuaranteeEligibilityProfileVersion`
- `CreatorTier`
- `TierPriceVersion`
- `MembershipPriceQuote`
- `GuaranteedMembershipContract`
- `PricingCalculationSnapshot`
- `GuaranteeReconciliation`
- `GuaranteeIncident`
- `Coupon`

## Tax/commerce

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

## Membership

- `MembershipSubscription`
- `MembershipPayment`
- `MembershipEvent`
- `CreatorEarningsEvent`
- `ManualEntitlement`

## Payout/provider finance

- `ConnectedBalanceSnapshot`
- `PayoutRecord`
- `FinancialReconciliationRecord`
- `ProviderCustomerReference`
- `WebhookEvent`
- `PaymentProviderEvent`

## Migration

- `MigrationProject`
- `MigrationImportRow`
- `MigrationTierMapping`
- `MigrationInvite`
- `MigrationConversion`

## Integrations

- `CreatorIntegration`
- `IntegrationMapping`
- `IntegrationSyncEvent`
- `OutboundWebhookEndpoint`
- `OutboundWebhookDelivery`

## Safety/support/admin

- `ContentReport`
- `ModerationAction`
- `SupportTicket`
- `SupportMessage`
- `AuditLog`
- `Notification`
- `FeatureFlag`
- `AdminSetting`

Apply:

- unique normalized email;
- unique creator slug;
- provider event uniqueness scoped correctly;
- provider IDs indexed;
- immutable quote/price/profile versions;
- no cross-creator tier/membership references;
- audit preservation;
- import dedupe;
- API secrets not plaintext where avoidable;
- money in minor units;
- explicit currency everywhere money exists.

---

# 46. PROVIDER / DOMAIN SEPARATION

Required abstractions:

- `CreatorPaymentsProvider`;
- `PlatformBillingProvider`;
- `TaxProvider`;
- `MediaStorageProvider`;
- `EmailProvider`;
- `CommunityIntegrationProvider` where appropriate.

Core financial services:

- `GuaranteePricingEngine`;
- `GuaranteeEligibilityService`;
- `GuaranteeReconciliationService`;
- `CreatorEarningsLedgerService`;
- `PayoutPresentationService`;
- `EntitlementResolver`.

Do not leak raw Stripe status/object semantics throughout UI.

Map provider states in one adapter/domain layer.

---

# 47. AUDIT LOGGING

Append-only application audit for:

- application submit/review;
- provider connected-account linkage/readiness;
- country changes;
- merchant/tax changes;
- processing fee profile changes;
- Guarantee Eligibility changes;
- guarantee profile enable/pause;
- guarantee incident resolution;
- SaaS plan changes;
- tier/earnings target/price contract changes;
- refund;
- payout configuration changes where visible;
- integration connect/revoke;
- API key create/revoke;
- creator suspension;
- moderation;
- support escalation;
- webhook replay;
- manual entitlement override.

Never log secrets, raw cards, bank credentials or KYC documents.

---

# 48. NOTIFICATIONS

In-app at minimum:

- application submitted;
- approved;
- info requested;
- rejected;
- KYC action required;
- payout ready/restricted;
- SaaS failed/grace/suspended;
- new member;
- successful Creator Earnings event;
- failed renewal;
- recovered renewal;
- repricing approval required;
- cancellation;
- refund;
- dispute;
- guarantee issue requiring creator awareness where policy says so;
- integration failure;
- migration milestone;
- moderation decision.

Email through provider abstraction.

No SMTP dependency for CI.

---

# 49. PRIVACY / PII

Principles:

- provider collects KYC docs where possible;
- no raw bank credentials;
- minimum stored PII;
- provider payload redaction;
- creator application access restricted;
- migration/member data protected;
- no public email leakage;
- account export/deletion architecture;
- retention documented;
- payment context classification stored without raw PAN/card secret data.

---

# 50. PUBLIC MARKETING / POSITIONING

Required public pages:

- `/`;
- `/pricing`;
- `/how-it-works`;
- `/migration`;
- `/safety`;
- `/faq`;
- auth;
- legal.

The homepage must quickly communicate:

# Choose what you earn.

Preferred messages:

> **Want €10 per member? You earn €10 per successful eligible membership payment.**

> **100 successful €10 earnings events = €1,000 Creator Earnings.**

> **0% platform fee on membership revenue.**

> **0% ZeroFee payout fee.**

> **Payment processing at provider cost.**

> **Our financial transaction markup: €0.**

> **We don't tax your success.**

> **Your earnings live with your connected payment provider, not in a ZeroFee wallet.**

> **Don't trust us. Verify it in Stripe.**

Use `Guaranteed` only with the defined scope and eligibility rules.

## 50.1 Exact guarantee footnote

Marketing must have a concise plain-language definition linked to details:

> Guaranteed Creator Earnings apply to successful eligible payment routes before later refunds, disputes, creator-selected payout/FX costs and taxes outside the defined earnings amount. Availability depends on country, currency and payment method.

Do not bury a contradiction in legal fine print.

## 50.2 Forbidden claims

Do not say:

- payment processing is free;
- no fees of any kind;
- every country/payment method is guaranteed;
- bank landing amount is guaranteed;
- refunds/chargebacks do not affect earnings;
- ZeroFee automatically handles every tax;
- unsupported sensational competitor percentages;
- ZeroFee is Merchant of Record unless confirmed.

---

# 51. SAVINGS / BREAK-EVEN CALCULATOR

Build interactive calculator.

Inputs:

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

Do not mix platform fees and processing unless explicitly selected.

Label assumptions.

---

# 52. PWA / MOBILE WEB

Build intentional high-quality mobile web/PWA.

Requirements:

- manifest/installability;
- icons;
- mobile navigation;
- creator application on phone;
- embedded KYC on phone;
- quote/payment confirmation on phone;
- creator earnings/payout dashboard on phone;
- no offline caching of paid/private/financial pages;
- no stale entitlement/payment state from service worker;
- native push only if safely supported/feature-flagged.

No native iOS/Android Prompt 1 apps.

---

# 53. DESIGN SYSTEM / UX QUALITY

ZeroFee should feel like a premium financial/creator SaaS, not generic AI dashboard output.

Aim for:

- exceptional typography;
- strong numerical hierarchy;
- calm financial UI;
- clear separation of earnings/balance/payout;
- confident whitespace;
- restrained cards;
- original brand;
- excellent mobile layouts;
- accessible statuses;
- polished forms;
- fast creator onboarding;
- financial tables that are easy to audit.

Create tokens for typography, spacing, semantic colors, borders, radius, shadows, statuses, forms, tables and loading/error/empty/success states.

Do not clone another product pixel-for-pixel.

---

# 54. INFORMATION ARCHITECTURE

Suggested routes.

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
- `/admin/fee-profiles`
- `/admin/guarantee-profiles`
- `/admin/guarantee-health`
- `/admin/countries`
- `/admin/commerce-tax`
- `/admin/webhooks`
- `/admin/audit`
- `/admin/settings`

Exact paths may vary, capabilities may not.

---

# 55. ERROR / EMPTY / LOADING / PERMISSION STATES

Implement intentionally:

- no creator application;
- review pending;
- needs info;
- rejected;
- unsupported country;
- waitlist;
- provider unavailable;
- TEST MODE;
- KYC incomplete;
- payout restricted;
- tax unconfigured;
- guarantee unavailable for selected market/method;
- guarantee quote expired;
- guarantee reconciliation pending;
- guarantee incident;
- repricing required;
- SaaS billing failed;
- no tier/post/member;
- failed payment;
- pending webhook;
- dunning;
- expired membership;
- migration states;
- integrations disconnected;
- API key states;
- support empty;
- unauthorized;
- server/network error.

No blank dashboards.

---

# 56. TECHNICAL STACK

Preferred unless existing repository state now establishes a better sound decision:

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
- schema-based env validation.

A single full-stack app is preferred over unnecessary monorepo complexity.

Suggested structure:

```text
/app
/components
/components/ui
/lib
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
/db or /prisma
/tests
/docs
/scripts
/prompts
```

Create `docs/ARCHITECTURE.md`.

---

# 57. ENVIRONMENT CONFIGURATION

Create `.env.example` and runtime validation.

Include:

- app URL;
- DB URL;
- auth/session secrets;
- creator payment provider;
- Stripe keys;
- Connect config;
- webhook secrets;
- platform Billing;
- Tax provider;
- storage;
- email;
- Discord;
- Telegram where used;
- feature flags;
- admin dev seed credentials.

No real secret committed.

Production fails safely when critical settings are absent.

---

# 58. PERFORMANCE / OBSERVABILITY / ACCESSIBILITY

## Performance

- pagination;
- indexes;
- query limits;
- avoid N+1;
- optimized images;
- no raw provider payloads to client;
- minimal unnecessary client components;
- fast public pages;
- efficient entitlement checks;
- batched migration;
- resilient webhook processing;
- bounded integration retries.

## Observability

Structured logs:

- correlation ID;
- severity;
- route/service;
- safe resource refs;
- provider event ID;
- guarantee reconciliation ID;
- redaction.

Health endpoint:

- app;
- DB;
- provider configuration without secrets;
- guarantee engine/profile health;
- integration summary.

## Accessibility

Target WCAG 2.1 AA fundamentals:

- keyboard;
- focus;
- semantic headings;
- labels;
- linked field errors;
- accessible dialogs;
- contrast;
- no color-only state;
- reduced motion;
- tab order;
- mobile typography.

---

# 59. SEED / DEMO DATA

Create deterministic seed data demonstrating the entire philosophy.

At minimum:

- admin;
- approved/payment-ready creator;
- creator under review;
- creator needing info;
- country waitlist example;
- normal fan;
- Guaranteed Earnings tier with exact mock fee profile;
- Simple Price tier;
- monthly/annual tiers;
- public/paid posts;
- 100-payment conceptual/seedable earnings summary where practical without bloating data;
- active membership;
- past-due/recovered/cancelled membership;
- quote accepted;
- exact guarantee reconciliation;
- guarantee breach simulation;
- payout standard;
- payout instant with provider fee;
- unknown downstream bank fee example;
- coupon;
- trial;
- migration project;
- Discord mock;
- failed webhook;
- report;
- support ticket;
- fee profiles;
- Guarantee Eligibility Profiles;
- country capabilities;
- tax mock state.

Never seed secrets.

Provide reset script.

---

# 60. CORE END-TO-END JOURNEYS

All must work in deterministic mock mode.

## Journey A — new creator

1. landing;
2. calculator;
3. signup;
4. country eligibility;
5. creator application;
6. admin review;
7. approval;
8. `Set up payouts` embedded onboarding;
9. provider readiness;
10. optional `Verify/Open in Stripe` capability shown in live-compatible UI;
11. creator selects ZeroFee SaaS plan;
12. profile;
13. tier;
14. chooses Guaranteed Earnings;
15. enters `I want to earn €10`;
16. system confirms eligible payment routes;
17. creator previews buyer retail-price behavior;
18. monthly/annual;
19. publish;
20. gated content;
21. launch-ready page.

## Journey B — buyer Guaranteed Earnings checkout

1. public tier;
2. buyer sees contextual/final-price explanation;
3. login/signup;
4. secure payment-context collection;
5. server confirms guarantee eligibility;
6. exact quote created;
7. buyer sees final recurring price;
8. tax shown correctly;
9. buyer confirms;
10. provider payment succeeds;
11. webhook creates/updates membership;
12. authoritative fee data arrives;
13. guarantee reconciliation becomes `VERIFIED_EXACT`;
14. Creator Earnings event = target;
15. entitlement unlocks;
16. creator can verify transaction in Stripe/provider.

## Journey C — guarantee-ineligible method

1. buyer selects an ineligible method;
2. system does NOT pretend exact guarantee;
3. offer only permitted alternative eligible method or Simple Price behavior according to tier policy;
4. no fake transaction.

## Journey D — guarantee breach simulation

1. mock provider returns unexpected actual fee;
2. reconciliation becomes SHORTFALL or SURPLUS;
3. admin alert;
4. affected Guarantee Eligibility Profile pauses according to policy;
5. transaction remains visible/auditable;
6. system does not silently subsidize/hide.

## Journey E — renewal

1. same eligible context;
2. renewal;
3. actual fee reconciliation;
4. exact Creator Earnings event.

## Journey F — payment method/fee change

1. member changes method or profile expires;
2. new retail price calculated;
3. buyer receives required confirmation/notice;
4. new contract version;
5. no silent creator underpayment.

## Journey G — payout

1. creator sees available provider balance;
2. chooses standard/instant;
3. provider cost shown where available;
4. ZeroFee fee = 0;
5. payout initiated via embedded provider flow;
6. amount sent recorded;
7. creator earnings history remains unchanged;
8. provider verification link available.

## Journey H — failed renewal

PAST_DUE → notify → payment update/retry → recovered or expired.

## Journey I — cancellation/tier change

cancel/resume/upgrade/downgrade with clear effective price and guarantee contract.

## Journey J — migration

CSV → validate → map → invite → fan authorizes → converted.

## Journey K — creator rejection

review → reject reason → no payout activation.

## Journey L — KYC info required

provider requirement → embedded resume → updated readiness.

## Journey M — SaaS billing fails

past due → grace → suspend → recover → data preserved.

## Journey N — refund/dispute

earning originally verified → refund/dispute event → current Creator Earnings accounting updates correctly → no ZeroFee insurance.

## Journey O — Discord entitlement

connect/mock → tier map → fan link → grant → cancellation revoke → reconcile.

## Journey P — support escalation

creator-service issue → creator → fraud/platform escalation → admin.

## Journey Q — creator export

authorized machine-readable export with no secrets.

---

# 61. TESTING

A successful build is not completion.

## 61.1 Unit tests

At minimum:

- GuaranteePricingEngine;
- exact gross-up math;
- currency rounding;
- tax-inclusive/exclusive calculations;
- fee profile versioning;
- Guarantee Eligibility;
- quote expiry;
- guarantee reconciliation exact/shortfall/surplus;
- Creator Earnings ledger;
- payout presentation/earnings separation;
- entitlement resolver;
- application state machine;
- provider readiness;
- platform billing;
- membership lifecycle;
- repricing state;
- dunning;
- coupons/trials;
- grandfathering;
- migration mapping/dedupe;
- country eligibility;
- tax provider mapping;
- authorization;
- webhook idempotency;
- outbound webhook signing.

## 61.2 Integration tests

- application/review;
- rejected creator blocked;
- country gate;
- payout onboarding gate;
- SaaS entitlement;
- Guaranteed Earnings tier publish blocked without Guarantee Eligibility;
- eligible quote creation;
- quote tampering rejected;
- customer price calculated server-side;
- webhook payment activation;
- authoritative balance transaction reconciliation;
- exact Creator Earnings event;
- duplicate webhook does not double earnings;
- guarantee breach pauses profile;
- renewal;
- repricing;
- failed renewal/recovery;
- cancellation;
- refund/dispute;
- paid-content gating;
- migration;
- integrations;
- support routing;
- admin-only actions;
- cross-creator IDOR denial.

## 61.3 E2E

Automate representative Journeys A–Q in mock mode.

Phone + desktop for critical paths.

Optional Stripe test-mode suite separate from deterministic CI.

---

# 62. SECURITY / ABUSE TESTS

Explicitly attack/fix:

- creator A accessing creator B members;
- creator A refunding B payment;
- fan paid-content bypass;
- client changing Creator Earnings Target after quote;
- client changing retail charge amount;
- client forcing guarantee-eligible flag;
- replaying accepted quote;
- reusing expired quote;
- webhook replay/fake signature;
- duplicate earnings event;
- guarantee profile config tampering;
- migration CSV injection/oversize;
- rich text XSS;
- API key after revoke;
- outbound webhook SSRF;
- unsafe redirect;
- MIME spoof;
- quota bypass;
- admin route access;
- payout action for wrong connected account.

---

# 63. SCREENSHOT / VISUAL QA

Capture real rendered screenshots after implementation:

- homepage desktop/mobile;
- pricing/calculator;
- country eligibility;
- creator application;
- admin review;
- payout/KYC onboarding;
- creator dashboard with Creator Earnings vs balance vs payout separation;
- Guaranteed Earnings tier builder;
- guarantee eligibility state;
- public creator page;
- buyer quote/final-price confirmation;
- financial verification page;
- Stripe verification CTA state;
- payout page standard/instant;
- member dashboard;
- paid content locked/unlocked;
- migration;
- tax center;
- integrations;
- admin dashboard;
- Guarantee Health admin;
- support.

Inspect/fix:

- clipping;
- overflow;
- dead space;
- spacing;
- hierarchy;
- typography;
- button clarity;
- financial readability;
- misleading number labels;
- mobile usability;
- status clarity.

---

# 64. REQUIRED DOCUMENTATION

Create/update:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/GUARANTEED_EARNINGS_MODEL.md`
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

Docs describe implemented reality, not aspirational fiction.

`docs/GUARANTEED_EARNINGS_MODEL.md` must be especially detailed and include:

- exact definition of Creator Earnings;
- guarantee eligibility requirements;
- quote lifecycle;
- payment context;
- renewal/repricing;
- actual provider fee reconciliation;
- tax interaction;
- refund/dispute behavior;
- payout distinction;
- examples;
- known provider limitations;
- conditions required before marketing `Guaranteed` live.

---

# 65. IMPLEMENTATION ORDER

Execute completely in this sequence.

## Phase 0 — audit/bootstrap

- sync repository;
- read all files;
- bootstrap;
- DB/migrations;
- env validation;
- lint/typecheck/test/build;
- README.

## Phase 1 — identity/domain

- auth;
- RBAC;
- schema;
- state machines;
- audit;
- seed.

## Phase 2 — design/marketing/PWA

- design system;
- homepage;
- positioning;
- pricing/plans;
- calculator;
- shells;
- PWA.

## Phase 3 — country/compliance/application

- country registry;
- creator application;
- admin review;
- safety/legal/reporting.

## Phase 4 — payment/provider foundation

- provider abstractions;
- mock Connect;
- Stripe account configuration boundary;
- embedded onboarding;
- full Dashboard/verification capability;
- webhooks;
- readiness.

## Phase 5 — SaaS plans/billing/unit economics

- multiple plans;
- quotas;
- platform billing;
- grace/suspension;
- admin.

## Phase 6 — guarantee/pricing engine

- fee profiles;
- Guarantee Eligibility Profiles;
- money math;
- Guaranteed Earnings mode;
- Simple Price;
- quote lifecycle;
- exact mock pricing;
- admin guarantee controls;
- versioning.

## Phase 7 — tax/commerce

- CommerceResponsibilityProfile;
- TaxProvider/mock;
- Stripe Tax boundary;
- guarantee+tax interaction;
- receipts/invoices;
- tax center.

## Phase 8 — creator product/content

- profile;
- tiers;
- monthly/annual;
- promotions;
- posts/downloads/comments;
- public page.

## Phase 9 — buyer subscriptions

- context collection;
- final quote;
- explicit confirm;
- payment;
- webhook activation;
- entitlement;
- renewal;
- dunning;
- cancellation/tier change;
- repricing.

## Phase 10 — reconciliation/earnings/payouts

- provider fee retrieval;
- Guarantee Reconciliation Engine;
- Creator Earnings ledger;
- Financial Verification;
- connected balance;
- embedded payouts;
- standard/instant provider-cost UX;
- Stripe verification links.

## Phase 11 — refunds/disputes/migration

- reversals;
- dispute states;
- migration importer/campaign/conversion.

## Phase 12 — integrations/API/broadcast

- Discord;
- Telegram boundary;
- outbound webhooks;
- API;
- broadcasts.

## Phase 13 — support/admin/analytics/export

- support routing;
- full admin;
- Guarantee Health;
- creator analytics;
- platform analytics;
- export.

## Phase 14 — hardening

- security;
- accessibility;
- performance;
- observability;
- clean migration;
- all tests;
- E2E.

## Phase 15 — visual QA/docs/finalization

- seeded app;
- screenshots;
- inspect/fix;
- documentation;
- owner checklist;
- clean tree;
- commit/push.

Do not stop between phases because one external credential-dependent feature cannot be live-tested. Finish everything possible, isolate live limitations honestly and keep deterministic mock mode complete.

---

# 66. PRODUCT ACCEPTANCE CRITERIA

Prompt 1 is complete only when materially applicable items are true.

1. Visitor understands `Choose what you earn`.
2. ZeroFee platform fee on creator membership sales is 0%.
3. ZeroFee payout markup is 0.
4. Payment processing is never described as free.
5. ZeroFee revenue and creator membership GMV are separate.
6. SaaS plans scale by usage/features/members, not revenue percentage.
7. Country eligibility exists.
8. Unsupported markets cannot fake onboarding.
9. Creator application/review works.
10. Embedded payout/KYC onboarding works in mock mode.
11. Stripe production integration boundary is real.
12. Preferred full-Dashboard/Stripe-responsibility configuration is represented and gated by capability truth.
13. Creator can operate primarily inside ZeroFee.
14. Creator can independently verify provider records in Stripe where supported.
15. Direct charges are intended payment topology.
16. No custodial ZeroFee creator wallet.
17. Guaranteed Earnings and Simple Price are distinct.
18. Guaranteed Earnings cannot publish live without eligible profile.
19. Creator can choose exact earnings target in guarantee mode.
20. Buyer final retail price is server-calculated.
21. Buyer sees final recurring price before confirmation.
22. No late ZeroFee processing-fee surcharge.
23. Buyer context/payment method can change retail price only through explicit quote flow.
24. Quotes expire/version correctly.
25. Renewal guarantee contract is versioned.
26. Payment-method/provider-fee changes trigger repricing workflow rather than silent creator loss.
27. Actual Stripe/provider fee is reconciled after payment.
28. Exact successful mock guarantee produces `VERIFIED_EXACT`.
29. Shortfall/surplus produces visible incident.
30. Guarantee incident can pause affected eligibility profile.
31. No automatic hidden SaaS subsidy.
32. Creator Earnings ledger exists.
33. Refund/dispute updates economic history correctly.
34. Creator dashboard separates Creator Earnings, provider balance and payouts.
35. Financial Verification page proves per-payment economics.
36. ZeroFee platform fee displays 0.
37. Payout page shows ZeroFee payout fee 0.
38. Provider payout fee is distinct.
39. `Amount sent` is distinct from unverified bank landing amount.
40. Creator can initiate/manage provider-supported payouts from ZeroFee.
41. Payout does not rewrite historical Creator Earnings.
42. Tax is separate and first-class.
43. Tax-inclusive/exclusive pricing does not silently destroy guarantee.
44. Merchant/tax responsibility is explicit.
45. Creator Tax Center exists.
46. Monthly/annual memberships exist.
47. Grandfathering/versioning works.
48. Coupons/trials have explicit economic funding logic.
49. Webhook-authoritative activation.
50. Paid content is server-gated.
51. Dunning/recovery works.
52. Cancellation/resume/tier changes work.
53. Migration Center works.
54. No fake card migration.
55. Creator data export works.
56. Support responsibility split exists.
57. Moderation/reporting exists.
58. Discord mock integration works.
59. Outbound webhook secure.
60. Creator API scoped.
61. Broadcast quotas/provider availability respected.
62. Admin manages plans, countries, fee profiles, guarantee profiles and guarantee health.
63. Webhook inspector/replay exists.
64. Audit critical actions.
65. PWA/mobile intentional.
66. Private content not publicly cached.
67. Core flows phone/desktop.
68. Security tests include quote/price/guarantee tampering.
69. Build/lint/typecheck/tests green.
70. E2E passes in mock mode.
71. Screenshot QA complete.
72. Docs match implementation.
73. Live Stripe/content/tax/legal gaps explicitly listed.

---

# 67. FINANCIAL INVARIANTS

These are hard invariants.

1. `creator_membership_gmv != zerofee_saas_revenue`.
2. `zerofee_membership_platform_fee_bps = 0`.
3. `zerofee_payout_markup = 0`.
4. `zerofee_processing_markup = 0`.
5. `zerofee_membership_application_fee = 0`.
6. ZeroFee does not silently subsidize variable creator processing from SaaS revenue.
7. Guaranteed Earnings is enabled only for verified eligible payment routes.
8. Buyer approves final retail price before charge.
9. Actual provider fee is reconciled after charge.
10. A guarantee mismatch is an incident, not rounded away.
11. Refunds/disputes can reverse previously earned amounts.
12. Creator Earnings and payout are different concepts.
13. Provider/bank payout fees do not retroactively redefine Creator Earnings.
14. Amount sent is not claimed as amount landed when unknown.
15. Tax is not mislabeled as a ZeroFee fee.
16. Direct charges are preferred subject to provider approval.
17. No custodial internal creator wallet.
18. SaaS plan upgrades are not GMV/revenue-share disguised as usage plans.
19. Exact provider capability/fees/liability are provider truth.
20. Creator data is portable.

---

# 68. PROMPT 1 SCOPE EXCLUSIONS

Do not build unrelated scope unless dependency requires:

- native iOS;
- native Android;
- Apple/Google IAP;
- adult-content workaround;
- crypto;
- crowdfunding;
- P2P cash transfer;
- creator-to-creator transfer;
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

Keep clean extension points without diluting core product.

---

# 69. OWNER NEXT STEPS

At completion generate `docs/OWNER_NEXT_STEPS.md` with dependency-ordered checkboxes.

## Company/legal

- operating entity/jurisdiction;
- legal review;
- Terms;
- Creator Agreement;
- Acceptable Use;
- Privacy;
- DSA/copyright process;
- recurring billing law;
- refund policy;
- exact wording of `Guaranteed Creator Earnings` reviewed.

## Stripe/payment

- contact Stripe before public launch;
- content-platform approval;
- confirm direct charges;
- confirm preferred full Dashboard configuration;
- confirm fees collected from connected account;
- confirm loss liability;
- confirm embedded components;
- confirm creators can be created through ZeroFee onboarding;
- confirm supported individuals/companies/countries;
- confirm payout controls/manual/instant behavior;
- confirm provider payout costs and how to surface them;
- confirm statement descriptors;
- configure platform Billing;
- webhooks;
- test charges/refunds/disputes/payouts.

## Guaranteed Earnings

- obtain authoritative provider pricing terms for initial markets;
- identify which payment routes have deterministic fee schedules;
- confirm whether any provider API can quote relevant fees before charge;
- approve initial Guarantee Eligibility Profiles;
- define allowed card/payment-method categories;
- test hundreds of Stripe test/live-beta transactions;
- verify `actual_creator_earnings == target` in every guaranteed case;
- define operational response to guarantee mismatch;
- define fee-change/repricing notice policy;
- obtain legal review of `guaranteed` marketing language;
- do NOT enable `GUARANTEED_EARNINGS_LIVE_ALLOWED` until all above are satisfied.

## Tax

- seller/merchant confirmation by jurisdiction;
- ZeroFee SaaS VAT/sales tax;
- creator-to-fan VAT/GST/sales tax;
- Stripe Tax decision;
- registrations;
- invoices/receipts;
- reporting forms;
- retention;
- tax advisor signoff.

## Commercial

- final SaaS plans;
- quotas;
- initial countries;
- initial creator verticals;
- migration incentive;
- support/refund policy.

## Infrastructure

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

## Beta

- small closed real-creator group;
- KYC;
- guaranteed pricing route test;
- tax;
- migration;
- failed payments;
- refunds/disputes;
- payouts;
- support load;
- infrastructure cost;
- conversion/churn;
- guarantee mismatch rate must be zero before public guarantee launch;
- unit economics recalculation;
- then public launch.

---

# 70. REQUIRED FINAL COMPLETION REPORT

When Prompt 1 execution completes, report:

- final commit SHA;
- branch;
- push status;
- clean/dirty tree;
- implemented major flows;
- architecture;
- schema/migrations;
- test counts/results;
- lint/typecheck/build;
- E2E;
- screenshot QA;
- mock providers;
- Stripe integration state;
- connected-account dashboard/responsibility configuration state;
- Stripe approval state;
- Guaranteed Earnings live eligibility state;
- number/status of Guarantee Eligibility Profiles;
- reconciliation test results;
- payout integration state;
- country capability state;
- tax state;
- credential/approval gaps;
- security findings fixed;
- remaining limitations;
- `docs/OWNER_NEXT_STEPS.md` path.

Never say `production ready` unless the external legal/payment/tax and guarantee-verification dependencies are actually satisfied.

---

# 71. DECISION PRINCIPLES

When ambiguous:

1. Protect exact financial correctness.
2. Protect authorization/security.
3. Protect truthfulness of the guarantee.
4. Protect tax/payment truth.
5. Protect creator/buyer clarity.
6. Prefer supporting fewer financial routes over lying about exactness.
7. Prefer reversible configuration over hardcoded assumptions.
8. Prefer provider abstractions over Stripe strings everywhere.
9. Preserve history/versioning.
10. Preserve auditability.
11. Prefer `not supported/not configured` over fake success.
12. Never solve UX by lying about money movement.
13. Never create revenue share through the back door.
14. Never redefine payout cost as lost Creator Earnings.
15. Never claim bank landing amount without evidence.
16. Do not trap creator data.
17. Do not assume global availability.
18. Do not call legal/compliance work complete without professional verification.

---

# 72. CORE PRODUCT NORTH STAR

Keep this as the implementation north star:

> **ZeroFee is the membership platform where creators choose what they earn, eligible successful membership payments reconcile to that Creator Earnings amount, ZeroFee takes 0% of membership revenue and 0% payout markup, payment-provider costs are incorporated into the buyer-facing economics rather than hidden from the creator, creator funds live with the connected payment provider rather than a ZeroFee wallet, and every important financial claim can be independently verified against provider records. ZeroFee makes money from fixed software subscriptions, not from taxing creator success.**

And the shortest product statement:

# You choose your earnings.

# We take 0% of your membership revenue.

# Don't trust us. Verify it.

EXECUTE THE ENTIRE SPECIFICATION.
