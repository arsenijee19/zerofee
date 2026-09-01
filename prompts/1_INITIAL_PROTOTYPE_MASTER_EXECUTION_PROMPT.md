# ZeroFee — Initial Prototype Master Execution Prompt

**Prompt version:** 1.1  
**Status:** AUTHORITATIVE MASTER SPECIFICATION FOR THE COMPLETE INITIAL PROTOTYPE  
**Repository:** `arsenijee19/zerofee`

---

# EXECUTION DIRECTIVE

START EXECUTION NOW.

Work directly from the CURRENT default branch of the `arsenijee19/zerofee` repository.

This file is intentionally large. Read it COMPLETELY before making architecture decisions. Until the owner explicitly says otherwise, **all requirements for the complete ZeroFee initial prototype belong in Prompt 1**. Do not create a Prompt 2 merely because the scope is large. If this file has been amended since a previous run, the newest version is authoritative.

The repository was empty when Prompt 1 was first created. The goal is to build a serious, functional, visually polished, technically coherent end-to-end prototype of the entire core ZeroFee platform, not merely a landing page or payment proof of concept.

Do not:

- summarize this specification instead of executing it;
- stop after scaffolding;
- deliver disconnected mockups;
- leave core buttons dead;
- fake successful payments, KYC, tax, or compliance states in live mode;
- claim production readiness when external Stripe/legal/tax approvals have not occurred;
- ask the owner questions that can safely be resolved through this specification, repository state, current official documentation, or a reasonable reversible implementation decision.

Where live external credentials or approvals are unavailable, build a deterministic mock/test provider behind the same production domain interface. The prototype must remain fully demonstrable and testable without live money movement, while the real Stripe integration boundary must be implemented as far as credentials/configuration permit.

Every implementation decision must preserve the central ZeroFee economics:

> **ZeroFee charges creators a predictable SaaS subscription and takes 0% platform transaction fee from creator membership sales. Payment processing remains real and transparent.**

---

# 1. PRODUCT THESIS

ZeroFee is a creator membership and community SaaS platform built for creators who are already earning meaningful recurring revenue and dislike revenue-share platforms becoming more expensive as they grow.

The primary market is NOT the creator earning $30/month.

Primary target profile:

- established YouTubers;
- podcasters;
- newsletter writers;
- educators;
- coaches where permitted by payment-provider policy;
- developers/open-source creators;
- gaming communities;
- Discord/Telegram communities;
- analysts/research creators;
- professional niche communities;
- creators with existing Patreon-like memberships;
- creators earning roughly hundreds to tens of thousands of dollars per month or more.

Core positioning:

> **The membership platform that doesn't tax your success.**

Preferred claims:

- **0% ZeroFee platform transaction fee.**
- **One predictable SaaS subscription.**
- **Your plan does not become more expensive because your revenue grows.**
- **Choose what you want to earn. ZeroFee helps you price for it.**
- **Your members see the real price upfront.**
- **Your audience, your data, your business.**

Forbidden/deceptive claims:

- “payment processing is free”;
- “keep every cent” without qualification;
- “no fees of any kind”;
- “every $50 sale always produces exactly $50 after every possible event”;
- “ZeroFee guarantees all refunds/chargebacks”;
- “Stripe supports every country”;
- “ZeroFee handles all of your taxes automatically” unless that is actually enabled and legally true for the transaction;
- unsupported blanket comparisons such as “Patreon always takes 30–40%.”

Competitor comparisons must separate:

1. platform fee;
2. payment processing;
3. app-store fees where applicable;
4. payout/FX fees where applicable;
5. taxes.

Never combine unrelated costs to manufacture a sensational percentage.

---

# 2. ZERO FEE DOES NOT MEAN ZERO PAYMENT COST

This distinction is fundamental and must be reflected everywhere in code, copy, analytics and accounting terminology.

ZeroFee's initial commercial promise:

`ZeroFee platform transaction fee on creator membership sales = 0%`

Payment processors still charge for processing.

Do not hide payment processing from the creator. Instead make the economics predictable and easy to understand.

A creator's money flows and ZeroFee's SaaS revenue must be separate concepts.

## Relationship A — creator pays ZeroFee

Creator → ZeroFee → creator SaaS subscription.

## Relationship B — fan pays creator

Fan → creator payment/connected account → processor costs/tax mechanics → creator balance/payout.

ZeroFee must not implement a custodial internal creator wallet for the initial product.

ZeroFee must not collect fan GMV into its own ordinary platform balance and then manually “pay creators out” unless a future explicitly approved merchant-of-record/custodial model replaces this architecture.

Core domain invariant:

`platform_subsidizes_creator_processing = false`

Core domain invariant:

`platform_transaction_fee_bps = 0`

for creator membership sales in the initial product.

---

# 3. ZERO FEE SAAS PLANS AND UNIT ECONOMICS

A single unlimited $29/$50 plan is not economically safe if one creator can consume extreme support, storage, email, API, member-management or media resources.

ZeroFee must remain **0% of creator revenue**, but SaaS plans may scale based on product usage, not GMV.

Build full support for multiple creator plans from the prototype.

Seed editable DEMO plans such as:

| Plan | Demo monthly price | Example active-member allowance | Purpose |
|---|---:|---:|---|
| Starter | $19 | 100 | smaller established creators |
| Creator | $49 | 1,000 | core target |
| Pro | $99 | 5,000 | larger communities |
| Business | $199 | 25,000 | high-scale creators |

These are **prototype defaults, not permanent commercial decisions**.

Admin must be able to change without code deployment:

- plan name;
- monthly price;
- annual price;
- active member allowance;
- storage quota;
- email/broadcast quota;
- API quota;
- integration entitlements;
- analytics retention;
- team-seat allowance architecture;
- custom-domain entitlement;
- trial duration;
- grace period;
- plan visibility;
- upgrade recommendation thresholds.

IMPORTANT:

- never make plan selection depend directly on revenue or GMV;
- creator earning $500,000 can remain on a plan if they fit its operational/usage limits;
- upgrading must be justified by member count, resource usage or features, not success tax;
- do not promise unlimited video, AI, email or bandwidth blindly.

Create `docs/UNIT_ECONOMICS.md` documenting:

- creator SaaS MRR vs creator GMV;
- zero revenue-share model;
- cost-sensitive resources;
- support burden;
- storage/bandwidth risk;
- email delivery risk;
- moderation/compliance cost;
- webhook/event volume;
- suggested gross-margin telemetry;
- future enterprise/custom pricing that remains non-percentage based.

---

# 4. CREATOR PRICING — TWO MODES

Pricing is a first-class domain.

## 4.1 Simple Price

Creator sets public recurring price.

Example:

`$50/month`

Buyer sees $50/month.

Processor/tax deductions then follow the connected account and transaction rules.

Creator copy:

> **Set the public price**  
> Members pay this amount. Applicable processing costs and taxes are handled according to your payment setup.

## 4.2 Target Net — default/recommended

Creator tells ZeroFee what they would like to target as proceeds from a successful supported payment before later events such as refund, dispute, reserve, tax liability or exceptional processing differences.

Example UX:

**I want to earn**  
`$50.00`

**Recommended member price**  
`$52.xx/month`

**ZeroFee platform transaction fee**  
`$0.00`

The creator can adjust the desired target until the final retail price has attractive psychology, e.g. $49.99 or $54.99.

The buyer must see only the final approved recurring retail price from the public tier card onward.

Do NOT show:

`$50 + ZeroFee fee $2.99`

as a surprise checkout surcharge.

The customer-facing amount is a normal retail price chosen/approved by the creator using ZeroFee's recommendation.

Taxes that legally depend on buyer location are a separate matter and must be disclosed correctly; they are not a ZeroFee platform surcharge.

---

# 5. PRICING ENGINE

Implement a dedicated server-side `PricingEngine`.

Never perform money math with floating-point arithmetic.

Use:

- integer minor units;
- currency metadata;
- fixed/decimal percentage representation;
- explicit rounding rules;
- immutable calculation snapshots.

Input must support:

- creator target net OR desired public price;
- currency;
- billing interval;
- pricing mode;
- processor fee profile;
- recurring billing fee component if applicable;
- payment-method group;
- domestic/cross-border assumptions;
- optional FX estimate;
- safety buffer;
- minimum transaction amount;
- tax behavior separate from processing gross-up.

