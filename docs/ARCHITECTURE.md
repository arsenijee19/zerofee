# Architecture

ZeroFee is implemented as a single Next.js App Router prototype with TypeScript domain services and deterministic mock providers.

## Main Components
- `components/zerofee-app.tsx`: visitor, onboarding, creator, member, and admin product surfaces.
- `lib/domain/pricing.ts`: pricing rule lookup, guarantee eligibility, minor-unit retail solver, reconciliation.
- `lib/domain/seed.ts`: seeded users, countries, applications, tiers, quotes, reconciliation, migrations, integrations, support tickets.
- `scripts/migrate.ts`: PostgreSQL schema reference for core entities.

## Provider Boundaries
- Creator payments: `mock|stripe`
- Platform billing: `mock|stripe`
- Tax: `mock|stripe_tax|disabled`
- Email/storage/community integrations: mock-first boundaries documented for production.

## Security Boundaries
- UI navigation is not treated as authorization.
- Security tests cover cross-creator access, webhook signature rejection, SSRF URL blocking, and CSV injection protection.
