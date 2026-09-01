# ZEROFEE — 1 SEP FINAL RECURSIVE V1 COMPLETION MASTER EXECUTION PROMPT

**Prompt version:** 2026-09-01 FINAL  
**Status:** AUTHORITATIVE RECURSIVE EXECUTION ORCHESTRATOR FOR COMPLETE TESTABLE V1  
**Repository:** https://github.com/arsenijee19/zerofee  
**Audited `main` HEAD before this prompt was authored:** `f8c7cb522ec1dc0024564f3710957140fe9cc05e`  
**Last code-bearing audited baseline before Prompt 6 documentation-only commits:** `1ec2034d774659f575e5787406013a902e395ef3`

---

# 0. START EXECUTION NOW — DO NOT SUMMARIZE THIS PROMPT INSTEAD OF EXECUTING IT

Work directly from the CURRENT `main` branch of:

https://github.com/arsenijee19/zerofee

First fetch/sync and record the ACTUAL current HEAD. The SHAs above are historical audit evidence, not permission to reset or discard newer work.

This is the final V1 completion execution pass.

The desired output is not another architecture document, seeded prototype, backend-only service layer, screenshot demo, or partial implementation.

The desired output is:

> **A coherent, routed, authenticated, PostgreSQL-backed, server-authoritative, provider-authoritative, secure, polished ZeroFee V1 that the owner can run and test end-to-end in deterministic test/mock mode, with the real Stripe/provider production boundary implemented as far as current official provider capabilities permit.**

The pass is complete only when every internally solvable V1 requirement is implemented, tested, visually reviewed, documented, committed and pushed.

Do not stop because one phase is large.
Do not stop because one test fails.
Do not stop because an external provider credential is absent.
Do not ask whether to continue.
Do not return a progress report as if it were completion.
Do not leave TODO placeholders for internally solvable work.

The first normal stopping point is the final completion report after the recursive completion gate at the end of this file passes.

---

# 1. AUTHORITY ORDER — READ EVERYTHING COMPLETELY BEFORE MODIFYING THE PRODUCT

Read completely, in this order:

1. `prompts/README.md`
2. `prompts/1_INITIAL_PROTOTYPE_MASTER_EXECUTION_PROMPT.md`
3. `prompts/2_DESIGN_SYSTEM_AND_UX_MASTER_PROMPT.md`
4. `prompts/3_REAL_APPLICATION_CONVERSION_MASTER_PROMPT.md`
5. `prompts/4_PLATFORM_OPERATING_MODEL_AND_CONTENT_EXECUTION_PROMPT.md`
6. `prompts/5_COMPLETE_REMAINING_V1_BACKEND_EXECUTION_PROMPT.md`
7. `prompts/6_GUARANTEE_PRICING_MATRIX_AND_SELF_CORRECTING_RISK_ENGINE_PROMPT.md`
8. this file, `prompts/PROMPT_1SEP.md`
9. `PROJECT_CONTEXT.md`
10. every file under `/docs`
11. current migrations/schema/scripts
12. current source code
13. current unit/integration/security/E2E/visual/accessibility tests
14. current CI configuration
15. current environment/configuration files.

Do not skim the prompt chain.

## 1.1 Authority rules

Use the following conflict-resolution order:

- **Prompt 1** remains authoritative for the complete ZeroFee V1 product scope, core economic definitions, original lifecycle, country/tax/compliance architecture, acquisition, operations and acceptance intent.
- **Prompt 2** remains authoritative for visual language, interaction design, hierarchy, responsive behavior, accessibility presentation and screenshot QA. Preserve its Electric Blue-led premium light SaaS direction.
- **Prompt 3** remains authoritative for replacing the mock/client prototype with a real database-backed/authenticated/server-authoritative application.
- **Prompt 4** is newer and authoritative for ZeroFee as SaaS/hosting infrastructure, creator-as-seller intent where legally permitted, creator-owned Stripe relationship, Direct Charges, no internal ZeroFee creator wallet, separate ZeroFee SaaS billing, and YouTube-only video in V1.
- **Prompt 5** remains the broad backend/completeness orchestrator and evidence standard, but its previous completion claims are not evidence by themselves.
- **Prompt 6** is the newest authoritative financial-risk specification. It supersedes older shortfall behavior wherever necessary: a valid eligible Guaranteed Earnings shortfall creates a real immutable Guarantee Top-Up obligation/funding lifecycle AND immediate route correction/pause behavior. Creator surplus remains 100% creator-owned. Future price corrections may not be used to confiscate creator surplus to recover old top-ups.
- **This Prompt 1SEP** is authoritative for current-state audit truth, execution order, recursive/no-stop behavior, UI/browser completion, security hardening, edge cases, final proof requirements, and resolving duplicated requirements across Prompts 1–6.

When the same requirement appears several times, implement it ONCE at the strictest/current interpretation and prove it with the strongest required evidence.

Do not interpret duplicated text as permission to build duplicate services, routes, tables or providers.

---

# 2. CURRENT REPOSITORY FACTS — DO NOT TRUST OLD COMPLETION CLAIMS

The following facts were verified against `main` while this prompt was authored.

Re-audit them against the current HEAD before implementation because the repository may have changed after this file was created.

## 2.1 Work that exists and should generally be PRESERVED / COMPLETED, not thrown away

Current repository already contains meaningful backend foundation, including:

- a PostgreSQL migration foundation;
- DB query/transaction utilities;
- persisted domain tables from the Prompt 5 backend pass;
- authentication/session service primitives;
- password hashing and hashed session/token patterns;
- server policy/service code;
- pricing/quote/reconciliation code;
- creator application and related domain services;
- search/content/migration/integration service boundaries;
- deterministic mock provider concepts;
- a Stripe adapter boundary;
- a signed mock webhook boundary;
- existing Prompt 2 styling and substantial visual prototype work;
- unit/backend/security/pricing tests;
- Playwright visual/navigation tests;
- design and architecture documentation.

Preserve correct work.
Do not restart the repository.
Do not rewrite good financial math without a failing test or current provider evidence.
Do not throw away Prompt 2 merely because routing changes.

## 2.2 Critical current gaps already proven at audit time

At audited HEAD, the production browser is NOT yet a complete real application.

### A. Root product is still one client state machine

`components/zerofee-app.tsx` still contains a large `View` union and:

```ts
const [view, setView] = useState<View>("home")
```

It switches locally among marketing/signup/creator/member/admin/financial/support surfaces.

Buttons such as `Admin`, `Log in`, `Start as a creator`, sidebar items and many CTAs change local state rather than navigate real authenticated routes.

This means:

- meaningful URLs do not represent product state;
- deep linking is not real;
- refresh does not preserve the current product surface as a routed application;
- admin access is represented by a UI switch;
- many apparent workflows are demos rather than server mutations.

### B. Homepage is still the shell for the prototype

`app/page.tsx` simply loads runtime state and renders:

```tsx
<ZeroFeeApp initialState={await getRuntimeState()} />
```

The route tree does not yet contain the required real public/creator/member/admin page architecture.

### C. Runtime silently falls back to seed data

`lib/server/app-state.ts` currently has a broad failure pattern equivalent to:

```text
try database-backed state
catch any failure
return getSeedState()
```

This can make DB/runtime failure look like successful application behavior.

That must be impossible in normal development/test/production application modes.

Seed/demo state may exist only in an explicit isolated DEMO mode.

### D. Search UI remains static

The command palette currently assembles `searchResults` from `initialState` and its visible search input is not the authoritative query/filter boundary.

The server search endpoint/service may exist, but the actual browser productivity UX is not yet wired to it.

### E. Onboarding UI is not a real form workflow

Current signup/application/payment setup surfaces render summary rows such as mock email/application/KYC statements and advance with `setView`.

They are not equivalent to real browser forms invoking the real auth/application/provider services.

### F. Large parts of creator/admin/member UI are hardcoded presentation data

Examples at audit time include hardcoded earnings, balances, content rows, broadcast rows, API/webhook rows, creator identity and operational actions.

A real backend table does not make a page complete if the page does not read/mutate that data.

### G. Existing Stripe creator account architecture is not the approved final model

Current Stripe adapter creates:

```ts
type: "express"
```

and uses metadata to represent an “existing Stripe requested” concept.

This must be replaced/reconciled with CURRENT official Stripe Connect architecture and Prompt 4/6 operating model.

### H. Current recurring subscription method is not a recurring subscription

Current provider method named `createDirectChargeSubscription` creates a PaymentIntent and fabricates a subscription-like ID.

This is not acceptable.

Memberships must use a true recurring provider subscription lifecycle abstraction.

### I. Real Stripe webhook endpoint is missing

At audit time the app has `/api/webhooks/mock`, not the required real `/api/webhooks/stripe` boundary with official Stripe signature verification and Connect event context.

### J. Existing browser E2E is superficial

Current `tests/flows.spec.ts` contains a test literally named:

`creator to buyer to admin seeded journey is navigable`

and the checkout test does not actually complete a checkout/payment/webhook/membership lifecycle.

Screenshot navigation is not functional E2E.

### K. CI does not run Playwright

Current `.github/workflows/ci.yml` runs migrations, seed, typecheck, lint, unit tests and build, but not the real browser E2E suite.

Therefore browser behavior is not a release gate.

### L. Current docs overstate completion

`docs/EXECUTION_STATE.md` currently marks routes/browser/provider/lifecycle areas `VERIFIED` despite the current browser architecture above.

`docs/V1_ACCEPTANCE_MATRIX.md` also contains weak intermediate labels such as:

- `IMPLEMENTED_IN_SCHEMA_AND_UI`
- `IMPLEMENTED_BOUNDARY`
- `IMPLEMENTED_UI_WITH_PERSISTED_INPUTS`
- `VERIFIED_BOUNDARY`

These are not valid final V1 completion statuses for internally solvable functionality.

### M. Prompt 6 is documentation-only at audited HEAD

The two commits after `1ec2034...` only add/update Prompt 6 prompt-chain documentation.

Do not assume Prompt 6’s Guarantee Top-Up, self-correcting risk engine, grandfathering, current route matrix and reserve controls are implemented just because the specification exists.

## 2.3 Interrupted prior execution attempt

The owner supplied a log from a previous execution attempt that began modifying:

- runtime fallback;
- `/demo` separation;
- server actions;
- auth pages;
- creator routes;
- recurring-provider structures;
- Stripe webhook code;
- lifecycle tables/services;
- route UI components.

That run was interrupted mid-execution around creator content/financial/migration/API route work.

At the audited `main` HEAD those changes are NOT present as a completed pushed remediation pass.

Therefore:

> **Do not treat the interrupted log as implemented state. The current repository is authoritative.**

If equivalent code appears in a newer current HEAD, inspect it and preserve it if correct.
If it does not appear, implement it.

---

# 3. PRECISE FINAL GOAL

After this prompt is executed, the owner must be able to run ZeroFee in deterministic TEST mode and manually test the real product without editing code.

The complete journey must operate through real routes, real session identity, real PostgreSQL records and real provider-domain events:

visitor
→ marketing/pricing/how-it-works/migration/safety/legal
→ signup
→ email verification
→ login
→ creator country selection
→ creator application draft/save/submit
→ admin authenticates
→ admin reviews / needs-information / approve / reject
→ creator reloads and sees real result
→ creator payment-provider setup
→ existing/new Stripe path through current supported architecture or deterministic equivalent
→ account requirements/readiness persisted
→ creator ZeroFee SaaS plan state/entitlement in deterministic billing mode
→ creator profile
→ creator tier
→ monthly/annual
→ Simple Price or Guaranteed Earnings
→ payment context
→ provisional/final server quote
→ creator publishes
→ public creator page reads DB
→ fan account/session
→ fan selects tier
→ final recurring price displayed before confirmation
→ provider subscription created on correct creator connected-account context
→ signed provider event/webhook confirms payment
→ membership activates
→ page reload preserves state
→ paid content becomes server-authorized
→ renewal
→ failed renewal/dunning/recovery
→ cancellation at period end
→ resume
→ upgrade/downgrade/interval change
→ grandfathering/new price versions
→ refund/partial-refund architecture
→ dispute/reversal
→ reconciliation using authoritative provider actuals
→ Creator Earnings/Surplus/Guaranteed Top-Up where applicable
→ route correction/pause when guarantee model fails
→ provider balances/payout display
→ creator posts/courses/modules/lessons
→ images/files
→ YouTube-only V1 video
→ comments/reporting/moderation
→ Patreon CSV import/map/invite/convert
→ Discord/Telegram deterministic integration lifecycle
→ broadcasts/notifications
→ Creator API
→ outbound webhooks
→ scoped search
→ analytics from persisted data
→ creator export
→ support
→ admin operations/audit
→ mobile/desktop/accessibility/security verification.

## 3.1 Live-money exclusion for this pass

The product must be READY FOR TESTING without requiring the owner to make real production payments during this execution.

Therefore:

- deterministic Mock providers are mandatory and complete;
- Stripe test-mode integration should be usable when credentials exist;
- real production Stripe code/boundaries must be implemented;
- real live-money SaaS plan charging is NOT required to prove this pass;
- real live fan-money charging is NOT required to prove this pass;
- final commercial SaaS plan prices do not need to be paid live during testing;
- production provider approval, live keys and live-money validation may remain `BLOCKED_EXTERNAL`.

However, this exclusion does NOT permit fake billing architecture.

Plan selection, persisted platform subscription states, entitlements, recurring member subscription architecture, checkout, provider event processing and all lifecycle behavior must work deterministically in test/mock mode.

---

# 4. RECURSIVE NO-STOP EXECUTION CONTRACT

This is mandatory.

Use this loop continuously:

```text
AUDIT CURRENT STATE
→ choose first internally solvable incomplete acceptance requirement
→ implement smallest coherent production-quality slice
→ run targeted unit/integration/security/E2E checks
→ if failure: diagnose owning subsystem
→ targeted fix
→ rerun targeted checks
→ regression checks for affected dependencies
→ mark evidence in execution ledger
→ move to next incomplete requirement
→ after all requirements appear complete: run full clean regression
→ re-audit entire application against Prompts 1–6 + this prompt
→ if ANY internally solvable gap/regression/fake path remains: enter loop again
→ only stop when final completion gate passes.
```

Do NOT recursively restart the whole project.

Recursion means targeted self-correction until complete, not repeated redesign/re-scaffolding.

Do not ask:

- “Should I continue?”
- “Do you want me to wire the UI?”
- “Should I implement Stripe next?”
- “Should I fix the failing tests?”
- “Should I run E2E?”
- “Do you want security hardening?”

The answer to all of those is YES.

If execution context is interrupted later, `docs/EXECUTION_STATE.md` and `docs/V1_ACCEPTANCE_MATRIX.md` must allow the next execution to resume from the first actually unverified requirement without replaying completed work.

---

# 5. PHASE 0 — FORENSIC REPOSITORY AUDIT BEFORE CODE CHANGES

Before implementation:

1. sync `main`;
2. record branch, HEAD and `origin/main`;
3. verify working tree;
4. inspect commits since the audited SHAs above;
5. read Prompt 1–6 and this file completely;
6. inspect all routes/components/server services/providers/migrations/tests/CI/docs;
7. inspect all `TODO`, `FIXME`, `HACK`, placeholder, mock, seeded, hardcoded and demo code;
8. inspect every place that catches errors and substitutes successful fake data;
9. inspect every visible button/form/control and classify whether it performs a real operation;
10. inspect every feature shown in navigation and marketing and verify it has real domain behavior;
11. inspect all existing tests to determine whether they test real app boundaries or local helpers;
12. inspect all docs for optimistic/outdated claims.

Rewrite:

- `docs/REMAINING_V1_GAP_AUDIT.md`
- `docs/EXECUTION_STATE.md`

Use truthful implementation states during execution, but the final acceptance matrix may only contain:

- `VERIFIED`
- `BLOCKED_EXTERNAL`
- `OUT_OF_V1_SCOPE`

A material V1 feature may not finish under a weaker implementation status.

Do not stop after the audit.

---

# 6. PHASE 1 — DETAILED UI / UX AUDIT BEFORE IMPLEMENTATION

This phase happens BEFORE route refactoring so the approved visual system is preserved while broken interaction architecture is replaced.

Run the current app with the current deterministic data and inspect it at minimum at:

- 390px phone;
- small tablet;
- common laptop;
- large desktop.

Use actual browser screenshots and interactions, not only source inspection.

Create/update:

`docs/UI_UX_V1_COMPLETION_AUDIT.md`

Record every issue with:

- surface/route;
- severity;
- current behavior;
- expected behavior;
- implementation owner/subsystem;
- required acceptance test;
- desktop/mobile impact.

## 6.1 Preserve what is visually correct

Preserve Prompt 2 direction:

- premium light SaaS appearance;
- Electric Blue identity;
- cool near-white application background;
- white primary surfaces;
- deep ink/navy typography;
- restrained borders/shadows;
- Calistoga-compatible display use only on selected marketing headings;
- Inter/product sans for application/data/financial UI;
- tabular numeric treatment for money;
- semantic green/amber/red/blue status meaning;
- dark/inverted marketing proof sections only where purposeful;
- restrained gradients;
- coherent Lucide-style icons;
- creator/member/admin shells belonging to one product system;
- intentional mobile presentation;
- clear Financial Verification identity.

Do not perform a subjective visual reboot.

## 6.2 Current known UI/UX defects that MUST be rechecked and fixed

At audited HEAD:

- routing is a local state machine;
- URL does not reflect current application context;
- refresh/deep-link semantics are not real;
- `Admin` is a fake role switch;
- `Log in` is a fake view switch;
- creator signup/application is summary text rather than real forms;
- many table/action buttons have no real mutation;
- search input does not perform the real search query;
- hardcoded creator name/metrics/balance/content/integration values remain visible;
- current marketing component can retain the hero even when switching conceptual marketing pages rather than giving each route intentional page hierarchy;
- creator and admin navigation uses local callbacks rather than real links;
- real server pending/success/error/validation states are not consistently represented;
- mutation UX does not consistently protect against double-submit;
- unsaved-change handling is not established for editors/wizards;
- destructive actions are not consistently reasoned/confirmed;
- tables are demonstrative rather than real server-paginated/filterable operational views;
- provider “ready” / financial states can appear even when runtime is seed fallback;
- mobile nav is a demo sheet, not authenticated route-aware information architecture;
- search dialog accessibility/focus semantics need real verification;
- product error handling can become fake success because of runtime seed fallback.

## 6.3 Required UX behavior for every real form/mutation

Every important mutation must have:

- visible labels;
- field-level validation;
- server error summary where appropriate;
- pending state;
- double-submit prevention;
- success confirmation;
- failure recovery without losing valid input;
- clear disabled reason;
- correct focus management after error/success/dialog close;
- no success toast before server commit;
- no optimistic financial/auth/permission state that can lie;
- route/reload-safe final state;
- mobile keyboard/input mode where relevant.

## 6.4 Required page states

Every real data page must intentionally support:

- loading/skeleton;
- empty;
- populated;
- validation error;
- server error;
- unauthorized;
- forbidden;
- not found;
- archived/deleted;
- provider unavailable;
- provider action required;
- capability unsupported;
- pending provider confirmation;
- stale data / retry where relevant.

Never substitute seed success for an error state.

Do not stop after this UI/UX audit. Immediately proceed to implementation.

---

# 7. PHASE 2 — REAL ROUTE ARCHITECTURE AND APPLICATION SHELLS

Remove the production dependency on the `View`/`setView` application state machine.

Use real Next.js App Router routes/layouts/server boundaries.

Minimum route map:

## Public

- `/`
- `/pricing`
- `/how-it-works`
- `/migration`
- `/safety`
- `/faq`
- `/legal/terms`
- `/legal/privacy`
- `/legal/creator-terms`
- `/legal/acceptable-use`
- `/login`
- `/signup`
- `/verify-email`
- `/forgot-password`
- `/reset-password`
- `/c/[creatorSlug]`
- `/c/[creatorSlug]/posts/[postSlug]`
- `/c/[creatorSlug]/courses/[courseSlug]`
- `/c/[creatorSlug]/courses/[courseSlug]/lessons/[lessonSlug]`
- secure migration invitation route.

## Creator

- `/creator`
- `/creator/application`
- `/creator/payments`
- `/creator/tiers`
- `/creator/tiers/new`
- `/creator/tiers/[tierId]`
- `/creator/members`
- `/creator/members/[memberId]`
- `/creator/content`
- `/creator/posts/new`
- `/creator/posts/[postId]`
- `/creator/courses`
- `/creator/courses/new`
- `/creator/courses/[courseId]`
- `/creator/earnings`
- `/creator/financial-verification`
- `/creator/payouts`
- `/creator/tax`
- `/creator/migration`
- `/creator/integrations`
- `/creator/broadcasts`
- `/creator/api`
- `/creator/settings`
- `/creator/billing`
- `/creator/export`
- `/creator/support`

## Member

- `/member`
- `/member/memberships`
- `/member/memberships/[membershipId]`
- `/member/billing`
- `/member/support`
- `/member/account`

## Admin

- `/admin`
- `/admin/search`
- `/admin/users`
- `/admin/creators`
- `/admin/creators/[creatorId]`
- `/admin/applications`
- `/admin/applications/[applicationId]`
- `/admin/payments`
- `/admin/guarantee`
- `/admin/guarantee/top-ups`
- `/admin/guarantee/route-corrections`
- `/admin/pricing-catalog`
- `/admin/guarantee-profiles`
- `/admin/countries`
- `/admin/commerce-tax`
- `/admin/webhooks`
- `/admin/integrations`
- `/admin/support`
- `/admin/moderation`
- `/admin/audit`
- `/admin/plans`
- `/admin/usage`
- `/admin/settings`

Exact nesting may differ only when necessary for Next.js conventions, but all capabilities must have meaningful real URLs.

Requirements:

- browser refresh works;
- direct deep URL works;
- browser back/forward works;
- unauthorized deep URLs fail correctly;
- route state is not duplicated in React memory;
- navigation uses links/router semantics, not role-switch callbacks;
- no production Admin button turns a visitor into admin;
- layout data comes from session/DB;
- route loading/error/not-found boundaries are present where useful;
- canonical creator slugs are resolved safely.

Keep the old monolithic prototype only if useful under explicit `/demo` and only in DEMO mode. It must not be the production application path.

---

# 8. PHASE 3 — EXPLICIT RUNTIME MODES / REMOVE FAKE SUCCESS

Implement one explicit runtime-mode contract.

At minimum:

- `development`
- `test`
- `production`
- optional `demo`

Do not infer business behavior ambiguously from only `NODE_ENV`.

Rules:

- normal dev/test/prod DB failure returns controlled failure/readiness error;
- no dev/test/prod DB failure may fall back to seed success;
- demo seed state is available only when explicitly enabled;
- demo routes/mock controls must be unavailable or fail closed in production;
- test fixtures must not create a default production admin password;
- provider mock endpoints must be inaccessible in production unless explicitly intended and secured;
- production startup validates required secrets/config for enabled live capabilities;
- health/readiness reveals mode/status safely without leaking secrets.