Fee profile model must support versioning and at minimum:

- name;
- provider;
- country/region applicability;
- currency applicability;
- payment-method applicability;
- percentage component;
- fixed component;
- recurring/billing percentage if relevant;
- optional cross-border estimate;
- optional FX estimate;
- safety-buffer rule;
- valid-from;
- valid-to;
- active flag.

Seed clearly labeled DEMO fee profiles. Never label a demo value as a globally valid Stripe fee.

For a simple percentage + fixed fee profile, the logic is mathematically equivalent to:

`gross = (target_net + fixed_fee) / (1 - percentage_rate)`

before currency-aware rounding/safety treatment.

Do not scatter this formula through React components.

Store a pricing calculation snapshot with a price version so historical prices remain explainable even if admin fee profiles later change.

Test:

- zero percentage;
- zero fixed cost;
- normal amounts;
- small amounts;
- huge amounts;
- invalid rates;
- rounding boundaries;
- zero-decimal currencies where supported;
- different billing intervals;
- buffer enabled/disabled;
- multiple currencies;
- profile expiry;
- missing profile;
- payment method mismatch.

## 5.1 Target net is an estimate, not insurance

Copy must explain, in plain language but not clutter the primary UI:

> Target Net is calculated using your active payment-cost assumptions for a successful supported payment. Refunds, disputes, taxes, reserves, FX changes or exceptional processing costs can change final proceeds.

Do not guarantee a net amount across events that occur after the successful charge.

---

# 6. PRICE VERSIONING AND GRANDFATHERING

A tier is not the same as a price.

Model:

- `CreatorTier` = membership offering;
- `TierPriceVersion` = immutable billing price definition.

When creator changes price:

- create a new price version;
- new members use new price;
- existing members remain grandfathered by default;
- creator can later initiate an explicit existing-member migration;
- migrations must preview affected members and effective dates;
- no silent price mutation.

Support monthly and annual tier prices in the prototype.

Annual pricing must be separately configured/calculated rather than multiplying a monthly rounded amount blindly.

---

# 7. STRIPE CONNECT — INTENDED PAYMENT ARCHITECTURE

The desired production architecture is Stripe Connect with the creator financially separated from ZeroFee's platform balance.

Use current official Stripe documentation at implementation time rather than relying on old “Standard/Express/Custom” assumptions if the Accounts API model has evolved.

## 7.1 Embedded onboarding

Creators should not need to manually operate stripe.com for normal ZeroFee onboarding.

Creator UX terminology:

- `Set up payouts`;
- `Verify identity`;
- `Add payout account`;
- `Complete verification`;
- `Payouts active`.

Use Stripe Connect Embedded Onboarding where live configuration permits.

ZeroFee can collect ordinary application/business information first and prefill legally permitted account fields.

Stripe should collect sensitive identity documents and verification data directly whenever possible.

Do not create a duplicate KYC-document vault.

The creator must personally perform any consent, identity or agreement action Stripe requires.

ZeroFee must never impersonate the creator to accept Stripe agreements.

## 7.2 Direct charges

Intended fan-payment topology:

fan → creator connected account → processor → creator balance/payout.

Not:

fan → ZeroFee wallet → ZeroFee manually pays creator.

Use direct charges for creator membership payments if the final approved Stripe platform configuration supports the intended model.

## 7.3 Stripe handles connected-account pricing

Preferred production direction: Stripe directly sets/collects processing pricing from connected users where this option is available and approved.

Do not hardcode availability.

Admin capabilities must explicitly expose platform configuration facts such as:

- `CONTENT_PLATFORM_APPROVAL_CONFIRMED`;
- `DIRECT_CHARGES_ENABLED`;
- `STRIPE_HANDLES_CONNECTED_PRICING`;
- `STRIPE_MANAGED_LOSS_LIABILITY_CONFIRMED`;
- `STRIPE_TAX_ENABLED`;
- `LIVE_CHARGES_ALLOWED`.

In mock mode these must be visibly labeled TEST/DEMO.

## 7.4 Loss liability

Preferred model is one where connected account bears fees/refunds/chargebacks for its direct charges and Stripe's contracted loss-liability arrangement covers qualifying unrecoverable account loss rather than ZeroFee silently becoming insurer.

This is a contractual/provider capability, not an application promise.

Never claim this is active unless actual Stripe configuration confirms it.

## 7.5 Platform SaaS billing is separate

Implement `PlatformBillingProvider` separately from `CreatorPaymentsProvider` even if both use Stripe.

Creator SaaS billing states:

- NONE;
- TRIALING;
- ACTIVE;
- PAST_DUE;
- GRACE;
- SUSPENDED;
- CANCEL_AT_PERIOD_END;
- CANCELLED.

Keep creator data when SaaS billing lapses.

Enforce a documented suspension policy after grace period rather than silently giving unlimited paid access forever.

---

# 8. PAYMENT PROVIDER ABSTRACTION AND MOCK MODE

The app must run fully without live payment credentials.

Support:

`CREATOR_PAYMENTS_PROVIDER=mock|stripe`

`PLATFORM_BILLING_PROVIDER=mock|stripe`

The mock provider must use the same domain contract and simulate:

- connected account not created;
- onboarding incomplete;
- identity pending;
- additional information required;
- approved/payment-ready;
- restricted/suspended;
- successful payment;
- failed payment;
- subscription renewal;
- cancellation;
- refund;
- partial refund if implemented;
- dispute opened;
- dispute won/lost;
- payout state;
- negative/restricted account state;
- failed SaaS billing;
- card-update recovery.

Display `TEST MODE` prominently whenever mock/test financial state is shown.

Never visually imply fake test money is live revenue.

---

# 9. WEBHOOKS AND EVENT CORRECTNESS

Payment and subscription state is server/provider-authoritative.

Browser success redirect is NOT proof of payment.

Implement:

- raw-body signature verification;
- platform vs connected-account event routing;
- provider event scope;
- unique provider event IDs;
- idempotent processing;
- persistent webhook event store;
- attempt count;
- processing status;
- safe error;
- internal replay;
- correlation IDs;
- no duplicate member subscription;
- no duplicate entitlement;
- no duplicate notification;
- transaction-safe state transitions.

Admin webhook console must show safe diagnostics and allow internal replay.

Provider payloads must be redacted where needed.

---

# 10. STRIPE CONTENT-PLATFORM APPROVAL

ZeroFee hosts/distributes third-party creator content and enables paid memberships. Treat Stripe approval for this platform category as a real launch dependency.

Before production launch, Stripe must confirm the exact acceptable business model and Connect setup.

Create `docs/STRIPE_APPROVAL_READINESS.md` containing:

- product description;
- target creator categories;
- explicit adult-content prohibition under Stripe-based product;
- creator review process;
- direct-charge architecture;
- moderation/reporting;
- prohibited categories;
- KYC division of responsibility;
- dispute/refund handling;
- tax architecture summary;
- target countries;
- open Stripe questions;
- required approvals/capabilities.

Do not call the app production-ready until approval/configuration has actually been confirmed.

---

# 11. COUNTRY ELIGIBILITY — DO NOT ASSUME GLOBAL AVAILABILITY

ZeroFee cannot pretend every creator in every country can receive payments through the same Stripe Connect setup.

Implement a first-class `CountryCapabilityRegistry`.

For each country/market, support fields such as:

- creator onboarding enabled;
- individuals supported;
- companies supported;
- charges enabled;
- payouts enabled;
- supported settlement currencies;
- supported presentment currencies;
- available payment methods;
- tax readiness status;
- terms/privacy availability;
- Stripe/PSP approval state;
- platform manual-approval requirement;
- notes/internal restrictions;
- launch status: `UNSUPPORTED`, `WAITLIST`, `BETA`, `AVAILABLE`, `PAUSED`.

Do not hardcode marketing claims about Serbia or any other country based on memory.

In live mode, current provider documentation/configuration is authoritative.

Creator registration flow:

1. choose country;
2. ZeroFee checks country registry;
3. if AVAILABLE/BETA → continue according to rules;
4. if WAITLIST → capture email/interest, do not fake payout readiness;
5. if unsupported → explain clearly and stop payment onboarding.

