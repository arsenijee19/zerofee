# ZeroFee — SaaS Design System & UX Master Execution Prompt

**Prompt version:** 2.0  
**Status:** AUTHORITATIVE VISUAL / UX SPECIFICATION  
**Repository:** `arsenijee19/zerofee`

---

# 0. GOAL

Transform the complete functional ZeroFee prototype defined by `prompts/1_INITIAL_PROTOTYPE_MASTER_EXECUTION_PROMPT.md` into a **cohesive, premium, production-quality SaaS interface** across marketing, member, creator, and admin surfaces.

This is a DESIGN / UX execution prompt.

It must NOT redefine:

- payment topology;
- Guaranteed Earnings mathematics;
- Stripe/Connect responsibilities;
- taxes;
- permissions;
- creator/member lifecycle;
- migration rules;
- financial terminology;
- security behavior;
- database/domain behavior.

Prompt 1 remains authoritative for product/business logic.

Prompt 2 is authoritative for:

- visual language;
- information hierarchy;
- layout;
- navigation;
- density;
- typography;
- color;
- component styling;
- responsive behavior;
- micro-interactions;
- loading/empty/error presentation;
- dashboard composition;
- search UX;
- screenshot-based visual QA.

The final output must feel like **one intentional product**, not separate AI-generated screens.

---

# 1. REFERENCE DESIGN DIRECTION

Primary reference family:

**designprompts.dev — SaaS / Light design direction**

Reference URL:

`https://www.designprompts.dev`

The observed SaaS direction is a clean, modern, design-forward light SaaS system characterized by:

- clean light product surfaces;
- strong blue CTA/accent language;
- confident typographic scale;
- modern startup/product energy;
- an Electric Blue-led visual identity;
- restrained gradient use for emphasis;
- sophisticated display/body typography pairing;
- animated/interactive hero product graphics;
- occasional inverted dark contrast sections;
- controlled micro-interactions;
- feature-focused layout;
- large but disciplined landing-page rhythm;
- clear conversion hierarchy;
- polished product dashboard visuals;
- a design system that avoids generic “purple AI SaaS” appearance.

The SaaS reference family uses a dual-font idea commonly represented by **Calistoga + Inter**. Adapt this intelligently rather than blindly applying display typography inside dense financial tables.

For ZeroFee:

- use **Calistoga** or a compatible licensed display serif only for selected marketing display headlines / high-emphasis editorial moments;
- use **Inter** or an equivalent modern product sans for application UI, body text, forms, tables, financial numbers, admin panels, and dense product surfaces;
- use tabular numerals for monetary values where available.

Do NOT copy demo branding, demo content, fake companies, unrelated visual assets, or source-page text.

Do NOT create a pixel clone of designprompts.dev.

Reproduce the **design grammar and quality bar**, adapted specifically to ZeroFee's financial-creator product.

---

# 2. DESIGN NORTH STAR

ZeroFee visually needs to communicate four things simultaneously:

1. **Financial trust** — the user must believe the numbers.
2. **Creator independence** — not a bank-like oppressive enterprise product.
3. **Software clarity** — users should understand every workflow quickly.
4. **Anti-greed confidence** — bold positioning without looking gimmicky or rebellious for the sake of it.

Desired personality:

- premium;
- clear;
- confident;
- transparent;
- modern;
- calm;
- slightly distinctive;
- financially credible;
- creator-friendly;
- not corporate-boring;
- not playful-fintech childish;
- not crypto/Web3;
- not dark hacker UI;
- not Patreon clone;
- not Stripe clone.

Core visual phrase:

> **Calm financial precision with modern creator-SaaS energy.**

---

# 3. EXECUTION CONTRACT — DO NOT REDESIGN FOREVER

Before changing UI:

1. read Prompt 1 completely;
2. read current `docs/EXECUTION_STATE.md`;
3. inspect every existing route/component;
4. identify current shared primitives/design tokens;
5. preserve correct product functionality;
6. create/update `docs/DESIGN_SYSTEM.md`;
7. execute the redesign once, systematically;
8. run bounded screenshot QA;
9. fix identified visual defects;
10. perform one verification screenshot pass;
11. stop when acceptance criteria are met.

Do not repeatedly redesign subjective details after they are coherent and usable.

Do not rebuild backend/domain features simply because UI is being redesigned.

Do not replace functioning domain components with fake static data.

Every redesigned screen must remain connected to real seeded/domain data.

---

# 4. DESIGN TOKENS

Create centralized semantic tokens. Exact implementation may use CSS variables/Tailwind theme tokens.

## 4.1 Light foundation

Recommended direction:

