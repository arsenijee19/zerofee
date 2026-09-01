# Stripe Connect Implementation Decision

Decision date: 2026-09-01

## Decision
ZeroFee models creator membership payments as Stripe Connect direct charges to the creator connected account. ZeroFee SaaS billing remains separate platform revenue paid by creators to ZeroFee/PWRS LLC.

The repository implements:
- a deterministic mock provider for local/test execution;
- a Stripe SDK adapter behind the same creator-payments interface;
- connected account creation and onboarding-link boundary;
- direct-charge PaymentIntent boundary with ZeroFee application fee set to 0;
- refund and balance retrieval boundaries;
- signed/idempotent webhook processing for provider-authoritative payment confirmation and reconciliation.

## Rationale
- The ZeroFee promise requires creator GMV to stay separate from ZeroFee SaaS revenue.
- Direct connected-account charges keep creator payment records independently provider-verifiable where Stripe supports it.
- Guaranteed Earnings cannot use live routes until fee rules are verified and represented in versioned provider pricing and eligibility profiles.

## Official Stripe Sources Consulted
- [Stripe Connect marketplace onboarding tasks](https://docs.stripe.com/connect/marketplace/tasks/onboard?locale=en-GB)
- [Stripe Connect SaaS onboarding tasks](https://docs.stripe.com/connect/saas/tasks/onboard?locale=en-GB)
- [Stripe connected accounts](https://docs.stripe.com/connect/accounts)
- [Stripe Connect embedded components guide](https://docs.stripe.com/connect/get-started-connect-embedded-components?locale=en-GB)
- [Stripe Connect direct charges](https://docs.stripe.com/connect/direct-charges)
- [Stripe webhooks](https://docs.stripe.com/webhooks)

## Live Blockers
- Stripe account approval for this exact creator membership/content platform.
- Live Connect configuration and account capabilities.
- Live webhook signing secret and endpoint registration.
- Provider pricing verification and route approval for Guaranteed Earnings.
- Final legal/tax/loss-liability decisions.

Until those are complete, the live Stripe capability is `BLOCKED_EXTERNAL`; deterministic mock mode remains fully demonstrable.