Admin can manage market availability without code change.

Create `docs/COUNTRY_AND_CURRENCY_STRATEGY.md`.

---

# 12. MERCHANT / SELLER / TAX RESPONSIBILITY MODEL

This is a major product area, not a future footnote.

ZeroFee's intended model is that creator membership sales are creator-side sales, not ZeroFee reselling creator content as Merchant of Record.

However, exact merchant/legal/tax treatment depends on jurisdiction and Stripe contract configuration.

Therefore model it explicitly.

Create a platform-level `CommerceResponsibilityProfile` with states/fields such as:

- intended seller: creator;
- payment processor: Stripe/other;
- merchant-of-record status: false/unknown/confirmed by jurisdiction;
- tax calculation provider;
- tax collection responsibility status;
- tax remittance responsibility status;
- receipt/invoice issuer policy;
- statement descriptor policy;
- legal-review status.

Never infer these from UI copy alone.

Create `docs/MERCHANT_AND_TAX_RESPONSIBILITY.md` documenting what is known, what is assumption, and what requires professional confirmation.

---

# 13. VAT / GST / SALES TAX ARCHITECTURE

Tax must be architected into the prototype from day one.

The application must not tell creators:

> “ZeroFee saves you 10%, now taxes are your problem, good luck.”

Instead build a guided tax-readiness layer while remaining honest about legal responsibility.

## 13.1 TaxProvider interface

Implement:

`TaxProvider = mock | stripe_tax | disabled`

or equivalent abstraction.

Tax domain must be separate from PricingEngine's processor-fee gross-up.

Support at minimum:

- seller/creator country;
- buyer billing country/address data provided through payment flow;
- product/service tax category placeholder;
- tax-inclusive vs tax-exclusive configuration where legally appropriate;
- tax registration records/reference IDs;
- calculation result snapshot;
- tax amount;
- tax jurisdiction metadata;
- tax collection status;
- remittance status/owner;
- receipt/invoice metadata;
- exemption/tax-ID architecture where relevant;
- `UNKNOWN/NOT_CONFIGURED` states.

Do not build homemade global tax-law logic.

Use provider APIs for calculation where configured.

## 13.2 Public price and tax

ZeroFee's “no surprise fee” promise applies to ZeroFee platform fees.

Taxes can legally depend on buyer location.

Public pricing UI must therefore support legally accurate wording such as:

- tax included where required/configured;
- taxes may apply based on location;
- final tax shown before payment confirmation.

Never disguise tax as a ZeroFee fee.

Never hide a known mandatory tax until after payment.

## 13.3 Creator tax center

Create a creator Tax/Compliance section showing, based on actual configuration:

- tax collection configured/not configured;
- registrations on file;
- countries requiring owner attention according to provider data;
- downloadable tax/payment summaries;
- warnings that ZeroFee is not providing tax/legal advice;
- links to provider-managed registration/reporting components when available.

Do not provide fabricated legal conclusions.

## 13.4 Tax reporting

Architecture must account for provider/market tax reporting such as US connected-account reporting requirements where applicable.

Do not assume Stripe automatically files every required form for every Connect configuration.

Create owner checklist items to confirm:

- 1099 or equivalent reporting responsibility;
- W-8/W-9 collection where applicable;
- EU VAT/GST responsibilities;
- platform's own SaaS VAT/tax;
- creator-to-fan tax;
- invoices/receipts;
- record retention.

---

# 14. RECEIPTS, INVOICES AND STATEMENT CLARITY

Chargebacks increase when buyers do not recognize the transaction.

Design the payment experience so the buyer knows:

- which creator they joined;
- what ZeroFee is;
- recurring amount;
- renewal interval;
- seller/merchant identity as legally configured;
- cancellation/refund path;
- support path.

Receipt/invoice generation must follow the configured merchant/tax model.

Do not blindly issue a receipt claiming ZeroFee sold creator content if creator is the seller.

Statement descriptor configuration must be documented and tested in live/test Stripe mode as supported.

---

# 15. CREATOR APPLICATION AND PRE-SCREENING

Stripe KYC answers “who is this person/business?”

ZeroFee pre-screening answers “what do they plan to sell here and do we allow it?”

Collect:

- creator display name;
- legal type: individual/business;
- country;
- category;
- detailed description of paid offering;
- examples of paid content/benefits;
- public website/social links;
- audience-size range;
- expected monthly membership revenue range;
- content formats;
- community integrations planned;
- confirmation they own/have rights to distribute content;
- acceptance of Acceptable Use/Creator Terms;
- explicit prohibited-content acknowledgement.

Do not collect unnecessary sensitive PII.

Application states:

- DRAFT;
- SUBMITTED;
- UNDER_REVIEW;
- NEEDS_INFORMATION;
- APPROVED_FOR_PAYOUT_ONBOARDING;
- REJECTED;
- SUSPENDED_POST_APPROVAL.

Admin can:

- review;
- request info;
- approve;
- reject with reason;
- suspend later;
- add private notes;
- see immutable history.

Every important transition is audited.

Creator cannot self-approve through client-side mutation.

---

# 16. KYC / PAYOUT ONBOARDING UX

After ZeroFee application approval:

1. creator opens `Set up payouts`;
2. ZeroFee creates/retrieves connected account server-side;
3. prefilled data is passed where allowed;
4. embedded Stripe onboarding collects remaining legal/KYC/bank information;
5. creator accepts required provider agreements personally;
6. provider account status is synchronized;
7. ZeroFee enables sales only when both ZeroFee review and provider payment readiness are satisfied.

Provider readiness states:

- NOT_CREATED;
- ONBOARDING_REQUIRED;
- PENDING_PROVIDER_REVIEW;
- NEEDS_INFORMATION;
- RESTRICTED;
- PAYMENT_READY;
- PAYOUT_READY;
- SUSPENDED/DISABLED.

Do not use one vague `isVerified` boolean.

Creator dashboard must surface provider actions without requiring normal stripe.com operation wherever embedded components permit.

---

# 17. PROHIBITED CONTENT AND PLATFORM SAFETY

ZeroFee Stripe-based product is NOT an adult-content/OnlyFans payment workaround.

Prototype Acceptable Use must conservatively prohibit at minimum:

- illegal products/services;
- pornography/sexual services prohibited by PSP rules;
- sexual exploitation;
- CSAM/minor sexual content;
- non-consensual content;
- extremist/terrorist financing or prohibited activity;
- illegal weapons sales;
- controlled-drug sales;
- stolen goods;
- fraud/scams;
- pyramid/money-circulation abuse;
- disguised money transmission;
- phishing;
- malware;
- credential theft;
- pirated/copyright-infringing distribution;
- doxxing/private-data sale;
- impersonation;
- other provider-restricted categories.

Implement:

- `/legal/acceptable-use`;
- `/legal/creator-terms`;
- `/legal/terms`;
- `/legal/privacy`;
- content report flow;
- creator report flow;
- admin moderation queue;
- takedown;
- creator suspension;
- appeal/contact path;
- evidence/note history;
- moderation audit log.

Legal pages are draft/prototype until professional review and must say so internally/documentationally.

Create `docs/LEGAL_AND_COMPLIANCE_OPEN_ITEMS.md`.

---

# 18. DSA / NOTICE-AND-ACTION / COPYRIGHT READINESS

Because ZeroFee can host user-generated creator content, implement platform safety architecture suitable for later legal review.

At minimum:

- report illegal content;
- report copyright infringement;
- report impersonation;
- report fraud/scam;
- report unsafe/prohibited content;
- structured report reason;
- reporter contact optional/required according to flow;
- moderation decision;
- creator notice;
- appeal path;
- status tracking;
- audit log;
- retention policy placeholder.

Do not call the feature “DSA compliant” without legal review.

Document EU DSA/copyright/DMCA-style open obligations by jurisdiction in the legal checklist.

---

# 19. USER ROLES AND AUTHORIZATION

Roles:

## Visitor

- marketing;
- public creator pages;
- public posts/previews;
- signup/login.

## Member/Fan

- profile/security;
- memberships;
- checkout;
- self-service billing actions;
- paid content access by entitlement;
- comments where enabled;
- support/refund request;
- content/creator reports;
- data export/account deletion request architecture.

## Creator