- App background: cool near-white, approximately `#F7F9FC` / equivalent OKLCH.
- Primary surface: `#FFFFFF`.
- Elevated/secondary surface: subtle cool blue-gray.
- Primary text: deep ink/navy, approximately `#0B1220`.
- Secondary text: cool slate, approximately `#647087`.
- Muted text: lighter slate but maintain contrast.
- Border: quiet cool gray-blue, approximately `#E4E9F2`.

## 4.2 Signature blue

Use one recognizable Electric Blue family as the product identity.

Suggested conceptual range:

- primary: around `#1E63FF`;
- hover/dark: around `#174FD3`;
- pale blue surface: around `#EDF4FF`;
- blue glow/gradient endpoint may introduce restrained cyan.

Do not scatter multiple unrelated accent colors.

## 4.3 Semantic colors

Reserve semantic colors for meaning:

- success: green;
- warning: amber;
- danger/shortfall: red;
- info/processing/pending: blue;
- neutral: slate.

Guarantee Surplus is positive but must not look like a promotional jackpot. Use a restrained positive treatment.

Guarantee Breach must be unmistakably serious.

## 4.4 Dark/inverted sections

Marketing may use occasional deep navy inverted bands such as:

- financial proof;
- “Don't trust us. Verify it.”;
- final CTA;
- high-impact comparison section.

Do not make the whole application dark.

Product/admin app remains predominantly light unless a later explicit dark-mode requirement is added.

## 4.5 Gradients

Gradients are permitted only as controlled emphasis:

- hero background accent;
- CTA/button highlight;
- chart accent;
- small decorative ambient glow;
- selected dark contrast section.

Avoid:

- gradient backgrounds on every card;
- random purple/pink AI gradients;
- glowing borders everywhere;
- glassmorphism as default component language.

---

# 5. TYPOGRAPHY

## Marketing

Use a dual-font hierarchy inspired by the SaaS reference:

- selected display headline: Calistoga or equivalent licensed display serif;
- all supporting text/navigation/UI: Inter or equivalent product sans.

Do not put every heading in Calistoga. It is an accent, not the entire interface identity.

Hero title should feel memorable but remain highly legible.

## Application / Admin

Use Inter/product sans throughout.

Financial values:

- `font-variant-numeric: tabular-nums` where supported;
- clear distinction between currency symbol, whole number, decimals, and helper label;
- avoid tiny gray currency values inside decorative cards.

Recommended hierarchy:

- page title: strong but compact;
- section heading: medium weight;
- table body: normal/medium;
- labels: smaller but accessible;
- metadata: muted;
- critical money value: size/weight appropriate to context, not cartoonishly huge everywhere.

---

# 6. SPACING / GRID / SHAPE

Use a consistent 4px-based spacing system with practical steps such as 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.

Marketing max content width: approximately 1200–1280px.

Application max widths vary by page; data-heavy pages should use available horizontal space intelligently.

Desktop product shell:

- sidebar around 236–256px;
- topbar around 60–68px;
- content padding 24–32px;
- compact but breathable sections.

Cards:

- medium radius, generally 12–16px;
- large marketing feature panels may use 20–24px;
- buttons/inputs typically 9–12px;
- do not make every control a pill.

Borders should carry most structure; shadows should be subtle.

---

# 7. MOTION / MICRO-INTERACTIONS

Use motion to communicate state, not distract.

Preferred timing:

- hover/focus: ~120–180ms;
- common transitions: ~180–240ms;
- larger marketing reveal: ~300–500ms;

Use:

- subtle button elevation/translation;
- small arrow movement on CTA;
- section reveal on marketing pages;
- animated financial flow diagram;
- smooth number/graph transitions where data changes;
- command-search open/close;
- sidebar/mobile sheet transitions;
- loading skeletons.

Avoid:

- endless floating cards;
- parallax everywhere;
- motion on every scroll section;
- dramatic spring physics inside financial tables;
- animations that delay interaction.

Respect `prefers-reduced-motion`.

---

# 8. ICONS / ILLUSTRATION / PRODUCT VISUALS

Use one icon family consistently, e.g. Lucide or equivalent.

Do not mix icon styles.

Prefer custom product/data visuals over generic stock illustrations.

ZeroFee's strongest marketing visual assets should be its own product concepts:

- creator earnings calculator;
- buyer price → processor cost → creator earnings flow;
- financial verification table;
- creator dashboard;
- payout breakdown;
- Patreon migration flow;
- Discord entitlement mapping;
- Guarantee Health visualization.

Avoid cliché images of smiling creators holding phones unless they materially help.

---

# 9. MARKETING SITE — SAAS TEMPLATE STRUCTURE ADAPTED TO ZEROFEE

Use the structural quality of the SaaS template family: strong hero, proof/stats, feature explanation, process, benefits, product visuals, pricing, FAQ, and final CTA.

Do not import unrelated demo content.

## 9.1 Header

Sticky/light header.

Desktop:

