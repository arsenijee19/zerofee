# Owner Next Steps

## Code Complete
- PostgreSQL-backed deterministic V1 prototype.
- Auth, email verification token flow, password reset token flow, database sessions, RBAC and creator ownership policies.
- Creator country eligibility, creator profile/application submission, admin compliance approval, audit and notifications.
- Mock connected-account onboarding state and Stripe Connect adapter boundary.
- ZeroFee SaaS plans/subscription persistence and entitlement checks.
- Membership tiers, Guaranteed Earnings quotes, Simple Price-capable schema, immutable quote snapshots and buyer final price display.
- Provider-authoritative mock payment confirmation, reconciliation, creator surplus, shortfall incidents, unsafe route pause, refunds/disputes/payout boundary.
- Paid content gating, courses/lessons with YouTube-only video references, upload validation, content reports and admin moderation.
- Patreon/generic CSV migration import, validation, tier mapping, invitation token generation and conversion-state schema.
- Creator/admin scoped search, API keys, outbound webhook endpoint validation, support/audit records.
- Desktop/mobile visual prototype and screenshot QA evidence.

## Owner Input Required
- Final SaaS plan pricing, quotas and overage policy.
- Initial launch countries and waitlist policy.
- Creator category/acceptable-use policy.
- Commercial refund, support escalation and dispute policies.
- Closed-beta creator selection and operating thresholds.

## Stripe Required
- Stripe content-platform approval for creator memberships and paid content.
- Live Connect configuration, platform account capabilities and connected-account onboarding settings.
- Confirmation of direct-charge topology, fee payer, payout schedule, reserve/loss liability and dispute handling.
- Live Stripe secret key, webhook secret, Connect client/settings and webhook endpoint registration.
- Embedded components enablement and production UI validation.
- Live provider pricing verification before any production Guaranteed Earnings profile is enabled.
- Live refund, dispute, balance and payout event validation.

## Tax / Legal Required
- Merchant/seller responsibility determination for creator memberships.
- VAT/GST/sales tax obligations by launch country.
- Creator agreement, member terms, privacy policy, refund policy and recurring billing disclosures.
- Review of `Guaranteed Earnings` wording and required disclaimers.
- Reporting obligations, records retention and KYC/privacy posture.

## Production Infrastructure
- Production PostgreSQL database and migration workflow.
- Domain/DNS, TLS, CDN/WAF and deployment target.
- Object storage and malware scanning for creator files.
- Email provider and deliverability setup.
- Secrets manager and environment separation.
- Observability, error tracking, metrics, alerting and audit export retention.
- Backup/restore, disaster recovery and incident response runbooks.

## Closed Beta
- Onboard real creators through live KYC.
- Validate live provider fees against quote catalog before enabling Guaranteed Earnings.
- Run real payouts, renewals, cancellations, refunds and disputes.
- Execute real Patreon migration campaigns without claiming card migration.
- Measure support load, failed payments, dunning outcomes and unit economics.
