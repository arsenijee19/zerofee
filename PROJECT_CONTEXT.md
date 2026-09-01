# Project Context

## Project Overview

- ZeroFee is a creator membership SaaS prototype where creators choose target earnings and ZeroFee takes 0% of creator membership revenue.
- Intended users are creators, paying members and ZeroFee operators.

## Current Project Status

- Production routes are server-rendered and PostgreSQL-backed in deterministic test mode.
- The original visual state machine is preserved only at the explicit /demo route.
- Live Stripe, tax, email, object storage, OAuth integrations and production infrastructure are external blockers.

## File Structure

- app/: Next.js App Router pages and API routes.
- components/route-ui.tsx: shared public, creator, member and admin route UI.
- components/zerofee-app.tsx: preserved deterministic demo shell.
- db/migrations/: executable PostgreSQL schema migrations.
- lib/domain/: money-safe pricing, reconciliation and domain types.
- lib/server/: database, auth, RBAC, applications, billing, pricing, memberships, providers, content, migration, search, webhooks and integrations.
- scripts/e2e-prepare.ts: isolated test database reset, migration and seed.
- tests/: unit, PostgreSQL integration, real browser flow, accessibility and screenshot tests.
- docs/: architecture, payments, pricing, tax, migration, security, QA, execution state and owner actions.

## Architecture and Technical Decisions

- Framework: Next.js App Router, TypeScript, React and custom CSS.
- Database: PostgreSQL through pg; migrations are plain SQL.
- Auth: scrypt password hashes, verification/reset tokens, database sessions and HTTP-only cookies.
- Authorization: member/creator/admin roles plus creator ownership policies at service and action boundaries.
- Money: integer minor units, explicit currencies, basis-point provider pricing, deterministic rounding and immutable quote snapshots.
- Payments: creator membership GMV is modeled as buyer-to-provider-to-connected-creator; ZeroFee platform fee is constrained to 0.
- Providers: deterministic mock provider and Stripe SDK adapter share one creator-payments interface.
- Search: DB-backed creator/admin scoped search and a protected search API.

## Setup and Execution

- Copy .env.example to .env.
- Start PostgreSQL with docker compose up -d postgres, or use local PostgreSQL on port 5432.
- Run npm install, npm run db:migrate, npm run seed and npm run dev.
- Open http://localhost:3000.
- Verify with npm run typecheck, npm test, npm run lint, npm run build and npm run test:e2e. The current release pass has 20 Vitest tests and 14 Playwright desktop/mobile runs.

## Important Business Logic

- ZeroFee membership platform fee is always 0; database checks enforce this for quotes and reconciliations.
- Guaranteed Earnings requires a current provider pricing rule and an eligible, non-stale guarantee profile.
- The solver finds the lowest legal minor-unit retail price whose modeled creator proceeds meet the target.
- Creator surplus remains creator proceeds. A shortfall creates an incident and pauses the affected eligibility profile.
- Provider webhook events are signature-checked and idempotent by provider event ID.
- Patreon migration imports audience data only. It never claims payment credentials moved; fans authorize new subscriptions.

## Recent Changes

- Added public, creator, member and admin routes backed by real server actions and PostgreSQL.
- Added recurring direct-charge provider subscriptions, lifecycle events, Stripe webhook route and integration entitlement events.
- Added isolated E2E database preparation, real browser journeys, CI browser installation and fresh visual QA screenshots.
- Added current acceptance matrix, execution ledger and remaining gap audit.

## Known Issues and External Dependencies

- Docker was unavailable locally; verification used Homebrew PostgreSQL 17.
- Stripe live credentials/approval, tax/legal review, production storage/email/observability and live integrations are not configured.
- Local development screenshots may show the Next development indicator; production builds do not.

## LLM Handoff Notes

- Read prompts/README.md, Prompt 5, docs/EXECUTION_STATE.md, docs/V1_ACCEPTANCE_MATRIX.md and this file first.
- Preserve integer-money invariants and the zero-platform-fee constraints.
- Do not route production traffic through the /demo state machine or add silent database fallbacks.
