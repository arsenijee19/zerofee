# Project Context

## Project Overview
- ZeroFee is a creator membership SaaS prototype where creators choose target earnings and ZeroFee takes 0% of creator membership revenue.
- Intended users are creators, their paying members, and ZeroFee platform operators.
- The product demonstrates creator onboarding, country eligibility, compliance review, connected-account setup, SaaS billing separation, Guaranteed Earnings pricing, member checkout, provider reconciliation, content entitlement, Patreon migration, integrations, support, and admin oversight.

## Current Project Status
- V1 backend conversion is implemented in deterministic test mode with PostgreSQL persistence and server-authoritative domain services.
- The existing Prompt 2 visual prototype is preserved and now loads runtime state from PostgreSQL when available, with static seed fallback only for unavailable local DB preview.
- Live Stripe, tax, email, storage, Discord, Telegram, and production infrastructure are not configured and are documented as external blockers.
- Verification passed on 2026-09-01: typecheck, lint, 19 Vitest tests, production build, 8 Playwright desktop/mobile E2E and screenshot tests, clean `npm ci`, and a fresh temporary PostgreSQL migration/seed/test pass.

## File Structure
- `app/`: Next.js App Router page, API routes, and global styles.
- `components/zerofee-app.tsx`: interactive visitor, creator, member, and admin UI shell.
- `db/migrations/001_initial.sql`: executable PostgreSQL schema.
- `lib/domain/`: money-safe pricing, reconciliation, seed/demo domain types.
- `lib/server/`: DB, auth, RBAC policies, creator applications, billing entitlements, pricing, membership payment activation, providers, content, migration, search, webhooks, integrations, and security utilities.
- `scripts/migrate.ts`: applies SQL migrations and records `schema_migrations`.
- `scripts/seed.ts`: idempotently seeds deterministic users, countries, plans, creator state, provider catalog, tiers, content, and notifications.
- `tests/`: financial/security unit tests, PostgreSQL-backed integration tests, browser flows, and screenshot capture tests.
- `docs/`: product, architecture, payment, tax, migration, security, visual QA, execution ledger, and owner next steps.

## Architecture & Technical Decisions
- Framework: Next.js App Router, TypeScript, React, custom CSS.
- Database: PostgreSQL via `pg`; migrations are plain SQL for auditability.
- Auth: email/password with scrypt hashes, verification tokens, password resets, database sessions, and HTTP-only cookie helpers.
- Authorization: explicit member/creator/admin roles plus creator ownership checks in server services.
- Money: integer minor units, explicit currencies, basis-point fees, deterministic rounding, immutable quote snapshots.
- Payments: creator membership GMV is modeled as buyer-to-provider-to-creator connected account; ZeroFee platform fee is constrained to 0 in the database.
- Provider boundary: `MockCreatorPaymentsProvider` is deterministic; `StripeCreatorPaymentsProvider` contains live Stripe SDK calls behind env gates.
- Search: DB-backed scoped search for creator/admin contexts to avoid cross-tenant exposure.

## Setup & Execution
- Copy env: `cp .env.example .env`
- Docker database: `docker compose up -d postgres`
- Install: `npm install`
- Migrate: `npm run db:migrate`
- Seed: `npm run seed`
- Dev: `npm run dev`
- Verify: `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, `npm run test:e2e`
- Full scripted verification: `pnpm verify`
- Local Homebrew PostgreSQL can be used with `DATABASE_URL=postgresql://127.0.0.1:5432/zerofee`.

## Important Business Logic
- ZeroFee membership platform fee is always 0; database checks enforce `platform_fee_minor = 0` and `zero_fee_platform_fee_minor = 0`.
- Guaranteed Earnings requires a current provider pricing rule plus an eligible guarantee profile; unverified or stale routes cannot issue guaranteed quotes.
- The solver finds the lowest minor-unit retail price whose modeled creator proceeds meet or exceed the creator target.
- Creator surplus belongs entirely to the creator. A shortfall creates a guarantee incident and pauses the unsafe eligibility profile in test mode.
- Payment webhooks require valid HMAC signatures and are idempotent by provider event id.
- Patreon migration imports audience data only; it never claims card credentials moved. Fans must authorize new subscriptions.

## Recent Changes
- Added executable PostgreSQL migration, idempotent seed, and server DB harness.
- Added auth/session/RBAC, creator application review, SaaS entitlement checks, pricing catalog, tier/quote persistence, mock/Stripe provider boundary, membership payment activation, reconciliation incidents, content/course gating, Patreon CSV import, scoped search, webhooks, API keys, SSRF guard, and upload/rich-text protections.
- Added PostgreSQL-backed backend tests and updated docs/ledger for Prompt 5 execution.
- Updated the app entry to load runtime state from PostgreSQL with safe local fallback.

## Current Priorities
- Complete live Stripe account approval and configure real credentials.
- Have tax/legal counsel validate merchant responsibility, recurring billing terms, refund policy, and `Guaranteed Earnings` wording.
- Provision production DB, storage, email, observability, secrets, backups, domain, CDN/WAF.
- Run closed beta with real creators to validate live provider fees, KYC, payouts, disputes, support load, and unit economics.

## Known Issues
- Docker was unavailable in this local environment; release DB verification used Homebrew PostgreSQL 17 on port 5432.
- Live Stripe, tax, email, storage, Discord, Telegram, and production infrastructure remain external/not configured.
- The browser screenshot suite uses Next dev server, so screenshots can show the Next development indicator in local runs.

## LLM Handoff Notes
- Read `prompts/README.md`, `prompts/5_COMPLETE_REMAINING_V1_BACKEND_EXECUTION_PROMPT.md`, `docs/EXECUTION_STATE.md`, `docs/V1_ACCEPTANCE_MATRIX.md`, and this file first.
- Do not weaken money invariants or introduce floating-point money math.
- Do not mix ZeroFee SaaS billing with creator membership GMV.
- Keep live provider capabilities marked external until credentials, provider approval, tax/legal review, and production infrastructure are actually configured.
