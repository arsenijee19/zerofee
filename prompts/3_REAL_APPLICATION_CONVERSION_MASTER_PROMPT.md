# ZeroFee — Real Application Conversion Master Prompt

**Prompt version:** 3.0  
**Status:** AUTHORITATIVE CONTINUATION SPECIFICATION  
**Repository:** https://github.com/arsenijee19/zerofee  
**Baseline commit audited before this prompt:** `0a4c005509236deb9d0b5fe90568477648d457d9`

---

# 0. START EXECUTION NOW

Work directly from the CURRENT `main` branch of:

https://github.com/arsenijee19/zerofee

Do not summarize this prompt instead of executing it.

Do not stop after planning.

Do not ask whether you should continue after a phase.

Do not wait for owner confirmation between implementation phases.

Continue autonomously until every internally solvable requirement in this prompt is implemented, verified, documented, committed and pushed.

If a genuine external dependency prevents live activation, implement the complete production integration boundary, deterministic local/test fallback, tests and documentation, mark only that specific capability `BLOCKED_EXTERNAL`, and continue everything else.

---

# 1. WHY THIS PROMPT EXISTS

The current repository contains a useful visual/product prototype and a promising Guaranteed Earnings proof-of-concept, but an audit of baseline commit `0a4c005509236deb9d0b5fe90568477648d457d9` found that many items previously marked `VERIFIED` are not yet real application functionality.

Important examples from the audited baseline:

- PostgreSQL is represented by a schema-reference file, but the application is not actually DB-backed.
- `pnpm db:migrate` writes a SQL reference file rather than executing real database migrations.
- runtime product state is primarily deterministic seed data passed into one large client component.
- authentication is not a real login/session system.
- creator/member/admin role separation is represented in UI/test helpers rather than enforced end-to-end by server authorization.
- global search is a static seeded result list rather than a real searchable, permission-scoped backend capability.
- several security tests test helper functions declared inside the test file rather than the real application boundary.
- browser tests largely navigate seeded screens rather than exercising server-authoritative state transitions.
- Patreon migration is represented in product UI, but not yet implemented as a real upload/parse/validate/persist/invite workflow.
- Stripe is installed and represented conceptually, but the real provider adapter, Connect endpoints, webhook routes, direct-charge integration boundary, account-session/embedded-component support and reconciliation ingestion are not fully implemented.

Therefore:

> **DO NOT redesign or restart the product. Convert the existing prototype into a real application.**

The existing UI, information architecture, financial terminology, Prompt 1 business model and Prompt 2 design system should be preserved wherever they are already correct.

---

# 2. PRECISE GOAL

Transform the existing ZeroFee prototype into a **real, database-backed, authenticated, server-authoritative working V1 application** while preserving the approved product concept and visual design.

At completion, the following journey must work through real application state rather than seeded navigation:

visitor  
→ signup  
→ email/account state  
→ creator application  
→ creator-country capability validation  
→ application persisted in PostgreSQL  
→ admin authenticates and reviews application  
→ admin approves  
→ creator sees persisted approval state  
→ creator starts real provider onboarding flow in mock/test or Stripe test mode  
→ provider account state is persisted and synchronized  
→ creator activates platform SaaS entitlement  
→ creator creates/edits/publishes real profile and membership tier  
→ creator enters Creator Earnings Target  
→ server Pricing Engine resolves eligible payment context  
→ immutable quote persisted  
→ fan creates account  
→ fan sees final customer price  
→ fan authorizes subscription/payment  
→ provider-authoritative event activates membership  
→ entitlement is persisted and server-enforced  
→ financial reconciliation is persisted  
→ creator sees real DB-derived earnings/payment/member data  
→ refund/dispute updates membership and financial state  
→ payout/balance provider state is surfaced correctly  
→ Patreon CSV can be uploaded and actually parsed/validated/imported  
→ migration invitations/conversion states are persisted  
→ creator/admin global search queries persisted records with tenant isolation  
→ all critical operations are protected by real server authorization  
→ E2E tests exercise real state transitions.

The final V1 does **not** need live production Stripe approval, production tax/legal certification or production infrastructure credentials.

It DOES need the real code architecture and test-mode implementation that can be switched to those production capabilities without rebuilding the product.

---

# 3. AUTHORITATIVE SPECIFICATION ORDER

Before implementation, read completely:

1. `prompts/1_INITIAL_PROTOTYPE_MASTER_EXECUTION_PROMPT.md`
2. `prompts/2_DESIGN_SYSTEM_AND_UX_MASTER_PROMPT.md`
3. this file: `prompts/3_REAL_APPLICATION_CONVERSION_MASTER_PROMPT.md`
4. `PROJECT_CONTEXT.md`
5. all architecture/payment/pricing/tax/security/migration docs in `/docs`
6. current application code and tests.

Authority order:

- Prompt 1 remains authoritative for product/business/payment rules.
- Prompt 2 remains authoritative for visual/UX design.
- Prompt 3 is authoritative for converting the prototype implementation into a real application and correcting false/weak verification claims.

If Prompt 3 requires replacing a mock implementation with a real one, do so while preserving Prompt 1 behavior and Prompt 2 presentation.

---

# 4. NON-NEGOTIABLE PRESERVATION RULES

Do not throw away good work.

Preserve unless a concrete test proves it wrong:

