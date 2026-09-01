# Security

Threat model:
- Users: visitor, member, creator, admin.
- Sensitive assets: sessions, provider references, reconciliation data, migration emails, paid content, API keys, webhook secrets.
- Trust boundaries: browser/client, server/domain layer, payment provider, mock providers, admin operations.

Implemented checks:
- cross-creator IDOR test;
- webhook signature rejection test;
- localhost SSRF webhook target rejection;
- CSV formula injection sanitization;
- quote/guarantee calculations server-side in domain service.

Production hardening:
- real auth/session store;
- CSRF on mutating routes;
- upload MIME sniffing;
- rich text sanitization;
- centralized rate limiting;
- third-party penetration test;
- KYC payload redaction audit.
