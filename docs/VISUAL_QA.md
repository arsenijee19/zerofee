# Visual QA

Updated: 2026-09-01

## Screenshot List

- 44 fresh screenshots captured under test-results/screenshots from the real route implementation.
- Coverage includes homepage, pricing, migration, public creator page, creator dashboard, tiers, content, earnings, payouts, migration, integrations, API/webhooks, member dashboard, memberships, billing, notifications, admin overview, applications, guarantee health, pricing catalog, webhooks, and audit.
- Both desktop and mobile screenshots were captured with the Playwright Desktop Chrome and Pixel 5 projects.

## Issues Discovered

- The real-route pass found long dynamic tier names wrapping poorly in public cards.
- Earlier mobile review found clipped product navigation and weak financial number hierarchy.
- Local Next development renders its development indicator.

## Fixes Made

- Added anywhere wrapping for dynamic tier headings.
- Changed public card layout to responsive auto-fit columns.
- Preserved compact mobile navigation and semantic financial metric styling.
- Re-captured the affected real routes and representative regression screens.

## Remaining Limitations

- Live Stripe embedded components cannot be visually verified without credentials and approval.
- Device-specific rendering should be checked again in closed beta.
- The local development indicator is absent from production builds.