- ZeroFee economic model;
- `0%` ZeroFee membership transaction fee;
- `0%` payout markup;
- creator surplus belongs entirely to creator;
- guarantee shortfall becomes an incident;
- Guaranteed Earnings eligibility concept;
- integer/minor-unit money model;
- existing Pricing Engine solver behavior where mathematically correct;
- existing public positioning;
- existing light SaaS design system;
- creator/member/admin information architecture;
- screenshot-backed visual polish;
- existing page terminology;
- Patreon migration product concept;
- Financial Verification concept;
- Provider Pricing Catalog concept.

Do NOT spend the majority of this prompt making a second visual redesign.

The priority is depth, correctness and real functionality.

---

# 5. HONEST EXECUTION STATE

Immediately audit and rewrite `docs/EXECUTION_STATE.md`.

Do not preserve a `VERIFIED` label merely because the previous prototype report used it.

Each phase must use one of:

- `NOT_STARTED`
- `IN_PROGRESS`
- `IMPLEMENTED`
- `VERIFIED`
- `BLOCKED_EXTERNAL`
- `TARGETED_FIX_REQUIRED`

`VERIFIED` means the real application implementation exists and its acceptance test passes.

A mock screen, seed state or documentation alone is not sufficient evidence for `VERIFIED` where a server/database/provider implementation is internally possible.

Maintain evidence links/commands per phase.

Do not mark real PostgreSQL as verified until tests execute against PostgreSQL.

Do not mark real auth as verified until sessions and permission enforcement exist.

Do not mark Stripe boundary as verified until real Stripe adapter/routes/webhook implementation exist in test mode or fail safely due to genuine external config.

---

# 6. TARGET ARCHITECTURE

Keep Next.js App Router + TypeScript unless a concrete blocker requires otherwise.

Use a real server-backed architecture.

Minimum boundaries:

```text
Browser / React UI
        |
        v
Server Components / Route Handlers / Server Actions
        |
        +--> Authentication / Session Layer
        +--> Authorization Policy Layer
        +--> Application Services
                |
                +--> PostgreSQL repositories
                +--> Pricing / Guarantee Engine
                +--> CreatorPaymentsProvider
                +--> PlatformBillingProvider
                +--> TaxProvider
                +--> NotificationProvider
                +--> StorageProvider
```

Do not leave the application as one giant client-side state machine.

Break the existing `components/zerofee-app.tsx` prototype into maintainable real pages/layouts/components/services.

Do not over-fragment solely for aesthetics, but domain boundaries must be real.

---

# 7. REAL POSTGRESQL — HIGHEST PRIORITY

Replace schema-reference persistence with actual PostgreSQL persistence.

Choose a mature TypeScript ORM/query layer with real migrations. Prefer a stack appropriate for Next.js and PostgreSQL such as Prisma or Drizzle. Make one decision and document it.

Requirements:

- actual `DATABASE_URL` connection;
- executable migrations;
- migration history committed to repo;
- clean database bootstrap;
- deterministic development/test seed;
- foreign keys;
- unique constraints;
- indexes;
- transactions where needed;
- relational ownership constraints;
- timestamps;
- enum/state modeling;
- immutable financial quote/version records where required.

`pnpm db:migrate` must execute migrations against a database.

It must NOT merely generate `schema.sql`.

Create appropriate commands for:

- generate migration;
- apply migration;
- reset test DB;
- seed;
- verify clean migration.

If local Docker is available, provide a development PostgreSQL compose/service setup.

If Docker is unavailable, tests may use an explicitly configured local PostgreSQL instance, but the repository must remain normal production PostgreSQL architecture.

Do not silently substitute SQLite for production domain semantics.

---

# 8. REQUIRED DATA MODEL DEPTH

Implement the real relational model required by Prompt 1.

At minimum support persisted entities for:

## Identity

- User
- Account/email verification state
- Session
- Password reset token
- Role/role assignment
- SecurityEvent

## Creator

- CreatorProfile
- CreatorApplication
- CreatorApplicationRevision/history
- CreatorReviewNote
- CreatorComplianceStatus
- CreatorConnectedAccount
- CreatorCountryCapability snapshot/reference

## Platform SaaS

- PlatformPlan
- PlatformSubscription
- PlatformEntitlement
- Usage/Quota record as needed

## Pricing / Guarantee

- ProviderPricingRule
- GuaranteeEligibilityProfile
- CreatorTier
- TierPriceVersion
- MembershipPriceQuote
- GuaranteeReconciliation
- GuaranteeIncident

## Content

- Post
- PostTierAccess
- MediaAsset/reference
- Comment if retained in V1

## Fan membership

- MembershipSubscription
- MembershipPayment
- MembershipEvent
- Entitlement snapshot/event where useful

## Provider integration

- ProviderAccountReference
- ProviderCustomerReference
- ProviderSubscriptionReference
- WebhookEvent
- ProviderEventProcessingAttempt

## Patreon migration

- MigrationProject
- MigrationUpload
- ImportedMember
- MigrationTierMapping
- MigrationInvitation
- MigrationConversionEvent

## Operations

- SupportTicket
- ContentReport
- ModerationAction
- Notification
- AuditLog
- FeatureFlag/AdminSetting
- API key/webhook endpoint records if feature is enabled.

Use transactions and constraints to prevent impossible cross-creator relationships.

---

# 9. REAL AUTHENTICATION

Implement actual authentication.

Minimum:

- signup;
- normalized unique email;
- password hashing using a modern password hashing algorithm;
- login;
- logout;
- secure server session;
- secure cookie configuration;
- session invalidation;
- email verification token/state;
- password reset request/token/reset flow;
- generic auth errors to reduce enumeration;
- rate limiting around auth-sensitive routes where practical;
- development email provider/mock mailbox so flows are testable without SMTP.

