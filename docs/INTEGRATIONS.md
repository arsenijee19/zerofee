# Integrations

Implemented mock boundaries:
- Discord entitlement role grant/revoke and resync.
- Telegram private-community invite/revoke.
- Signed outbound webhooks with HMAC, retries, SSRF guard, and disable policy.
- Creator API keys with scopes, rotation, revoke, and audit concepts.
- Broadcasts via mock email/in-app delivery.

Production OAuth credentials and email provider are external blockers.
