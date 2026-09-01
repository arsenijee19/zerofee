# ZeroFee — Complete Remaining V1 Backend Execution Prompt

**Prompt version:** 5.0  
**Status:** FINAL AUTHORITATIVE EXECUTION ORCHESTRATOR FOR ALL REMAINING V1 WORK  
**Repository:** https://github.com/arsenijee19/zerofee  
**Current implementation baseline:** the functional-looking prototype introduced at `0a4c005509236deb9d0b5fe90568477648d457d9`, plus later specification/documentation commits.  

---

# 0. START EXECUTION NOW — THIS IS THE ONE PROMPT TO RUN

Work directly from the CURRENT `main` branch of:

https://github.com/arsenijee19/zerofee

The owner already executed the original Prompt 1 once. That execution produced a useful visual/mock prototype, but a later repository audit proved that large parts of the backend were not actually implemented: core state remained seeded/client-side, PostgreSQL was only a schema reference, security tests often tested local helper functions, E2E tests mostly navigated screens, and Stripe/Patreon/search/auth were not real application boundaries.

**Do not execute Prompt 1 again from scratch.**

**Do not rebuild the visual design from scratch.**

**Do not ask the owner whether to continue.**

This prompt is the autonomous continuation from the CURRENT repository state. Its job is to convert every internally solvable V1 requirement into a real server-authoritative application and to reconcile all requirements from Prompts 1–4.

Continue without stopping until every internally solvable requirement is implemented, tested, documented, committed and pushed.

If one capability is genuinely blocked by external Stripe approval, credentials, legal/tax signoff, DNS or another external dependency:

1. implement the real production interface/adapter/code path as far as possible;
2. implement a deterministic test/mock provider through the same domain interface;
3. test the internal behavior completely;
4. mark only the external live round-trip `BLOCKED_EXTERNAL`;
5. continue every other phase automatically.

Never use `BLOCKED_EXTERNAL` as a substitute for writing code that can be written without the external dependency.

---

# 1. READ ALL AUTHORITATIVE MATERIAL BEFORE MODIFYING ARCHITECTURE

Read completely, in this order:

1. `prompts/1_INITIAL_PROTOTYPE_MASTER_EXECUTION_PROMPT.md`
2. `prompts/2_DESIGN_SYSTEM_AND_UX_MASTER_PROMPT.md`
3. `prompts/3_REAL_APPLICATION_CONVERSION_MASTER_PROMPT.md`
4. `prompts/4_PLATFORM_OPERATING_MODEL_AND_CONTENT_EXECUTION_PROMPT.md`
5. this file
6. `docs/PLATFORM_OPERATING_MODEL.md`
7. `PROJECT_CONTEXT.md`
8. all files under `/docs`
9. current source code, tests, migrations/scripts, configuration and screenshots.

Authority rules:

- Prompt 1 remains authoritative for the core ZeroFee product, economic model, financial invariants, lifecycle and original V1 scope.
- Prompt 2 remains authoritative only for visual language/UX. Preserve the existing visual direction unless real-data conversion causes a concrete regression.
- Prompt 3 remains authoritative for replacing the mock/client-only prototype with a real PostgreSQL/auth/server application.
- Prompt 4 is newer and authoritative for the operating model, creator-owned Stripe relationship, creator-as-seller intent, direct-charge topology, ZeroFee SaaS-only revenue model, content hosting, and **YouTube-only video in V1**.
- Prompt 5 is authoritative for execution order, completeness criteria, backend depth, evidence requirements, and resolving overlap between Prompts 1–4.

When an earlier prompt conflicts with Prompt 4 on the operating/content model, Prompt 4 wins.

When an earlier implementation is only a mock/seed/static demonstration but Prompts 1/3/4 require real behavior, replace the mock implementation with real behavior while preserving the approved UX.

---

# 2. PRECISE END STATE

At completion ZeroFee must be a **real database-backed, authenticated, server-authoritative V1 web application** that can run end-to-end using deterministic test providers and can switch to real provider credentials without rewriting the product architecture.

A reviewer must be able to perform this journey through persisted state:

visitor
→ signup
→ email verification
→ creator application
→ country/capability validation
→ admin login/review
→ approval
→ creator payment-provider onboarding
→ creator-owned connected Stripe relationship in real/test adapter architecture
→ ZeroFee SaaS plan/entitlement
→ creator profile
→ membership tier
→ Guaranteed Earnings or Simple Price
→ immutable server quote
→ fan signup/login
→ creator-identified checkout
→ provider-authoritative payment event
→ membership activation
→ server-enforced content entitlement
→ recurring renewal/dunning
→ cancellation/resume/tier change
→ refund/dispute/reversal
→ financial reconciliation
→ Creator Earnings / Surplus / Guarantee Incident
→ provider balance/payout visibility
→ creator content/posts/courses/lessons
→ text/images/files + YouTube-only video
→ comments/moderation
→ Patreon CSV migration and conversion campaign
→ Discord/Telegram/integration operations
→ broadcasts/API/outbound webhooks
→ search/analytics/export/support
→ admin operations/audit
→ clean install and real E2E verification.

No critical product state may depend on React memory, a hardcoded seeded `initialState`, or a static JSON file in normal application runtime.

Seed data is allowed only to populate a real database for development/tests.

---

# 3. HARD BUSINESS / OPERATING INVARIANTS

These are not optional implementation details:

1. `creator_membership_gmv != zerofee_saas_revenue`.
2. ZeroFee membership transaction/application fee is always `0`.
3. ZeroFee payment-processing markup is `0`.
4. ZeroFee payout markup is `0`.
5. Creator Surplus belongs 100% to the creator.
6. A shortfall below Creator Earnings Target is a Guarantee Breach/Incident, never hidden rounding or ZeroFee revenue.
7. ZeroFee does not silently subsidize processing shortfalls from SaaS revenue.
8. Creator fan/member commerce must use the creator connected-account context and preferred direct-charge topology.
9. ZeroFee must not create an internal custodial creator wallet.
10. Creator funds, provider balance and payout remain provider-side concepts.
11. ZeroFee earns its separate SaaS subscription from the creator.
12. The intended creator/member commerce seller is the creator wherever the configured Commerce Responsibility Profile legally permits that model.
13. Product architecture must support `CREATOR`, `PLATFORM` or `UNKNOWN` seller/tax responsibility per jurisdiction; do not hardcode a universal legal conclusion.
14. Creator owns/controls the commercial offer and publishes the resulting tier/pricing configuration.
15. Creator should be able to use/connect their own Stripe relationship through the current supported Connect architecture.
16. Existing Stripe vs new Stripe onboarding must use current official Stripe capabilities; never fake an unsupported account-linking flow.
17. Creator-controlled refunds/payouts/disputes should remain provider-side where the selected Connect configuration permits it.
18. Marketplace discovery/trending/ranking is out of initial V1.
19. Initial commerce scope is recurring digital memberships/content/community access.
20. V1 video is YouTube-only. Do not build native video upload/transcoding/streaming/CDN/DRM.

Product copy and UI must support the factual model:

> **Your Stripe. Your customers. Your money. Our software.**

without making unsupported universal legal/tax claims.

---