Audit every `catch` that turns an exception into successful fake state.

---

# 9. PHASE 4 — AUTHENTICATION, ACCOUNT SECURITY, SESSION SECURITY, RBAC

Wire the existing auth primitives into real browser routes/forms and harden them.

## 9.1 Required user auth

- signup;
- normalized unique email;
- strong password hashing;
- email verification;
- login;
- logout;
- forgot password;
- reset password;
- reset token expiry/single use;
- verification token expiry/single use;
- server session;
- HttpOnly cookie;
- Secure in production;
- correct SameSite policy;
- explicit cookie path;
- session expiry;
- session invalidation;
- rotate/fixation-safe session on authentication and relevant privilege changes;
- password reset invalidates existing sessions;
- generic account-enumeration-resistant errors;
- auth rate limits;
- security events;
- deterministic test mailbox/email provider.

## 9.2 Admin/owner high-risk security

Admin can operate financial, moderation, pricing and provider controls.

Implement stronger protection than a normal member session:

- MFA architecture and real deterministic test flow;
- require MFA for admin/owner in production mode;
- support a current secure factor such as TOTP and/or WebAuthn/passkey where practical;
- recovery policy documented;
- step-up/recent-auth requirement for high-risk actions where practical;
- high-risk actions require reason where specified;
- admin session events audited;
- no hidden URL/role switch can bypass MFA/RBAC.

Do not build custom cryptography.

## 9.3 Authorization

Use server-side centralized policy checks.

Deny by default.

Prove:

- visitor cannot access private creator/member/admin routes;
- member cannot access creator/admin private operations;
- creator cannot access admin;
- Creator A cannot read/write Creator B resources;
- Member A cannot read Member B billing/account records;
- creator cannot self-approve application;
- creator cannot change another creator’s connected provider account;
- API/search/assets/export are tenant-safe;
- admin actions require admin role and, where required, step-up/reason;
- deleted/suspended creator state is respected everywhere.

Do not rely on UI hiding.

---

# 10. PHASE 5 — WEB APPLICATION SECURITY BASELINE

Perform a real security implementation pass, not only tests.

## 10.1 HTTP/browser security

Implement and verify appropriate production headers:

- Content-Security-Policy compatible with actual Stripe/YouTube usage;
- `frame-ancestors`/clickjacking protection appropriate to routes;
- HSTS in production HTTPS context;
- `X-Content-Type-Options: nosniff`;
- Referrer-Policy;
- Permissions-Policy where useful;
- no unsafe wildcard CORS for authenticated APIs;
- cache-control preventing sensitive auth/financial/private content caching.

## 10.2 Request security

Protect against:

- CSRF on cookie-authenticated mutations;
- unsafe cross-origin server actions;
- open redirects (`returnTo`, onboarding return, login redirect);
- mass assignment / request-body overposting;
- SQL injection;
- XSS/stored XSS;
- dangerous URL protocols;
- path traversal;
- header injection;
- query/resource exhaustion;
- abusive pagination limits;
- unsafe file names;
- unauthenticated internal error details.

Use strict server validation schemas at request boundaries.

## 10.3 Rate/abuse limiting

At minimum cover:

- login;
- signup;
- verification resend;
- password reset;
- migration invitation attempts;
- API keys;
- public forms/comments/reports;
- high-cost search/export endpoints;
- provider/mock event simulation endpoints outside normal test harness;
- outbound webhook test action.

Use deterministic testable limiter abstraction suitable for current architecture.

## 10.4 Secret/PII handling

- no secrets in browser bundles;
- no provider secrets/raw tokens in logs;
- integration OAuth/bot credentials encrypted or protected at rest as appropriate;
- API key plaintext shown once, hash stored;
- reset/session/migration tokens hashed where appropriate;
- raw card/PAN never stored;
- unnecessary KYC documents never stored;
- audit log redacts secrets/payment-sensitive payloads;
- error UI never dumps stack traces/provider payloads.

---

# 11. PHASE 6 — CREATOR APPLICATION / COUNTRY / COMPLIANCE / ADMIN REVIEW

Implement the real browser workflow from Prompt 1/3/5.

Creator:

1. verified session;
2. country/entity selection;
3. server checks CountryCapability;
4. application draft created;
5. fields are real editable inputs;
6. save draft;
7. submit;
8. immutable revision/history;
9. state persists after logout/reload;
10. needs-information response creates new revision;
11. approval/rejection result appears via persisted notification/state.

Admin:

- real review queue;
- filters/search/pagination;
- detail page;
- revision history;
- private notes;
- approve;
- needs information;
- reject;
- suspend post-approval;
- reason required where appropriate;
- concurrency-safe transition;
- notification;
- audit.

Country capability values are real DB configuration, not hardcoded UI.

Fail closed for production onboarding when legal/provider/tax readiness is unknown according to configured rules.

---

# 12. PHASE 7 — CURRENT STRIPE CONNECT ARCHITECTURE

Before changing Stripe code, read CURRENT official Stripe documentation only.

Do not rely on this prompt’s historical API assumptions if Stripe has changed.

Create/update:

`docs/STRIPE_CONNECT_IMPLEMENTATION_DECISION.md`

Document the exact current date, API/configuration chosen and official sources.

The required ZeroFee operating objective is:

> **Your Stripe. Your customers. Your money. Our software.**

Target behavior where current Stripe capabilities/approval allow:

- creator has the strongest practical direct Stripe relationship;
- creator can use their own Stripe credentials/dashboard where supported;
- existing Stripe creator uses the officially supported connect/reuse flow;
- new creator uses official hosted/embedded onboarding;
- Stripe collects KYC/legal/bank data where appropriate;
- direct charges on creator connected account;
- creator commerce funds remain provider-side;
- ZeroFee application fee = 0 hard invariant;
- ZeroFee processing markup = 0;
- ZeroFee payout markup = 0;
- creator controls/refers to Stripe for payouts/refunds/disputes where configuration permits;
- Stripe fees collected from connected account where supported/configured;
- loss responsibility configured to the intended supported provider/connected-account side where approved;
- full Stripe Dashboard where current configuration permits;
- ZeroFee owner/admin uses Connect platform/API visibility, never creator credential impersonation.

Do not retain legacy `type: "express"` merely because it is already in code if current Accounts v2/controller/configuration primitives are the correct implementation.

Do not fake existing-account connection with metadata.

Persist and synchronize:

- provider account ID;
- architecture/config version;
- account status;
- requirements due;
- charges enabled;
- payouts enabled;
- dashboard capability;
- relevant capabilities;
- restrictions;
- last sync;
- disabled/deauthorized state.

Handle account becoming restricted after previously being ready.

If connected account changes while active subscriptions exist, prevent unsafe silent switching and require an explicit supported migration/recovery path.

---

# 13. PHASE 8 — REAL RECURRING SUBSCRIPTIONS / DIRECT CHARGES / CHECKOUT

Replace the fake PaymentIntent-as-subscription architecture.

Provider abstraction must model:

- provider customer;
- recurring product/price or current Stripe equivalent;
- provider subscription;
- initial invoice/payment;
- recurring invoice/payment;
- billing period start/end;
- payment method context;
- renewal;
- payment failure;
- retry/recovery;
- cancellation at period end;
- cancellation;
- resume/reactivation;
- upgrade/downgrade;
- monthly/annual interval change;
- provider subscription ID;
- invoice IDs;
- payment IDs;
- refunds;
- disputes;
- balances/payout visibility.

Mock provider must model the same lifecycle deterministically.

Fan membership commerce uses the correct creator connected-account context.

Hard invariant:

```text
ZeroFee membership application fee = 0
```

The server must reject any attempt to make it non-zero.

Browser redirect/success page never activates a membership.

Only verified provider event/domain processing activates paid entitlement.

Prevent double-click/double-submit from creating duplicate provider subscriptions.

Define and enforce whether a member may have more than one active subscription to the same creator/tier. The default should prevent accidental duplicates.

---

# 14. PHASE 9 — REAL STRIPE WEBHOOK + PROVIDER EVENT ENGINE

Implement:

`/api/webhooks/stripe`

using current official Stripe SDK behavior.

Requirements:

- raw body;
- official signature verification;
- environment-specific webhook secret;
- Connect account context;
- persistent provider event record;
- globally unique provider event ID;
- idempotency;
- processing attempts;
- retry/replay;
- safe error state/dead state;
- audit visibility;
- correlation IDs;
- no duplicate membership/payment/earnings/reconciliation/refund/top-up/notification;
- correct creator binding.

Handle events required by the selected architecture for:

- connected account status/capability/requirements;
- subscription create/update/delete;
- invoices;
- successful/failed payments;
- payment method changes where relevant;
- refunds/full/partial;
- disputes open/update/won/lost;
- balance transaction/authoritative fee availability;
- payout state where surfaced;
- ZeroFee platform billing separately.

Use CURRENT official event names.

## 14.1 Event ordering / eventual consistency

Do not assume provider events arrive in business order.

Test and safely handle:

- duplicate events;
- late events;
- out-of-order subscription/payment events;
- reconciliation data arriving after payment activation;
- refund after cancellation;
- dispute after refund attempt;
- webhook retry after state has already advanced;
- wrong connected-account context;
- old event that must not regress a newer terminal state.

Use provider timestamps/object versions/current retrieval where appropriate rather than blindly applying arrival order.

---

# 15. PHASE 10 — ZEROFEE SAAS BILLING / ENTITLEMENTS / QUOTAS

ZeroFee SaaS billing remains completely separate from creator fan GMV.

Implement real persisted states with deterministic billing provider:

- NONE;
- TRIALING;
- ACTIVE;
- PAST_DUE;
- GRACE;
- SUSPENDED;
- CANCEL_AT_PERIOD_END;
- CANCELLED.

Plans/versions/quotas are admin-configurable.

Enforce entitlements server-side for:

- active member allowance;
- storage;
- broadcasts/email;
- API limits;
- integrations;
- analytics retention/features where applicable.

Do not delete creator data on lapse.

Define grace/read-only/suspended behavior explicitly.

For this pass, real production money charging for final commercial plan pricing is not required. Mock/test billing must fully exercise entitlement behavior.

---

# 16. PHASE 11 — PROMPT 6 GUARANTEE PRICING / GRANDFATHERING / TOP-UP / RISK ENGINE

Prompt 6 is mandatory and currently newer than the older shortfall handling.

Implement it completely.

## 16.1 Grandfathering

When creator changes price/target:

Default/recommended UI:

`Keep existing members at their current price`

Alternative:

`Move existing members to the new price`

Existing subscriptions must remain pinned to their immutable `TierPriceVersion` unless explicit migration is chosen.

New subscribers use the new price version.

Moving existing members must model:

- effective date;
- notice state;
- affected count;
- proration policy;
- provider update state;
- partial/batch failure;
- retry idempotency;
- audit history.

Never silently overwrite historical prices.

## 16.2 Current Stripe fee matrix

At execution time re-verify official Stripe pricing for target account geographies using official Stripe sources.

Do not preserve the September 1 fixture values if current official pricing differs.

Persist a versioned provider pricing matrix with:

- provider;
- connected account country;
- provider pricing contract/profile;
- card/payment country/region;
- payment method family;
- card class/product bucket;
- presentment currency;
- settlement currency;
- FX state;
- payments fee;
- recurring billing fee;
- tax-on-fee behavior if relevant;
- exact formula;
- safe upper bound;
- custom account override;
- source URL/reference;
- captured date;
- effective dates;
- verification confidence;
- latest observed actuals;
- guarantee-enabled state.

