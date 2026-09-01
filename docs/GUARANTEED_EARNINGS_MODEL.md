# Guaranteed Earnings Model

Creators choose a Creator Earnings Target. The server calculates the lowest valid buyer retail amount where modeled creator proceeds are at least that target.

The model distinguishes platform country, creator connected-account country, business type, buyer tax country, issuer region, payment method family, card class, domestic/cross-border status, presentment currency, settlement currency, FX, billing interval, provider fee profile, tax profile, and eligibility profile.

Outcomes:
- `actual == target`: exact target met.
- `actual > target`: Creator Surplus; all surplus belongs to creator.
- `actual < target`: Guarantee Shortfall; visible financial incident.

Unknown or stale routes cannot create Guaranteed Earnings quotes.

## Persistence
- Provider rules live in `provider_pricing_rules`.
- Eligibility profiles live in `guarantee_eligibility_profiles`.
- Every buyer quote is saved in `membership_price_quotes` with target, retail, tax, modeled provider cost, modeled creator proceeds, pricing rule version, eligibility profile version, full payment context snapshot, expiration and status.
- Provider actuals are saved in `membership_payments` and `guarantee_reconciliations`.
- Shortfalls create `guarantee_incidents` and pause the unsafe eligibility profile in deterministic test mode.