# 4. FIRST ACTION — HONEST GAP AUDIT

Before implementation:

1. fetch/sync current `main`;
2. record current HEAD;
3. inspect entire repository tree;
4. inspect current `docs/EXECUTION_STATE.md`;
5. inspect the prototype runtime architecture;
6. identify every feature that is:
   - `REAL_AND_VERIFIED`
   - `REAL_BUT_UNVERIFIED`
   - `MOCK_PROVIDER_REAL_DOMAIN`
   - `UI_ONLY`
   - `SEED_ONLY`
   - `DOC_ONLY`
   - `MISSING`
   - `BLOCKED_EXTERNAL`;
7. create/update `docs/REMAINING_V1_GAP_AUDIT.md`;
8. rewrite `docs/EXECUTION_STATE.md` so no previous optimistic `VERIFIED` status survives without real evidence.

A screen is not backend evidence.
A TypeScript interface is not an integration.
An SDK dependency is not an integration.
A SQL reference file is not a migration.
A test-local helper is not a security boundary.
A screenshot-only Playwright test is not functional E2E.

Do not stop after the audit. Continue immediately into implementation.

---

# 5. TARGET SERVER ARCHITECTURE

Keep the existing Next.js App Router + TypeScript direction unless the repository has evolved to an objectively better compatible structure.

Required boundaries:

```text
Browser / React
      |
      v
Server Components / Route Handlers / Server Actions
      |
      +--> Auth / Session
      +--> Authorization Policy Layer
      +--> Application Services
              |
              +--> PostgreSQL repositories / transactions
              +--> Pricing & Guarantee domain
              +--> CreatorPaymentsProvider
              +--> PlatformBillingProvider
              +--> TaxProvider
              +--> MediaStorageProvider
              +--> Email/NotificationProvider
              +--> Discord/Telegram providers
              +--> OutboundWebhookDispatcher
              +--> Audit / Observability
```

Rules:

- no giant client-side application state machine for core flows;
- no client-authoritative money/permission/subscription state;
- no direct DB access scattered through React components;
- centralize domain services and authorization policies;
- external provider-specific models map into internal domain models;
- all dangerous mutations execute server-side;
- all core mutations create audit/event evidence where appropriate.

---

# 6. PHASE A — REAL POSTGRESQL FOUNDATION

This is the first implementation priority.

Choose one mature PostgreSQL ORM/query/migration stack suitable for current Next.js/TypeScript. Make one decision, document it and proceed; do not debate libraries indefinitely.

Implement:

- real `DATABASE_URL` connection;
- actual PostgreSQL migrations committed to repo;
- migration history;
- deterministic real DB seed;
- empty-database bootstrap;
- test database reset/isolation strategy;
- development database setup, using Docker Compose if available;
- GitHub Actions PostgreSQL service later in CI;
- transactions;
- foreign keys;
- composite/unique constraints;
- indexes;
- timestamps;
- immutable/versioned financial records;
- database-level idempotency constraints.

`pnpm db:migrate` must modify/verify a real PostgreSQL database. It must never merely write a schema text file.

Do not replace PostgreSQL with SQLite to make tests easier.

Use integer minor units for money. Database monetary minor-unit fields should use an integer type with sufficient range. In TypeScript, validate all money amounts as safe integers if represented as `number`; no binary floating point calculations.

Required persisted domains include at minimum:

### Identity / security
- User
- Session
- EmailVerificationToken
- PasswordResetToken
- Role/UserRole or equivalent
- SecurityEvent

### Creator / compliance
- CreatorProfile
- CreatorApplication
- CreatorApplicationRevision
- CreatorReviewNote
- CreatorComplianceStatus
- CountryCapability
- CreatorConnectedAccount / ProviderAccountReference

### ZeroFee SaaS
- PlatformOperatingEntity
- PlatformPlan
- PlatformPlanVersion
- PlatformSubscription
- PlatformEntitlement
- UsageCounter / quota records

### Commerce / tax
- CommerceResponsibilityProfile
- CreatorTaxProfile
- TaxRegistrationReference
- TaxCalculationSnapshot

### Pricing / guarantee
- ProviderPricingRule + version/history
- GuaranteeEligibilityProfile + version/history
- CreatorTier
- TierPriceVersion
- MembershipPriceQuote
- GuaranteedMembershipContract
- PricingCalculationSnapshot
- GuaranteeReconciliation
- GuaranteeIncident
- CreatorEarningsEvent

### Membership / payments
- MembershipSubscription
- MembershipPayment
- MembershipEvent
- ProviderCustomerReference
- ProviderSubscriptionReference
- WebhookEvent
- WebhookProcessingAttempt
- ConnectedBalanceSnapshot
- PayoutRecord/reference

### Promotions
- Coupon
- CouponRedemption
- Trial/introductory configuration or equivalent

### Content
- Post
- PostTierAccess
- Course/Collection
- CourseModule/Section
- Lesson
- LessonTierAccess or generalized content access mapping
- MediaAsset
- YouTubeVideoReference or normalized media reference
- LessonProgress where V1 supports progress
- Comment
- CommentReport

### Migration
- MigrationProject
- MigrationUpload
- MigrationImportRow/ImportedMember
- MigrationTierMapping
- MigrationInvitation
- MigrationConversionEvent

### Integrations / communication
- CreatorIntegration
- IntegrationMapping
- IntegrationSyncEvent
- ApiKey
- OutboundWebhookEndpoint
- OutboundWebhookDelivery
- Broadcast
- BroadcastRecipient/Delivery where appropriate
- Notification

### Operations
- SupportTicket
- SupportMessage
- ContentReport
- ModerationAction
- AuditLog
- FeatureFlag
- AdminSetting

Prevent impossible cross-creator relationships with constraints as well as application authorization.

**Phase A exit:** empty DB migrates; seed inserts real rows; application can read/write DB; migration/seed tests pass.

---

# 7. PHASE B — REAL AUTHENTICATION, SESSION SECURITY AND RBAC

Implement real authentication before converting protected business flows.

Required:

- signup;
- normalized unique email;
- secure password hashing using a current strong algorithm;
- login/logout;
- opaque secure server sessions;
- HttpOnly cookies;
- Secure cookies in production;
- appropriate SameSite policy;
- session expiration/invalidation;
- email verification token, expiry and single use;
- password reset request/token/reset, expiry and single use;
- generic auth errors to limit account enumeration;
- rate limiting around login/signup/reset/verification;
- development/mock email mailbox so these flows are deterministic without SMTP;
- CSRF/origin protection appropriate to the selected server-action/route architecture;
- security event logging.

Authorization must be server-side and resource-aware.

At minimum prove:

- visitor cannot access creator/admin private routes;
- member cannot access admin;
- creator cannot access admin;
- Creator A cannot read/update Creator B resources;
- creator cannot self-approve application;
- member cannot inspect another member's billing/subscriptions;
- admin-only pricing/country/provider settings reject non-admin users;
- connected-account actions are tied to the correct creator;
- API keys and search respect tenant ownership.

Do not use UI role switch buttons as authentication.

**Phase B exit:** real auth integration tests, session tests and IDOR/RBAC tests pass against the application boundary.

---

# 8. PHASE C — REAL ROUTES AND SERVER-DRIVEN PRODUCT SHELL

