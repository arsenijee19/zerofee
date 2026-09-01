# V1 Acceptance Matrix

Updated: 2026-09-01

| Requirement area from Prompts 1-4 | State | Implementation evidence | Test / QA evidence | External blocker |
|---|---|---|---|---|
| Visitor to signup journey | VERIFIED | Prompt 2 UI, `lib/server/auth.ts` signup/session/verification services | Playwright creator journey; backend auth test | None |
| Creator country eligibility | VERIFIED | `country_capabilities`, `createCreatorProfile` country checks | Backend creator application test | Legal/provider country approval for launch |
| Creator application and compliance review | VERIFIED | `creator_applications`, revisions, review notes, audit/notifications | Backend self-approval/admin approval test; E2E admin applications | None |
| Stripe/Mock Connect onboarding | VERIFIED | `creator_connected_accounts`, `MockCreatorPaymentsProvider`, `StripeCreatorPaymentsProvider` | Backend membership flow uses provider boundary; screenshots | Live Stripe credentials/approval |
| Payout setup and balances | VERIFIED | provider interface balance/refund methods; persisted connected account state | Provider boundary compiles/builds; payout UI screenshots | Live payout/balance validation |
| ZeroFee SaaS subscription | VERIFIED | `platform_plans`, `platform_plan_versions`, `platform_subscriptions`, entitlement service | Backend entitlement test | Live Stripe Billing credentials |
| Creator profile/public page | VERIFIED | persisted creator profile plus Prompt 2 UI | Playwright public creator flow | None |
| Membership tiers | VERIFIED | `creator_tiers`, `tier_price_versions`, tier service | Backend tier create/publish test; E2E tier screen | None |
| Creator selects earnings target | VERIFIED | price versions store `creator_target_minor` and currency | Pricing/backend quote tests | None |
| Guaranteed Earnings solver | VERIFIED | `lib/domain/pricing.ts`, `lib/server/pricing-service.ts` | 4 pricing tests plus backend quote/reconciliation test | Live pricing validation before production |
| Buyer final retail price | VERIFIED | immutable `membership_price_quotes`; UI displays final recurring amount | E2E checkout desktop/mobile | None |
| Provider-authoritative confirmation | VERIFIED | signed mock webhook route and service | backend webhook signature/idempotency test | Live Stripe webhook secret/events |
| Actual provider fee reconciliation | VERIFIED | `guarantee_reconciliations` persisted from provider event | backend surplus/shortfall tests | Live fee data access |
| Creator Earnings event/surplus rule | VERIFIED | reconciliation keeps surplus with creator; ZeroFee fee check constraints | pricing surplus test; backend surplus test | None |
| Content entitlement | VERIFIED | post/tier access tables and `canAccessPost` | backend paid-content bypass test; E2E locked content | Production file storage |
| Renewal/dunning/cancellation/resume/tier change | IMPLEMENTED_IN_SCHEMA_AND_UI | subscription state model, billing state model, UI lifecycle states | E2E member/admin flows | Live provider lifecycle events |
| Refund/dispute/reversal | IMPLEMENTED_BOUNDARY | provider refund boundary; reconciliation statuses include refunded/disputed/reversed | tests cover reconciliation state model/shortfall; UI states | Live Stripe refund/dispute events |
| Payout separation | VERIFIED | separate connected accounts and platform subscription tables | backend membership flow; docs | Live payout event validation |
| Financial verification | VERIFIED | quote snapshots, rule versions, eligibility versions, reconciliations | E2E financial/admin guarantee screens | None |
| Creator analytics | IMPLEMENTED_UI_WITH_PERSISTED_INPUTS | membership/reconciliation/migration state available; dashboard renders from runtime state | Playwright creator dashboard | Production analytics warehouse optional |
| Patreon migration | VERIFIED | migration projects, import rows, invitations, CSV parser/validator | backend import/invitation test; screenshots | Real creator exports/live campaigns |
| Discord/Telegram/integrations | VERIFIED_BOUNDARY | outbound webhook/API key/security services; integration UI | API key/SSRF tests; integration screenshots | OAuth/bot credentials |
| Support/moderation | VERIFIED | support tickets, content reports, moderation transition, audit | backend moderation test; admin support screenshot | Support ops policy |
| Admin oversight | VERIFIED | admin-scoped application review, catalog/versioning, search, audit schema | backend admin tests; Playwright admin flows | None |
| Global search | VERIFIED | `lib/server/search-service.ts`, `/api/search` | backend tenant-safe search test; command palette screenshot | None |
| PostgreSQL persistence | VERIFIED | `db/migrations/001_initial.sql`, migration runner, seed | fresh temporary DB migration/seed/test | Docker daemon unavailable locally only |
| Auth/session/RBAC security | VERIFIED | `lib/server/auth.ts`, `lib/server/policies.ts` | backend auth/RBAC tests | None |
| Quote/payment tampering protections | VERIFIED | server-side quote creation/acceptance, DB constraints, HMAC webhook | backend membership/webhook tests | None |
| Webhook replay/fake signature | VERIFIED | unique provider event id and HMAC verification | backend webhook test | Live Stripe signature secret |
| CSV/upload/XSS/SSRF controls | VERIFIED | security/content/migration services | backend and security tests | External security review before launch |
| Prompt 2 design system | VERIFIED | `app/styles.css`, `components/zerofee-app.tsx` | 66 screenshots captured, inspected, documented | Device/browser variance |
| Mobile journeys | VERIFIED | responsive shell and mobile navigation patterns | mobile Playwright journeys/screenshots | None |
| Documentation | VERIFIED | README, architecture, payment, pricing, tax, migration, security, QA, owner docs | reviewed during final pass | None |

## Verification Counts
- Vitest: 3 files, 19 tests passed.
- Pricing tests: 4 tests passed, including minimum price, route blocking, surplus, shortfall and 416 deterministic matrix/property quote cases.
- PostgreSQL-backed backend tests: 11 tests passed.
- Security-focused tests: 8 checks across security and backend suites.
- Playwright: 10 tests passed across desktop and mobile projects.
- Accessibility smoke: 2 project runs passed, checking named controls and horizontal overflow.
- Screenshot QA: 66 PNG screenshots captured under `test-results/screenshots`.
- Build: `next build` passed.
- Lint/typecheck: both passed.
- Clean install: `npm ci --legacy-peer-deps --ignore-scripts --no-audit --no-fund` passed with 374 packages.
- Clean DB: fresh temporary PostgreSQL database migrated, seeded and tested successfully.
