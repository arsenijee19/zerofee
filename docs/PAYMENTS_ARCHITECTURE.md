# Payments Architecture

Creator membership money is modeled as buyer to payment provider to creator connected account. ZeroFee does not hold a custodial creator wallet and does not charge an application fee on creator membership revenue.

ZeroFee SaaS revenue is separate: creator to ZeroFee/PWRS LLC as a fixed software subscription.

## Implemented Test-Mode Flow
- Creator connected accounts are persisted in `creator_connected_accounts`.
- Member quotes are persisted as immutable `membership_price_quotes`.
- Quote acceptance creates a `membership_subscriptions` row in `PENDING_PAYMENT`.
- Provider success events activate subscriptions and persist `membership_payments`.
- Reconciliation persists actual provider fee, actual creator proceeds, ZeroFee platform fee of 0, surplus, shortfall, and provider reference.
- Shortfalls create `guarantee_incidents` and pause the unsafe eligibility profile in deterministic mock mode.

## Stripe Boundary
- `lib/server/providers.ts` contains the production Stripe adapter using Stripe SDK calls for Express connected accounts, account links, direct-charge PaymentIntents with `application_fee_amount: 0`, refunds, and balances.
- The live adapter is selected only when `CREATOR_PAYMENTS_PROVIDER=stripe` and required Stripe env vars are present.
- Mock and Stripe providers share the same service-facing interface.

## External Stripe Blockers
- Live Stripe secret key and webhook secret.
- Stripe Connect configuration and platform account approval for a content/membership platform.
- Final confirmation of fee responsibility, payout schedule, loss liability, account requirements, and embedded components.
- Provider pricing verification before any live Guaranteed Earnings route is production-enabled.

## Safety Rules
- Creator membership GMV and ZeroFee SaaS revenue are never mixed.
- Database checks enforce ZeroFee platform fee of 0 on quotes and reconciliations.
- Provider webhook records are idempotent by provider event id.
- Actual provider financial data is authoritative for reconciliation.