Do not use a UI dropdown/button to pretend the current user is admin/creator/member.

Seed test accounts through the database.

E2E tests should login through the real auth flow or a documented test-only authentication helper that still creates valid server sessions.

---

# 10. REAL AUTHORIZATION / RBAC

Implement server-side authorization policies.

UI hiding is not authorization.

Every protected read/mutation must validate session and resource ownership.

At minimum enforce:

- member cannot access admin routes;
- creator cannot access admin routes;
- one creator cannot read/update another creator's private records;
- creator cannot self-approve application;
- creator cannot alter another creator's tier/profile/post;
- member cannot read another user's billing/membership records;
- paid content requires real entitlement;
- admin-only fee-profile/country/guarantee settings require admin;
- provider-account operations are bound to the correct creator;
- payout actions cannot target a different connected account;
- search results respect role and tenant ownership.

Centralize policies where practical.

Do not duplicate brittle role checks across random components.

---

# 11. ROUTING / APPLICATION STRUCTURE

Replace the single client-side `View` switch with real application routes.

Maintain the Prompt 1/2 information architecture.

Examples:

- `/`
- `/pricing`
- `/how-it-works`
- `/migration`
- `/safety`
- `/login`
- `/signup`
- `/c/[slug]`
- `/c/[slug]/posts/[slug]`
- `/app/...`
- `/creator/...`
- `/admin/...`

Use appropriate route groups/layouts.

Browser refresh/deep-linking must work.

Authorization must occur server-side for protected routes.

Do not keep essential product state only in React memory.

---

# 12. CREATOR APPLICATION — REAL WORKFLOW

Implement the complete application lifecycle against PostgreSQL.

Creator:

1. creates account;
2. selects creator country;
3. country capability is checked;
4. creates/saves draft application;
5. submits;
6. sees persisted state.

Admin:

1. logs in;
2. sees review queue from DB;
3. opens application;
4. adds internal note;
5. approves, rejects or requests information;
6. action is transactionally persisted;
7. audit event created;
8. creator receives notification;
9. state survives reload/restart.

Needs-information resubmission must preserve revision/history.

Security tests must prove creator cannot call approval mutation.

---

# 13. COUNTRY CAPABILITY REGISTRY — REAL CONFIGURATION

Persist and enforce country capability records.

Country state should support at minimum:

- `UNSUPPORTED`
- `WAITLIST`
- `BETA`
- `AVAILABLE`
- `PAUSED`

Store/represent:

- creator legal country;
- supported entity types;
- payout capability state;
- supported presentment/settlement currencies;
- Guaranteed Earnings availability;
- tax readiness state;
- Stripe/processor availability notes;
- owner/admin verification metadata.

Admin changes must be audited.

Creator onboarding must use these records rather than hardcoded demo text.

---

# 14. PROVIDER ABSTRACTIONS — REAL CODE

Implement real interfaces and adapters.

At minimum:

- `CreatorPaymentsProvider`
- `PlatformBillingProvider`
- `TaxProvider`
- `NotificationProvider`
- `MediaStorageProvider`

Implement a deterministic Mock provider.

Implement a real Stripe provider adapter using the official Stripe SDK.

Mock and Stripe adapters should map into the same ZeroFee domain states.

Do not scatter Stripe-specific strings/statuses throughout React components.

---

# 15. STRIPE CONNECT TEST-MODE INTEGRATION BOUNDARY

Implement as much as possible without production platform approval.

The absence of production approval does not justify leaving the Stripe code as an empty dependency.

Implement server-side capability for:

- creating/retrieving connected accounts using the current Stripe-recommended architecture available at implementation time;
- creating Account Sessions / embedded onboarding configuration where supported;
- account requirement/status synchronization;
- storing external Stripe account IDs safely;
- capability/readiness mapping;
- direct-charge architecture for fan payments;
- connected-account context on payment operations;
- test-mode Checkout/PaymentIntent/Subscription flow appropriate to current design;
- Stripe customer/subscription external references;
- refund API boundary;
- dispute event ingestion;
- balances/payout embedded/provider boundary where supported;
- `Verify in Stripe`/Dashboard-access concept where the selected account configuration supports it.

Use current official Stripe documentation during implementation.

Do not rely on outdated account-type assumptions if the API has changed.

If Stripe account-level settings/approval prevent an actual test API call, code the real adapter, validate environment configuration, unit/integration test it with SDK mocks where necessary, mark only the live/test account round trip external, and continue.

---

# 16. REAL WEBHOOK SYSTEM

Implement actual webhook route handlers.

Requirements:

- raw payload signature verification;
- correct secret/environment selection;
- provider/connected-account event scope;
- persistent WebhookEvent record;
- unique provider event ID/idempotency constraint;
- processing status;
- processing attempts;
- safe error recording;
- retry/replay admin action;
- no duplicate membership activation;
- no duplicate payment records;
- no duplicate notification/email;
- transaction-safe state transitions.

Browser success redirect must never be proof of successful payment.

Implement provider event → domain event mapping.

Test duplicate delivery and invalid signature against the REAL route/service, not helper functions defined in tests.

---

# 17. PLATFORM SAAS BILLING

Creator → ZeroFee SaaS billing is separate from fan → creator membership GMV.

Implement persisted plan/subscription/entitlement state.

Mock mode must support:

- no plan;
- trial if configured;
- active;
- past due;
- grace;
- suspended;
- cancelled.

Implement Stripe platform-billing adapter boundary for ZeroFee's own SaaS billing.

Creator paid features must depend on server-side entitlement, not seeded UI data.

Admin override must require reason + audit event.

---