- ZeroFee wordmark;
- Product;
- How it works;
- Migration;
- Pricing;
- Safety;
- optional Resources/FAQ;
- Log in;
- primary `Start as a creator` CTA.

On scroll, header may gain a subtle white/blur/border surface.

Mobile:

- compact wordmark;
- primary CTA if space allows;
- accessible menu sheet.

## 9.2 Hero

Primary headline:

# You choose what you earn.

Supporting concept:

> Set the amount you want to earn per successful member payment. ZeroFee takes 0% of your membership revenue.

CTA hierarchy:

Primary: `Start as a creator`

Secondary: `See how pricing works`

Trust microcopy below CTA:

- 0% platform fee on membership revenue;
- fixed software subscription;
- processing at provider cost.

Hero visual should NOT be a random dashboard screenshot floating in perspective.

Build an intentional live-looking product composition showing:

- creator target input `€10.00`;
- resolved buyer price example;
- provider cost;
- ZeroFee fee `€0.00`;
- Creator Earnings / Surplus;
- a compact Financial Verification card;
- subtle animated money-flow line.

Numbers must be clearly labelled as demonstration/example where needed.

## 9.3 Trust / proof strip

Do not use fake company logos or fake customer counts.

Until real proof exists, use product guarantees/facts as proof:

- `0% platform membership fee`;
- `0% ZeroFee payout markup`;
- `Creator-owned data exports`;
- `Verify provider records`.

If actual integrations exist, display factual integration logos only according to trademark guidelines.

## 9.4 Problem section

Explain percentage-platform economics without sensationalism.

Use a simple comparison visual:

- Percentage platform: platform cost grows with creator revenue.
- ZeroFee: SaaS cost is fixed/usage-tier based.

Do not mix unrelated payment-processing/tax costs into an exaggerated competitor percentage.

## 9.5 “Set what you earn” interactive section

This should be one of the most distinctive sections on the site.

Interactive demo:

- target earnings input;
- sample market/payment context selector;
- final buyer price;
- provider processing estimate/profile label;
- ZeroFee fee = 0;
- creator target/surplus explanation.

The component must use real PricingEngine demo endpoints/data where practical, not duplicated frontend math.

## 9.6 How it works

Use a clean 3–4 step process:

1. Create your creator page.
2. Set up payouts / verification.
3. Choose what you want to earn.
4. Publish and get paid through your connected provider account.

Use numbered steps with clear mini product visuals, not generic icon cards.

## 9.7 Financial transparency / inverted section

Use a deep navy contrast section.

Headline concept:

# Don't trust us. Verify it.

Show an audit-style example:

- Member paid;
- Tax;
- Provider cost;
- ZeroFee fee;
- Your verified earnings;
- `View in Stripe` action.

This is a key differentiation section.

## 9.8 Product features

Use a varied grid/bento-like composition, but keep it structured and calm.

Feature groups:

- Memberships and gated content;
- Guaranteed Earnings pricing;
- Financial verification;
- Payout management;
- Member management;
- Failed-payment recovery;
- Coupons/trials;
- Discord/Telegram;
- Analytics;
- Creator API/webhooks;
- Tax/compliance guidance;
- Data export.

Do not make 12 identical icon cards.

## 9.9 Migration from Patreon

Prominent dedicated section, not hidden in footer.

Use a split layout:

Left:

- `Already earning on Patreon? Bring your audience.`
- CSV import;
- tier mapping;
- migration campaign;
- conversion tracking;
- honest requirement for members to reauthorize payment when credentials cannot migrate.

Right:

Visual migration wizard / funnel:

`Import → Map tiers → Invite → Convert`

CTA:

`See migration workflow`

## 9.10 Integrations

Show Discord, Telegram, webhooks/API, email, Stripe/payment provider only when actually implemented/in scope.

Use a tidy integration rail/grid, not a giant logo wall.

## 9.11 Creator ownership

Short section:

> Your audience. Your data. Your business.

Show export UI / data portability.

## 9.12 Pricing

Use clean SaaS pricing cards aligned with current plan configuration.

Features:

- monthly/annual switch if supported;
- member/usage allowance;
- feature distinctions;
- no GMV/revenue percentage;
- one plan may be visually recommended, but do not aggressively distort card size.

Near pricing, reinforce:

`ZeroFee membership transaction fee: 0%`

Do not imply payment processing is free.

## 9.13 FAQ

Accordion with meaningful questions:

- What does 0% platform fee mean?
- Does Stripe/payment processing still cost money?
- How can earnings be guaranteed?
- Why can final buyer price vary?
- Who receives my membership money?
- Can I verify it in Stripe?
- How do payouts work?
- What about refunds/chargebacks?
- What countries are available?
- Can I migrate from Patreon?
- Do I need an existing Stripe account?
- Does ZeroFee handle taxes?

## 9.14 Final CTA

Strong dark or Electric Blue-led band.

Headline:

# Stop paying a percentage of your growth.

Primary CTA:

`Start as a creator`

Secondary:

`Calculate the difference`

## 9.15 Footer

Structured, compact:

- Product;
- Creators;
- Migration;
- Pricing;
- Safety;
- Legal;
- Support;
- status/contact links when implemented.

---

# 10. APPLICATION SHELL — CREATOR

Desktop layout:

### Sidebar

Grouped navigation, not one long unstructured list.

**Overview**
- Home
- Earnings
- Financial Verification
- Payouts

**Business**
- Members
- Membership Tiers
- Content
- Migration
- Broadcasts

**Growth / Tools**
- Analytics
- Integrations
- API / Webhooks

**Account / Compliance**
- Payout setup
- Tax
- ZeroFee Billing
- Support
- Settings
- Export

Sidebar behavior:

- active state clear;
- section labels quiet;
- icons consistent;
- collapsible only if it genuinely improves narrow laptop layouts;
- no rainbow navigation icons.

### Topbar

Include:

- contextual breadcrumb/title;
- global search trigger;
- Test Mode badge where applicable;
- provider/KYC warning when urgent;
- notifications;
- creator/profile menu.

Global search should visually read as a primary productivity feature, not a tiny magnifier.

---

# 11. GLOBAL SEARCH / COMMAND PALETTE

Implement a polished `Cmd/Ctrl + K` search surface tied to Prompt 1 search permissions.

Visual behavior:

- centered command panel;
- immediate focus;
- recent searches/actions when empty;
- grouped results;
- keyboard arrows;
- Enter opens result;
- Escape closes;
- filter chips where useful.

Creator groups:

- Members;
- Tiers;
- Posts;
- Payments;
- Payouts;
- Migration;
- Support.

Admin groups:

- Users;
- Creators;
- Applications;
- Payments;
- Provider events;
- Guarantee incidents;
- Support;
- Reports;
- Configuration.

Result rows should show enough disambiguating metadata without leaking unauthorized data.

Use page-specific search/filter bars for tables in addition to global command search.

---

# 12. CREATOR OVERVIEW DASHBOARD

Avoid the standard “12 random KPI cards” SaaS dashboard.

Use a hierarchy.

## Top hero summary

Large but controlled financial section:

Left:

**Creator Earnings**

Primary value.

Supporting:

- successful earning events;
- selected period;
- `ZeroFee transaction fees: €0.00`.

Right/adjacent:

**Provider Balance**

- available;
- pending;
- next payout.

Clearly visually separate earnings from balance.

## Guarantee health

Compact health module:

- Verified target met;
- With surplus;
- Pending reconciliation;
- any incident.

Normal state should feel reassuring, not noisy.

## Trend chart

One useful chart, e.g. Creator Earnings over time with member growth overlay or toggle.

Do not include charts merely as decoration.

## Business activity

Two-column responsive region:

- recent new members / churn;
- recent payment/earnings events;
- failed-payment recovery;
- next actions.

## Quick actions

Useful creator actions:

- Create tier;
- Publish post;
- Invite/migrate members;
- View payouts.

Keep them compact.

---

# 13. EARNINGS PAGE

This page must be exceptionally clear.

Top summary:

- Creator Earnings;
- Creator Surplus;
- refunds/reversals;
- ZeroFee membership fees = 0;
- selected date range.

Below:

- earnings timeline chart;
- breakdown by tier;
- breakdown by payment route/currency where useful;
- reconciliation statuses;
- export.

Do not call provider balance “earnings”.

---

# 14. FINANCIAL VERIFICATION PAGE

Treat this as a signature product experience.

Use an audit-ledger visual language.

Top:

> Every important number, independently verifiable.

Table columns should prioritize:

- date/member;
- charged amount;
- tax;
- provider cost;
- ZeroFee fee;
- target earnings;
- actual creator earnings;
- surplus;
- status;
- provider verification.

Status examples:

- Target met;
- Target met + surplus;
- Pending provider data;
- Refunded;
- Disputed;
- Guarantee issue.

Payment detail drawer/page:

Use a vertical money breakdown with arrows and explicit provider reference.

Do not bury ZeroFee fee = 0 in a tooltip; show it confidently but without repetitive marketing noise.

---

# 15. GUARANTEED EARNINGS TIER BUILDER

This must be one of the best-designed workflows in the app.

Desktop preferred layout:

### Left — configuration

- tier name;
- billing interval;
- currency;
- pricing mode segmented control;
- `I want to earn` money input;
- benefits;
- trials/coupons;
- publish controls.

### Right — live pricing preview

Sticky preview showing:

- creator target;
- eligible buyer context examples;
- final buyer price;
- provider-cost explanation;
- ZeroFee fee = 0;
- guarantee availability;
- public tier card preview.

Use an expandable `How this is calculated` disclosure with provider profile/reference information.