Replace the prototype `View`/`useState` navigation model with real routes and layouts.

Keep Prompt 2 design.

Use appropriate routes such as:

- `/`
- `/pricing`
- `/how-it-works`
- `/migration`
- `/safety`
- `/faq`
- `/login`
- `/signup`
- `/c/[slug]`
- `/c/[slug]/posts/[slug]`
- `/c/[slug]/courses/[courseSlug]`
- `/c/[slug]/courses/[courseSlug]/lessons/[lessonSlug]`
- `/creator/...`
- `/member/...`
- `/admin/...`
- `/api/...` / provider webhooks.

Refresh/deep links must work.
Protected routes authorize on the server.
Data pages load from DB/services.
Mutations persist and survive process restart/reload.

Keep seed/demo state only as development fixtures, never as the normal runtime source of truth.

**Phase C exit:** key routes work after browser reload and derive data from PostgreSQL.

---

# 9. PHASE D — COUNTRY, CREATOR APPLICATION, COMPLIANCE AND ADMIN REVIEW

Implement real persisted workflow:

Creator:

1. account verified;
2. selects legal country/entity type;
3. country capability registry checked;
4. application draft created;
5. creator offering/category/public links/rights/AUP acknowledgements stored;
6. submit;
7. immutable revision/history stored;
8. persisted status displayed.

Admin:

1. real admin session;
2. DB review queue;
3. detail/revision/history;
4. private note;
5. `APPROVE`, `NEEDS_INFORMATION`, `REJECT`, later `SUSPEND`;
6. mandatory reason where relevant;
7. transaction-safe state transition;
8. audit log;
9. creator notification/email.

CountryCapability must be persisted/admin-managed and support at least:

`UNSUPPORTED`, `WAITLIST`, `BETA`, `AVAILABLE`, `PAUSED`.

Production launch eligibility must be able to require provider, tax and legal-readiness flags. Test/demo country records must be clearly `TEST_ONLY`/non-production where appropriate.

**Phase D exit:** creator application/admin review E2E persists through reload and unauthorized approval attempts fail.

---

# 10. PHASE E — ZEROFEE SAAS BILLING, ENTITLEMENTS AND QUOTAS

ZeroFee SaaS billing is separate from creator GMV.

Implement:

- admin-configurable plan versions;
- monthly billing state and future annual option if already in scope;
- platform subscription state machine;
- deterministic MockPlatformBillingProvider;
- real Stripe Billing adapter boundary for ZeroFee's own SaaS charges;
- platform billing webhook mapping where enabled;
- grace/suspension/recovery;
- server-enforced feature entitlements;
- active-member quota;
- storage quota;
- broadcast/email quota;
- API quota/rate limits;
- integration entitlement/feature flags where plans differ;
- admin override with reason + audit.

Do not delete creator data on SaaS lapse.
Define grace/suspended read/write behavior explicitly.

ZeroFee's own SaaS tax is a separate Tax/Commerce concern from creator fan-commerce tax.

**Phase E exit:** plan/billing state changes alter real server entitlements and quotas; mock billing lifecycle E2E passes.

---

# 11. PHASE F — CREATOR-OWNED STRIPE CONNECT ARCHITECTURE

Implement the operating model from Prompt 4.

Before writing final Stripe adapter behavior, research **current official Stripe Connect documentation** and record the current decision in:

`docs/STRIPE_CONNECT_IMPLEMENTATION_DECISION.md`

Document:

- selected current account/configuration model;
- whether/how an already-existing Stripe account can be connected/reused;
- how a creator without Stripe completes onboarding;
- Dashboard/full-dashboard availability;
- direct-charge requirements;
- fees collector/responsibility;
- losses/negative-balance responsibility;
- payout ownership;
- embedded component capabilities;
- account sessions/onboarding mechanism;
- application-fee behavior;
- exact external platform settings/approvals still required.

Desired model, when current Stripe capabilities permit:

- creator owns/directly uses their Stripe relationship;
- creator can connect/reuse an existing Stripe account when Stripe officially supports that flow;
- otherwise Stripe-hosted/embedded onboarding creates/configures the appropriate connected account;
- full Stripe Dashboard where supported;
- direct charges;
- fan payment belongs to creator connected account context;
- creator-borne Stripe fees where configured/supported;
- Stripe/connected-account side loss responsibility where supported/approved;
- creator controls payouts/refunds/disputes;
- ZeroFee application fee hard-invariant `0`;
- `Verify in Stripe` / Dashboard links where supported.

Do not store raw bank credentials or unnecessary KYC documents.

Create real provider abstractions:

- `CreatorPaymentsProvider`
- deterministic Mock provider
- real Stripe adapter using official SDK.

The Stripe adapter must contain actual server code for account creation/retrieval/linking flow selected from current docs, onboarding/account sessions, account-status sync, direct-charge customer/subscription/payment operations, refunds, balances/payout surfaces, and provider references.

If credentials/approval prevent actual remote test round-trip, keep adapter production-real, use SDK mocks for integration tests, and mark only the remote round-trip external.

**Phase F exit:** mock creator payment onboarding is fully E2E through real DB/domain; Stripe adapter is real code; capability/configuration truth is documented; no fake account-linking behavior.

---

# 12. PHASE G — WEBHOOK / PROVIDER EVENT BACKBONE

Payment/browser redirects never activate membership.

Implement a real provider-event system:

- raw-body signature verification;
- separate secrets/environments;
- connected-account/platform event scope;
- persistent WebhookEvent;
- unique provider event ID;
- processing attempt records;
- transaction-safe status changes;
- idempotency;
- retry/replay admin action;
- correlation IDs;
- safe redacted error data;
- no duplicate payment/membership/entitlement/earnings/notification;
- provider event → internal domain event mapping.

Mock provider E2E should be able to emit **signed provider events through the same webhook/application processing path**, not bypass domain behavior with direct UI state changes.

Handle relevant account, subscription/invoice/payment, refund, dispute, payout and platform-billing events according to the selected providers.

Implement a simple durable DB-backed job/retry mechanism where asynchronous retries/deliveries are needed. Do not introduce unnecessary infrastructure solely for fashion.

**Phase G exit:** invalid signature, duplicate event and concurrent delivery tests attack the real endpoint/service and pass.

---

# 13. PHASE H — PRICING CATALOG, GUARANTEED EARNINGS AND QUOTES

Preserve the existing minor-unit pricing engine only where tests prove it correct. Move it behind real services and database inputs.

Implement real DB-backed:

- Provider Pricing Catalog;
- versioned ProviderPricingRule;
- source/evidence metadata;
- source verification dates;
- exact formula / verified upper bound / unknown confidence;
- GuaranteeEligibilityProfile;
- expiration/revalidation;
- creator/account country;
- issuer region;
- payment method/card class where relevant;
- presentment/settlement currency;
- domestic/cross-border;
- FX;
- billing fee;
- tax treatment;
- fee payer;
- current/effective state;
- admin versioning/audit.

Quote generation must be server-side.

Persist immutable MembershipPriceQuote containing all context/version snapshots needed to reproduce why the price was quoted.

Client must never be able to choose:

- retail price;
- provider cost;
- tax result;
- eligibility profile;
- pricing rule;
- reconciliation result.

Expired/stale quotes fail.
Unknown/unverified/stale routes cannot produce a Guaranteed Earnings quote.

If payment context cannot be safely known before price confirmation, implement the two-stage provider/payment-context flow required by Prompt 1 or fall back to Simple Price. Never guess.

Financial tests must cover a large deterministic matrix and property/fuzz sample, including:

- creator country classes;
- issuer regions;
- domestic/cross-border;
- payment methods;
- consumer/commercial classification where relevant;
- presentment/settlement currencies;
- FX on/off;
- tax inclusive/exclusive/zero;
- monthly/annual billing-cost variants;
- fixed + percentage fees;
- upper-bound rules;
- zero-decimal currencies;
- rounding boundaries;
- small through large targets.

Hard assertions:

1. eligible quote proceeds >= target;
2. one minor unit lower fails unless documented price-step rule explains equivalence;
3. `UNKNOWN_OR_VARIABLE` cannot guarantee;
4. stale/paused rule cannot guarantee;
5. ZeroFee transaction/application fee remains 0;
6. creator surplus remains creator-owned;
7. shortfall becomes Guarantee Incident.

Prefer a property-based testing library if it improves rigor. Use a deterministic seed and enough generated cases to detect boundary failures without making CI unreasonably slow.

**Phase H exit:** client tampering/ineligible/stale/rounding/fuzz tests pass; admin catalog/profile CRUD is real and versioned.

---

# 14. PHASE I — TAX / COMMERCE RESPONSIBILITY ARCHITECTURE

The intended model is creator-as-seller, but legal/tax liability remains jurisdiction-specific.

Implement real configuration, not global tax-law guesses:

`CommerceResponsibilityProfile` must represent:

- jurisdiction scope;
- seller party `CREATOR | PLATFORM | UNKNOWN`;
- tax-liable party `CREATOR | PLATFORM | UNKNOWN`;
- invoice/receipt responsibility;
- tax provider;
- legal review state;
- effective date/version;
- production enablement state.

Implement `TaxProvider = mock | stripe_tax | disabled` or equivalent.

Mock tax provider must let pricing/subscription E2E test tax-inclusive/exclusive behavior deterministically.

Stripe Tax adapter/boundary should support creator-side tax calculation/settings where the selected Stripe architecture and legal model permit it, without making ZeroFee the remittance party by assumption.

If a jurisdiction is legally/tax `UNKNOWN`, production enablement must be blockable while test mode remains functional.

Checkout/receipts must be able to identify the creator as seller/provider where profile says `CREATOR`.

Keep ZeroFee SaaS tax completely separate.

Do not build a homemade global tax engine.

**Phase I exit:** commerce responsibility is persisted/configurable; tax mocks integrate with pricing; production can fail closed on unknown responsibility.

---

# 15. PHASE J — CREATOR PROFILE, TIERS, PROMOTIONS AND REAL CONTENT HOSTING

Implement real CRUD with server ownership checks.

## Creator profile

- identity/display name;
- unique slug;
- bio/about;
- avatar/banner asset;
- social links;
- category;
- theme/accent constraints;
- support/contact details where required;
- published state.

## Membership tiers

- name/description/benefits;
- monthly/annual;
- Guaranteed Earnings / Simple Price;
- target/price versions;
- draft/published/archived;
- sort order;
- content mapping;
- grandfathering;
- trial/coupon policy.

## Promotions

Implement coupons and trials as real persisted domain features, not placeholder UI.

For Guaranteed Earnings tiers, every promotion must have an explicit economic rule. Default safely:

- no ambiguous discount may silently force ZeroFee to fund the creator target;
- free trials have no successful paid earning event during the free period;
- discounted paid periods require an explicit creator-authorized target/discount treatment and a new immutable quote/contract snapshot;
- if the economics cannot preserve the configured guarantee, reject the promotion for that guaranteed price version or require creator confirmation of a reduced target for that promotional period.

Document the selected policy and test it.

## Content

ZeroFee hosts creator text/images/files. Video is YouTube-only.

Real content models:

- Posts;
- Courses/Collections;
- Modules/Sections;
- Lessons;
- ordering;
- draft/publish/archive;
- public/all-paid/tier-specific access;
- public preview;
- lesson progress where implemented;
- comments and creator/admin moderation.

### Rich text

Use structured/sanitized content.
No arbitrary executable HTML.
Protect against stored XSS.

### Images/files

Implement `MediaStorageProvider`:

- deterministic local test adapter;
- production-ready S3/R2-compatible adapter boundary;
- authenticated upload;
- ownership;
- safe generated keys;
- file size limits;
- MIME validation including file-content/magic-byte validation where practical, not only browser header;
- quota accounting;
- no path traversal;
- delete/archive lifecycle;
- private paid assets require entitlement before signed/short-lived access.

### YouTube-only video

- accept supported YouTube URLs;
- server parser normalizes to validated video ID;
- reject arbitrary iframe/HTML/non-YouTube/javascript/malformed inputs;
- render official supported embed, preferably privacy-enhanced domain where appropriate;
- do not bypass disabled embedding/private/age/geo/copyright restrictions;
- do not proxy/restream;
- paid YouTube embed is only rendered after entitlement;
- document clearly that YouTube embed is not DRM.

ZeroFee still needs AUP/report/takedown over lessons/pages it serves even though YouTube hosts the underlying video.

**Phase J exit:** creator can create/publish/reload real tier, post, course, module, lesson, image/file and YouTube lesson with real DB/storage state.

---

# 16. PHASE K — FAN CHECKOUT, SUBSCRIPTIONS AND ENTITLEMENTS

Implement the real member commerce path.

1. fan visits creator public page from DB;
2. selects published tier;
3. authenticates/registers;
4. server resolves current tier/version/payment context;
5. server creates immutable quote;
6. buyer sees creator/seller identity, membership, interval, tax/final recurring amount and cancellation/support context;
7. server creates provider checkout/payment/subscription on the **correct creator connected account context**;
8. application fee remains 0;
9. provider event/webhook confirms payment;
10. membership becomes active;
11. entitlement service grants content;
12. member dashboard reads DB.

Implement real lifecycle:

- pending quote;
- quote accepted;
- pending payment;
- trialing;
- active;
- past due;
- grace;
- reprice required;
- paused where supported;
- cancel at period end;
- resumed;
- cancelled;
- expired;
- revoked/refunded states as policy requires.

Paid content authorization must be server authoritative. Do not send locked body/file/YouTube reference to an unauthorized client and merely hide it with CSS.

Test direct URL/API/file bypass.

**Phase K exit:** real fan E2E from public creator page through signed mock provider event activates membership and unlocks paid content.

---

# 17. PHASE L — RENEWAL, DUNNING, CANCELLATION, TIER CHANGE AND REPRICING

Implement lifecycle depth required by Prompt 1.

### Renewal/dunning

- provider renewal event;
- failed renewal → PAST_DUE;
- retry/recovery mapping;
- member notification;
- creator visibility;
- grace policy;
- recovered or expired;
- track failed/recovered renewals and involuntary churn.

### Cancellation/resume