# 18. PRICING ENGINE — PRESERVE, HARDEN, PERSIST

Preserve the existing integer/minor-unit solver unless a test proves a defect.

Move its inputs/results into real persistence and service boundaries.

Requirements:

- pricing rules loaded from DB;
- eligibility profiles loaded from DB;
- current/effective/revalidate checks;
- creator tier loaded from DB;
- quote generated server-side;
- quote immutable once used for checkout;
- quote expiration enforced server-side;
- buyer cannot edit retail amount client-side;
- creator cannot submit arbitrary provider fee profile IDs they do not control;
- quote stores complete payment/pricing context snapshot;
- actual reconciliation records persisted.

Do not trust request JSON for calculated financial fields.

Recalculate or retrieve immutable server quote.

---

# 19. PRICING CATALOG ADMIN — REAL CRUD

Admin must be able to manage real ProviderPricingRule and GuaranteeEligibilityProfile records.

Support:

- create;
- edit future/current rules according to safe versioning policy;
- deactivate/pause;
- revalidation date;
- source URL/reference;
- creator account country;
- issuer region;
- payment family;
- card class where relevant;
- currencies;
- cross-border/FX conditions;
- fee payer;
- percentage/fixed/billing/FX/cross-border cost components;
- exact vs verified-upper-bound confidence;
- production/test enabled state;
- audit history.

Used historical pricing rules must not be destructively rewritten in a way that changes historical quote truth.

Create a new version where required.

---

# 20. REAL MEMBERSHIP TIERS

Creator must be able to actually:

- create tier;
- edit tier;
- choose Simple Price or Guaranteed Earnings mode;
- define target;
- preview retail using Pricing Engine;
- publish;
- archive;
- create new price version;
- view active/historical versions.

Persist everything.

Public creator page must read from DB.

Only published/eligible tiers appear publicly.

---

# 21. REAL PUBLIC CREATOR / CONTENT SYSTEM

Persist:

- creator public profile;
- slug;
- tier cards;
- posts;
- post visibility;
- tier access rules.

Use real server-side content entitlement checks.

A user manually navigating to a paid-content URL must not receive paid content unless entitlement service allows it.

Do not send full locked content in HTML/client payload and merely hide it visually.

For media, retain abstraction and reasonable prototype restrictions rather than implementing expensive custom streaming.

---

# 22. REAL FAN CHECKOUT / MEMBERSHIP LIFECYCLE

Implement real persisted lifecycle.

Fan flow:

1. visits public creator page;
2. chooses tier;
3. authenticates/registers;
4. server resolves payment context as far as available;
5. server creates/retrieves immutable quote;
6. final customer price shown before authorization;
7. checkout/payment provider session created server-side;
8. fan completes mock/Stripe test payment;
9. webhook/provider event confirms state;
10. membership persisted ACTIVE;
11. entitlement becomes active;
12. member dashboard queries DB.

Support state transitions required by Prompt 1:

- pending;
- active;
- past due;
- cancel at period end;
- resumed;
- cancelled;
- expired;
- refunded/revoked as policy requires.

Implement dunning/recovery state model in mock/test mode and Stripe mapping where available.

---

# 23. REAL RECONCILIATION / GUARANTEE INCIDENTS

Persist provider payment and actual fee/reconciliation data.

When provider payment succeeds:

- store gross/customer charge;
- store actual provider fee when available;
- store tax snapshot;
- compute/store actual creator proceeds;
- store ZeroFee membership transaction fee = 0;
- calculate surplus/shortfall;
- create GuaranteeIncident on shortfall;
- associate pricing rule/profile/quote versions;
- preserve provider transaction references.

Admin Guarantee Health must query real incidents and real reconciliation aggregates.

A repeated reconciliation event must not duplicate earnings.

---

# 24. REFUNDS / DISPUTES — REAL DOMAIN TRANSITIONS

Implement real service and persistence behavior for:

- full refund;
- provider refund event;
- dispute opened;
- dispute won;
- dispute lost;
- reversal as applicable.

Provider adapters can simulate deterministic events in mock mode.

Stripe webhook mapping must support actual Stripe event types relevant to selected architecture.

Membership entitlement after refund/dispute must follow explicit policy.

Do not simply update a badge in UI.

---

# 25. PAYOUTS / BALANCES

Keep Creator Earnings distinct from provider Available/Pending/Paid-Out balance.

Implement provider service boundary and persisted references where appropriate.

Mock mode should support realistic:

- pending balance;
- available balance;
- standard payout;
- instant payout with provider cost;
- payout completed/failed;
- provider/bank fee explanation.

Stripe adapter should use supported balance/payout/embedded components according to selected Connect configuration.

ZeroFee payout markup remains `0`.

Do not claim `amount landed in bank` when only `amount sent` is known.

---

# 26. PATREON MIGRATION — MUST BECOME REAL

This is a core acquisition feature.

Implement an actual migration workflow.

## Upload

- authenticated creator only;
- CSV file upload;
- strict maximum size;
- MIME/extension/content validation;
- safe temporary/storage handling;
- malformed file errors;
- encoding handling where practical.

## Parse

- robust CSV parser library;
- normalize headings;
- support known Patreon-export heading variants where practical;
- preserve raw source fields for troubleshooting if safe;
- sanitize CSV formula injection for any re-export;
- validate email/amount/status/date fields;
- detect duplicate rows/member identity collisions.

## Preview

Before committing import show:

- total rows;
- valid;
- invalid;
- duplicates;
- statuses;
- external tiers;
- monthly/annual hints;
- unmapped fields.

## Mapping

Persist:

