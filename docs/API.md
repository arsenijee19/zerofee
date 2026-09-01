# API

Prototype API surface is implemented through server services and selected Next API routes.

Implemented routes:
- `GET /api/health`: database/provider mode health without secrets.
- `GET /api/search?q=...`: session-backed creator/admin scoped search.
- `GET /api/content/[postId]`: server-side paid-content entitlement check.
- `POST /api/webhooks/mock`: signed/idempotent mock provider events.

Implemented service APIs:
- Auth/session/email verification/password reset.
- Creator profile/application review.
- SaaS billing entitlement checks.
- Tier creation/publish and server-authoritative quote creation.
- Quote acceptance, payment activation, reconciliation and guarantee incidents.
- Patreon CSV import and migration invitations.
- Creator API keys: scoped, hashed, one-time displayed and revocable.
- Outbound webhook endpoints with SSRF validation.

Production public API expansion still needs rate limiting, OpenAPI publishing, and account-level quota policy.