- creator application;
- payout setup;
- ZeroFee SaaS billing;
- profile;
- tiers/prices;
- posts/downloads;
- member management;
- earnings;
- payouts/provider status;
- tax center;
- integrations;
- migration;
- broadcasts/notifications within quota;
- refunds/disputes where provider permits;
- data export;
- API/webhooks where plan permits.

## Admin/Owner

- applications;
- creators;
- moderation;
- plans;
- fee profiles;
- country capability registry;
- merchant/tax config;
- provider capabilities;
- webhook events;
- audit logs;
- support escalations;
- platform metrics;
- feature flags;
- mock/test controls;
- manual entitlement overrides with reason.

RBAC must be enforced server-side.

Hiding navigation is not authorization.

---

# 20. AUTHENTICATION AND SECURITY

Implement real authentication.

Minimum:

- email/password or another secure first-party flow;
- secure password hashing;
- email normalization;
- secure session cookies;
- session invalidation;
- login/registration rate limits;
- password reset;
- email verification architecture and functioning mock-email flow;
- CSRF protection appropriate to framework;
- safe auth errors;
- server-side authorization;
- no secrets in client bundle.

Admin seed account only in dev/test.

Security review must cover:

- IDOR;
- role escalation;
- CSRF;
- XSS/rich text;
- SQL injection;
- SSRF;
- upload validation;
- oversized files;
- path traversal;
- open redirects;
- webhook spoofing/replay;
- race conditions;
- rate limiting;
- cookie flags;
- secret leakage;
- sensitive-log leakage;
- payout/KYC metadata access;
- API-key abuse;
- integration OAuth token storage if implemented.

Create `docs/SECURITY.md` with threat model, trust boundaries, known limitations and production hardening backlog.

---

# 21. CREATOR PUBLIC PROFILE

Creator can configure:

- display name;
- unique slug;
- avatar;
- banner;
- short bio;
- full about;
- social links;
- category;
- constrained visual theme/accent;
- featured tier;
- featured posts;
- support/contact preference;
- optional verified/approved indicator only if defined honestly.

Public page shows:

- creator identity/branding;
- about;
- final public prices;
- benefits;
- free posts;
- locked previews;
- join CTA;
- legal recurring billing disclosure;
- report creator/content link;
- appropriate seller/support information.

Never expose legal/KYC private data.

---

# 22. MEMBERSHIP TIERS

Support:

- name;
- description;
- benefit list;
- public/draft/archive state;
- sort order;
- monthly price;
- annual price;
- currency;
- Simple Price or Target Net;
- price versions;
- member count;
- gated content mapping;
- optional trial;
- coupons/discount eligibility;
- migration/grandfathering status.

Do not implement unrestricted peer-to-peer donations disguised as memberships.

Core product is defined recurring creator membership and creator content/community access.

---

# 23. CONTENT SYSTEM

Post fields:

- title;
- slug;
- excerpt;
- body;
- cover image;
- attachments/downloads;
- visibility: public / all paid / selected tiers;
- draft/published/archived;
- publish timestamp;
- creator ownership.

Support safe downloadable files with strict limits and storage abstraction.

Do not build expensive proprietary video streaming/transcoding in Prompt 1.

Support safe external video/embed providers or a media-provider abstraction.

Never cache private paid content publicly.

Comments:

- creator can enable/disable per post;
- authenticated comments;
- delete own comment;
- creator moderation;
- report comment;
- admin moderation for abuse;
- rate limits.

---

# 24. PWA / MOBILE WEB

ZeroFee should deliberately avoid an initial native in-app-purchase trap.

Build a high-quality mobile web product and installable PWA where practical.

Requirements:

- web app manifest;
- installability metadata;
- responsive icon setup;
- standalone display behavior where appropriate;
- mobile navigation intentionally designed;
- creator onboarding works on phone;
- checkout handoff works on phone;
- no assumption that iOS allows all PWA capabilities equally;
- no offline caching of private paid content or sensitive financial pages;
- service-worker strategy must avoid stale entitlement/payment state;
- push-notification architecture can be documented/feature-flagged if not fully implemented.

Do not build native iOS/Android apps in Prompt 1.

---

# 25. MEMBER SUBSCRIPTION LIFECYCLE

A Patreon replacement needs more than “Subscribe”.

Implement a real subscription lifecycle.

Statuses:

- PENDING_PAYMENT;
- TRIALING;
- ACTIVE;
- PAST_DUE;
- GRACE;
- PAUSED if supported/configured;
- CANCEL_AT_PERIOD_END;
- CANCELLED;
- EXPIRED;
- REVOKED;
- REFUNDED where relevant.

Member actions:

- subscribe;
- view renewal date;
- update payment method through provider-safe flow;
- cancel immediately or at period end according to policy;
- resume before period end where supported;
- switch tier;
- switch monthly/annual where supported;
- see next price/effective date;
- see invoice/receipt/history;
- request support/refund;
- rejoin after expiration.

Creator actions:

- view member;
- grant/revoke non-billing test/admin comp entitlement where authorized;
- refund through provider-supported flow;
- cancel membership where policy permits;
- view member lifecycle events;
- never view raw card details.

---

# 26. FAILED-PAYMENT RECOVERY / DUNNING

This is core revenue-retention functionality.

Implement provider-driven failed-payment recovery.

Flow:

1. renewal fails;
2. subscription becomes appropriate `PAST_DUE` state;
3. member receives in-app/email notification;
4. clear `Update payment method` action;
5. creator sees member as payment-recovery, not simply churned;
6. configurable grace period;
7. provider retry events update status;
8. successful retry restores/maintains entitlement;
9. exhaustion transitions according to policy;
10. no duplicate notifications on repeated webhook delivery.

Admin/creator metrics:

- failed renewals;
- recovered renewals;
- recovery rate;
- involuntary churn.

Do not invent card retry algorithms if Stripe Billing/processor already owns retry behavior. Map provider truth into ZeroFee domain.

---

# 27. CANCELLATION, PAUSE, TIER CHANGES AND PRORATION

Implement predictable subscription-change policy.

Support:

- cancel at period end;
- resume before effective cancellation;
- cancellation reason collection;
- optional feedback;
- upgrade/downgrade;
- clear effective date;
- proration behavior configured centrally;
- preview before change;
- annual↔monthly transition rules;
- grandfathered price protection;
- optional pause architecture if provider supports it.

Never silently charge a new amount without confirmation/provider-authorized subscription rules.

---

# 28. COUPONS, TRIALS AND PROMOTIONS

Prototype must support creator promotions.

Coupon fields:

- code;
- percentage or fixed discount;
- applicable tiers;
- monthly/annual applicability;
- duration: once/repeating/forever where provider supports;
- start/end date;
- redemption limit;
- per-user restriction;
- active flag.

Trials:

- configurable duration;
- tier eligibility;
- one-trial-per-member/creator anti-abuse rule;
- payment-method requirement configurable;
- trial ending notifications;
- conversion tracking.

Pricing analytics must distinguish list price, discount and actual charged amount.

---

# 29. MEMBER ENTITLEMENTS

Paid access is server-authoritative.

Implement `EntitlementResolver`.

Inputs:

- user;
- creator;
- membership;
- tier;
- subscription status;
- grace policy;
- post/resource visibility;
- optional manual comp entitlement.

Output:

- allowed/denied;
- reason code;
- expiry/effective time where relevant.

Test extensively.

Client UI flags never override server authorization.

---

# 30. MIGRATION FROM PATREON / OTHER PLATFORMS

Migration is a CORE acquisition feature because ZeroFee targets existing creators.

Do not assume payment credentials can magically be transferred from Patreon.

Build a `Migration Center`.

## 30.1 Import

Support CSV import for creator/member data.

Design import mapping for common fields such as:

- member name;
- email;
- external member ID;
- external tier;
- membership status;
- charge frequency;
- pledge/subscription amount;
- join date;
- last charge date where available;
- entitled/paid status;
- notes/tag metadata if safely useful.

Provide a Patreon preset based on currently exportable creator member data, while keeping a generic CSV mapper.

Never scrape private Patreon data or bypass their access controls.

## 30.2 Tier mapping

Wizard:

