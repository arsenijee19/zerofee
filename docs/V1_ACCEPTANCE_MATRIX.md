# ZeroFee V1 Acceptance Matrix

Updated: 2026-09-01

This matrix records only evidence-backed states. VERIFIED means the repository has an implementation and deterministic test evidence. BLOCKED_EXTERNAL means the internal boundary and test mode exist but live activation needs a third party or owner decision. OUT_OF_V1_SCOPE means the item is deliberately not part of this prototype.

| Material requirement | State | Implementation evidence | Verification evidence |
|---|---|---|---|
| Public marketing and creator signup | VERIFIED | App Router public pages and signup server action | Playwright desktop/mobile flow and screenshots |
| Email verification and password reset | VERIFIED | Auth service, token tables, verify/reset pages | PostgreSQL backend auth test |
| Role-based access and creator ownership | VERIFIED | Route guards and policy checks | Backend RBAC test and member-to-admin browser guard |
| Creator country eligibility | VERIFIED | country_capabilities and application service | Backend application test |
| Creator application, review, audit and notifications | VERIFIED | Application tables/service and admin route | Backend approval test and admin E2E |
| Connected account onboarding boundary | VERIFIED | Mock and Stripe provider interfaces, connected account persistence | Typecheck/build and creator payments route |
| Live Stripe Connect activation | BLOCKED_EXTERNAL | Stripe adapter, controller configuration and account-link boundary | Mock provider E2E; live credentials/approval required |
| ZeroFee SaaS plans and entitlements | VERIFIED | platform plans/subscriptions and entitlement service | Backend entitlement test and billing route |
| Live SaaS billing | BLOCKED_EXTERNAL | Provider boundary reserved for platform billing | Live Stripe Billing credentials required |
| Creator profile and public page | VERIFIED | Persisted profile route and public slug route | Browser public creator flow |
| Membership tier CRUD and publish | VERIFIED | Creator tier service and persisted price versions | Creator browser flow and backend tier test |
| Guaranteed Earnings quote solver | VERIFIED | Integer minor-unit solver with current rule/profile matching | Pricing tests: minimum price, matrix and property loop |
| Simple Price quote mode | VERIFIED | Persisted simple retail price and non-guaranteed quote path | Typecheck/build and service path |
| Versioned provider pricing catalog | VERIFIED | provider_pricing_rules and admin catalog | Pricing tests and admin browser route |
| Guarantee eligibility profiles | VERIFIED | eligibility profile matching and stale-route rejection | Pricing route-blocking test |
| Tax architecture | BLOCKED_EXTERNAL | Tax provider interface/configuration and quote tax snapshot | Mock tax path; professional tax validation required |
| Buyer final-price review | VERIFIED | Immutable membership_price_quotes and checkout route | Desktop/mobile checkout E2E |
| Provider-authoritative confirmation and replay protection | VERIFIED | Signed mock webhook, Stripe webhook route, unique event records | Webhook signature/idempotency backend tests |
| Recurring membership subscriptions | VERIFIED | Provider recurring subscription boundary and subscription persistence | Mock checkout E2E |
| Renewal, dunning, cancellation, resume and tier-change states | VERIFIED | membership_events and server lifecycle functions/actions | Member billing E2E and backend lifecycle coverage |
| Refund and dispute handling boundary | VERIFIED | Provider refund adapter, reconciliation state updates and admin action | Backend reconciliation tests |
| Live Stripe refunds/disputes/balances/payouts | BLOCKED_EXTERNAL | Stripe methods and connected-account topology | Mock payout screen; live event access required |
| Creator surplus ownership and shortfall incident | VERIFIED | Reconciliation math, zero-fee checks and incident pause | Surplus/shortfall unit and PostgreSQL tests |
| Paid content entitlement | VERIFIED | post visibility/tier access and API guard | Backend access test and public post route |
| Content sanitization and YouTube validation | VERIFIED | Sanitizer, URL parser and content service | Backend content tests |
| Actual object storage and malware scanning | BLOCKED_EXTERNAL | Upload validation boundary exists | Production storage/scanner provisioning required |
| Patreon/CSV migration import and secure invitations | VERIFIED | Parser, validation, mapped rows, invitation hashes and migration UI | Backend migration test and creator E2E |
| Live Patreon provider-assisted payment migration | OUT_OF_V1_SCOPE | No claim that card credentials move | Fan reauthorization is the required product path |
| Discord/Telegram/email integration boundary | VERIFIED | Persisted connections and entitlement event records | Seed/runtime integration route |
| Live Discord/Telegram/OAuth/email delivery | BLOCKED_EXTERNAL | Same-domain integration boundary | Credentials, app review and mail provider required |
| Creator/admin scoped global search | VERIFIED | DB search service and API route | Backend tenant-safe search test and browser E2E |
| API keys and outbound webhook URL validation | VERIFIED | Hashed keys, revoke flow and SSRF checks | Security tests and creator E2E |
| Support, moderation and audit trail | VERIFIED | Support/report/audit tables and admin route | Backend moderation test and admin screenshots |
| Mobile critical routes | VERIFIED | Responsive shell, tables and mobile controls | Playwright Pixel 5 project and overflow smoke |
| PostgreSQL migrations and deterministic seed | VERIFIED | 001 and 002 SQL migrations, e2e prepare script | Clean reset/migrate/seed run |
| CI typecheck, lint, build and browser setup | VERIFIED | GitHub Actions workflow | Local equivalent commands passed |
| Production infrastructure, legal and compliance sign-off | BLOCKED_EXTERNAL | Documentation and explicit configuration gates | Owner/Stripe/tax/legal actions remain |

## Verification Counts

- Vitest: 20 tests passed across 3 files.
- Browser: 14 Playwright tests passed across desktop and mobile projects in the latest full run; 5 functional journeys plus accessibility and visual route coverage.
- Fresh database: schema reset, migrations 001 and 002, and deterministic seed passed.
- Typecheck, lint and production build passed.
- Fresh visual pass: 44 route screenshots captured across desktop and mobile.
