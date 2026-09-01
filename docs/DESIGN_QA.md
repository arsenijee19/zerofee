# Design QA

Screenshot QA is executed through `npm run test:e2e` or `pnpm qa:screenshots`, which captures desktop and mobile evidence under `test-results/screenshots`.

Coverage:
- homepage and pricing;
- marketing migration;
- signup, creator application, and payout onboarding;
- creator dashboard, tier builder, earnings, verification, payouts, tax, members, content, migration, integrations, broadcasts, API/webhooks;
- public creator page, checkout review, member dashboard, locked content;
- admin overview, command search, applications, creator detail, guarantee health, pricing catalog, countries, webhooks, support, and audit.

Inspected criteria:
- hierarchy;
- consistency;
- typography;
- spacing;
- CTA clarity;
- financial labels;
- table usability;
- mobile overflow;
- status clarity.

Fixes applied:
- responsive tables convert to stacked rows;
- top navigation wraps on mobile;
- product navigation wraps into compact rows on phone viewports;
- financial metrics use tabular numerals;
- status colors are semantic and text-labelled.

Remaining limitations:
- Visual QA is browser-rendered but not a substitute for live device QA.
