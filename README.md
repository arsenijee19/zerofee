# ZeroFee

ZeroFee is a first working prototype of a creator membership SaaS built around one promise:

**Creators choose what they earn. ZeroFee takes 0% of creator membership revenue.**

The app runs in deterministic test mode and demonstrates the complete business journey from visitor onboarding through creator approval, mock Connect setup, SaaS billing, tier creation, Guaranteed Earnings quoting, buyer checkout, provider-authoritative reconciliation, content entitlement, migration, integrations, support, and admin operations.

## Run Locally

```bash
pnpm install
pnpm db:migrate
pnpm seed
pnpm dev
```

Open `http://localhost:3000`.

## Verify

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

`pnpm verify` runs migration, seed, typecheck, tests, build, and E2E in sequence.

## Test Mode

The prototype is intentionally labelled `TEST MODE`.

- `CREATOR_PAYMENTS_PROVIDER=mock`
- `PLATFORM_BILLING_PROVIDER=mock`
- `TAX_PROVIDER=mock`
- Live Stripe credentials are not committed.

Live Stripe, tax, legal, and production infrastructure require the owner actions listed in `docs/OWNER_NEXT_STEPS.md`.