- Patreon tier → ZeroFee tier;
- external interval → ZeroFee interval;
- grandfathered target/retail decision;
- import strategy;
- unsupported rows.

## Import

Persist ImportedMember records.

Never claim payment credentials migrated.

## Invitation

Generate cryptographically random, scoped, expiring migration tokens.

Token must be hashed or otherwise safely stored where appropriate.

Invitation flow:

- user opens secure link;
- intended creator/tier context shown;
- fan authenticates or creates account;
- fan authorizes new subscription;
- conversion attributed to migration project;
- token cannot be reused incorrectly.

## Funnel

Persist and display:

- imported;
- invited;
- delivered if notification provider can confirm;
- clicked;
- started;
- converted;
- expired;
- failed;
- unsubscribed/unconverted.

E2E must upload a fixture CSV and convert at least one imported member through the real workflow.

---

# 27. GLOBAL SEARCH — REAL SEARCH

Replace static precomputed search results.

Implement query-backed search.

Creator search should search only creator-owned/allowed records such as:

- members;
- posts;
- tiers;
- payments;
- payouts;
- support tickets;
- migration records;
- integrations.

Admin search can search platform-wide allowed resources.

Requirements:

- query input actually filters;
- debounce/request strategy appropriate to UX;
- grouped results;
- permission enforcement server-side;
- no cross-creator leakage;
- sensible DB indexes;
- basic typo/fuzzy behavior if practical without excessive complexity;
- keyboard navigation retained.

Security test must prove Creator A search cannot discover Creator B private member/payment data.

---

# 28. NOTIFICATIONS / EMAIL TEST PROVIDER

Persist in-app notifications.

Create deterministic development email provider/mailbox so flows are testable without external SMTP.

Test notifications for:

- email verification;
- password reset;
- application status;
- information requested;
- payout/KYC action required;
- membership started;
- failed payment;
- migration invitation;
- support update as relevant.

Production SMTP/provider stays pluggable.

---

# 29. SUPPORT / MODERATION — REAL RECORDS

Support tickets and reports must persist.

Implement basic create/update/status flows with role separation.

Fan/member can create support request.

Creator can see only creator-relevant tickets where policy permits.

Admin can inspect/escalate/resolve.

Moderation actions require audit trail.

---

# 30. AUDIT LOG — REAL AND APPEND-ORIENTED

Persist critical events.

At minimum:

- login/security events;
- creator application submission;
- admin approval/reject/info request;
- creator suspension;
- pricing rule/profile changes;
- tier price changes;
- webhook replay;
- guarantee incident handling;
- billing override;
- report/moderation resolution;
- country capability changes;
- API key changes if implemented.

Do not store secrets/full sensitive webhook payloads in audit text.

---

# 31. REAL API / WEBHOOK FEATURES

If Prompt 1 exposes creator API and outbound webhooks, make them real enough to justify UI presence.

## API keys

- generated server-side;
- high entropy;
- plaintext shown once;
- hash stored;
- scopes;
- created/revoked timestamps;
- creator ownership;
- rate limit.

## Outbound webhooks

- HTTPS only;
- block private/local/internal ranges, not only literal localhost;
- DNS/IP SSRF-aware validation strategy;
- HMAC signature;
- delivery record;
- retry;
- disable/revoke endpoint;
- creator isolation.

If full production outbound network delivery is inappropriate in test environment, use deterministic test dispatcher while real service boundary exists.

---

# 32. REPLACE FAKE SECURITY TESTS

Do not delete useful pure unit tests, but add REAL security integration tests against application boundaries.

Do not satisfy this requirement by declaring helper functions inside tests and testing those helpers.

Required real tests include:

## Auth

- invalid login;
- expired/reset token;
- session invalidation;
- protected page without session.

## RBAC / IDOR

- creator A cannot fetch creator B member resource;
- creator A cannot edit creator B tier;
- creator cannot call application approval route;
- member cannot call admin mutation;
- member cannot access another member billing record.

## Financial tampering

- client cannot submit custom retail price;
- client cannot reduce quote amount;
- client cannot modify creator target on an existing quote;
- expired quote rejected;
- wrong creator/tier quote rejected;
- ineligible guarantee route rejected server-side.

## Webhooks

- invalid signature rejected by real webhook endpoint/service;
- duplicate event idempotent;
- event for wrong connected account cannot mutate unrelated creator;
- replay safe.

## Content

- locked content not returned without entitlement;
- direct URL does not bypass gate.

## Upload

- oversized migration CSV rejected;
- malformed CSV handled;
- CSV injection protected on export;
- unsafe media MIME rejected if uploads exist.

## SSRF

- outbound webhook cannot target loopback;
- private IPv4 ranges;
- link-local;
- IPv6 loopback/private equivalents where practical;
- URL parsing edge cases.

## API keys

- revoked key rejected;
- wrong scope rejected;
- creator A key cannot access creator B resources.

---

# 33. REAL E2E TESTS

Replace superficial browser navigation tests with real workflows.

Use isolated/resettable test DB.

At minimum automate:

### E2E 1 — Creator application

signup → verify/login → application draft → submit → persisted under review.

### E2E 2 — Admin approval

admin login → review application → approve → creator sees approved state.

### E2E 3 — Provider onboarding mock

approved creator → provider onboarding → requirements resolved → readiness persisted.

### E2E 4 — SaaS entitlement

creator activates mock plan → entitlement active → paid creator features unlocked.

### E2E 5 — Tier pricing

creator creates tier → target entered → real server quote generated → publish → reload → state persists.

### E2E 6 — Fan subscription