- cancel at period end;
- resume before effective cancellation where supported;
- cancellation reason;
- entitlement remains until configured end when appropriate.

### Tier/interval change

- upgrade/downgrade;
- monthly/annual change;
- central proration policy;
- preview before commit;
- provider mapping;
- immutable change history.

### Guarantee repricing

If provider pricing/payment method/tax context changes and old retail can no longer preserve target:

- `REPRICE_REQUIRED`;
- calculate new price;
- notify creator;
- require legally/provider-valid buyer notice/consent where needed;
- never silently increase recurring price;
- never silently underpay creator;
- pause/cancel future renewal if no safe valid path exists.

**Phase L exit:** deterministic provider simulations and integration tests cover renewal success, dunning recovery, cancellation/resume, tier change and repricing-required behavior.

---

# 18. PHASE M — RECONCILIATION, EARNINGS, REFUNDS, DISPUTES, BALANCES AND PAYOUTS

Implement append-oriented financial truth.

After payment, reconciliation must use provider-authoritative actual fee/net data when available. The Stripe path should map the real Balance Transaction/authoritative fee source exposed by current Stripe APIs rather than pretending the predicted fee was actual.

Persist:

- gross/customer charge;
- tax snapshot;
- predicted provider cost;
- actual provider fee;
- provider net where available;
- target;
- actual creator proceeds;
- ZeroFee fee = 0;
- creator surplus;
- shortfall;
- provider references;
- pricing/profile/quote versions;
- reconciliation status.

Mock provider must independently produce actual fee cases:

- exact;
- lower → surplus;
- higher → shortfall.

Shortfall creates persisted GuaranteeIncident and operational alert. Default to fail-safe profile pause behavior or an equally safe documented policy; never allow repeated known-unsafe guaranteed charging unnoticed.

Creator Earnings ledger must preserve history and append reversal/refund/dispute adjustments instead of destructively rewriting old economic events.

Refunds/disputes:

- creator initiates refund against their own payment where allowed;
- admin emergency override only privileged/reasoned/audited;
- provider refund event;
- dispute opened/won/lost;
- reversal;
- entitlement policy update;
- financial history remains auditable.

Payouts/balances:

- provider pending balance;
- provider available balance;
- payout schedule;
- standard payout;
- instant payout where provider supports;
- provider cost;
- ZeroFee payout fee 0;
- amount sent vs amount landed distinction;
- `Verify in Stripe` where supported.

Do not model ZeroFee as owing an internal wallet balance.

**Phase M exit:** exact/surplus/shortfall/refund/dispute/payout scenarios persist and pass real service/E2E tests.

---

# 19. PHASE N — REAL PATREON MIGRATION

Implement the complete acquisition workflow, not a CSV-looking UI.

### Upload/security

- creator authenticated;
- size limit;
- extension/MIME/content checks;
- encoding handling;
- safe temporary/storage lifecycle;
- no arbitrary executable upload.

### Parse/validate

Use a robust CSV parser.
Support Patreon-oriented known headings plus generic mapping.
Validate/normalize:

- name;
- email;
- external ID;
- tier;
- status;
- interval;
- amount/currency;
- join date;
- last charge where present;
- entitlement hints;
- safe metadata.

Detect duplicate rows and existing-member collisions.
Preserve safe source diagnostics.
Sanitize formula injection on re-export.

### Preview/map/import

- valid/invalid/duplicate counts;
- field map;
- Patreon tier → ZeroFee tier;
- interval map;
- pricing/grandfathering strategy;
- unsupported row decisions;
- idempotent import.

### Invitation/conversion

- cryptographically random scoped expiring token;
- store token safely (hash where suitable);
- fan opens link;
- correct creator/tier shown;
- fan authenticates/registers;
- fan authorizes a NEW provider subscription;
- conversion attributed to project;
- token replay/misuse blocked.

Never claim payment credentials migrated unless a later officially supported provider migration is genuinely configured.

Track imported/invited/delivered/clicked/started/converted/expired/failed/unconverted states and recovered MRR estimate.

**Phase N exit:** Playwright uploads a real fixture, maps/imports it, creates invitation and converts at least one member through real checkout/domain state.

---

# 20. PHASE O — DISCORD, TELEGRAM, API, OUTBOUND WEBHOOKS AND BROADCASTS

Do not leave Prompt 1 integration features as green badges.

## Discord

Implement real provider boundary and production OAuth/bot architecture:

- creator connect flow;
- OAuth state/PKCE where applicable/current;
- encrypted secure token storage, never plaintext secrets where avoidable;
- selected guild/server;
- tier → role mapping;
- member identity link;
- active entitlement grants role;
- cancel/expire/refund revokes according to policy;
- reconciliation/resync;
- retry/error state;
- least privilege;
- audit;
- deterministic mock adapter for CI/E2E.

Real Discord remote round-trip may remain credential-blocked, but code cannot remain placeholder-only.

## Telegram

Implement real provider boundary appropriate to current Telegram Bot/API capabilities:

- creator bot/community configuration;
- member identity/linking flow;
- private group/channel access/invite where supported;
- entitlement grant/revoke architecture;
- retry/audit;
- deterministic mock adapter.

## Creator API

- high-entropy keys generated server-side;
- plaintext shown once;
- hash stored;
- scopes;
- creator ownership;
- rate limits/quota;
- last-used/revoked;
- rotation;
- audit;
- no cross-creator reads.

## Outbound webhooks

- HTTPS only;
- SSRF-safe validation beyond literal localhost;
- resolve/check loopback, private, link-local and relevant IPv6 ranges;
- redirect handling must not bypass SSRF validation;
- HMAC signing;
- secret rotation;
- delivery log;
- retry/backoff;
- disable policy;
- creator isolation;
- deterministic test dispatcher.

## Broadcasts

Persist real campaigns:

- recipients all active / tier / recovery / migration where legally permitted;
- recipient preview/count;
- quota enforcement;
- in-app delivery;
- EmailProvider/mock;
- unsubscribe/compliance architecture;
- delivery log;
- audit.

**Phase O exit:** real domain/integration tests prove entitlement sync, API-key security, webhook HMAC/SSRF/retry and broadcast quota behavior.

---

# 21. PHASE P — SEARCH, ANALYTICS, EXPORT, NOTIFICATIONS, SUPPORT AND MODERATION

## Global search

Replace static searchResults with real server/DB queries.

Creator scope:

- own members;
- tiers;
- posts/courses;
- payments/reconciliations;
- payouts;
- migration records;
- support;
- integration events.

Admin scope:

- users;
- creators;
- applications;
- memberships/payments/provider refs;
- payouts;
- support/reports;
- webhooks;
- guarantee incidents;
- country/pricing/guarantee config.

Implement query filtering, pagination, exact ID/reference lookup, useful indexes and typo/fuzzy matching only where practical. Server authorization is mandatory.

## Analytics

Replace fake metrics with DB/event-derived analytics:

- creator earnings trend;
- active/new/churned members;
- MRR/recurring membership metrics with definitions;
- failed-payment recovery;
- migration funnel;
- tier breakdown;
- ZeroFee SaaS MRR in admin;
- creator GMV shown separately;
- guarantee health aggregates.

Document metric definitions to prevent ambiguous revenue/earnings/balance labels.

