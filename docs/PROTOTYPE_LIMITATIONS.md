# Prototype Limitations

- Live Stripe Connect is not configured.
- Provider pricing catalog uses deterministic test-only profiles.
- Tax is mock-mode only.
- PostgreSQL persistence is implemented and verified locally; Docker was unavailable in this environment, so release verification used Homebrew PostgreSQL 17.
- Auth/session persistence is implemented; live email delivery, production storage and OAuth providers are not configured.
- Legal/compliance documents are architecture placeholders requiring counsel.
- Closed-beta live payment validation is still required before launch.
- Local dev screenshot captures can show the Next development indicator; production build output does not.
