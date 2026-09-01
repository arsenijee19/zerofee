# Payments Architecture

Creator membership money is modeled as buyer to Stripe/provider to creator connected account. ZeroFee does not hold a custodial creator wallet and does not charge an application fee on creator membership revenue.

ZeroFee SaaS subscription revenue is separate platform billing paid by the creator to ZeroFee/PWRS LLC.

## Mock Mode
- Direct charges, onboarding requirements, balances, payouts, refunds, disputes, dunning, and webhooks are deterministic mock states.
- Every mock surface is visibly labelled `TEST MODE`.

## Stripe Boundary
- `.env.example` includes Stripe secret, webhook, and Connect configuration variables.
- Live use requires Stripe content-platform approval, Connect setup, live webhooks, provider pricing verification, and legal/tax review.
