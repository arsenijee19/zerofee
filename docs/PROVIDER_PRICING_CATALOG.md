# Provider Pricing Catalog

The prototype contains versioned deterministic mock rules:
- `mock-ie-eea-card-consumer-eur-v1`
- `mock-us-domestic-commercial-fx-v1`

Each rule is persisted in PostgreSQL and records provider, source type, source reference, verified date, revalidation date, creator account country, issuer region, payment method family, card class, presentment/settlement currency, fee payer, fee confidence, status, and reviewer/audit metadata.

Rules do not power Guaranteed Earnings by themselves. A matching current `guarantee_eligibility_profiles` row must also be `ELIGIBLE`. New pricing versions can be inserted without mutating historical quote snapshots; they remain unusable for guarantees until an eligibility profile is approved.

Live Guaranteed Earnings requires verified provider pricing and external approval.