1. upload CSV;
2. preview rows/errors;
3. map external tiers to ZeroFee tiers;
4. map monthly/annual frequency;
5. choose price preservation/grandfathering strategy;
6. import non-payment member records;
7. generate migration campaign.

## 30.3 Payment migration reality

If an external processor and Stripe officially support secure payment-method/subscription migration, build an advanced provider-assisted path only when explicitly configured.

Otherwise:

- import member/contact/status data;
- do NOT pretend cards/subscriptions migrated;
- mark records `IMPORTED_NOT_CONVERTED`;
- send/produce creator-controlled migration invite links;
- member authorizes new ZeroFee/creator subscription themselves.

Migration statuses:

- IMPORTED;
- INVITE_READY;
- INVITED;
- CLICKED;
- NEW_SUBSCRIPTION_STARTED;
- CONVERTED;
- DECLINED/EXPIRED;
- ERROR.

## 30.4 Migration campaign

Provide:

- migration landing page;
- personalized/tokenized invite link;
- creator messaging templates;
- optional migration discount/trial;
- grandfathered ZeroFee price;
- countdown/switch date;
- conversion analytics;
- unconverted-member list;
- CSV export for follow-up.

Do not send real email without creator authorization/provider setup.

## 30.5 Migration dashboard

Show:

- imported members;
- mapped tiers;
- invited;
- clicked;
- converted;
- conversion rate;
- recovered MRR estimate;
- errors.

Create `docs/MIGRATION_ARCHITECTURE.md` describing what can/cannot be moved automatically.

---

# 31. CREATOR OWNERSHIP / ANTI-LOCK-IN

ZeroFee's anti-greed philosophy must include data portability.

Creators should be able to export their business data in machine-readable formats.

Build creator export flow for data they are legally permitted to receive, including:

- member list/contact data subject to privacy rules;
- tiers/prices;
- posts/content metadata;
- subscription history metadata;
- analytics summary;
- migration data;
- integration configuration metadata excluding secrets.

Never export:

- raw card data;
- protected provider credentials;
- Stripe secret data;
- private admin moderation notes;
- data the creator is not entitled to receive.

Document portability and deletion/retention rules for future legal review.

Marketing can later credibly say:

> Your audience and data are not held hostage by ZeroFee.

---

# 32. SUPPORT RESPONSIBILITY SPLIT

Fans will contact ZeroFee even when a creator is financially responsible for a sale.

Build a structured Support Center that makes responsibility clear without abandoning users.

Ticket categories:

- cannot access membership/content;
- payment failed;
- billing question;
- refund request;
- creator did not provide promised benefit;
- suspected fraud/scam;
- content report;
- account/security;
- ZeroFee technical problem.

Routing principles:

### Creator-first service issues

Examples:

- promised content;
- benefit fulfillment;
- ordinary refund request;
- creator-specific community access.

Route to creator support workspace first where appropriate.

### ZeroFee-first issues

Examples:

- platform bug;
- login/security;
- prohibited content;
- fraud/scam escalation;
- moderation;
- payment integration malfunction;
- privacy request.

Admin escalation must exist.

Never tell the fan “not our problem” merely because charge was on a connected account.

Keep auditable ticket/event history.

---

# 33. REFUNDS AND DISPUTES

Refunds and disputes are creator-side payment events in the intended direct-charge model.

Prototype must support:

- creator refund request/action through provider interface;
- full refund;
- partial refund architecture where supported;
- membership access policy after refund;
- dispute opened;
- dispute evidence/status display where embedded/provider feature permits;
- dispute won/lost;
- creator notification;
- admin visibility;
- test-mode simulation.

ZeroFee does not automatically reimburse creator from SaaS revenue.

Do not promise ZeroFee chargeback insurance.

Create clear member copy explaining who processes/refunds the membership payment according to actual architecture.

---

# 34. COMMUNITY INTEGRATIONS

A competitive membership product should be able to deliver external community access.

Build an integration framework with clean providers.

Initial prototype targets:

## Discord

Architecture/functionality where credentials permit:

- creator connects Discord server via OAuth/bot;
- map ZeroFee tier → Discord role;
- member links Discord identity;
- active entitlement grants role;
- cancellation/expiration revokes role;
- retry/reconciliation job;
- audit log;
- manual resync;
- no privilege beyond required bot permissions.

If credentials are absent, implement deterministic mock Discord provider and real integration boundary.

## Telegram

Implement provider architecture and safe prototype flow for private community access where feasible:

- creator connects bot/community;
- member links Telegram identity;
- entitlement-based invite/access state;
- revoke/expire behavior subject to Telegram API capability;
- mock provider if real credentials unavailable.

## Generic outbound webhook

Creator can configure a signed outbound webhook on membership lifecycle events, subject to plan entitlement.

Security:

- URL validation;
- SSRF protection;
- HMAC signing;
- retry/backoff;
- secret rotation;
- event logs;
- disable failing endpoint after policy threshold.

---

# 35. CREATOR API

Implement a small, secure prototype creator API for higher plans.

Use scoped API keys.

Minimum safe endpoints can include:

- current creator profile;
- tiers;
- member entitlement lookup;
- membership events/list with pagination;
- posts metadata if useful.

Do not expose payment credentials or unrestricted PII.

API key requirements:

- hashed-at-rest key material where appropriate;
- prefix/identifier;
- scopes;
- created/last-used/revoked dates;
- one-time secret display;
- rotation/revocation;
- rate limits;
- audit log.

Document API in `docs/API.md`.

---

# 36. CREATOR BROADCASTS / MEMBER COMMUNICATION

Implement a minimal but real creator communication system.

Creator can target:

- all active members;
- a tier;
- payment-recovery members;
- imported migration members where consent/law permits;
- free followers architecture if later added.

For Prompt 1:

- build message composer;
- recipient preview/count;
- in-app delivery;
- email provider abstraction;
- mock email provider;
- quota enforcement;
- unsubscribe/legal architecture for marketing email;
- audit/logging;
- no bulk send if provider not configured.

Do not build a full Substack replacement editor.

---

# 37. CREATOR DASHBOARD

Show real domain data, not vanity metrics.

Required:

- creator application/compliance status;
- payout/KYC status;
- ZeroFee SaaS plan/billing status;
- active members;
- new members;
- cancellations;
- failed payments;
- recovered payments;
- creator membership GMV;
- estimated/actual processing where data exists;
- refunds/disputes;
- estimated/actual creator proceeds distinction;
- upcoming renewals where available;
- top tiers;
- public page conversion basics;
- migration progress;
- integration health;
- quota usage;
- next required action.

Never mix creator GMV with ZeroFee MRR.

Test data must be clearly labeled.

---

# 38. ADMIN CONTROL PLANE

Build a serious owner/admin system.

## Dashboard

- users;
- creators by application state;
- approved creators;
- connected-account readiness;
- SaaS subscriptions/MRR;
- creator GMV separate from platform revenue;
- active memberships;
- failed payments/recovery;
- open reports;
- support escalations;
- failed webhooks;
- country availability overview;
- tax/config warnings;
- integration failures.

## Creator applications

Full review queue and history.

## Creators

- profile;
- compliance;
- payout readiness;
- SaaS billing;
- public page;
- member/tier counts;
- support/moderation history;
- integration health;
- audit history.

## Plans

CRUD/versioning for ZeroFee SaaS plans and quotas.

## Fee profiles

CRUD/versioning + calculator preview.

## Countries

Country capability registry UI.

## Tax/merchant configuration

Read/manage safe configuration flags, never raw secrets.

## Webhooks

Event inspector/replay.

## Reports/moderation

Queue, decision, notice, appeal state.

## Support

Escalation queue.

## Audit

Filter by actor/action/resource/date/creator.

---

# 39. AUDIT LOGGING

Append-only application audit for critical actions:

- creator application submit/change;
- admin approve/reject/info request;
- connected account linkage/readiness change;
- country config change;
- tax/merchant config change;
- fee-profile change;
- SaaS plan change;
- tier price publish/change/migration;
- refund;
- integration connect/revoke;
- API key create/revoke;
- creator suspension;
- moderation action;
- support escalation;
- webhook replay;
- manual entitlement override.

Fields:

- actor/system;
- action;
- resource;
- timestamp;
- reason where required;
- safe before/after metadata;
- correlation ID.