## Creator export

Implement machine-readable export of creator-owned legally permitted data:

- members/contact fields creator is entitled to;
- tiers/prices;
- posts/course metadata/content where appropriate;
- membership history;
- earnings/reconciliation summary;
- migration;
- integrations metadata without secrets.

Never export raw payment credentials, provider secrets, private admin notes or unrelated tenant data.

## Notifications

Persist in-app notifications and use test EmailProvider for verification/reset/application/payment/migration/support events.

## Support

Persist ticket/message/status/escalation flows with role filtering.

## Moderation

Because ZeroFee hosts text/images/files and embeds YouTube:

- Report content;
- copyright/takedown category;
- fraud/prohibited-content category;
- admin queue;
- internal notes;
- unpublish;
- suspend creator;
- restore/appeal state architecture;
- creator notice;
- immutable audit trail.

YouTube hosting reduces underlying video-hosting burden but does not eliminate ZeroFee AUP/takedown responsibilities over the ZeroFee page/account.

**Phase P exit:** search isolation E2E, analytics derived from DB, real export, support and moderation persistence/tests pass.

---

# 22. PHASE Q — SECURITY AND ABUSE TESTS AGAINST REAL BOUNDARIES

Do not count test-local helper tests as security verification.

Attack real routes/services/database boundaries.

Required coverage:

### Authentication/session
- invalid login;
- enumeration-resistant errors;
- expired/used verification token;
- expired/used reset token;
- session invalidation;
- unauthenticated protected route;
- CSRF/origin policy where relevant.

### RBAC / IDOR
- Creator A cannot read Creator B private resources;
- cannot edit another tier/course/member/payment;
- creator cannot approve application;
- member cannot call admin actions;
- member cannot inspect another member billing;
- cross-creator asset/file access denied;
- cross-creator search leakage denied.

### Financial tampering
- custom retail price rejected;
- quote amount reduction rejected;
- quote creator/tier mismatch rejected;
- target mutation after immutable quote rejected;
- expired quote rejected;
- ineligible/stale guarantee profile rejected;
- application fee cannot become non-zero;
- connected-account ID cannot be swapped by client;
- payout/refund cannot target another creator.

### Webhooks / event races
- invalid signature;
- replay;
- duplicate event;
- concurrent processors;
- wrong connected-account event;
- repeated refund/dispute;
- no duplicate earnings/entitlement/notification.

### Content/upload
- direct paid URL blocked;
- locked body not in unauthorized response;
- signed file URL requires entitlement;
- path traversal blocked;
- oversized upload blocked;
- MIME spoof blocked;
- stored XSS blocked;
- arbitrary iframe blocked;
- YouTube parser injection blocked.

### Migration
- malformed/oversized CSV;
- duplicate import submission;
- CSV formula injection safe on export;
- migration token expiry/replay/wrong creator.

### SSRF/outbound webhooks
- localhost;
- 127/8;
- RFC1918;
- link-local;
- IPv6 loopback/private/link-local as practical;
- DNS/redirect edge strategy;
- unsupported scheme/userinfo parsing edge cases.

### API/OAuth/secrets
- revoked/wrong-scope key;
- cross-creator key;
- OAuth state validation;
- integration secret encryption/redaction;
- logs do not expose secrets/KYC/payment-sensitive payloads.

Fix every internally solvable critical/high issue before continuing.

**Phase Q exit:** security suite targets actual app boundaries and all critical/high findings are fixed.

---

# 23. PHASE R — DATABASE CONCURRENCY / IDEMPOTENCY / RELIABILITY

Use DB constraints/transactions, not in-memory booleans.

Test:

- duplicate/concurrent webhook processing;
- duplicate membership activation;
- repeated refund/dispute event;
- duplicate migration import;
- concurrent application review stale transition;
- quote used after expiry;
- quote used twice where single-use semantics apply;
- pricing rule version changes do not alter historical quote;
- guarantee profile pause racing with new quote;
- coupon redemption caps/per-user restrictions under concurrency;
- API key revocation vs request race where practical;
- payout/refund idempotency keys through provider adapter where user-triggered.

**Phase R exit:** deterministic concurrency tests pass using PostgreSQL-backed protections.

---

# 24. PHASE S — OBSERVABILITY, ENVIRONMENT SAFETY, PERFORMANCE, PWA AND CI

Implement:

- schema-validated environment configuration;
- separate dev/test/prod behavior;
- safe production startup when enabled provider secrets are missing/insecure;
- structured logs;
- request/correlation IDs;
- provider event IDs;
- guarantee reconciliation IDs;
- PII/secret redaction;
- health/readiness endpoint for app/DB/provider mode;
- pagination/query limits;
- indexes verified for high-value searches;
- avoid N+1 on member/payment/content lists;
- batched migration processing;
- upload limits;
- rate limits;
- no giant provider payloads serialized to browser.

PWA/mobile requirements still apply from Prompt 1/2:

- valid manifest/installability where practical;
- intentional mobile navigation;
- no service-worker/offline caching of private paid/financial/auth content;
- no stale entitlement/payment state served offline.

CI must run without live external credentials and include at minimum:

- locked dependency install;
- PostgreSQL service;
- migrations;
- seed/test setup;
- typecheck;
- lint;
- unit/domain tests;
- DB/integration/security tests;
- build;
- Playwright E2E where environment permits.

Optional credential-dependent Stripe remote integration belongs in a separate job/workflow.

**Phase S exit:** clean CI workflow exists and deterministic suite is green.

---

# 25. PHASE T — REAL END-TO-END ACCEPTANCE SUITE

Use an isolated/resettable PostgreSQL test environment.

At minimum automate these real workflows. These tests must create/change/persist/reload application state, not merely navigate screenshots.

1. Signup → email verify → login.
2. Creator application → submit.
3. Admin review → approve → creator sees persisted approval.
4. Creator payment-provider mock onboarding → connected account persisted.
5. Creator SaaS plan activation → entitlements/quota active.
6. Creator profile/tier creation → Guaranteed Earnings server quote → publish → reload.
7. Guarantee-ineligible route blocked/fallback.
8. Fan signup → creator page → checkout → signed mock webhook → membership ACTIVE.
9. Locked content denied before payment and available after payment.
10. Course creation with module + text lesson + image/file + YouTube URL → published → entitled member consumes it.
11. Wrong tier/cross-creator membership remains locked.
12. Exact reconciliation.
13. Creator Surplus reconciliation.
14. Guarantee Shortfall → incident + safe profile handling.
15. Renewal success.
16. Failed renewal → dunning → recovery.
17. Cancellation → resume.
18. Tier/monthly-annual change + proration preview/policy.
19. Payment/pricing change → `REPRICE_REQUIRED`.
20. Coupon/trial economics according to documented policy.
21. Creator refund → provider/domain event → entitlement/accounting update.
22. Dispute opened/lost/won simulation.
23. Provider balance/payout presentation and provider cost separation.
24. Patreon CSV upload → validate → map → import → invite → one member converts.
25. Discord entitlement grant/revoke through deterministic adapter.
26. Telegram entitlement boundary through deterministic adapter.
27. API key create/use/revoke/scope isolation.
28. Outbound webhook HMAC/retry/SSRF rules.
29. Broadcast quota/recipient selection/mock email delivery.
30. Creator search isolation vs Admin global search.
31. Creator data export contains allowed own data and excludes secrets/other tenant.
32. Support ticket escalation.
33. Content report → admin unpublish → audit.
34. Admin pricing rule version change → new quote uses new version; historical quote unchanged.
35. SaaS billing past due → grace/suspend/recover.
36. Password reset via deterministic mailbox.
37. Mobile creator critical path smoke.
38. Mobile fan checkout/content smoke.