Priority:

1. verified account-specific contract;
2. verified exact standard rule for account geography;
3. verified safe upper bound;
4. no guarantee.

## 16.3 IP is preview-only

Never authorize Guaranteed Earnings from IP geolocation.

Stage A provisional price may use IP as preview metadata.

Stage B final pre-payment quote uses the strongest Stripe/payment-method context available before confirmation, including card/payment country where available.

If exact fee class is not knowable, use verified safe upper bound or disable guarantee.

The buyer sees the exact final recurring price BEFORE confirming payment.

## 16.4 Explicit GuaranteeRouteKey

Persist explicit dimensions rather than ambiguous `country`:

- provider;
- provider pricing contract/profile;
- creator account country;
- creator legal country where distinct;
- creator settlement currency;
- buyer IP country preview;
- buyer billing/tax country;
- payment instrument/card country;
- issuer region;
- payment method family;
- card class/product;
- presentment currency;
- settlement currency;
- FX yes/no/unknown;
- recurring billing pricing profile;
- tax profile/version;
- pricing rule version;
- guarantee eligibility version;
- quote engine version.

## 16.5 Guarantee Top-Up

Create a real immutable `GuaranteeTopUp` ledger/domain.

A valid covered shortfall creates exactly one obligation.

Persist at minimum:

- creator;
- payment;
- reconciliation;
- provider payment/balance reference;
- quote;
- rule/profile versions;
- target;
- actual pre-top-up proceeds;
- shortfall;
- top-up amount;
- currency;
- reason;
- status;
- funding/transfer references;
- idempotency key;
- timestamps;
- reversal/compensation records;
- audit metadata.

States should cover:

- PENDING;
- FUNDED;
- TRANSFER_PENDING;
- TRANSFERRED;
- FAILED;
- REVERSED.

Database uniqueness/transactions must guarantee one active top-up obligation per reconciliation and safe concurrent webhook processing.

## 16.6 GuaranteeFundingProvider

Implement:

- deterministic mock funding provider;
- real Stripe-capable boundary as far as current Connect architecture supports;
- funding availability/reserve check;
- idempotent initiate/retry/query/reconcile;
- correct creator destination binding.

If live funding transfer requires external Stripe approval/config, only that remote transfer is `BLOCKED_EXTERNAL`. The obligation, state machine and mock E2E are still mandatory.

## 16.7 Self-correcting route engine

Every valid shortfall automatically triggers route analysis.

If authoritative data identifies a deterministic missing fee component:

- create a NEW pricing rule version;
- never rewrite history;
- apply narrowly to affected route/account profile;
- add minimal safe rounding margin only as necessary;
- rerun pricing property tests;
- enable corrected rule according to configured policy.

If residual is unexplained:

- pause Guaranteed Earnings for the exact unsafe route/profile;
- keep Simple Price available where safe;
- create admin incident;
- require verification before re-enable.

Do not let one account-specific anomaly globally raise every creator’s price.

## 16.8 Creator surplus remains creator-owned

Future price correction only prevents future guarantee losses.

It may NEVER capture future creator surplus to reimburse ZeroFee for historical top-ups.

Top-ups are separate ZeroFee guarantee/risk operating cost, funded/accounted through the guarantee reserve/business model, not a hidden transaction fee.

## 16.9 Reserve / circuit breakers

Admin telemetry:

- top-ups today/MTD;
- top-up count/average/largest;
- creators/routes affected;
- repeat shortfall rate;
- guarantee cost relative to SaaS revenue;
- reserve available;
- pending obligations;
- failed funding transfers.

Circuit breakers:

- max auto top-up/payment;
- max shortfall percentage;
- route rolling loss limit;
- daily exposure;
- monthly exposure;
- repeat shortfall threshold;
- reserve-low threshold.

Circuit breakers stop NEW guarantees, but never erase an already-earned valid obligation.

## 16.10 Refund/dispute after top-up

Define append-only compensation treatment for:

- full refund after top-up;
- multiple partial refunds;
- refund amount validation;
- dispute after top-up;
- dispute won/lost;
- reversal;
- refund/dispute races.

Never delete history.
Never create a second guarantee for the same original payment.

---

# 17. PHASE 12 — CREATOR TIERS / QUOTES / PUBLIC OFFER

Real creator tier CRUD:

- create;
- edit metadata;
- monthly/annual;
- Guaranteed Earnings / Simple Price;
- target or buyer price;
- benefits;
- trial/coupon eligibility;
- content mapping;
- preview;
- publish;
- unpublish/archive;
- immutable price versions;
- grandfathering;
- safe current version selection.

Quote creation is server-authoritative.

Immutable quote must include all context/version snapshots required to reproduce why the exact price was selected.

Reject:

- client-supplied calculated retail;
- client-supplied provider fee;
- stale/expired quote;
- wrong creator/tier;
- used quote where single-use semantics apply;
- paused/ineligible guarantee profile;
- connected-account mismatch;
- target/price version changed incompatibly since quote.

Double-click/retry must not create duplicate subscriptions or charge attempts.

---

# 18. PHASE 13 — MEMBERSHIP LIFECYCLE DEPTH

Implement and persist actual behavior for:

- PENDING_QUOTE;
- QUOTE_ACCEPTED;
- PENDING_PAYMENT;
- TRIALING;
- ACTIVE;
- PAST_DUE;
- GRACE;
- REPRICE_REQUIRED;
- PAUSED where provider permits;
- CANCEL_AT_PERIOD_END;
- CANCELLED;
- EXPIRED;
- REVOKED;
- REFUNDED where applicable.

Required actions:

- initial subscription;
- successful renewal;
- failed renewal;
- provider retry;
- recovery;
- exhausted recovery;
- cancel at period end;
- resume before end;
- immediate cancel if supported/policy permits;
- rejoin after cancellation;
- upgrade;
- downgrade;
- monthly↔annual;
- proration preview/policy;
- payment method change;
- guarantee route reclassification;
- repricing-required;
- buyer acknowledgement when price must legally/provider-validly change.

Provider retry/dunning remains provider-driven where appropriate; do not invent fake retry scheduling inconsistent with Stripe.

Persist MembershipEvents and immutable change history.

---

# 19. PHASE 14 — RECONCILIATION / EARNINGS / REFUNDS / DISPUTES / PAYOUTS

Use provider-authoritative actual economic data after payment where provider exposes it.

For Stripe, retrieve/map current authoritative Balance Transaction or equivalent.

Do not label predicted fee as actual.

Persist:

- gross;
- tax;
- predicted provider cost;
- actual provider cost;
- provider net;
- target;
- pre-top-up creator proceeds;
- surplus;
- shortfall;
- top-up if any;
- final guaranteed earnings where applicable;
- ZeroFee fee = 0;
- provider IDs;
- quote/rule/profile versions;
- reconciliation state.

Creator Earnings ledger is append-oriented.

Refund/dispute/reversal creates adjustment records rather than destructive rewriting.

Creator refund UI must:

- verify creator ownership;
- validate refundable remaining amount;
- support full and partial architecture where provider supports;
- require idempotency;
- show pending/provider-confirmed state;
- reflect entitlement policy.

Payout UI must use provider balance abstraction:

- available;
- pending;
- next payout;
- payout history/status;
- provider fee;
- ZeroFee payout fee 0;
- amount sent vs amount landed distinction;
- Verify/manage in Stripe where supported.

No ZeroFee internal creator wallet.

---

# 20. PHASE 15 — REAL CONTENT / COURSES / MEDIA / YOUTUBE

Wire real database/storage into UI.

## Posts

- create;
- edit;
- autosave or explicit reliable draft save;
- draft;
- preview;
- publish/unpublish;
- archive;
- public/all-paid/tier visibility;
- attachments;
- safe rich text;
- comments configuration where retained.

## Courses

- create course;
- modules/sections;
- lessons;
- reorder;
- text;
- image;
- file;
- YouTube URL;
- tier access;
- public preview;
- publish/unpublish/archive;
- progress where V1 includes it.

## YouTube-only V1

Do not implement native video hosting/transcoding/streaming.

Validate supported YouTube host/URL forms server-side, normalize video ID, reject arbitrary iframe/HTML/XSS/non-YouTube protocols, and render the official embed only after entitlement for paid content.

Respect private/unavailable/embedding-disabled/age/geo/copyright restrictions.
Do not proxy or restream.
YouTube embed is not DRM.

## Media/file security

Implement real `MediaStorageProvider` flow:

- deterministic local/test adapter;
- production S3/R2-compatible boundary;
- authenticated creator upload;
- generated safe keys;
- ownership;
- quotas;
- size limits;
- extension + MIME + file-content/magic-byte validation where practical;
- reject/sanitize dangerous SVG/HTML-like active content rather than serving executable user content inline;
- safe `Content-Disposition`/content type for downloads;
- no path traversal;
- private paid file requires entitlement before signed/short-lived access;
- deletion/archive lifecycle;
- cross-creator access denied;
- scanning/quarantine hook documented if production malware scanning is external.

Never expose paid body/file/YouTube ID to unauthorized browser payload and merely hide it with CSS.

---

# 21. PHASE 16 — COMMENTS / REPORTING / MODERATION / SAFETY

Implement real persisted safety operations:

- content report;
- creator report;
- copyright/takedown;
- fraud/scam;
- prohibited content;
- internal notes;
- admin queue;
- status lifecycle;
- unpublish;
- suspend creator;
- restore;
- appeal/review architecture;
- creator notice;
- immutable audit.

Comment actions where V1 keeps comments:

- authenticated create;
- creator enable/disable;
- delete own;
- creator moderation according to policy;
- abuse/rate limits;
- admin moderation.

Do not claim legal compliance without external review.

---

# 22. PHASE 17 — PATREON MIGRATION REAL END-TO-END

Browser workflow:

Upload CSV
→ secure validation
→ parse
→ field preview
→ invalid/duplicate reporting
→ field mapping
→ Patreon tier mapping
→ monthly/annual mapping
→ grandfather/new pricing choice
→ import
→ project/campaign
→ invitations
→ secure token
→ fan opens link
→ account/login
→ correct creator/tier shown
→ fan authorizes a NEW subscription
→ conversion recorded
→ funnel dashboard updates.

Security/edge cases:

- oversized file;
- malformed encoding;
- malformed CSV;
- formula injection;
- duplicate row;
- duplicate import request;
- existing member collision;
- same email across different creators handled tenant-safely;
- token hash/expiry/single-use;
- token replay;
- wrong creator/tier tampering;
- signed-in user different from intended invitation where policy requires validation;
- expired invite;
- converted invite cannot convert twice;
- import retry idempotent;
- no claim that payment credentials migrated.

Large imports should be batched and progress/error state persisted.

---

# 23. PHASE 18 — DISCORD / TELEGRAM / API / OUTBOUND WEBHOOKS / BROADCASTS

Implement explicit provider domains, not generic green cards.

## Discord

- OAuth/bot architecture;
- state/PKCE where current flow requires;
- token secret protection;
- guild selection;
- tier→role mapping;
- member identity linking;
- active membership grants role;
- cancel/expire/refund/revoke removes according to policy;
- retries;
- resync;
- stale mapping handling;
- identity-link hijack/replay protection;
- deterministic mock E2E.

## Telegram

Equivalent safe provider architecture:

- creator bot/community connection;
- chat/community mapping;
- member identity/linking;
- invite/access lifecycle;
- revoke/expire;
- retries/audit;
- deterministic mock.

## Creator API keys

- high entropy;
- server-generated;
- one-time plaintext;
- stored hash;
- key ID/prefix for lookup;
- scopes;
- creator ownership;
- rotation;
- revoke;
- last used;
- rate limit/quota;
- audit;
- cross-creator denial.

## Outbound webhooks

- HTTPS only;
- HMAC signing;
- secret rotation;
- timestamp/replay-safe signature design;
- persisted deliveries;
- bounded retries/backoff;
- disable policy;
- creator isolation;
- deterministic test dispatcher.

SSRF must defend against:

- localhost;
- `127/8`;
- RFC1918;
- link-local;
- metadata/internal targets;
- IPv6 loopback/private/link-local;
- alternate IP notations where parser permits;
- userinfo confusion;
- unsupported schemes;
- DNS resolving to private/internal address;
- DNS rebinding strategy as practical;
- redirects to forbidden targets;
- every redirect hop revalidated.

## Broadcasts

- persist campaign;
- audience: all active/tier/recovery/migration where legally permitted;
- recipient preview/count;
- quota;
- in-app delivery;
- deterministic email provider;
- delivery/error log;
- unsubscribe/compliance architecture;
- idempotent retry;
- no duplicate sends from worker retry.

---

# 24. PHASE 19 — SEARCH / ANALYTICS / EXPORT / NOTIFICATIONS / SUPPORT

## Search

Wire `Cmd/Ctrl+K` to a real server query.

The input must actually filter/search.

Creator can only search own authorized records.
Admin can search platform-authorized records.

Support:

- query debounce/cancel stale requests;
- keyboard navigation;
- result grouping;
- exact ID/reference search;
- pagination/limits;
- no secret/provider payload leakage;
- no cross-tenant count leakage.

## Analytics

Remove decorative/hardcoded metrics.

Creator metrics derive from DB/event truth:

- active/new/churned members;
- Creator Earnings;
- surplus;
- failed/recovered payments;
- MRR definition;
- tier mix;
- migration funnel.

Admin metrics:

- ZeroFee SaaS MRR;
- active creators;
- creator GMV SEPARATE;
- membership count;
- guarantee health/top-ups;
- webhook failures;
- support/moderation;
- provider readiness.

Do not sum unlike currencies without explicit normalized/reporting treatment.
Define timezone/date boundaries for period metrics.

## Export

Creator export must stream/handle realistic volume and include only authorized data.
Protect CSV formula injection.
Exclude secrets/raw payment data/admin notes/other tenants.

## Notifications

Persist and render:

- verification;
- reset;
- application status;
- provider/KYC action;
- membership start;
- failed payment;
- recovery;
- repricing;
- migration;
- support;
- guarantee incident/top-up as role-appropriate.

## Support

Real ticket/message/status/escalation flow with role-safe visibility and history.

---

# 25. PHASE 20 — ADMIN OPERATIONS COMPLETENESS

Admin must be able to actually operate V1 without direct SQL.

Required real operational surfaces:

- users;
- creators;
- applications;
- creator suspension/reactivation;
- ZeroFee plans/versions;
- usage/entitlements;
- provider account readiness;
- payments/reconciliation;
- Guarantee Health;
- Guarantee Top-Ups;
- Route Corrections;
- Pricing Catalog;
- Guarantee Eligibility Profiles;
- Countries;
- Commerce/Tax Responsibility Profiles;
- webhook events/replay;
- integrations health;
- support;
- moderation;
- notifications;
- feature flags/settings;
- audit.

High-risk operations require:

- server authorization;
- reason;
- confirmation UI;
- audit;
- idempotency/concurrency safety;
- step-up/recent authentication where appropriate.

Admin may not directly edit immutable historical financial amounts.
Use compensating/versioned actions.

---

# 26. PHASE 21 — RELIABILITY / CONCURRENCY / DATA INTEGRITY

Use PostgreSQL constraints/transactions/locking as appropriate.

Test and fix:

- duplicate quote acceptance;
- two checkout requests from double click;
- duplicate/concurrent webhook;
- out-of-order webhook;
- duplicate membership activation;
- duplicate renewal;
- repeated refund;
- multiple partial-refund total exceeding paid amount;
- dispute/refund race;
- top-up duplicate/concurrency;
- top-up retry;
- route correction concurrency;
- reserve circuit breaker racing quote generation;
- creator application double review;
- stale admin tab changing old state;
- tier price version published concurrently;
- coupon redemption cap race;
- trial abuse key constraints;
- API key revoke vs request;
- outbound webhook worker retry;
- migration duplicate import;
- invitation reuse;
- analytics/event duplication.

Add optimistic concurrency/version checks where a stale browser edit could silently overwrite newer business-critical state.

Historical quote/pricing/reconciliation/top-up records must never change when a later rule/version changes.

---

# 27. PHASE 22 — PRODUCTION ENVIRONMENT SAFETY / OBSERVABILITY / OPERATIONS

Implement:

- schema-validated `.env` configuration;
- `.env.example` complete but secret-free;
- explicit provider modes;
- safe prod startup;
- structured logging;
- request/correlation IDs;
- provider event IDs;
- reconciliation/top-up IDs;
- secret/PII redaction;
- health endpoint;
- readiness endpoint that fails on DB/runtime dependency failure;
- operational webhook failure visibility;
- bounded job retry state;
- pagination/query limits;
- indexes for major operational queries;
- N+1 avoidance;
- DB migration locking/safe deployment behavior where needed;
- backup/restore runbook;
- deterministic database backup/restore drill in a test environment if practical;
- no committed credentials;
- CI secret scanning/basic repository secret check;
- production admin bootstrap without static default password.

PWA rules:

- manifest/installability where retained;
- no service worker cache of private paid/auth/financial data;
- no stale entitlement/payment state offline.

---

# 28. PHASE 23 — COMPLETE SECURITY TEST MATRIX AGAINST REAL BOUNDARIES

Tests must attack real routes/actions/services/DB/provider event boundaries.

Pure helper tests may remain, but they do not satisfy these requirements alone.

## Authentication/session

- invalid login;
- user enumeration resistance;
- expired verification;
- used verification;
- expired reset;
- used reset;
- session invalidation;
- password reset session invalidation;
- unauthenticated protected route;
- session fixation/rotation behavior;
- MFA/admin enforcement;
- rate limit behavior;
- CSRF/origin rejection.

## RBAC/IDOR

- Creator A cannot read/write Creator B profile/tier/content/member/payment/migration/integration/assets/export;
- Member A cannot read Member B account/billing;
- creator cannot approve own application;
- creator/member cannot call admin mutations;
- suspended/deleted actor loses forbidden capability;
- search does not leak tenant metadata.

## Financial tampering

- retail price tampering;
- creator target tampering after quote;
- provider fee tampering;
- application fee non-zero attempt;
- quote creator/tier mismatch;
- expired quote;
- stale quote;
- quote double use;
- connected-account swap;
- wrong currency;
- wrong price version;
- payout/refund wrong creator;
- top-up amount client submission ignored/rejected;
- creator cannot self-trigger arbitrary top-up;
- admin cannot rewrite historical top-up.

## Provider/webhook

- invalid Stripe/mock signature;
- replay;
- duplicate;
- concurrent duplicate;
- wrong connected account;
- out-of-order event;
- old event cannot regress state;
- forged provider fee rejected;
- repeated refund/dispute idempotent.

## Content/upload

- locked content direct URL;
- private asset direct URL;
- cross-creator asset;
- path traversal;
- MIME spoof;
- oversized file;
- active SVG/HTML upload;
- stored XSS;
- dangerous URL protocol;
- arbitrary iframe;
- YouTube parser injection.

## Migration/export

- oversized CSV;
- malformed CSV;
- duplicate import;
- formula injection;
- invitation expiry;
- replay;
- wrong creator/tier;
- converted token reuse.

## SSRF/outbound webhook

Cover all private/loopback/link-local/IPv6/DNS/redirect parsing cases listed earlier.

## API/integration secrets

- revoked key;
- wrong scope;
- cross-tenant key;
- OAuth state/PKCE;
- integration identity-link replay;
- secret/token redaction in logs/errors/browser.

## Web platform

- CSP/headers present in production-mode tests where feasible;
- open redirect blocked;
- mass assignment rejected;
- sensitive pages non-cacheable.

No known critical/high internally solvable security issue may remain at completion.

---

# 29. PHASE 24 — REAL PLAYWRIGHT FUNCTIONAL E2E

Use an isolated/resettable PostgreSQL test database and deterministic providers.

These must create/change/reload real persisted state.

At minimum automate:

1. Visitor marketing navigation through real URLs.
2. Signup.
3. Email verification through test mailbox.
4. Login/logout.
5. Password reset.
6. Creator country eligibility.
7. Creator application draft/save/reload.
8. Creator application submit.
9. Admin login + MFA/test factor.
10. Admin needs-information.
11. Creator resubmission revision.
12. Admin approval.
13. Creator payment-provider onboarding mock.
14. Provider requirements due → ready.
15. Creator ZeroFee SaaS mock activation.
16. SaaS past due → grace → suspend → recover.
17. Creator profile edit/publish/reload.
18. Simple Price tier create/publish.
19. Guaranteed Earnings tier create/publish.
20. Grandfathering old price version.
21. Explicit migration of existing members to new price version.
22. Public creator page DB data.
23. Fan signup/login.
24. Provisional payment route preview.
25. Final payment-method-aware guaranteed quote.
26. Ineligible guarantee route falls back/blocks safely.
27. Real mock recurring checkout.
28. Signed provider webhook activation.
29. Membership persists after reload.
30. Duplicate checkout does not duplicate subscription.
31. Paid post denied before entitlement.
32. Paid post available after entitlement.
33. Wrong tier remains locked.
34. Cross-creator membership remains locked.
35. Course/module/lesson creation.
36. YouTube lesson validation/render after entitlement.
37. Image/file upload/access.
38. Private file direct URL denial.
39. Renewal success.
40. Renewal failure/past due.
41. Dunning recovery.
42. Dunning exhaustion/expiry.
43. Cancel at period end.
44. Resume.
45. Upgrade/downgrade.
46. Monthly↔annual change.
47. Reprice required.
48. Exact reconciliation.
49. Creator surplus reconciliation.
50. Guarantee shortfall.
51. Exactly-one Guarantee Top-Up.
52. Top-up funding mock lifecycle.
53. Known shortfall route auto-correction.
54. Unknown anomaly route pause.
55. Next corrected route avoids same known shortfall.
56. Reserve circuit breaker blocks new guarantees but preserves old obligation.
57. Full refund.
58. Partial refund.
59. Dispute opened/won/lost.
60. Refund/dispute after top-up compensation history.
61. Provider balances/payout screen.
62. Patreon CSV upload/preview/map/import.
63. Migration invitation.
64. Migration member conversion.
65. Creator scoped search.
66. Admin global search.
67. API key create/use/revoke.
68. Outbound webhook configure/HMAC/test/retry/SSRF rejection.
69. Discord grant/revoke deterministic integration.
70. Telegram access lifecycle deterministic integration.
71. Broadcast/test-email delivery.
72. Creator analytics based on records created in test.
73. Creator export with own data only.
74. Support ticket lifecycle.
75. Content report/moderation/unpublish/restore.
76. Admin pricing catalog versioning.
77. Admin country/commerce profile versioning.
78. Admin webhook replay.
79. Admin audit entry verification.
80. Mobile creator critical journey.
81. Mobile member checkout/content journey.
82. Mobile admin critical operational journey.