Never log secrets/raw card/KYC document data.

---

# 40. NOTIFICATIONS

In-app notifications at minimum:

- application submitted;
- approved;
- info requested;
- rejected;
- KYC action required;
- payout ready/restricted;
- SaaS payment failed;
- SaaS grace/suspension;
- new member;
- failed renewal;
- recovered renewal;
- cancellation;
- refund;
- dispute;
- integration failure;
- migration milestone;
- moderation/report decision.

Email through provider abstraction where configured.

No external SMTP dependency for core CI.

---

# 41. DATA MODEL

Use PostgreSQL and real migrations.

Do not model the entire product as opaque JSON.

Recommended entities, adapting naming to ORM:

## Identity/security

- `User`
- `Session`
- `Role` / `UserRole`
- `SecurityEvent`
- `ApiKey`

## Creator

- `CreatorProfile`
- `CreatorApplication`
- `CreatorApplicationRevision`
- `CreatorReviewNote`
- `CreatorComplianceStatus`
- `CreatorConnectedAccount`

## Platform SaaS

- `PlatformPlan`
- `PlatformPlanVersion`
- `PlatformSubscription`
- `PlatformEntitlement`
- `UsageCounter`

## Pricing

- `PaymentFeeProfile`
- `PaymentFeeProfileVersion`
- `CreatorTier`
- `TierPriceVersion`
- `PricingCalculationSnapshot`
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

## Fan memberships

- `MembershipSubscription`
- `MembershipPayment`
- `MembershipEvent`
- `ManualEntitlement`

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

## Provider/event

- `ProviderCustomerReference`
- `WebhookEvent`
- `PaymentProviderEvent`

## Safety/support/admin

- `ContentReport`
- `ModerationAction`
- `SupportTicket`
- `SupportMessage`
- `AuditLog`
- `Notification`
- `FeatureFlag`
- `AdminSetting`

Apply foreign keys, unique constraints, indexes and immutable/version semantics correctly.

Important:

- unique normalized email;
- unique creator slug;
- provider event uniqueness scoped properly;
- external IDs indexed;
- tier cannot reference another creator's price;
- membership cannot reference another creator's tier;
- audit history preserved;
- imports deduplicated;
- API secrets not stored plaintext where avoidable.

---

# 42. PROVIDER / DOMAIN SEPARATION

Required abstractions:

- `CreatorPaymentsProvider`;
- `PlatformBillingProvider`;
- `TaxProvider`;
- `MediaStorageProvider`;
- `EmailProvider`;
- `CommunityIntegrationProvider` where sensible.

Do not let Stripe raw statuses/objects leak throughout UI components.

Map provider-specific data into domain statuses/services.

---

# 43. TECHNICAL STACK

Preferred initial stack unless repository state now provides a better established decision:

- current stable Next.js App Router;
- TypeScript;
- PostgreSQL;
- mature TypeScript ORM + migrations;
- pnpm;
- Tailwind CSS;
- accessible UI primitives;
- official Stripe SDK;
- Stripe embedded Connect components where supported;
- Playwright;
- unit/integration test runner;
- ESLint/formatting;
- schema-based environment validation.

Do not choose experimental infrastructure merely because it is fashionable.

A single full-stack app is acceptable and preferred over unnecessary monorepo complexity unless a real boundary requires otherwise.

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

Create `docs/ARCHITECTURE.md` documenting actual choices.

---

# 44. ENVIRONMENT CONFIGURATION

Create `.env.example` and runtime validation.

Include placeholders for:

- app URL;
- database URL;
- auth/session secrets;
- creator payment provider;
- Stripe keys;
- webhook secrets;
- Connect configuration;
- platform Billing configuration;
- Tax provider;
- storage provider;
- email provider;
- Discord credentials;
- Telegram credentials where implemented;
- admin development seed credentials;
- feature flags.

No real secret committed.

Production mode must fail safely if required payment/security configuration is missing.

---

# 45. PRIVACY / PII MINIMIZATION

Principles:

- Stripe/provider collects identity docs directly;
- ZeroFee stores only required references/statuses;
- no raw bank credentials;
- redact provider payloads/logs;
- creator application PII visible only to authorized roles;
- migration data protected;
- member exports governed by permissions;
- no leaking email lists publicly;
- account deletion/export architecture;
- data retention documented for legal review.

---

# 46. PUBLIC MARKETING SITE

Required pages:

- `/`;
- `/pricing`;
- `/how-it-works`;
- `/migration`;
- `/safety`;
- `/faq`;
- auth pages;
- legal pages.

Homepage must explain above the fold:

- 0% ZeroFee platform transaction fee;
- flat SaaS plans;
- payment processing still exists;
- target-net pricing assistance;
- creator owns audience/data;
- existing creators can migrate.

Do not make unsupported competitor claims.

---

# 47. SAVINGS / BREAK-EVEN CALCULATOR

Build an interactive calculator.

Inputs:

- monthly creator revenue;
- competitor platform percentage;
- competitor flat monthly fee optional;
- selected ZeroFee SaaS plan;
- optional active member count;
- optional processing comparison toggle.

Outputs:

- competitor platform fee;
- ZeroFee SaaS cost;
- monthly difference;
- annual difference;
- break-even revenue;
- plan eligibility by active-member allowance.

Payment processing must be excluded from the simple platform-fee comparison unless explicitly enabled, because both products may incur it differently.

Label every assumption.

---

# 48. INFORMATION ARCHITECTURE

Suggested routes:

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
- `/admin/countries`
- `/admin/commerce-tax`
- `/admin/webhooks`
- `/admin/audit`
- `/admin/settings`

Exact paths may differ but capabilities must remain.

---

# 49. DESIGN SYSTEM / VISUAL QUALITY

ZeroFee must feel like a credible premium financial/creator SaaS.

Avoid generic AI-dashboard appearance.

Aim for:

- excellent typography;
- strong numerical hierarchy;
- calm finance UI;
- confident whitespace;
- restrained cards;
- minimal decorative gradients;
- original brand;
- strong mobile layout;
- accessible statuses;
- polished forms;
- fast creator onboarding.

Create tokens for:

- typography;
- spacing;
- semantic colors;
- radius;
- shadow;
- borders;
- statuses;
- forms;
- tables;
- empty/loading/error/success states.

Do not clone another product pixel-for-pixel.

---

# 50. ERROR / EMPTY / LOADING / PERMISSION STATES

Intentionally implement at minimum:

- no creator application;
- review pending;
- needs info;
- rejected;
- unsupported country;
- country waitlist;
- provider unavailable;
- Stripe/test mode;
- KYC incomplete;
- payout restricted;
- tax not configured;
- SaaS billing failed;
- no tier;
- no post;
- no member;
- failed payment;
- payment confirmation pending webhook;
- dunning;
- membership expired;
- migration empty/in progress/error;
- Discord/Telegram disconnected;
- API key none/revoked;
- support empty;
- unauthorized;
- generic server/network failure.

No blank dashboards.

---

# 51. ACCESSIBILITY

Target WCAG 2.1 AA fundamentals.

- keyboard support;
- visible focus;
- semantic headings;
- form labels;
- linked errors;
- accessible dialogs;
- contrast;
- no color-only status;
- reduced motion;
- sensible tab order;
- mobile text sizing.

Automated accessibility checks on representative pages where tooling supports.

---

# 52. PERFORMANCE

- paginate lists;
- indexes;
- query limits;
- avoid N+1;
- optimize images;
- do not ship provider payloads to client;
- minimize unnecessary client components;
- public creator pages fast;
- paid entitlement checks correct and efficient;
- migration import processed safely/batched;
- webhook processing resilient;
- integration sync retry bounded.

---

# 53. OBSERVABILITY

Structured server logs:

- correlation ID;
- severity;
- route/service;
- safe creator/user/resource refs;
- provider event ID;
- redaction.

Health endpoint:

- application;
- DB;
- provider configuration status without secrets;
- background/integration health summary where appropriate.

Error boundaries and safe user-facing errors.

---

# 54. SEED / DEMO DATA

Create deterministic seed data demonstrating the platform immediately.

At minimum:

- admin;
- approved/payment-ready creator;
- creator under review;
- creator needing information;
- unsupported-country creator/waitlist example;
- fan/member;
- several tiers using both pricing modes;
- monthly and annual price;
- public/paid posts;
- active membership;
- past-due membership;
- recovered membership;
- cancelled membership;
- coupon;
- trial;
- migration project with imported/converted members;
- sample Discord mock integration;
- sample failed webhook;
- sample report;
- sample support ticket;
- fee profiles;
- country capabilities;
- tax mock state.

Never seed production secrets.

Provide reset script.

---

# 55. CORE USER JOURNEYS — MUST WORK END TO END

## Journey A — new creator

1. landing;
2. calculator;
3. signup;
4. country eligibility;
5. creator application;
6. submit;
7. admin review;
8. approval;
9. payout onboarding;
10. provider readiness;
11. select/pay ZeroFee SaaS plan;
12. configure profile;
13. create tier;
14. Target Net pricing;
15. preview public price;
16. monthly/annual setup;
17. publish;
18. create gated content;
19. public launch-ready page.

## Journey B — fan subscription

1. public page;
2. sees final recurring price;
3. signup/login;
4. checkout;
5. sees applicable tax before final confirmation where configured;
6. payment succeeds;
7. webhook activates;
8. paid content unlocks;
9. membership dashboard shows renewal/cancellation controls.

## Journey C — failed renewal

1. renewal event fails;
2. PAST_DUE;
3. member notified;
4. update-payment action;
5. creator sees recovery status;
6. retry succeeds;
7. entitlement recovers correctly;
8. analytics count recovery.

## Journey D — cancellation and tier change

- cancel at period end;
- resume;
- upgrade/downgrade preview;
- effective date/proration visible;
- no accidental duplicate subscription.

## Journey E — creator migration from Patreon-like CSV

1. upload;
2. validate;
3. map tiers;
4. import members;
5. no fake payment-token import;
6. generate invite campaign;
7. fan accepts new subscription;
8. conversion tracked.

## Journey F — creator rejected

- review;
- reject reason;
- cannot activate payouts;
- clear creator status.

## Journey G — KYC additional info

- provider requirement appears;
- embedded onboarding resumes;
- readiness updates from provider.

## Journey H — SaaS billing fails

- past due;
- grace;
- suspension;
- recovery;
- data preserved.

## Journey I — refund/dispute

- event/action;
- membership state policy;
- creator/admin/member visibility;
- no ZeroFee subsidy.

## Journey J — Discord entitlement

- creator connects/mock-connects;
- maps tier→role;
- fan links identity;
- active membership grants;
- cancellation revokes;
- reconciliation works.

## Journey K — support escalation

- fan opens creator-service refund/content ticket;
- creator receives;
- unresolved/fraud issue escalates to ZeroFee;
- audit/history preserved.

## Journey L — creator export

- creator requests export;
- gets authorized data;
- no secrets/raw payment data leaked.

---

# 56. TESTING

Building successfully is not completion.

## Unit tests

At minimum:

- PricingEngine/gross-up;
- currency rounding;
- fee-profile versioning;
- entitlement resolver;
- application state machine;
- provider readiness mapping;
- platform billing state machine;
- fan subscription state machine;
- dunning state transitions;
- coupon/trial eligibility;
- price grandfathering;
- migration row mapping/deduplication;
- country eligibility;
- tax provider mapping;
- authorization helpers;
- webhook idempotency;
- outbound webhook signing.

## Integration tests

- application/review;
- rejected creator blocked;
- payout onboarding gate;
- country waitlist gate;
- SaaS entitlement;
- price version creation;
- Target Net calculation snapshot;
- monthly/annual subscription;
- provider event activation;
- duplicate event idempotency;
- failed renewal/recovery;
- cancellation;
- refund;
- paid-content denial/allow;
- Patreon-style CSV import;
- integration entitlement sync;
- support routing;
- admin-only actions;
- cross-creator IDOR denial.

## Playwright/E2E

Automate representative full journeys A–L in deterministic mock mode.

At minimum test phone and desktop viewport for critical paths.

Optional Stripe test-mode integration suite must be separate from deterministic CI.

---

# 57. SECURITY / ABUSE TESTS

Explicitly test/fix:

- creator A reading creator B members;
- creator A refunding creator B payment;
- fan accessing paid post without entitlement;
- user changing creator application status client-side;
- migration CSV injection/oversize/malformed input;
- webhook replay;
- fake signature;
- support attachment abuse if attachments exist;
- malicious rich text;
- API key leakage/reuse after revoke;
- outbound webhook SSRF;
- unsafe redirect;
- upload MIME spoofing;
- plan quota bypass;
- admin routes as normal user.

---

# 58. SCREENSHOT / VISUAL QA

Run the real seeded application and capture actual rendered screenshots for at minimum:

- homepage desktop/mobile;
- pricing/calculator;
- creator country eligibility;
- creator application;
- admin review;
- payout onboarding/mock state;
- creator dashboard;
- Target Net tier builder;
- public creator page;
- member checkout pre-confirmation;
- member dashboard;
- paid content locked/unlocked;
- migration wizard/dashboard;
- tax center;
- integrations;
- admin dashboard;
- support center.

Inspect each manually for:

- clipping;
- overflow;
- dead space;
- spacing;
- hierarchy;
- typography;
- button clarity;
- financial readability;
- form usability;
- phone usability;
- status meaning.

Fix findings before completion.

---

# 59. REQUIRED DOCUMENTATION

