# Remaining V1 Gap Audit

Audit date: 2026-09-01  
Audited HEAD before backend conversion: `027befcef53a339d0ad6ca6c52512d5f54f18938`

## Initial Findings
- The existing app was a polished deterministic visual prototype with most state in `lib/domain/seed.ts`.
- Prompt 2 visual work was real and worth preserving.
- The money/pricing solver existed and was correct at helper level, but it was not yet backed by persisted pricing catalog, immutable DB quote snapshots, or server payment activation.
- PostgreSQL migrations, auth/session/RBAC, webhooks, Patreon import persistence, scoped search, API keys, support/moderation records, and provider boundaries were missing or UI-only.

## Closing Classification

| Area | Initial state | Final state | Evidence |
|---|---|---|---|
| Prompt 2 visual baseline | Real and verified | Preserved | 66 refreshed screenshots, 8 Playwright tests |
| Money utilities/pricing solver | Helper-level real | DB-backed quote service added | `lib/domain/pricing.ts`, `lib/server/pricing-service.ts`, 4 pricing tests |
| Reconciliation math | Helper-level real | Persisted provider actuals/incidents | `guarantee_reconciliations`, `guarantee_incidents`, backend tests |
| PostgreSQL | Missing executable migration | Implemented | `db/migrations/001_initial.sql`, fresh DB release pass |
| Auth/session/RBAC | Missing | Implemented | `lib/server/auth.ts`, `lib/server/policies.ts`, backend tests |
| Creator applications | Seed-only | Persisted workflow | application service and admin review test |
| Country capabilities | Seed-only | Persisted registry | `country_capabilities` migration/seed |
| Stripe adapter | Dependency/docs only | Production boundary implemented | `lib/server/providers.ts`, Stripe decision doc |
| Webhooks | Missing | Signed/idempotent mock route | `lib/server/webhook-service.ts`, `/api/webhooks/mock`, tests |
| SaaS billing | UI-only | Persisted entitlement service | `platform_subscriptions`, entitlement tests |
| Tiers/quotes | Seed-only | Persisted tiers and immutable quotes | backend quote lifecycle test |
| Fan subscription | UI-only | Server pending/active membership flow | membership service test |
| Content/courses/YouTube | UI-only/missing | Server gating and video validation | content service tests |
| Patreon migration | UI-only | CSV parse/import/invite persistence | migration service test |
| Search | Static seed-only | Scoped DB search | search service test |
| API keys/webhooks/broadcasts | UI-only | API key and outbound webhook boundary | integration service test |
| Support/moderation/audit | Seed-only | Persisted records/transitions | content report moderation test |
| Live Stripe/tax/legal/prod infra | External | Still external | `docs/OWNER_NEXT_STEPS.md` |

## Residual External Gaps
- Stripe live account credentials, content-platform approval, Connect configuration, webhooks, payout/refund/dispute event access, and provider pricing verification.
- Tax/legal decisions for seller of record, indirect tax handling, recurring billing terms, refund policy, and guarantee wording.
- Production database, storage, email, secrets, observability, backups, domain, CDN/WAF, and closed-beta operational validation.

No remaining item in this audit is classified as internally solvable coding work.