Do not overwhelm normal creators with raw formula math by default.

Expert details remain available.

For ineligible route, show a calm actionable state:

> Guaranteed Earnings isn't available for this payment route yet.

Then offer eligible alternatives or Simple Price according to product logic.

---

# 16. MEMBERS PAGE

This is operational, so prioritize density and search.

Header:

- title/count;
- search;
- filters;
- export;
- optional migration/import CTA.

Table:

- member;
- tier;
- status;
- billing interval;
- creator earnings per successful payment;
- renewal;
- payment-recovery state;
- joined;
- row actions.

Use status chips and secondary metadata compactly.

Member detail:

- identity/contact;
- membership history;
- payment lifecycle;
- entitlement;
- support;
- refunds;
- integration access.

Do not expose raw payment credentials.

---

# 17. PAYOUTS PAGE

Financial trust screen.

Top layout:

- Available balance;
- Pending balance;
- next payout.

Primary action:

`Withdraw / Manage payout`

Payout method cards/rows:

### Standard
- provider cost;
- ZeroFee fee `€0`;
- estimated/scheduled timing where provider supplies it;
- amount sent.

### Instant
- eligibility;
- actual/quoted provider cost;
- ZeroFee fee `€0`;
- amount sent.

Below:

- payout history;
- destination;
- bank-fee disclaimer;
- `Verify in Stripe`.

Do not make payout UI look like ZeroFee is holding a wallet if funds reside with provider.

---

# 18. CONTENT / POSTS

Use familiar creator-content management UX.

List/table/grid depending on viewport:

- title;
- visibility;
- tiers;
- status;
- publish date;
- engagement summary if available;
- actions.

Editor:

- focused writing area;
- clear visibility/tier control;
- attachment limits;
- autosave/draft indicator;
- preview;
- publish CTA.

Avoid a cluttered CMS interface.

---

# 19. MIGRATION FROM PATREON UX

Migration Center must look like a first-class growth feature.

Landing state:

- why migrate;
- what imports;
- what does not automatically transfer;
- estimated process;
- `Start Patreon import`.

Wizard steps visualized clearly:

1. Upload CSV
2. Map fields
3. Map tiers
4. Choose pricing / grandfathering
5. Review members
6. Create migration campaign
7. Track conversion

Use a stepper, but do not make every step a full-screen modal.

Error rows:

- downloadable validation report;
- inline row issues;
- clear retry.

Migration dashboard:

- imported;
- invited;
- clicked;
- converted;
- conversion rate;
- recovered MRR estimate;
- unconverted list;
- campaign actions.

Visualize the funnel clearly.

Do not imply payment credentials were migrated when they were not.

---

# 20. INTEGRATIONS PAGE

Use categorized integration cards:

- Community: Discord, Telegram;
- Developer: API, Webhooks;
- Communication: email/broadcast provider;
- Payments: Stripe/provider account status.

Each card:

- icon/logo;
- connection status;
- short description;
- primary action;
- health/sync status after connection.

Connected state should look operational, not merely a green badge.

Discord mapping screen must make Tier → Role mapping easy to scan.

---

# 21. MEMBER / FAN APPLICATION

Member UI should be simpler than creator/admin UI.

Primary navigation:

- Home;
- Memberships;
- Billing;
- Support;
- Account.

Membership card:

- creator;
- tier;
- recurring price;
- renewal date;
- status;
- manage action.

Locked content UX:

- show enough preview to understand value;
- clearly state required tier;
- direct CTA;
- never reveal private content in client HTML before authorization.

Checkout review must prioritize:

- creator;
- tier;
- final recurring amount;
- tax;
- renewal;
- payment method;
- cancellation/support info;
- final confirm CTA.

---

# 22. ADMIN APPLICATION SHELL

Admin uses the same ZeroFee visual language but with higher information density.

Desktop sidebar groups:

**Platform**
- Overview
- Search
- Users
- Creators
- Applications

**Money / Provider**
- Payments
- Payout status
- Guarantee Health
- Pricing Catalog
- Guarantee Profiles
- Webhooks

**Commerce / Safety**
- Countries
- Merchant / Tax
- Reports
- Support

**Operations**
- Plans
- Usage
- Integrations Health
- Notifications

**System**
- Audit
- Feature Flags
- Provider Capabilities
- Settings

Admin must never look like a separate legacy back office bolted onto the product.

Use the same tokens/components, with more compact tables.

---

# 23. ADMIN OVERVIEW

Top row:

- ZeroFee SaaS MRR;
- active creators;
- active memberships;
- creator GMV clearly separated;
- open guarantee incidents;
- failed webhooks/support alerts.

Use one or two useful operational charts rather than many decorative ones.

Critical action center:

- applications awaiting review;
- Guarantee Breach;
- Stripe capability warnings;
- tax/country configuration warnings;
- moderation escalation;
- failed provider events.