fan signup/login → public creator page → tier → final quote → mock payment → simulated signed provider event/webhook → membership active.

### E2E 7 — Entitlement

before membership paid post denied → after membership paid post accessible → after revocation/refund policy re-evaluated.

### E2E 8 — Reconciliation

successful payment creates persisted reconciliation → creator surplus case correct → admin guarantee dashboard reflects it.

### E2E 9 — Shortfall

simulated provider shortfall → GuaranteeIncident persisted → unsafe profile state/alert behavior as configured.

### E2E 10 — Refund/dispute

provider event → financial state updated → membership policy applied.

### E2E 11 — Patreon migration

upload fixture CSV → validate → map tier → import → generate invitation → convert one member → funnel changes.

### E2E 12 — Search isolation

creator A search finds own member → does not find creator B private member → admin search can find both.

### E2E 13 — Admin configuration

admin versions pricing rule/country capability → audit event created → new quote uses appropriate version.

### E2E 14 — Password reset/email provider

request reset → dev mailbox/test token → reset → old password fails → new succeeds.

### E2E 15 — Mobile critical path smoke

creator dashboard/tier pricing/migration/member checkout at phone viewport without functional blockers.

Do not count screenshot-only tests as functional E2E.

---

# 34. DATABASE / CONCURRENCY TESTS

Financial and subscription state must survive races/retries.

Test at minimum:

- duplicate webhook delivery;
- two concurrent webhook processors for same event;
- duplicate membership activation attempt;
- repeated refund event;
- duplicate migration import submission;
- quote use after expiration;
- pricing rule version change after quote creation does not mutate historical quote;
- creator application double approval/reject stale transition;
- payout request idempotency in mock/provider abstraction if user-triggered payout exists.

Use database uniqueness/transactions, not only in-memory flags.

---

# 35. PRICING ENGINE TEST DEPTH

The existing Pricing Engine tests are only a starting point.

Expand tests to a structured matrix.

At minimum vary:

- creator country;
- issuer region;
- domestic/cross-border;
- consumer/commercial where pricing differs;
- payment method family;
- presentment currency;
- settlement currency;
- FX yes/no;
- tax inclusive/exclusive/zero;
- monthly/annual where billing cost differs;
- target amounts from smallest accepted through high values;
- percentage + fixed combinations;
- exact formula and verified upper bound.

Add property/fuzz tests across a large deterministic sample of minor-unit targets.

For every eligible quote assert:

`modeled_creator_proceeds >= creator_target`

and minimality:

`retail - smallest_currency_unit` must fail target unless rounding creates a documented equivalent boundary.

Assert ZeroFee membership application fee remains 0.

Assert creator surplus remains creator-owned.

Assert stale/paused/unverified pricing rules cannot power Guaranteed Earnings.

---

# 36. FINANCIAL RECONCILIATION MUST USE PROVIDER ACTUALS

The production/test Stripe adapter should fetch/map authoritative balance/fee information available after payment, such as the provider balance transaction associated with the charge/payment, according to current Stripe APIs.

Do not use the quote's predicted provider fee as the actual reconciliation fee.

Mock provider must independently generate actual fees so tests can prove:

- exact target;
- surplus;
- shortfall.

Persist both predicted and actual values.

---

# 37. DESIGN PRESERVATION / TARGETED QA ONLY

Do not perform a wholesale Prompt 2 redesign.

After real-routing/database conversion, use screenshots to detect regressions caused by implementation.

Required targeted screenshot regression set:

- homepage desktop/mobile;
- creator application;
- creator dashboard desktop/mobile;
- tier builder;
- financial verification;
- Patreon migration;
- public creator page;
- checkout review;
- member dashboard;
- admin dashboard;
- guarantee health;
- global search.

Compare qualitatively with the approved baseline screenshots.

Fix:

- lost styling;
- route layout regressions;
- mobile overflow;
- loading/error-state ugliness;
- table regressions;
- auth page inconsistency.

Do not spend cycles changing the established visual identity without a concrete problem.

---

# 38. LOADING / EMPTY / ERROR STATES WITH REAL DATA

All important real-data pages must handle:

- loading/pending;
- no records;
- provider not configured;
- database/server error;
- unauthorized;
- forbidden;
- deleted/archived/not found;
- external capability unavailable;
- stale quote;
- payment pending webhook confirmation;
- failed payment;
- webhook processing error;
- migration parse errors;
- search no results.

Do not replace real errors with fake successful seed data.

---

# 39. OBSERVABILITY / HEALTH

Implement real health/readiness endpoints appropriate for prototype V1.

Report safely:

- app running;
- DB reachable;
- provider configured/not configured;
- mock/test/live mode;
- migration version if useful.

Do not leak secrets.

Use structured logs for important server/provider operations with correlation/request IDs where practical.

Redact sensitive data.

---

# 40. ENVIRONMENT SAFETY

Create/update `.env.example`.

Validate env values at startup/server boundary.

Separate:

- development;
- test;
- production.

Production startup must fail safely if required secrets are obviously insecure/missing for enabled live capabilities.

Test/mock mode must remain easy to run.

Never commit real credentials.

---

# 41. CLEAN INSTALL MUST BE REAL

At completion, verify from a clean environment as far as locally possible:

1. install dependencies from lockfile;
2. start PostgreSQL dependency;
3. create empty test/dev database;
4. apply real migrations;
5. seed;
6. run typecheck;
7. run lint;
8. run unit tests;
9. run integration/security tests;
10. run E2E;
11. run build;
12. start built application smoke if practical.