Do not inflate count by screenshot captures.

If combining closely related assertions into fewer test files is more reliable, that is acceptable only if every journey above is actually exercised and reported individually in the acceptance evidence.

---

# 30. PHASE 25 — ACCESSIBILITY / RESPONSIVE / CROSS-BROWSER QA

Prompt 2 acceptance still applies.

Run automated accessibility checks on representative real routed pages.

Manually verify keyboard workflows for:

- navigation;
- auth;
- command palette;
- dialogs/sheets;
- forms;
- tier builder;
- checkout;
- tables/actions;
- moderation/admin high-risk confirmations.

Verify:

- visible focus;
- semantic heading hierarchy;
- accessible names;
- associated validation messages;
- dialog focus trap/restore;
- no color-only status;
- AA contrast fundamentals;
- reduced motion;
- 200% zoom practical usability;
- touch targets;
- no common mobile horizontal overflow;
- financial tables have a deliberate mobile alternative;
- 390px phone layout;
- tablet;
- laptop;
- large desktop.

Run functional smoke in Chromium and at least targeted WebKit/Firefox paths where environment supports them, especially login/checkout/content.

---

# 31. PHASE 26 — TARGETED VISUAL QA AFTER REAL WIRING

After the real app is functional, capture screenshots from the REAL routed/database-backed app.

Do not reuse old screenshots as evidence.

At minimum capture and inspect:

## Marketing

- homepage desktop/mobile;
- pricing;
- how it works;
- migration;
- safety/FAQ;
- final CTA/footer.

## Auth/onboarding

- signup;
- login;
- verification;
- reset;
- country/application;
- needs information;
- approved/provider setup.

## Creator

- overview desktop/mobile;
- tier builder;
- grandfathering dialog/workflow;
- members;
- content;
- course builder;
- earnings;
- financial verification including top-up;
- payouts;
- migration wizard/dashboard;
- integrations;
- broadcasts;
- API/webhooks;
- billing;
- settings/support/export.

## Member

- public creator desktop/mobile;
- final checkout desktop/mobile;
- member dashboard;
- locked/unlocked post;
- locked/unlocked lesson;
- past-due/reprice/cancel state.

## Admin

- overview;
- application review;
- creator detail;
- Guarantee Health;
- top-ups;
- route corrections;
- pricing matrix;
- guarantee profiles;
- countries;
- commerce/tax;
- webhook inspector;
- support/moderation;
- audit.

Inspect for:

- visual hierarchy;
- Electric Blue consistency;
- typography;
- spacing;
- responsive density;
- focus/hover/error states;
- financial labeling;
- CTA priority;
- table usability;
- overflow;
- stale/hardcoded/demo data;
- fake provider UI;
- unnecessary cards/pills/gradients;
- inconsistent status colors;
- inaccessible contrast;
- layout shift;
- destructive action clarity.

Perform targeted fixes, then recapture changed surfaces.

Do not enter an endless subjective redesign loop.

---

# 32. PHASE 27 — CI MUST PROVE THE REAL PRODUCT

Update GitHub Actions.

CI must include PostgreSQL and run at minimum:

1. locked clean install using repository’s declared package manager consistently;
2. migration from empty DB;
3. deterministic seed/test setup;
4. migration/schema validation;
5. typecheck;
6. lint;
7. unit/domain tests;
8. database integration tests;
9. provider tests;
10. security tests;
11. financial pricing/property matrix;
12. concurrency/idempotency tests;
13. build;
14. Playwright browser install/setup;
15. real functional Playwright E2E;
16. accessibility smoke;
17. production-mode configuration/security-header smoke where practical.

CI must not require live Stripe credentials.

Optional live/test Stripe remote integration belongs in a separate credentialed job.

Use least-privilege GitHub workflow permissions.
Do not print secrets.

A green build without Playwright is not sufficient.

---

# 33. PHASE 28 — CLEAN INSTALL / RELEASE REHEARSAL

Before declaring completion:

1. fresh checkout/worktree or equivalent clean validation;
2. install from lockfile;
3. clean PostgreSQL database;
4. apply migrations from zero;
5. seed test data;
6. run all verification categories;
7. build production app;
8. start built app;
9. smoke real routed pages;
10. verify no normal route silently uses seed fallback;
11. verify `/demo`/mock-only production isolation;
12. verify no committed secrets;
13. verify DB migration deterministic/re-runnable as designed;
14. verify clean tree before final commit/push.

If deterministic failure occurs:

`diagnose → targeted fix → relevant tests → release regression again`.

Do not merely document the failure.

---

# 34. PHASE 29 — DOCUMENTATION MUST MATCH REALITY

Update/create at minimum:

- `README.md`
- `PROJECT_CONTEXT.md`
- `docs/EXECUTION_STATE.md`
- `docs/REMAINING_V1_GAP_AUDIT.md`
- `docs/V1_ACCEPTANCE_MATRIX.md`
- `docs/ARCHITECTURE.md`
- `docs/UI_UX_V1_COMPLETION_AUDIT.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/DESIGN_QA.md`
- `docs/VISUAL_QA.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/STRIPE_CONNECT_IMPLEMENTATION_DECISION.md`
- `docs/STRIPE_FEE_MATRIX.md`
- `docs/GUARANTEED_EARNINGS_MODEL.md`
- `docs/GUARANTEE_TOPUP_AND_RISK_ENGINE.md`
- `docs/PRICING_ENGINE.md`
- `docs/PROVIDER_PRICING_CATALOG.md`
- `docs/PAYOUTS_AND_BALANCES.md`
- `docs/STRIPE_APPROVAL_READINESS.md`
- `docs/COUNTRY_AND_CURRENCY_STRATEGY.md`
- `docs/PLATFORM_OPERATING_MODEL.md`
- `docs/MERCHANT_AND_TAX_RESPONSIBILITY.md`
- `docs/TAX_ARCHITECTURE.md`
- `docs/CONTENT_ARCHITECTURE.md`
- `docs/MIGRATION_ARCHITECTURE.md`
- `docs/INTEGRATIONS.md`
- `docs/API.md`
- `docs/SEARCH_AND_INFORMATION_ARCHITECTURE.md`
- `docs/SECURITY.md`
- `docs/LEGAL_AND_COMPLIANCE_OPEN_ITEMS.md`
- `docs/UNIT_ECONOMICS.md`
- `docs/PROTOTYPE_LIMITATIONS.md`
- `docs/OWNER_NEXT_STEPS.md`.

Final `V1_ACCEPTANCE_MATRIX.md` states are ONLY:

- `VERIFIED`
- `BLOCKED_EXTERNAL`
- `OUT_OF_V1_SCOPE`.

Every `VERIFIED` row must link to:

- implementation route/service;
- DB entity if relevant;
- test evidence;
- E2E journey if relevant;
- screenshot/QA evidence if visual.

Do not mark a capability `VERIFIED` because:

- a TypeScript interface exists;
- a table exists;
- a screen exists;
- a screenshot exists;
- SDK dependency exists;
- deterministic seed shows it;
- helper test passes.

`docs/OWNER_NEXT_STEPS.md` may contain only external/business/legal/production owner work after completion, not internal coding the agent could still perform.

---

# 35. EXTERNAL BLOCKER RULE — VERY STRICT

Acceptable `BLOCKED_EXTERNAL` examples:

- production Stripe platform approval;
- content-platform approval;
- live Connect configuration controlled by provider/dashboard;
- production Stripe keys/secrets;
- live webhook registration;
- provider responsibility/loss settings requiring approval;
- live guarantee funding transfer approval/configuration;
- current live account-specific pricing contract confirmation;
- legal review of seller/tax/guarantee wording;
- tax registrations/advisor signoff;
- production SMTP/storage/Discord/Telegram credentials;
- production domain/DNS/CDN/WAF/hosting accounts;
- live-money closed beta;
- external penetration test/legal audit.

These are NOT `BLOCKED_EXTERNAL`:

- missing route;
- missing form;
- missing DB mutation;
- missing session wiring;
- missing lifecycle;
- missing provider adapter code;
- missing deterministic mock;
- missing Stripe webhook code;
- missing idempotency;
- missing Top-Up ledger;
- missing route correction;
- missing migration UI;
- missing search;
- missing analytics;
- missing export;
- missing support/moderation;
- missing security headers;
- missing security tests;
- missing E2E;
- missing CI;
- missing accessibility/visual fixes;
- missing documentation.

---

# 36. FINAL RECURSIVE COMPLETION AUDIT

After implementation appears complete, DO NOT immediately stop.

Perform a fresh full audit as if reviewing another team’s release.

Read again:

- Prompts 1–6;
- this prompt;
- `docs/EXECUTION_STATE.md`;
- `docs/V1_ACCEPTANCE_MATRIX.md`;
- route tree;
- providers;
- migrations;
- browser tests;
- security tests;
- CI;
- current UI screenshots.

Search repository for:

- `TODO`;
- `FIXME`;
- `HACK`;
- `placeholder`;
- `seed` runtime fallback;
- hardcoded fake financial values;
- hardcoded role switch;
- fake provider URL;
- fake success state;
- dead buttons;
- unimplemented handlers;
- `any`/unsafe parsing around high-risk inputs;
- client-submitted financial fields;
- missing authorization;
- old intermediate acceptance statuses.

For every finding classify:

- internally solvable blocker;
- genuine external blocker;
- non-blocking out-of-V1 item.

If ANY internally solvable blocker exists:

> re-enter the implementation/test/fix loop automatically.

Repeat this completion audit until no internally solvable blocker remains.

---

# 37. FINAL DEFINITION OF DONE

This entire execution is complete only when ALL applicable statements are true.

## Browser/product architecture

- real URLs/routes exist;
- refresh works;
- deep links work;
- back/forward works;
- production root is not the old state machine;
- no production role-switch buttons;
- browser reads actual server/session/DB state;
- browser mutations actually persist;
- no silent seed fallback in normal runtime.

## Auth/security

- signup/verify/login/logout/reset real;
- session security real;
- server authorization real;
- admin MFA/strong admin security path real in deterministic test mode and enforced in production config;
- CSRF/origin protections;
- security headers;
- XSS/SSRF/upload/open-redirect/mass-assignment defenses;
- secret/PII handling;
- rate limits;
- real security suite green.

## Creator/admin

- country/application/admin review real;
- profile/tier/content/member operations real;
- SaaS entitlements/quotas real;
- admin can operate required V1 configuration without SQL;
- audit real.

## Stripe/payments

- current official Connect model selected/documented;
- existing/new Stripe path truthful;
- direct-charge connected-account context enforced;
- true recurring provider subscription architecture;
- application fee invariant 0;
- real Stripe webhook route;
- provider event authority/idempotency/out-of-order handling;
- deterministic mock provider full lifecycle.

## Guaranteed Earnings / financial

- provider pricing matrix current/versioned;
- IP preview-only;
- final payment-route-aware pre-payment quote;
- immutable quote;
- Simple Price distinct;
- Guaranteed Earnings eligibility fail-closed;
- grandfathering works;
- actual provider reconciliation;
- creator surplus creator-owned;
- real Guarantee Top-Up obligation/funding state;
- one top-up exactly once;
- self-correcting route behavior;
- unknown anomaly pauses route;
- reserve/circuit breakers;
- refunds/disputes/top-up reversals append-oriented;
- payout/balance provider-side;
- ZeroFee transaction fee 0;
- ZeroFee payout markup 0.

## Membership