Priority must be immediately visible.

---

# 24. GUARANTEE HEALTH ADMIN

This should feel like a financial operations console, but remain readable.

Overview:

- payments reconciled;
- target met exactly;
- target met with surplus;
- pending;
- shortfalls;
- average surplus rate;
- profiles paused.

Use clear time range/filtering.

Incident table:

- severity;
- profile/route;
- creator;
- payment;
- target;
- actual;
- shortfall;
- provider rule version;
- status;
- action.

Profile health:

- pricing source;
- verified date;
- expiry;
- production-test state;
- quote count;
- surplus distribution;
- breach count.

Make `Pause profile` a deliberate high-risk action with confirmation.

---

# 25. PROVIDER PRICING CATALOG ADMIN

Dense but understandable configuration UI.

Provide:

- search;
- country filter;
- payment method filter;
- currency filter;
- provider/source status;
- verified/expired state;
- effective dates.

Rule detail should separate:

- pricing dimensions;
- formula;
- source/evidence;
- verification history;
- affected guarantee profiles;
- test results.

Do not show formula configuration as raw JSON unless an advanced developer section explicitly requests it.

---

# 26. CREATOR APPLICATION REVIEW ADMIN

Use a split review workspace.

Main:

- creator/business details;
- what they plan to sell;
- content examples;
- links;
- country;
- revenue/audience ranges;
- agreement confirmations.

Side panel:

- current state;
- approve;
- needs information;
- reject;
- private notes;
- history.

Actions remain sticky/visible without covering content.

Rejection/info request requires reason.

---

# 27. TABLE SYSTEM

Create one consistent table system for app/admin.

Features:

- sticky header where helpful;
- 44–52px row height depending density;
- hover state;
- selected state;
- compact status chips;
- sortable columns;
- server pagination;
- filters;
- empty state;
- loading skeleton;
- row actions menu;
- responsive column hiding/prioritization.

On mobile, do NOT force full desktop tables into horizontal scrolling for every workflow. Convert high-value rows into stacked record cards or dedicated mobile detail patterns.

---

# 28. FORMS / WIZARDS

Form rules:

- labels always visible;
- helper text concise;
- errors close to fields;
- required state clear;
- progressive disclosure for advanced financial settings;
- persistent unsaved-change protection where appropriate;
- clear disabled reasons;
- loading state on submit;
- success confirmation without disruptive full-screen modals.

Multi-step flows:

- application;
- payout setup;
- migration;
- tier pricing;
- tax setup.

Use progress steps only when sequence is real.

---

# 29. STATUS SYSTEM

Define semantic status tokens/components once.

Examples:

### Positive
- Active
- Verified
- Target met
- Paid
- Connected

### Neutral/info
- Pending
- Processing
- Under review
- Draft

### Warning
- Needs information
- Past due
- Reprice required
- Expiring pricing rule

### Danger
- Rejected
- Suspended
- Guarantee shortfall
- Dispute lost
- Failed webhook

Do not invent different badge styles per page.

Do not rely on color alone.

---

# 30. CHARTS / DATA VISUALIZATION

Use charts sparingly.

Rules:

- label axes/units;
- readable currency formatting;
- accessible contrast;
- no decorative 3D charts;
- avoid pie charts with many categories;
- use line/area for trend;
- bar for comparison;
- compact sparkline only when full context exists elsewhere.

Primary creator charts:

- Creator Earnings trend;
- member growth/churn;
- failed-payment recovery;
- migration conversion.

Primary admin charts:

- SaaS MRR;
- creator/member growth;
- guarantee reconciliation health;
- platform operational failures.

---

# 31. STRIPE CONNECT / EMBEDDED COMPONENT PRESENTATION

Do not fight Stripe embedded components with incompatible custom styling.

Surround provider components with ZeroFee context:

- clear page title;
- what action is happening;
- why information is required;
- current provider status;
- next step;
- ZeroFee help/support.

Where Stripe component appearance APIs allow theming, align typography/color/radius within provider constraints.

Do not recreate sensitive Stripe KYC/card forms merely for visual consistency.

`Verify in Stripe` actions should be visually secondary but easy to find on financial pages.

---

# 32. MOBILE DESIGN

Mobile is intentional, not “desktop squeezed narrower.”

Creator mobile navigation may use:

- top header + bottom tab bar for core areas;
- `Overview`, `Members`, `Content`, `Earnings`, `More`;
- deeper pages in `More`/drawer.

Admin mobile may use drawer navigation rather than forcing all admin tools into a bottom bar.

Mobile rules:

- important financial numbers remain readable;
- primary action reachable;
- forms use correct keyboard/input types;
- sticky footer action on critical confirmation steps where useful;
- no 2-column forms on narrow screens;
- no off-screen data tables without an intentional alternative;
- search remains accessible;
- embedded provider components tested at real phone width.