Critical security and financial state must be asserted at DB/service level where browser text alone is insufficient.

Do not inflate E2E count by counting screenshot captures as functional journeys.

---

# 26. PHASE U — TARGETED VISUAL REGRESSION, NOT ANOTHER REDESIGN

Prompt 2 design has already been applied in the prototype. Preserve it while connecting real routes/data.

Capture actual running real-data application screenshots after conversion for at least:

- homepage desktop/mobile;
- signup/login;
- creator application;
- creator dashboard desktop/mobile;
- tier/Guaranteed Earnings builder;
- creator content/course editor;
- Patreon migration;
- Earnings;
- Financial Verification;
- Payouts;
- public creator page;
- checkout desktop/mobile;
- member dashboard;
- locked/unlocked course lesson;
- global search;
- admin dashboard;
- application review;
- Provider Pricing Catalog;
- Guarantee Health;
- countries/commerce responsibility;
- webhooks;
- support/moderation.

Inspect for route-layout regressions, loading/error states, mobile overflow, table breakage, financial labeling, auth-page inconsistency and inaccessible controls.

Perform one targeted fix pass and verification of changed screens.

Do not spend this phase restyling the whole product subjectively.

---

# 27. PHASE V — DOCUMENTATION AND PROOF MATRIX

Rewrite docs so they describe reality.

Maintain all docs required by Prompts 1–4, especially:

- `README.md`
- `PROJECT_CONTEXT.md`
- `docs/EXECUTION_STATE.md`
- `docs/REMAINING_V1_GAP_AUDIT.md`
- `docs/ARCHITECTURE.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/STRIPE_CONNECT_IMPLEMENTATION_DECISION.md`
- `docs/PLATFORM_OPERATING_MODEL.md`
- `docs/GUARANTEED_EARNINGS_MODEL.md`
- `docs/PRICING_ENGINE.md`
- `docs/PROVIDER_PRICING_CATALOG.md`
- `docs/PAYOUTS_AND_BALANCES.md`
- `docs/STRIPE_APPROVAL_READINESS.md`
- `docs/COUNTRY_AND_CURRENCY_STRATEGY.md`
- `docs/MERCHANT_AND_TAX_RESPONSIBILITY.md`
- `docs/TAX_ARCHITECTURE.md`
- `docs/CONTENT_ARCHITECTURE.md`
- `docs/MIGRATION_ARCHITECTURE.md`
- `docs/INTEGRATIONS.md`
- `docs/API.md`
- `docs/SEARCH_AND_INFORMATION_ARCHITECTURE.md`
- `docs/LEGAL_AND_COMPLIANCE_OPEN_ITEMS.md`
- `docs/SECURITY.md`
- `docs/UNIT_ECONOMICS.md`
- `docs/PROTOTYPE_LIMITATIONS.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/DESIGN_QA.md`
- `docs/VISUAL_QA.md`
- `docs/OWNER_NEXT_STEPS.md`.

Create:

`docs/V1_ACCEPTANCE_MATRIX.md`

This is mandatory.

For every material requirement from Prompts 1–4, record:

- requirement;
- implementation state;
- owning file/service/route;
- database entity if relevant;
- test name/file;
- E2E journey if relevant;
- screenshot evidence if relevant;
- external blocker if genuinely external.

Nothing may be marked `VERIFIED` solely because a doc or UI screen exists.

If a Prompt 1 V1 feature was intentionally removed/superseded by Prompt 4 (for example native video provider work), state the superseding requirement explicitly rather than silently omitting it.

`docs/OWNER_NEXT_STEPS.md` after this work must contain **owner/external launch actions**, not internal coding work the agent could still do.

---

# 28. WHAT MAY REMAIN BLOCKED EXTERNALLY AFTER THIS PROMPT

Legitimate examples:

- Stripe approval of ZeroFee's creator/content-platform model;
- live Connect platform configuration controlled by Stripe/platform dashboard;
- production Stripe keys;
- confirmation of selected connected-account fee/loss responsibilities;
- live launch-market provider pricing verification/contract evidence;
- country-specific seller/tax legal advice;
- legal wording of `Guaranteed Earnings`;
- production tax registrations/provider configuration;
- production domain/DNS;
- production SMTP/object-storage/OAuth credentials;
- final Terms/Privacy/Creator Agreement/AUP legal signoff;
- production WAF/CDN/secrets/hosting account configuration;
- real closed-beta creator/KYC/live-money validation.

Not legitimate external blockers:

- PostgreSQL migrations;
- auth/sessions/RBAC;
- real CRUD;
- Stripe adapter code;
- provider interfaces;
- webhooks;
- immutable quotes;
- tax mock/provider boundary;
- content/course persistence;
- YouTube parser/embed;
- storage adapter;
- entitlements;
- coupons/trials;
- dunning/lifecycle;
- reconciliation;
- migration CSV parser;
- Discord/Telegram adapter code;
- creator API;
- outbound webhook security;
- broadcasts;
- search;
- analytics;
- export;
- support/moderation;
- security tests;
- E2E;
- CI;
- documentation.

---

# 29. CLEAN-INSTALL / RELEASE VERIFICATION

Before completion perform a real clean verification as far as the environment permits:

1. fresh checkout/worktree or equivalent clean install validation;
2. install exactly from lockfile;
3. provision clean PostgreSQL;
4. apply all migrations from zero;
5. seed deterministic development/test data;
6. typecheck;
7. lint;
8. unit/domain tests;
9. database/integration tests;
10. security tests;
11. financial property/matrix tests;
12. build;
13. real Playwright E2E;
14. targeted mobile tests;
15. targeted screenshot regression QA;
16. built-app smoke test if practical;
17. verify no committed secrets;
18. verify migrations are deterministic;
19. verify docs/proof matrix;
20. verify working tree before commit/push.

If a deterministic test fails, fix it. Do not merely report failure and stop.

---

# 30. ANTI-LOOP / NO-STOP CONTRACT

Do not restart the whole project after discovering a defect.

Use:

`failure → owning subsystem → targeted fix → relevant tests → regression smoke → continue`.

Do not ask the owner for permission between phases.
Do not stop after PostgreSQL.
Do not stop after auth.
Do not stop after Stripe adapter.
Do not stop after checkout.
Do not stop after content.
Do not stop after Patreon migration.
Do not stop after tests.

The completion report is the first normal stopping point unless the environment itself becomes technically unable to continue.

Do not waste cycles repeatedly redesigning Prompt 2 surfaces.
Do not rewrite working financial mathematics without a failing test/evidence.
Do not swap architecture libraries repeatedly because another option is fashionable.

---

# 31. FINAL DEFINITION OF DONE

