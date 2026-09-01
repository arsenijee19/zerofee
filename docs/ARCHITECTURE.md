# Architecture

ZeroFee is a Next.js App Router prototype with a PostgreSQL-backed domain layer and deterministic mock providers for unavailable third-party systems.

## Runtime Shape
- `app/page.tsx` is a server-rendered entry that loads runtime state from PostgreSQL through `lib/server/app-state.ts`.
- `components/zerofee-app.tsx` preserves the Prompt 2 product shell and renders visitor, creator, member, and admin surfaces.
- API routes exist for health, scoped search, paid-content access, and signed mock provider webhooks.

## Backend Services
- `lib/server/db.ts`: shared PostgreSQL pool and transaction helper.
- `lib/server/auth.ts`: scrypt password hashing, email verification, password reset tokens, sessions.
- `lib/server/policies.ts`: role and creator ownership authorization.
- `lib/server/application-service.ts`: creator profile, application submission, admin review, audit/notification.
- `lib/server/billing-service.ts`: ZeroFee SaaS plan activation and entitlement checks.
- `lib/server/pricing-service.ts`: persisted tiers, provider catalog lookup, immutable quote snapshots.
- `lib/server/membership-service.ts`: quote acceptance, mock/provider payment creation, subscription activation, entitlement checks, reconciliation incidents.
- `lib/server/providers.ts`: deterministic mock provider plus Stripe SDK adapter boundary.
- `lib/server/content-service.ts`: paid posts, courses, YouTube validation, upload validation, moderation.
- `lib/server/migration-service.ts`: Patreon/generic CSV parse, validation, mapped import rows, secure invitation tokens.
- `lib/server/search-service.ts`: creator/admin scoped search.
- `lib/server/webhook-service.ts`: HMAC verification and idempotent provider event handling.
- `lib/server/integration-service.ts`: creator API keys and outbound webhook endpoint validation.

## Database
- Migrations are executable SQL files under `db/migrations`.
- `schema_migrations` records applied migration names and checksums.
- Key tables cover users, roles, sessions, country capabilities, creators, applications, connected accounts, SaaS subscriptions, provider pricing rules, guarantee eligibility profiles, tiers, quotes, member subscriptions, payments, reconciliations, incidents, content, courses, migration projects, webhooks, API keys, support, reports, notifications, and audit logs.

## Provider Boundaries
- Creator payments: `CREATOR_PAYMENTS_PROVIDER=mock|stripe`.
- Platform billing: represented as persisted SaaS subscriptions, with live Stripe Billing externally blocked until configured.
- Tax: `TAX_PROVIDER=mock|stripe_tax|disabled`; architecture is persisted and documented, professional validation remains external.
- Community/email/storage providers are represented by secure boundaries and mock/test records until credentials exist.

## Verification
- `npm test`: 19 unit/integration tests across pricing, security, and PostgreSQL-backed backend services.
- `npm run test:e2e`: 10 Playwright desktop/mobile journeys including accessibility smoke and screenshot capture.
- Release verification included clean `npm ci`, fresh temporary PostgreSQL migration/seed/test, lint, typecheck, build, and full `pnpm verify`.