- activation provider-authoritative;
- renewal;
- dunning;
- recovery;
- cancellation;
- resume;
- rejoin;
- upgrade/downgrade;
- monthly/annual change;
- repricing;
- refund/dispute entitlement behavior.

## Content

- real posts;
- real courses/modules/lessons;
- real media/files;
- YouTube-only video;
- entitlement server-gated;
- comments/moderation where retained;
- no unauthorized locked payload leakage.

## Acquisition/integrations/ops

- Patreon migration real;
- Discord mock/provider boundary real;
- Telegram mock/provider boundary real;
- API keys real;
- outbound webhooks real and SSRF-safe;
- broadcasts real;
- search real;
- analytics DB-derived;
- export real;
- notifications real;
- support real;
- moderation real.

## UX/quality

- Prompt 2 design preserved/improved where wiring required;
- no obvious hardcoded fake product data remains in normal runtime;
- all major actions have pending/error/success behavior;
- mobile critical flows intentional;
- accessibility fundamentals pass;
- targeted cross-browser smoke passes;
- screenshot QA from real app completed;
- all visual defects found in bounded QA fixed.

## Reliability/release

- PostgreSQL migrations work from zero;
- database constraints protect critical invariants;
- concurrency/idempotency tests green;
- typecheck green;
- lint green;
- unit green;
- integration green;
- security green;
- financial/property green;
- Playwright functional E2E green;
- CI runs Playwright and is green;
- production build starts;
- clean install/release rehearsal passes;
- docs match reality;
- no internally solvable V1 row is unfinished;
- repository clean;
- work committed;
- work pushed;
- final `HEAD == origin/main` unless repository workflow intentionally uses another final branch.

---

# 38. FINAL COMPLETION REPORT — EVIDENCE ONLY

Only after the Definition of Done passes report:

## Repository

- branch;
- starting SHA;
- final SHA;
- push status;
- clean tree;
- HEAD vs origin/main.

## Current-state remediation

- which old completion claims were corrected;
- which fake/seed/browser paths were removed or isolated.

## Routing/UI

- public routes;
- creator routes;
- member routes;
- admin routes;
- desktop/mobile/a11y result;
- UI/UX defects found/fixed;
- screenshot evidence.

## Database

- stack;
- migration count;
- fresh database result;
- seed/test fixture result;
- persistence/reload evidence.

## Auth/security

- auth/session/MFA design;
- security headers;
- RBAC/IDOR;
- CSRF/XSS/SSRF/upload/open-redirect/mass-assignment;
- security test count and exact categories.

## Stripe/providers

- current Connect architecture selected;
- official source/date;
- existing/new Stripe behavior;
- Direct Charges;
- true recurring subscription;
- webhook implementation;
- deterministic mock lifecycle;
- actual remote test calls performed, if any;
- genuine external provider blockers.

## Financial

- pricing source/date;
- route matrix dimensions;
- property/fuzz count + deterministic seed;
- grandfathering;
- final route classification;
- reconciliation;
- surplus;
- shortfall;
- Guarantee Top-Up;
- top-up idempotency/concurrency;
- route correction/pause;
- reserve/circuit breakers;
- refund/dispute compensation.

## Membership/content/acquisition/integrations

Report actual implementation state for each major domain.

## Testing

Give ACTUAL counts separately for:

- unit;
- database integration;
- security;
- provider;
- pricing/property;
- concurrency;
- functional Playwright E2E;
- accessibility;
- visual screenshot captures.

Do not combine screenshots with E2E counts.

## CI

- workflow path/run URL if available;
- jobs;
- result.

## External blockers

Only genuine external/legal/provider/live-infrastructure items.

## Acceptance

Reference final `docs/V1_ACCEPTANCE_MATRIX.md`.

There must be no internal coding task hidden under `BLOCKED_EXTERNAL` or `OWNER_NEXT_STEPS`.

---

# 39. FINAL EXECUTION COMMAND

START NOW.

READ EVERY PROMPT AND DOCUMENT FIRST.

TRUST CURRENT CODE, NOT OLD COMPLETION CLAIMS.

PRESERVE GOOD BACKEND AND PROMPT 2 DESIGN WORK.

DO NOT REBUILD FROM SCRATCH.

DO NOT LEAVE THE BROWSER AS A SEEDED STATE MACHINE.

MAKE THE URL, SESSION, DATABASE AND PROVIDER EVENTS AUTHORITATIVE.

REMOVE SILENT SEED FALLBACK FROM NORMAL RUNTIME.

IMPLEMENT REAL AUTH ROUTES AND REAL SERVER AUTHORIZATION.

HARDEN ADMIN/OWNER SECURITY.

IMPLEMENT CURRENT STRIPE CONNECT ARCHITECTURE FROM CURRENT OFFICIAL DOCUMENTATION.

USE TRUE RECURRING SUBSCRIPTIONS AND DIRECT CHARGES IN CREATOR ACCOUNT CONTEXT.

KEEP ZEROFEE APPLICATION FEE AT 0.

IMPLEMENT THE REAL STRIPE WEBHOOK.

IMPLEMENT PROMPT 6 COMPLETELY: GRANDFATHERING, CURRENT FEE MATRIX, PAYMENT-ROUTE FINAL PRICING, GUARANTEE TOP-UPS, SELF-CORRECTING ROUTES AND RESERVE CIRCUIT BREAKERS.

NEVER CAPTURE CREATOR SURPLUS.

IMPLEMENT ALL MEMBERSHIP LIFECYCLES.

IMPLEMENT REAL CONTENT, FILES, YOUTUBE-ONLY VIDEO AND ENTITLEMENTS.

IMPLEMENT REAL PATREON MIGRATION.

IMPLEMENT REAL INTEGRATIONS, API, WEBHOOKS, BROADCASTS, SEARCH, ANALYTICS, EXPORT, SUPPORT, MODERATION AND AUDIT.

RUN THE COMPLETE SECURITY AND CONCURRENCY PASS.

MAKE PLAYWRIGHT TEST REAL DATABASE-BACKED PRODUCT JOURNEYS.

MAKE CI RUN THOSE JOURNEYS.

RUN REAL UI/UX, MOBILE, ACCESSIBILITY AND SCREENSHOT QA AFTER WIRING.

THEN RE-AUDIT THE ENTIRE PLATFORM.

IF ANY INTERNALLY SOLVABLE GAP REMAINS, AUTOMATICALLY ENTER THE FIX/TEST LOOP AGAIN.

DO NOT STOP UNTIL THE PRODUCT ITSELF IS COMPLETE FOR OWNER TESTING IN DETERMINISTIC TEST MODE.

COMMIT AND PUSH EVERYTHING.

ONLY THEN PROVIDE THE FINAL EVIDENCE REPORT.

---

# APPENDIX A — FULL INHERITED PREVIOUS REMEDIATION REQUIREMENTS

The owner explicitly required the previously interrupted remediation prompt to remain included in the next execution. The requirements below therefore remain mandatory. If a line conflicts with a newer requirement in Prompt 6 or the main body of this Prompt 1SEP, the newer/stricter requirement wins. Otherwise implement it exactly once.

# ZEROFEE — REAL APPLICATION WIRING & V1 COMPLETION EXECUTION

START EXECUTION NOW.

Repository:

https://github.com/arsenijee19/zerofee

Current audited baseline in that prior execution was:

`1ec2034d774659f575e5787406013a902e395ef3`

Work from the CURRENT `main` branch, but verify the actual HEAD before making changes.

This is a REMEDIATION AND COMPLETION execution pass.

DO NOT restart the project.

DO NOT redesign the product.

DO NOT create another disconnected backend service layer.

DO NOT stop after writing architecture or documentation.

The current repository contains a meaningful PostgreSQL-backed server/domain foundation, but the actual browser application is still substantially the original client-side prototype.

YOUR PRIMARY JOB IS NOW:

> CONNECT THE REAL BACKEND TO THE REAL PRODUCT.

The completed application must no longer be a seeded UI sitting on top of unused server services.

## A1. READ EVERYTHING FIRST

Read completely:

- `prompts/README.md`
- `prompts/1_INITIAL_PROTOTYPE_MASTER_EXECUTION_PROMPT.md`
- `prompts/2_DESIGN_SYSTEM_AND_UX_MASTER_PROMPT.md`
- `prompts/3_REAL_APPLICATION_CONVERSION_MASTER_PROMPT.md`
- `prompts/4_PLATFORM_OPERATING_MODEL_AND_CONTENT_EXECUTION_PROMPT.md`
- `prompts/5_COMPLETE_REMAINING_V1_BACKEND_EXECUTION_PROMPT.md`
- `prompts/6_GUARANTEE_PRICING_MATRIX_AND_SELF_CORRECTING_RISK_ENGINE_PROMPT.md`
- `docs/PLATFORM_OPERATING_MODEL.md`
- `docs/EXECUTION_STATE.md`
- `docs/V1_ACCEPTANCE_MATRIX.md`
- `docs/REMAINING_V1_GAP_AUDIT.md`
- all architecture/payment/pricing/content/security/tax/migration documentation.

Then inspect actual implementation.

Do not trust previous completion claims.

The current code is authoritative.

## A2. AUDITED PROBLEMS THAT MUST BE FIXED

### A2.1 The UI is still primarily one client-side state machine

`components/zerofee-app.tsx` still uses a `useState<View>` model to switch between marketing, signup, creator, member, checkout, admin, migration, financial and support screens.

Buttons such as `Admin`, `Log in`, `Start as a creator` change local React state instead of navigating through real application routes and authenticated state.

This is NOT acceptable as final V1 architecture.

Replace it with real Next.js routes/layouts and server-authoritative state.

### A2.2 Existing backend services are insufficient unless the browser uses them

Do not consider auth, creator application, pricing, membership, migration, search, moderation or integrations complete merely because a function exists under `lib/server`.

Actual browser workflows must invoke those real boundaries.

A creator clicking `Create tier` must create a database row.
A fan subscribing must create real quote/payment/subscription state.
An admin approving a creator must mutate the real application.
Refresh must preserve state.
Opening a deep URL directly must work.

### A2.3 E2E is currently misleading

The current browser suite’s seeded-navigation tests are not functional E2E.

Replace superficial navigation/screenshot tests with actual persistent workflows.

### A2.4 Runtime seed fallback hides serious failures

Database/query failure may not silently become `getSeedState()` in normal application execution.

Implement explicit runtime modes.

When DB-backed application mode is enabled, DB failure must produce a controlled error/health failure, not fake successful seeded state.

### A2.5 Stripe implementation must align with approved operating model

Do not retain the current Express-account assumption automatically.

The intended model remains:

> Your Stripe. Your customers. Your money. Our software.

Before modifying Stripe code, read CURRENT OFFICIAL STRIPE CONNECT DOCUMENTATION.

Research and document the recommended current implementation for creator-owned commerce, Direct Charges, strongest practical creator Stripe relationship/full dashboard, provider-side fees/losses where supported, ZeroFee application fee 0, creator-controlled refunds and provider-side payouts.

Use current official Stripe documentation only for architecture decisions.

## A3. STRIPE ACCOUNT ONBOARDING MUST BE REALISTIC

Existing Stripe user:

- show `Connect Stripe`;
- use officially supported connect/reuse mechanism;
- do not fake connection by metadata.

New Stripe user:

- use official Stripe onboarding;
- Stripe collects identity/business/legal/bank/KYC where supported;
- ZeroFee does not unnecessarily collect KYC/bank documents.

Persist/synchronize requirements, charges enabled, payouts enabled, account status and provider IDs.

Mock provider supplies deterministic equivalent in CI.