This execution is DONE only when all internally solvable items below are true:

### Backend / persistence
- core runtime state is PostgreSQL-backed;
- migrations are real;
- seed writes DB rows;
- no production route relies on seed JSON as source of truth;
- state survives reload/restart.

### Auth/security
- real authentication/sessions/verification/reset;
- server RBAC/resource policies;
- real IDOR/tampering/upload/webhook/SSRF/API-key tests.

### Creator/admin
- application/review/approval is real;
- country capability is real;
- profile/tier/pricing/content CRUD is real;
- SaaS entitlements/quotas are real;
- admin config/versioning/audit is real.

### Payments
- creator-owned connected-account model implemented through provider abstraction;
- current Stripe Connect decision documented;
- Stripe adapter contains real integration code;
- direct-charge connected-account context is enforced;
- application fee is invariant zero;
- provider webhooks are signed/idempotent;
- membership activation is provider-event authoritative;
- ZeroFee SaaS billing is separate.

### Financial
- pricing catalog/eligibility is DB/version-backed;
- quotes are immutable/server-authoritative;
- large financial matrix/property tests are green;
- actual provider reconciliation path exists;
- creator surplus remains creator-owned;
- shortfall creates real incident;
- earnings/refunds/disputes are auditable;
- balance/payout is provider-side, not ZeroFee wallet.

### Content
- posts + courses/modules/lessons work;
- text/images/files are really persisted/hosted through storage abstraction;
- V1 video is YouTube-only;
- paid content is server-gated;
- comments/report/moderation are real;
- no native video pipeline was accidentally introduced.

### Membership lifecycle
- monthly/annual;
- coupons/trials with explicit economics;
- renewals;
- dunning;
- cancellation/resume;
- tier/interval change;
- repricing-required path;
- refund/dispute effects.

### Acquisition/operations
- Patreon migration is real;
- Discord/Telegram adapter paths are real with deterministic mocks;
- API keys/outbound webhooks are real;
- broadcasts are real;
- search queries DB and is isolated;
- analytics derive from real data;
- export/support/notifications/moderation/audit persist.

### Quality
- concurrency/idempotency suite green;
- CI green;
- real E2E green;
- mobile critical flows work;
- Prompt 2 visual regression is acceptable;
- docs match implementation;
- `V1_ACCEPTANCE_MATRIX.md` contains evidence;
- no internally solvable requirement remains `NOT_STARTED`, `IN_PROGRESS` or `TARGETED_FIX_REQUIRED`;
- work is committed and pushed;
- working tree clean;
- `HEAD == origin/main` unless repository workflow explicitly requires a different final branch.

---

# 32. FINAL COMPLETION REPORT — EVIDENCE, NOT CLAIMS

Only after the Definition of Done is satisfied, report:

## Repository
- final SHA;
- branch;
- push status;
- clean tree;
- remote HEAD comparison.

## PostgreSQL
- ORM/query stack;
- PostgreSQL test version/environment;
- migration count;
- clean-from-zero migration result;
- seed result;
- proof runtime reads/writes DB.

## Auth / Security
- session/auth implementation;
- verification/reset implementation;
- real security integration test count;
- IDOR/tampering/webhook/upload/SSRF/API-key cases.

## Product
- creator/admin/member flows;
- SaaS billing/entitlements;
- memberships/lifecycle/promotions;
- content/courses/YouTube;
- Patreon migration;
- integrations;
- search/analytics/export/support/moderation.

## Stripe / providers
Separate clearly:
- actual Stripe code implemented;
- test-mode remote round-trips actually executed, if any;
- SDK-mocked adapter tests;
- current selected Connect configuration;
- existing/new Stripe account behavior actually supported;
- genuine external approval/configuration blockers.

Do not call an installed Stripe SDK an integration.

## Financial
- pricing tests count;
- matrix dimensions;
- property/fuzz sample count/seed;
- zero-decimal/rounding coverage;
- exact/surplus/shortfall results;
- immutable quote/tampering results;
- reconciliation persistence;
- Guarantee Incident behavior.

## Database/concurrency
- race/idempotency cases and results.

## E2E
- actual functional journey count;
- list journeys;
- desktop/mobile scope.

## Visual QA
- screenshots captured in conversion pass;
- regressions found/fixed.

## Documentation
- `docs/V1_ACCEPTANCE_MATRIX.md` path;
- `docs/OWNER_NEXT_STEPS.md` path;
- any remaining genuine prototype limitations.

## External blockers
Only actual external/business/legal/production dependencies.

Do not list unfinished coding as owner work.

---

# 33. FINAL EXECUTION COMMAND

START NOW.

READ PROMPTS 1–4 COMPLETELY.

AUDIT THE CURRENT REPOSITORY HONESTLY.

DO NOT REPEAT THE FAILED STRATEGY OF TURNING REQUIREMENTS INTO SEEDED SCREENS.

PRESERVE THE APPROVED PROMPT 2 DESIGN AND THE CORRECT PARTS OF THE EXISTING FINANCIAL ENGINE.

BUILD THE REAL POSTGRESQL BACKEND.

BUILD REAL AUTHENTICATION AND SERVER AUTHORIZATION.

CONVERT ALL CORE ROUTES TO REAL PERSISTED STATE.

IMPLEMENT THE CREATOR-OWNED STRIPE/DIRECT-CHARGE OPERATING MODEL WITH A REAL PROVIDER ADAPTER AND DETERMINISTIC MOCK MODE.

IMPLEMENT SIGNED IDEMPOTENT WEBHOOKS.

HARDEN AND PERSIST THE GUARANTEED EARNINGS ENGINE.

IMPLEMENT REAL CREATOR TIERS, MEMBERSHIP LIFECYCLE, COUPONS/TRIALS, DUNNING, REPRICING, RECONCILIATION, REFUNDS, DISPUTES AND PROVIDER-SIDE PAYOUT PRESENTATION.

IMPLEMENT REAL POSTS, COURSES, MODULES, LESSONS, TEXT, IMAGE/FILE HOSTING AND YOUTUBE-ONLY VIDEO.

IMPLEMENT REAL PATREON MIGRATION.

IMPLEMENT REAL DISCORD/TELEGRAM PROVIDER BOUNDARIES, API KEYS, OUTBOUND WEBHOOKS AND BROADCASTS.

IMPLEMENT REAL SEARCH, ANALYTICS, EXPORT, SUPPORT, NOTIFICATIONS, MODERATION AND AUDIT.

ATTACK THE REAL APPLICATION WITH SECURITY AND CONCURRENCY TESTS.

RUN A LARGE FINANCIAL TEST MATRIX.

RUN REAL DB-BACKED E2E JOURNEYS.

RUN TARGETED VISUAL REGRESSION QA, NOT A NEW REDESIGN.

CREATE THE V1 ACCEPTANCE EVIDENCE MATRIX.

FIX ALL INTERNALLY SOLVABLE FAILURES.

UPDATE DOCUMENTATION TO MATCH REALITY.

COMMIT AND PUSH EVERYTHING.

DO NOT STOP OR WAIT FOR OWNER CONFIRMATION UNTIL THE COMPLETE REMAINING V1 BACKEND EXECUTION IS FINISHED.