Create/update at minimum:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/PRICING_ENGINE.md`
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

Docs must describe reality, not aspirational fiction.

---

# 60. IMPLEMENTATION ORDER

Execute the whole prompt in this sequence.

## Phase 0 — audit/bootstrap

- sync repository;
- read all files;
- preserve current prompt;
- bootstrap app;
- DB/migrations;
- lint/typecheck/test/build;
- env validation;
- README startup.

## Phase 1 — identity/domain foundation

- auth;
- RBAC;
- DB schema;
- state machines;
- audit;
- seed framework.

## Phase 2 — design/marketing shell

- design system;
- marketing;
- pricing;
- savings calculator;
- member/creator/admin shells;
- PWA foundation.

## Phase 3 — creator eligibility/compliance

- countries;
- creator application;
- admin review;
- safety/legal/reporting.

## Phase 4 — payment providers

- provider interfaces;
- mock Connect;
- mock billing;
- Stripe integration boundary;
- embedded onboarding;
- webhook infrastructure;
- provider readiness.

## Phase 5 — SaaS plans/unit-economics controls

- multiple plans;
- quotas/entitlements;
- billing state machine;
- grace/suspension;
- admin plan UI.

## Phase 6 — pricing/tax commerce layer

- fee profiles;
- PricingEngine;
- price versioning;
- country capability;
- merchant responsibility profile;
- TaxProvider/mock;
- Stripe Tax integration boundary;
- receipts/invoice architecture.

## Phase 7 — creator product

- profile;
- tiers;
- monthly/annual;
- coupons/trials;
- posts/downloads/comments;
- public page.

## Phase 8 — fan membership lifecycle

- checkout;
- webhook activation;
- entitlements;
- member dashboard;
- dunning;
- payment update;
- cancellation/resume;
- tier changes;
- refunds/disputes.

## Phase 9 — migration

- CSV importer;
- Patreon preset;
- mapper;
- migration invites;
- conversion dashboard;
- grandfathering.

## Phase 10 — integrations/API/communication

- Discord provider/mock/real boundary;
- Telegram provider boundary;
- outbound webhooks;
- API keys/endpoints;
- broadcasts/in-app/email mock.

## Phase 11 — support/admin/analytics/export

- support routing/escalation;
- admin operations;
- creator analytics;
- platform analytics;
- creator data export.

## Phase 12 — hardening

- security;
- accessibility;
- performance;
- observability;
- clean migration test;
- all tests;
- E2E.

## Phase 13 — visual QA/docs/finalization

- run seed;
- screenshots;
- inspect/fix;
- documentation;
- owner checklist;
- clean working tree;
- commit/push.

Do not stop between phases unless execution is technically impossible. If one external credential-dependent feature cannot be fully live-tested, finish everything else and clearly isolate that limitation.

---

# 61. PRODUCT ACCEPTANCE CRITERIA

Prompt 1 is complete only when all materially applicable items below are true.

1. Visitor understands 0% ZeroFee platform transaction fee vs real payment processing.
2. Marketing avoids false universal competitor percentages.
3. Multiple SaaS plans exist and are configurable.
4. Plans scale by usage/members/features, never GMV percentage.
5. Country eligibility is first-class.
6. Unsupported country cannot fake onboarding.
7. Creator can apply.
8. Admin can review/approve/reject/request info.
9. Approval history/audit exists.
10. Creator can complete mock payout onboarding fully inside ZeroFee UX.
11. Real Stripe embedded onboarding boundary is implemented.
12. Creator does not need routine stripe.com dashboard use in intended UX.
13. Direct charges are intended fan-payment architecture.
14. ZeroFee has no custodial creator wallet.
15. Platform SaaS billing is separate.
16. Creator can use Simple Price.
17. Creator can use Target Net.
18. Target Net defaults/recommends final public price.
19. Buyer sees final ZeroFee retail price before checkout.
20. No surprise ZeroFee processing surcharge appears at final step.
21. Payment fee profiles are versioned/configurable.
22. Tax is modeled separately from processing.
23. Tax provider abstraction exists.
24. Tax/merchant responsibility is explicit, not guessed.
25. Creator tax center exists.
26. Public checkout can represent applicable tax honestly.
27. Creator can create monthly and annual memberships.
28. Price changes preserve historical/grandfathered subscriptions.
29. Coupon/trial support exists.
30. Fan payment is webhook-authoritative.
31. Paid content is server-gated.
32. Failed payment/dunning works.
33. Payment recovery works.
34. Cancellation/resume works.
35. Tier change policy works.
36. Refund/dispute states work in mock mode.
37. Migration Center exists.
38. Patreon-style CSV import works.
39. Migration does not pretend card data moved when it did not.
40. Migration conversion is measurable.
41. Creator data export exists.
42. Support routing creator-vs-ZeroFee exists.
43. Moderation/reporting exists.
44. Discord entitlement integration works in mock mode and has real boundary.
45. Generic outbound webhook is signed/retriable.
46. Creator API uses scoped keys.
47. Broadcast system respects quotas/provider availability.
48. Creator dashboard has meaningful financial/lifecycle metrics.
49. Admin has country/tax/plan/fee/provider controls.
50. Webhook inspector/replay exists.
51. Audit log covers critical actions.
52. PWA/mobile experience is intentional.
53. Private paid content is not cached publicly/offline.
54. Core flows work on phone and desktop.
55. Security tests cover IDOR/webhook/upload/API/integration risks.
56. Build/lint/typecheck/tests are green.
57. E2E journeys pass in deterministic mock mode.
58. Screenshot QA is completed and findings fixed.
59. Required docs match implementation.
60. Live Stripe/content-platform/tax/legal gaps are clearly identified rather than faked.

---

# 62. PAYMENT ECONOMICS INVARIANTS

These invariants must never be violated accidentally:

1. `creator_gmv != zerofee_revenue`.
2. ZeroFee takes `0%` platform transaction fee from creator membership sales in the initial model.
3. ZeroFee does not subsidize variable creator processing from flat SaaS revenue.
4. Target Net works by recommending/grossing-up public retail pricing according to configured assumptions.
5. Buyer sees the approved public price before checkout.
6. Processor fees remain real.
7. Tax is separate from processor gross-up.
8. Refunds/disputes are not silently insured by ZeroFee.
9. Direct charge is preferred creator-payment topology subject to provider approval.
10. No custodial internal creator wallet.
11. SaaS plan upgrades are usage/feature based, not revenue-share disguised as tiers.
12. Exact Stripe fee/liability/tax configuration is provider truth, not marketing truth.

---

# 63. PRODUCT SCOPE EXCLUSIONS FOR PROMPT 1

Even though Prompt 1 is the complete initial prototype, avoid unrelated scope explosion.

Do NOT build unless a dependency requires it:

- native iOS app;
- native Android app;
- Apple/Google IAP;
- adult-content payment workaround;
- crypto payments;
- crowdfunding;
- peer-to-peer cash transfer;
- creator-to-creator money transfer;
- proprietary large-scale video transcoding/CDN;
- full Substack-style newsletter product;
- livestreaming;
- AI content generation;
- full payroll/accounting system;
- homemade global tax-law engine;
- custom banking/wallet ledger;
- affiliate marketplace;
- arbitrary ecommerce marketplace;
- complex multi-PSP routing.

Build extension points where appropriate, but protect prototype coherence.

---

# 64. OWNER NEXT STEPS CHECKLIST

At completion generate `docs/OWNER_NEXT_STEPS.md` with checkboxes in dependency order.

Must include at minimum:

## Company/legal

- choose final operating entity/jurisdiction;
- professional legal review;
- Terms;
- Creator Agreement;
- Acceptable Use;
- Privacy;
- DSA/copyright/reporting process;
- consumer recurring billing requirements;
- refund policy.

## Stripe/payment

- contact Stripe before public launch;
- obtain content-platform approval;
- confirm Connect account architecture;
- confirm embedded onboarding;
- confirm direct charges;
- confirm “Stripe handles pricing for users” availability;
- confirm loss-liability model;
- confirm statement descriptor/receipts;
- confirm target creator countries;
- confirm supported currencies/payment methods;
- configure platform Billing;
- configure webhooks;
- run test-mode charges/refunds/disputes;
- verify live capability before enabling LIVE.

## Tax

- confirm who is seller/merchant by jurisdiction;
- confirm ZeroFee SaaS VAT/sales tax;
- confirm creator-to-fan VAT/GST/sales-tax responsibility;
- confirm Stripe Tax usage;
- confirm registrations;
- confirm invoicing/receipts;
- confirm US 1099/W-8/W-9 or equivalent responsibilities;
- confirm record retention;
- tax advisor signoff.

## Commercial

- finalize plan prices;
- finalize member/usage quotas;
- choose initial countries;
- choose initial creator verticals;
- choose Target Net safety buffer;
- choose migration incentives;
- choose refund/support policy.

## Infrastructure

- production DB;
- domain/DNS;
- storage;
- email;
- observability;
- backups;
- secrets;
- rate limits/WAF/CDN as appropriate;
- security review;
- disaster recovery.

## Beta

- onboard small closed group of real creators;
- test KYC;
- test real tax calculation where applicable;
- test member migration;
- test failed payments;
- test refunds/disputes;
- measure support load;
- measure infrastructure cost;
- measure conversion/churn;
- recalculate unit economics;
- only then public launch.

---

# 65. REQUIRED FINAL COMPLETION REPORT

When Prompt 1 execution is finished, report:

- final commit SHA;
- branch;
- push status;
- clean/dirty working tree;
- implemented major flows;
- architecture summary;
- migration/schema status;
- test counts/results;
- lint/typecheck/build;
- E2E results;
- screenshot QA results;
- mock provider status;
- live Stripe integration status;
- Stripe approval status;
- country capability status;
- tax provider/status;
- external credential/approval gaps;
- security findings fixed;
- remaining prototype limitations;
- path to `docs/OWNER_NEXT_STEPS.md`.

Never say “production ready” unless external legal/payment/tax dependencies have actually been satisfied.

---

# 66. DECISION PRINCIPLES

When a detail is ambiguous:

1. Protect financial correctness.
2. Protect authorization/security.
3. Protect truthful tax/payment representation.
4. Protect creator/buyer clarity.
5. Prefer reversible configuration over hardcoded business assumptions.
6. Prefer provider abstractions over Stripe-specific UI leakage.
7. Preserve history/versioning.
8. Preserve auditability.
9. Prefer “not configured” over fake success.
10. Never solve UX by lying about money movement.
11. Never create revenue-share through the back door.
12. Do not trap creator data inside ZeroFee.
13. Do not assume global availability.
14. Do not call legal/compliance work complete without professional verification.

---

# 67. CORE PRODUCT SENTENCE

Keep this sentence as the implementation north star:

> **ZeroFee is a flat-fee creator membership platform where creator revenue is not taxed by a percentage platform fee, creators can price toward the proceeds they want, buyers see the real price upfront, creators retain portability of their audience/data, and payment/tax/compliance realities are handled transparently rather than hidden.**

EXECUTE THE ENTIRE SPECIFICATION.