Test at approximately:

- 390px phone;
- small tablet;
- laptop;
- large desktop.

---

# 33. EMPTY / LOADING / ERROR STATES

Every important page needs intentional states.

Avoid giant illustrations and vague “Nothing here yet” copy.

Examples:

### No members

Explain what happens after publishing a tier and offer `View public page` / migration action.

### No payouts

Explain provider balance/payout state, not “earn money first” generically.

### No migration

Offer `Import from Patreon` prominently.

### Guarantee unavailable

Explain which route/context is unavailable and offer next valid action.

### Provider action required

Show exact status and `Complete verification`.

Skeletons should approximate final layout and not cause major layout shift.

---

# 34. CONTENT DENSITY RULES

Marketing = spacious.

Creator dashboard = medium density.

Admin tables = compact/medium density.

Financial audit pages = dense but extremely clear.

Do not apply one card/grid density to every part of the product.

Avoid:

- a card inside a card inside a card;
- cards for simple label/value pairs when a section row works;
- 3×4 dashboard KPI walls;
- excessive separators;
- excessive blank whitespace in admin screens.

---

# 35. ACCESSIBILITY

Target WCAG 2.1 AA fundamentals.

Required:

- visible keyboard focus;
- semantic heading hierarchy;
- accessible labels;
- error association;
- screen-reader names for icons;
- keyboard search/dialog/table controls;
- contrast;
- no color-only status;
- reduced motion;
- usable zoom;
- minimum practical touch targets;
- meaningful skip/navigation behavior.

Run automated accessibility checks on representative surfaces and manually inspect keyboard workflows.

---

# 36. DESIGN IMPLEMENTATION PLAN

Execute ONCE in this order.

## Phase D0 — visual audit

- read Prompt 1;
- inspect all routes;
- inventory existing components;
- identify duplicated visual primitives;
- establish current screenshots for comparison if useful;
- create `docs/DESIGN_SYSTEM.md` skeleton.

## Phase D1 — tokens / primitives

- colors;
- typography;
- spacing;
- radii;
- shadows;
- status system;
- buttons;
- inputs;
- cards;
- tables;
- dialogs/sheets;
- navigation;
- empty/loading/error primitives.

## Phase D2 — marketing

- header;
- homepage;
- how it works;
- migration;
- pricing;
- FAQ;
- footer;
- responsive.

## Phase D3 — creator shell / search

- sidebar/topbar;
- command search;
- responsive mobile nav;
- breadcrumb/page headers.

## Phase D4 — creator financial surfaces

- Overview;
- Earnings;
- Financial Verification;
- Payouts;
- Guaranteed Earnings builder.

## Phase D5 — creator operations

- Members;
- Content;
- Migration;
- Integrations;
- Broadcasts;
- Tax;
- Billing;
- Settings/Support/Export.

## Phase D6 — member/fan UI

- public creator page;
- checkout review;
- member home/memberships;
- billing;
- support;
- locked/unlocked content.

## Phase D7 — admin

- shell/search;
- overview;
- applications;
- creator detail;
- Guarantee Health;
- Pricing Catalog;
- guarantee profiles;
- countries/tax;
- webhooks;
- support/moderation;
- audit/settings.

## Phase D8 — mobile / responsive audit

Fix all core surfaces intentionally.

## Phase D9 — screenshot QA

Capture required screenshots below, inspect, fix, recapture only changed screens.

## Phase D10 — regression verification

- core E2E still passes;
- build/typecheck/lint;
- accessibility checks;
- final design docs;
- no business logic regression.

---

# 37. REQUIRED SCREENSHOT DESIGN QA

Use actual seeded application.

Capture desktop + mobile where specified.

### Marketing

1. Homepage desktop.
2. Homepage mobile.
3. Hero detail.
4. Interactive Set What You Earn section.
5. Financial transparency dark section.
6. Pricing.
7. Patreon migration marketing section/page.

### Creator

8. Creator Overview desktop.
9. Creator Overview mobile.
10. Global search / command palette.
11. Earnings.
12. Financial Verification table.
13. Financial payment detail.
14. Guaranteed Earnings tier builder desktop.
15. Tier builder mobile.
16. Members/search/filter.
17. Member detail.
18. Payouts.
19. Migration wizard.
20. Migration conversion dashboard.
21. Content list/editor.
22. Integrations.
23. Tax Center.
24. SaaS Billing.

### Fan

25. Public creator page desktop/mobile.
26. Checkout final-price review desktop/mobile.
27. Member memberships dashboard.
28. Locked post.
29. Unlocked post.

### Admin

30. Admin overview.
31. Admin global search.
32. Application review.
33. Creator detail.
34. Guarantee Health.
35. Guarantee incident detail.
36. Provider Pricing Catalog.
37. Guarantee Profile detail.
38. Countries registry.
39. Webhooks.
40. Support/moderation.

