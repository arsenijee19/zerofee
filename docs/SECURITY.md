# Security

## Threat Model
- Actors: visitor, member, creator, admin, payment provider, external integration receiver.
- Sensitive assets: sessions, password hashes, verification/reset tokens, provider references, quote snapshots, reconciliation data, migration emails, paid content, API keys, webhook secrets, KYC status.
- Trust boundaries: browser/client, server services, PostgreSQL, payment provider, outbound webhooks, creator uploads/imports.

## Implemented Controls
- Passwords use scrypt hashes with per-password salt.
- Sessions are stored server-side as hashed tokens and exposed through HTTP-only cookie helpers.
- Email verification and password reset tokens are stored hashed and expire.
- Creator-owned operations call `requireCreatorOwner`; admin operations require `ADMIN`.
- Paid content access is checked server-side against active memberships.
- Quotes are created server-side from persisted tier price versions and provider catalogs.
- ZeroFee platform fee is constrained to 0 in quote and reconciliation tables.
- Webhooks require HMAC signatures and are idempotent by provider event id.
- Outbound webhook URLs reject localhost, private IP ranges, userinfo, and non-HTTPS schemes.
- Rich text strips scripts, inline event handlers, and `javascript:` URLs.
- Upload validation checks filename, MIME allowlist, size, and magic bytes.
- CSV migration import neutralizes spreadsheet formula injection cells.
- API keys are stored hashed, scoped, creator-bound, and revocable.
- Search service scopes creator results to the authenticated creator tenant; admin search is role-gated.

## Verification
- 19 Vitest tests passed, including pricing invariants, cross-creator search isolation, API key isolation/revoke, webhook signature/idempotency, creator self-approval bypass, paid-content bypass, upload spoofing, YouTube allowlist, CSV validation, SSRF blocking, and shortfall incident creation.
- 8 Playwright journeys passed across desktop and mobile.

## Remaining Production Security Work
- External penetration test.
- Production rate limiting and abuse monitoring.
- CSRF enforcement on all mutating browser routes once full form/API mutation surfaces are exposed.
- KYC payload minimization/redaction review with live provider payloads.
- Production secrets manager, audit export retention policy, WAF/CDN, backup restore drills.