`db:migrate` success means database schema changed/validated, not that a SQL text file was generated.

---

# 42. CI

Add or improve GitHub Actions CI for deterministic checks if repository permissions/workflow allow.

CI should run at minimum:

- install;
- PostgreSQL service;
- migrations;
- typecheck;
- lint;
- unit/integration tests;
- build;
- E2E where environment permits.

Do not require live Stripe credentials for ordinary CI.

Optional Stripe-test integration can be a separate credential-dependent workflow/job.

---

# 43. DOCUMENTATION MUST BE REWRITTEN TO MATCH REALITY

Update all affected docs.

Especially:

- `README.md`
- `PROJECT_CONTEXT.md`
- `docs/EXECUTION_STATE.md`
- `docs/ARCHITECTURE.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/PRICING_ENGINE.md`
- `docs/GUARANTEED_EARNINGS_MODEL.md`
- `docs/PAYOUTS_AND_BALANCES.md`
- `docs/MIGRATION_ARCHITECTURE.md`
- `docs/SECURITY.md`
- `docs/API.md`
- `docs/SEARCH_AND_INFORMATION_ARCHITECTURE.md`
- `docs/PROTOTYPE_LIMITATIONS.md`
- `docs/VISUAL_QA.md`
- `docs/OWNER_NEXT_STEPS.md`

Documentation must distinguish:

- fully implemented;
- implemented in deterministic mock/test mode;
- real Stripe code present but external account configuration blocked;
- genuinely external/legal/tax blocker;
- future/non-V1 enhancement.

Do not describe DB as production-like if it is not actually used.

Do not describe security as verified unless tests attack real boundaries.

---

# 44. EXECUTION PLAN — DO IN THIS ORDER

## Phase A — Audit and reclassify

- read all specs/current code;
- update `EXECUTION_STATE.md` honestly;
- preserve baseline commit/reference;
- identify mock-only implementations.

Exit evidence:

- documented gap map;
- no misleading `VERIFIED` statuses.

## Phase B — PostgreSQL foundation

- ORM/query layer;
- real schema;
- migrations;
- seed;
- DB test harness.

Exit evidence:

- empty DB migrates;
- seed writes rows;
- app can query DB.

## Phase C — Auth/session/RBAC

- signup/login/logout;
- verification/reset;
- sessions;
- authorization policies;
- protected layouts/routes.

Exit evidence:

- real auth tests;
- real IDOR tests.

## Phase D — Convert application routes and creator workflow

- real pages/layouts;
- application persisted;
- admin review persisted;
- notifications/audit.

Exit evidence:

- reload-safe application/approval E2E.

## Phase E — Provider abstractions + Stripe boundary

- interfaces;
- mock provider;
- Stripe adapter;
- Connect account/onboarding/state;
- webhooks.

Exit evidence:

- deterministic mock E2E;
- Stripe adapter tests;
- invalid/duplicate real webhook tests.

## Phase F — SaaS billing/entitlements

- persisted plan/subscription;
- entitlement policy;
- mock billing lifecycle;
- Stripe platform-billing boundary.

Exit evidence:

- suspended creator loses applicable paid features server-side.

## Phase G — Pricing catalog + tiers + quotes

- DB-backed catalog;
- real tier CRUD;
- immutable server quote;
- admin versioning;
- expanded financial tests.

Exit evidence:

- client price tampering tests pass.

## Phase H — Fan membership/content

- public DB-backed page;
- checkout;
- provider-confirmed activation;
- content entitlement;
- cancellation/dunning.

Exit evidence:

- full fan E2E.

## Phase I — Reconciliation/refunds/disputes/payouts

- persisted financial records;
- actual vs expected;
- incidents;
- refund/dispute events;
- provider balance/payout boundary.

Exit evidence:

- exact/surplus/shortfall + refund/dispute tests.

## Phase J — Patreon migration

- real upload;
- parse;
- validation;
- mapping;
- persistence;
- invitations;
- conversion funnel.

Exit evidence:

- fixture CSV end-to-end conversion.

## Phase K — Search/API/integrations/support

- real search;
- API keys;
- outbound webhook security;
- support/moderation persistence;
- notifications/broadcast provider boundary.

Exit evidence:

- creator isolation tests;
- search E2E.

## Phase L — Security/concurrency hardening

- attack real routes/services;
- webhook race/idempotency;
- quote tampering;
- SSRF;
- upload security;
- API key security.

Exit evidence:

- security suite attacks application implementation, not test-local helpers.

## Phase M — E2E + clean install + CI

- full journeys;
- fresh DB;
- all checks;
- CI.

Exit evidence:

- actual test counts and command output captured in completion report.

## Phase N — Targeted visual regression QA

- capture selected screenshots;
- fix regressions only;
- update visual QA doc.

Exit evidence:

- no major visual regression from Prompt 2 baseline.

## Phase O — Documentation/finalization

- docs reflect reality;
- owner next steps only external/business/production items;
- clean tree;
- commit/push.

---

# 45. ANTI-LOOP RULE

Do not restart the whole prompt after a test failure.

Use:

failure  
→ identify owning module  
→ targeted fix  
→ relevant test  
→ regression smoke  
→ continue.

Do not repeatedly redesign.

Do not repeatedly rewrite architecture because another library is fashionable.

Do not stop after each phase.

Do not wait for owner approval.

---

# 46. WHAT COUNTS AS BLOCKED_EXTERNAL

Examples that may legitimately remain external:

- Stripe approval of ZeroFee as a creator/content platform;
- live Connect platform configuration controlled in Stripe Dashboard;
- production Stripe keys;
- contractual confirmation of loss liability/fee responsibility;
- live provider pricing agreements/verification;
- Stripe Tax commercial/configuration decision;
- qualified VAT/GST/sales-tax review;
- qualified legal review of merchant/seller status and `Guaranteed` wording;
- production domain/DNS;
- production SMTP/storage/OAuth credentials;
- production infrastructure secrets.

These are NOT external blockers:

- creating real DB migrations;
- building auth;
- implementing RBAC;
- writing Stripe adapter code;
- implementing webhook endpoints;
- implementing CSV parsing;
- implementing persisted search;
- implementing mock provider state transitions;
- implementing test-mode checkout architecture;
- writing real security tests;
- writing E2E tests.

Do not misuse `BLOCKED_EXTERNAL` to avoid coding.

---

# 47. FINAL DEFINITION OF DONE

This prompt is complete only when all of the following are true:

1. application runtime data comes from PostgreSQL for core product state;
2. migrations are real and executable;
3. seed populates database, not just JSON evidence;
4. users authenticate through real sessions;
5. role/resource authorization is server enforced;
6. creator applications persist and admin review is real;
7. creator profiles/tiers/posts are real CRUD;
8. Prompt 2 design remains substantially intact;
9. Pricing Engine uses DB-backed rules/profiles;
10. quote generation is server authoritative;
11. customer cannot tamper with price;
12. provider abstraction exists as production code;
13. deterministic mock provider works end-to-end;
14. Stripe provider adapter is real code and uses official SDK;
15. webhook endpoint is real, signed and idempotent;
16. membership activation is provider/webhook authoritative;
17. paid content is server gated;
18. reconciliation is persisted;
19. creator surplus remains creator-owned;
20. shortfall creates persisted Guarantee Incident;
21. refund/dispute transitions are real domain operations;
22. payout/balance model is provider-backed abstraction, not static UI;
23. Patreon CSV actually uploads/parses/validates/imports;
24. migration invitation/conversion state persists;
25. global search actually queries/filter data and is tenant-safe;
26. support/audit/notifications persist where in V1;
27. security tests attack real application boundaries;
28. E2E tests create/change/reload real state;
29. duplicate webhook/race/idempotency cases are tested with database protection;
30. clean empty database can migrate and run test suite;
31. build/lint/typecheck/tests are green;
32. screenshot regression QA shows no material Prompt 2 degradation;
33. docs no longer overstate mock functionality;
34. no internally solvable item is left `NOT_STARTED`, `IN_PROGRESS` or `TARGETED_FIX_REQUIRED`;
35. all work is committed and pushed.

---

# 48. FINAL COMPLETION REPORT

Do not return another optimistic summary without evidence.

Only after completion report:

## Repository

- final SHA;
- branch;
- push status;
- working tree;
- `HEAD == origin/main` status.

## Database

- chosen ORM/query layer;
- PostgreSQL version/test environment;
- migration count;
- clean migration result;
- seed result;
- evidence app reads/writes DB.

## Auth / Security

- auth method;
- session implementation;
- verification/reset state;
- number of real security integration tests;
- exact IDOR/tampering/webhook/upload/SSRF/API-key cases tested.

## Product

- creator application workflow;
- admin approval;
- creator CRUD;
- member subscription;
- content entitlement;
- SaaS billing;
- migration;
- search;
- support/integrations.

## Financial

- Pricing Engine test count;
- matrix dimensions;
- fuzz/property sample count;
- immutable quote implementation;
- surplus result;
- shortfall result;
- reconciliation persistence;
- guarantee incident handling.

## Stripe

Clearly separate:

- actual Stripe code implemented;
- Stripe test-mode round trips actually executed;
- SDK mocked integration tests;
- external platform approval/configuration still unavailable.

Do not call an SDK dependency an integration.

## Patreon Migration

Report:

- parser implementation;
- fixture formats tested;
- validation cases;
- imported rows in E2E;
- invitation conversion E2E.

## Tests

Give actual counts for:

- unit;
- integration;
- security;
- database;
- E2E;
- pricing/financial;
- visual regression.

Report exact commands and whether they passed.

## Visual QA

- screenshots captured in this conversion pass;
- regressions found;
- regressions fixed.

## External blockers

List only genuine external/business/legal/production dependencies.

## Owner next action

Reference `docs/OWNER_NEXT_STEPS.md`.

There must be no unfinished internally solvable coding work disguised as an owner action.

---

# 49. FINAL EXECUTION COMMAND

START NOW.

AUDIT THE CURRENT REPOSITORY AGAINST THIS PROMPT.

RECLASSIFY FALSE OR WEAK `VERIFIED` STATES.

PRESERVE THE EXISTING DESIGN AND CORRECT FINANCIAL ENGINE.

CONVERT THE PROTOTYPE INTO A REAL POSTGRESQL-BACKED APPLICATION.

IMPLEMENT REAL AUTH, RBAC, ROUTES, SERVICES, PERSISTENCE, STRIPE PROVIDER BOUNDARY, WEBHOOKS, MEMBERSHIPS, PATREON MIGRATION, SEARCH AND SECURITY TESTS.

RUN REAL E2E AGAINST PERSISTED STATE.

FIX ALL INTERNALLY SOLVABLE FAILURES.

RUN TARGETED VISUAL REGRESSION QA.

UPDATE DOCUMENTATION HONESTLY.

COMMIT AND PUSH EVERYTHING.

DO NOT STOP OR WAIT FOR OWNER CONFIRMATION UNTIL THE COMPLETE REAL-APPLICATION V1 CONVERSION IS FINISHED.