Inspect each for:

- hierarchy;
- consistency;
- typography;
- spacing;
- density;
- visual noise;
- CTA clarity;
- financial truth/labels;
- table usability;
- embedded-provider integration;
- accessibility;
- mobile overflow;
- unnecessary horizontal scrolling;
- broken responsive patterns;
- generic AI/SaaS appearance;
- overuse of gradients/cards/pills.

Perform targeted fixes once, then verification screenshots for changed screens.

---

# 38. DESIGN ANTI-PATTERNS — STRICT

Do not produce:

- generic purple-gradient SaaS;
- glass cards everywhere;
- giant gradient blobs behind every section;
- 3D crypto illustrations;
- fake metrics/testimonials/logos;
- arbitrary “AI” sparkles;
- every control as a pill;
- overly rounded mobile-app aesthetic on desktop admin;
- huge unused whitespace in operational screens;
- card grids when a table/list is the correct information architecture;
- dozens of equal-sized KPI cards;
- hidden financial details behind tooltips only;
- light-gray low-contrast text;
- inconsistent status colors;
- fake Stripe controls;
- creator dashboard that looks like admin dashboard;
- admin dashboard that looks like a consumer mobile app;
- mobile layout that is simply desktop columns stacked without prioritization.

---

# 39. REQUIRED DESIGN DOCUMENTATION

Create/update:

- `docs/DESIGN_SYSTEM.md`
- `docs/UX_INFORMATION_ARCHITECTURE.md`
- `docs/DESIGN_QA.md`

`docs/DESIGN_SYSTEM.md` must contain:

- visual principles;
- color tokens;
- typography;
- spacing;
- radii/shadows;
- semantic statuses;
- button/input/table/card patterns;
- navigation;
- mobile patterns;
- motion;
- financial-number presentation;
- chart guidance;
- accessibility rules.

`docs/DESIGN_QA.md` must record:

- screenshot matrix;
- issues found;
- fixes applied;
- remaining non-blocking issues;
- final desktop/mobile verification.

---

# 40. DESIGN ACCEPTANCE CRITERIA

Design Prompt 2 is complete only when:

1. marketing site clearly looks like one deliberate premium SaaS brand;
2. the design reflects the SaaS/light reference direction without copying unrelated content/branding;
3. Electric Blue is used consistently and not excessively;
4. marketing typography has distinctive display hierarchy while product UI remains highly legible;
5. creator/admin/member surfaces share one design system;
6. creator and admin remain appropriately different in information density;
7. Creator Earnings, provider balance, payout, and ZeroFee fee are visually distinguishable;
8. Guaranteed Earnings tier builder is simple for normal creators while exposing advanced details when needed;
9. Financial Verification is clear enough to audit payment economics;
10. Patreon Migration is a first-class polished workflow;
11. global search is obvious, fast, and consistent;
12. tables are usable and responsive;
13. Stripe embedded components feel integrated without unsafe recreation;
14. mobile creator workflows are intentional;
15. public creator page feels trustworthy and creator-friendly;
16. checkout clearly shows final recurring amount before confirmation;
17. admin Guarantee Health makes incidents obvious;
18. no fake testimonials/logos/metrics are used;
19. no generic AI-dashboard visual clichés remain;
20. accessibility fundamentals pass;
21. screenshot QA is completed;
22. visual fixes are performed without infinite redesign loops;
23. product behavior and E2E tests remain intact;
24. design documentation matches the implementation.

---

# 41. FINAL DESIGN COMPLETION REPORT

When complete, report:

- final commit SHA;
- changed design-system files/components;
- marketing pages redesigned;
- creator surfaces redesigned;
- member surfaces redesigned;
- admin surfaces redesigned;
- search UX state;
- Patreon migration UX state;
- Stripe embedded component integration state;
- responsive/mobile state;
- accessibility results;
- screenshot QA paths/results;
- functional regression test results;
- remaining design limitations;
- paths to `docs/DESIGN_SYSTEM.md` and `docs/DESIGN_QA.md`.

Do not claim the redesign is complete if screenshots still show obvious overflow, broken hierarchy, inconsistent components, or unreadable financial information.

---

# 42. FINAL VISUAL NORTH STAR

The final product should make a creator feel:

> **This is simpler than Patreon, more transparent than a marketplace, and serious enough to trust with my membership business.**

The visual system should make the central product promise immediately legible:

# You choose your earnings.

# We take 0% of your membership revenue.

# Don't trust us. Verify it.

EXECUTE THIS DESIGN PASS ONCE, SYSTEMATICALLY, WITHOUT CHANGING PROMPT 1 PRODUCT LOGIC OR ENTERING AN ENDLESS REDESIGN LOOP.
