# Project Context

## Project Overview
- ZeroFee is a creator membership SaaS prototype where creators choose target earnings and ZeroFee takes 0% of creator membership revenue.
- The prototype demonstrates creator onboarding, mock Connect payout setup, SaaS billing separation, Guaranteed Earnings pricing, buyer checkout, reconciliation, content entitlement, migration, integrations, support, admin oversight, and visual QA.
- Intended users are creators with meaningful recurring audience revenue, their members, and ZeroFee operators.

## Current Project Status
- Complete deterministic mock-mode V1 prototype implemented in a single Next.js app.
- Financial engine uses integer minor units, explicit currencies, versioned pricing rules, guarantee eligibility profiles, immutable quote snapshots, and reconciliation states.
- Stripe, tax, email, storage, Discord, Telegram, and platform billing production boundaries are represented and fail safely as not configured; mock/test mode is fully demonstrable.
- PostgreSQL schema is provided as a migration reference; local prototype persistence is deterministic seed JSON rather than a running database in this environment.
- Untested areas: live Stripe, real tax law, production infrastructure, live email, real OAuth providers, and legal/compliance policies.

## File Structure
- `app/`: Next.js App Router entry and global styles.
- `components/zerofee-app.tsx`: end-to-end interactive product prototype.
- `lib/money.ts`: integer minor-unit money utilities.
- `lib/domain/pricing.ts`: Guaranteed Earnings solver and reconciliation service.
- `lib/domain/seed.ts`: deterministic mock provider data and product state.
- `lib/domain/types.ts`: domain state and financial type definitions.
- `scripts/migrate.ts`: writes PostgreSQL schema reference.
- `scripts/seed.ts`: writes deterministic seed-state evidence.
- `tests/`: Vitest financial/security tests and Playwright journeys/screenshot QA.
- `docs/`: implementation, architecture, payment, tax, migration, design, QA, and owner next-step documentation.

## Architecture & Technical Decisions
- Framework: Next.js App Router with TypeScript and React.
- UI: custom CSS tokens and components using a light SaaS visual system with Electric Blue accents.
- Money: all financial calculations use integer minor units; no binary floating point for money.
- Payments: creator membership payments are modeled as direct provider-to-creator connected-account flows; ZeroFee SaaS billing is separate.
- Providers: mock provider is deterministic; Stripe SDK dependency and env boundary are included for future live integration.
- Database: PostgreSQL schema reference created by migration script; DB-backed ORM is a production follow-up.
- Auth/RBAC: prototype documents and tests permission boundaries; seeded roles demonstrate member/creator/admin flows.

## Setup & Execution
- Install: `pnpm install`
- Migrate schema reference: `pnpm db:migrate`
- Seed deterministic data: `pnpm seed`
- Dev server: `pnpm dev`
- Typecheck: `pnpm typecheck`
- Tests: `pnpm test`
- E2E/screenshots: `pnpm test:e2e`
- Build: `pnpm build`
- Full verification: `pnpm verify`

## Important Business Logic
- `zerofee_membership_platform_fee_bps` is always 0.
- Creator surplus belongs entirely to the creator.
- A creator shortfall becomes a Guarantee Breach/incident.
- Guaranteed Earnings requires a current pricing rule and eligible profile; unknown routes are blocked.
- Buyer final retail price is solved as the lowest legal minor-unit amount satisfying creator target after tax/provider costs.
- Migration never claims payment credentials moved; fans must authorize new subscriptions.

## Recent Changes
- Bootstrapped the full prototype from a spec-only repository.
- Added financial engine, deterministic seed data, UI surfaces, tests, docs, and QA scripts.

## Current Priorities
- Replace schema-reference persistence with real PostgreSQL/ORM migrations.
- Complete live Stripe Connect configuration after external approval.
- Add production auth/email/storage infrastructure.
- Run closed-beta live fee validation before enabling live Guaranteed Earnings.

## Known Issues
- Live Stripe/tax/legal capabilities are not configured.
- Persistence is prototype/demo oriented in this environment.
- Some advanced provider embedded components are represented by mock states.

## LLM Handoff Notes
- Read `prompts/1_INITIAL_PROTOTYPE_MASTER_EXECUTION_PROMPT.md`, `prompts/2_DESIGN_SYSTEM_AND_UX_MASTER_PROMPT.md`, `lib/domain/pricing.ts`, and `PROJECT_CONTEXT.md` first.
- Do not weaken money invariants or introduce floating-point money math.
- Keep ZeroFee SaaS billing separate from creator membership GMV.
- Do not call live payment/tax/legal capabilities complete without external verification.
