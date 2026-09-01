# ZeroFee

ZeroFee is a first working prototype of a creator membership SaaS built around one promise:

**Creators choose what they earn. ZeroFee takes 0% of creator membership revenue.**

The app runs in deterministic test mode with a real PostgreSQL schema, server-side auth/session services, RBAC checks, persisted creator applications, tiers, quotes, memberships, payment reconciliations, migration imports, API keys, webhooks, content gating, moderation records, and scoped search. Live third-party calls are behind provider interfaces and remain explicitly not configured until credentials and approvals exist.

## Run Locally

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npm run db:migrate
npm run seed
npm run dev
```

Open `http://localhost:3000`.

If you already have local PostgreSQL on port 5432, set `DATABASE_URL=postgresql://127.0.0.1:5432/zerofee` before running migration and seed.

## Verify

```bash
npm run typecheck
npm test
npm run lint
npm run build
npm run test:e2e
```

`pnpm verify` runs migration, seed, typecheck, tests, build, and E2E in sequence. The release pass for this commit also verified `npm ci --legacy-peer-deps --ignore-scripts --no-audit --no-fund` and a fresh temporary PostgreSQL database.

## Test Mode

The prototype is intentionally labelled `TEST MODE`.

- `CREATOR_PAYMENTS_PROVIDER=mock`
- `PLATFORM_BILLING_PROVIDER=mock`
- `TAX_PROVIDER=mock`
- Live Stripe credentials are not committed.

Live Stripe, tax, legal, and production infrastructure require the owner actions listed in `docs/OWNER_NEXT_STEPS.md`.