## A4. REAL RECURRING MEMBERSHIPS

Do not manufacture subscription IDs from PaymentIntents.

Provider abstraction must represent actual recurring customer/product-price/subscription/invoice/payment lifecycle, renewals, failures, billing periods, cancellation, resume, upgrades/downgrades and provider references.

Mock provider models the same lifecycle deterministically.

## A5. DIRECT CHARGES

Fan membership payment executes in creator connected-account context.

ZeroFee application fee remains 0 and server-enforced.

ZeroFee SaaS billing is separate.

## A6. REAL STRIPE WEBHOOK

Implement `/api/webhooks/stripe` with raw body, official signature verification, environment secret, Connect context, persistent provider event, unique event ID, idempotency, attempts, retries/errors, audit visibility and cross-creator isolation.

Map current relevant account/subscription/invoice/payment/refund/dispute/provider events into provider-neutral domain events.

Use current official event names.

## A7. ACTUAL PROVIDER FEE RECONCILIATION

After Stripe payment, use provider-authoritative actual financial records such as current Balance Transaction/equivalent where exposed.

Persist gross, tax, predicted cost, actual cost, target, proceeds, surplus, shortfall, ZeroFee fee 0, provider IDs and reconciliation state.

Guaranteed Earnings reconciles only after authoritative provider data is available.

## A8. REAL AUTH ROUTES AND UI

Implement `/signup`, `/login`, `/logout`, verification, forgot password and reset password through existing server auth/session implementation.

Browser receives real HTTP-only session cookie.

Protected routes derive identity from server session.

No fake production user-role switching.

## A9. REAL APPLICATION ROUTING

Replace the single View application with proper public/creator/member/admin routes.

Refresh, deep links and server authorization must work.

URL reflects meaningful application state.

## A10. PRESERVE APPROVED DESIGN

Reuse/refactor the approved Prompt 2 UI.

Preserve design tokens, typography, Electric Blue identity, creator/member/admin shell language, financial layouts and responsive behavior.

Visual changes exist to make real functionality coherent: forms, validation, errors, loading, success, route transitions, persisted data and required controls.

## A11. CREATOR APPLICATION — BROWSER E2E

Real flow:

signup → verify → login → country → profile/application draft → submit → persisted UNDER_REVIEW → logout → admin login → review/request-info/approve/reject → audit + notification → creator reload sees persisted result.

No local view state substitutes for this.

## A12. CREATOR STRIPE SETUP — BROWSER FLOW

Approved creator → Payments Setup → Connect Stripe → mock or test provider → onboarding → state persisted → requirements shown → ready state.

Mock drives full browser flow; real Stripe boundary remains usable with credentials.

## A13. ZEROFEE SAAS BILLING

Creator plan selection is persisted.

Mock/test billing activates platform subscription and entitlements/quotas.

States include trialing, active, past due, grace, suspended, cancelled.

Feature access is server-enforced.

## A14. MEMBERSHIP TIER CREATION

Creator → create tier → monthly/annual → Simple Price or Set What You Earn → target/price → benefits → real server quote examples → publish → refresh → tier remains → public creator page displays DB tier.

## A15. BOTH PRICING MODES MUST BE CLEAR

Simple Price: creator chooses member retail, provider costs reduce creator proceeds, no guaranteed proceeds.

Guaranteed Earnings: creator chooses desired minimum proceeds, server calculates safe retail for eligible route, creator publishes, final buyer amount may be higher.

Product wording must be `ZeroFee platform fee: 0%`, never “there are no fees anywhere.”

## A16. REAL MEMBER CHECKOUT

Public creator → tier → auth/account → immutable server quote → checkout displays final amount → provider payment/subscription → pending → signed provider event → ACTIVE membership → reload persists → content accessible.

Browser redirect never activates membership.

## A17. RENEWAL / DUNNING / CANCELLATION

Implement real domain behavior and deterministic simulation for successful renewal, failed renewal, retry, recovery, past due, grace, exhausted recovery, cancellation at period end, cancellation, resume and expiry.

Persist MembershipEvents.

## A18. TIER CHANGE / REPRICING

Implement upgrade, downgrade, price versioning, grandfathering, new-member price, `REPRICE_REQUIRED` and required acknowledgements.

Never rewrite historical financial records.

## A19. REFUNDS / DISPUTES

Creator can initiate valid own-payment refund from real UI through provider adapter and event processing.

Disputes persist, notify creator, update financial/admin state and follow documented entitlement policy.

Mock provider demonstrates full flow.

## A20. PAYOUTS

Use provider balance abstraction.

Show available, pending, next payout, payout status/provider fee, ZeroFee payout fee 0 and Stripe verification/manage links where supported.

No internal ZeroFee wallet.

## A21. REAL CONTENT MANAGEMENT

Wire DB content backend into creator UI for post CRUD, draft/publish/archive/visibility/tier mapping, and course/module/lesson CRUD/order/text/image-file/YouTube/tier access/public preview/publish.

Refresh preserves state.

## A22. YOUTUBE ONLY FOR V1 VIDEO

No native video hosting.

Validate/normalize YouTube ID server-side, reject arbitrary iframe/HTML/XSS, render official embed after entitlement, respect unavailable/private/embed-disabled state, do not proxy/restream.

## A23. IMAGES AND FILES

Implement actual V1 `MediaStorageProvider` upload flow, deterministic local/test adapter, production S3/R2 boundary, validation, ownership, quotas, signed/private retrieval, delete/archive and cross-creator denial.

## A24. PATREON MIGRATION — ACTUAL UI + BACKEND

Upload CSV → parse → preview/errors → tier mapping → pricing/grandfathering → import → project → invitations → secure token → member link → account/login → new subscription authorization → converted state → conversion dashboard.

No fixture-only fake migration.

## A25. GLOBAL SEARCH

Connect command palette to real server query.

Search input actually affects query.

Creator sees authorized own data, admin authorized platform data.

Remove static initial-state search as production implementation.

## A26. API KEYS / OUTBOUND WEBHOOKS

Creator can create API key, see plaintext once, copy, see scopes and revoke.

Outbound webhook supports endpoint, HMAC secret, test delivery, persisted attempts, retries/failure and disable.

Harden SSRF including DNS/IP/redirect bypasses.

## A27. DISCORD / TELEGRAM

Implement explicit integration provider adapters and deterministic simulators when live credentials absent.

Discord: connection, guild, tier→role, activation grant, cancellation revoke, retry/error.

Telegram: connection, community/chat mapping, access lifecycle and deterministic mock.

## A28. BROADCASTS / NOTIFICATIONS

Persist broadcasts and targeted audiences.

Development/test email records deterministic deliveries.

Do not claim real delivery without credentials.

## A29. ANALYTICS

Remove decorative analytics.

Creator analytics use persisted members/payments/earnings/surplus/failures/recovery/tier/migration data.

Admin analytics separate ZeroFee SaaS MRR from creator GMV and show real operational state.

## A30. DATA EXPORT

Creator exports own permitted business data.

Protect CSV formula injection.
Never export another creator’s data.

## A31. REMOVE FAKE SUCCESS PATHS

Audit seed fallback, test/demo shortcuts, hardcoded success, view-switch buttons, fake Stripe links/payout actions/forms/data mutations/search/admin switching.

Production fails honestly.

Explicit DEMO mode is isolated.

## A32. REAL SECURITY TESTS

Expand tests against actual HTTP/server boundaries for auth, protected routes, tenant separation, quote tampering, expiry/mismatch, application fee invariant, content/download gating, webhook signatures/idempotency/account scope, API keys, migration tokens, SSRF, upload spoofing, stored XSS and admin-only moderation.

Do not satisfy with test-local helpers.

## A33. REPLACE THE E2E SUITE

Build real Playwright E2E with isolated PostgreSQL covering creator auth/application/admin approval/provider onboarding/SaaS/tier pricing/public page/fan checkout/webhook activation/persistence/content/courses/dunning/recovery/cancellation/resume/tier changes/refund/dispute/reconciliation/surplus/shortfall/payout/migration/search/moderation/API/webhooks/Discord/Telegram/broadcast/export/mobile/admin operations.

Functional journeys only.

## A34. CI MUST RUN IMPORTANT TESTS

CI with PostgreSQL runs clean install, migrations, seed, typecheck, lint, unit, integration, security, build and Playwright functional E2E.

Live Stripe credentials are not required.

## A35. ACCEPTANCE MATRIX MUST BE HONEST

Final allowed statuses are `VERIFIED`, `BLOCKED_EXTERNAL`, `OUT_OF_V1_SCOPE`.

Do not use intermediate boundary/UI/schema statuses for complete V1.

Internally solvable work is implemented; deterministic provider tests cover external round-trip boundaries.

## A36. EXTERNAL BLOCKER RULE

External blockers may be production Stripe approval/keys/webhook registration/responsibility configuration, legal/tax opinion, email/storage/Discord/Telegram credentials and production infrastructure.

Missing code, routes, forms, lifecycle, adapters, webhooks, migration, analytics, export, security tests or E2E are NOT external blockers.

## A37. DO NOT STOP BETWEEN PHASES

Failure → diagnose → targeted fix → relevant test → continue.

Never ask permission to proceed.

## A38. PRIOR FINAL DEFINITION OF DONE

The remediation is complete only when browser auth/sessions/routes/DB mutations are real; reload persists; role-switch and seed fallback are gone from normal runtime; creator/admin/SaaS/provider/Stripe/webhook/recurring/direct-charge/quote/checkout/membership/lifecycle/repricing/refund/dispute/reconciliation/payout/content/YouTube/media/migration/search/API/integrations/broadcast/analytics/export/moderation/security/E2E/CI/mobile/docs are actually working and internally solvable requirements are finished.

Prompt 6’s stricter top-up/risk requirements are additionally mandatory under this Prompt 1SEP.

## A39. PRIOR FINAL REPORT REQUIREMENTS

Report evidence for repository, routing, database, authentication, payments, financials, membership lifecycle, content, migration, integrations, testing counts, CI, genuine external blockers and final acceptance matrix only after completion.

Do not build another disconnected service layer.

Wire the existing backend into the actual product.

Make the browser use the database.

Make the browser use real auth.

Make payments and memberships provider-authoritative.

Make Playwright prove the real product journeys.

Fix Stripe architecture to match current official Connect model and approved ZeroFee operating model.

Do not stop until the APPLICATION ITSELF, not merely services beneath it, is a real working V1.

COMMIT AND PUSH EVERYTHING.

ONLY THEN PROVIDE THE FINAL REPORT.

---

# APPENDIX B — PROMPT SELF-CHECK BEFORE EXECUTION COMPLETION

Before declaring this prompt itself satisfied, compare implementation against each user intent encoded here:

- all prompts read first;
- executed vs unexecuted reality re-audited;
- interrupted prior run not trusted;
- Prompt 6 included;
- goal and deterministic plan included;
- UI/UX audit performed before wiring changes;
- existing Prompt 2 design preserved;
- real browser routing/auth/DB mutations required;
- Stripe current official docs required;
- recurring subscriptions real;
- live Stripe webhook real;
- Prompt 6 top-up/risk engine required;
- security expanded beyond prior tests;
- edge cases/concurrency/event order covered;
- mobile/accessibility/cross-browser covered;
- CI executes browser tests;
- live-money pricing payment not required for completion, but test billing is real;
- final platform re-audited;
- recursive targeted fix loop repeats until no internal gaps;
- all work committed/pushed;
- final report evidence-based only.

If any item is missing in implementation or proof, return to the relevant phase before stopping.
