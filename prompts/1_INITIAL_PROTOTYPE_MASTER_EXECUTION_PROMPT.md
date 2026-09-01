# ZeroFee — Initial Prototype Master Execution Prompt

## EXECUTION DIRECTIVE

START EXECUTION NOW.

You are working directly in the `arsenijee19/zerofee` repository. At the time this master prompt was written, the repository was empty. Treat this file as the authoritative product and implementation specification for the first end-to-end ZeroFee prototype unless the repository later contains an explicit owner-authored document that supersedes a specific requirement.

Do not merely summarize this specification, create another plan, produce mockups, or stop after scaffolding. Read this file completely, inspect the current repository state, make safe technical decisions where necessary, and IMPLEMENT the prototype end to end.

The purpose of this phase is not to ship a legally final, production-certified payments company. The purpose is to create a serious, coherent, technically sound, visually polished, testable product prototype that proves the complete ZeroFee business model and user experience while establishing the correct architecture for later production hardening.

The result must be a functional application, not a collection of static screens.

Do not leave core flows as TODOs, dead buttons, fake success screens, or disconnected UI. Where live third-party credentials are unavailable, implement a clearly separated test/mock provider with deterministic states while preserving the exact production integration boundary so that live Stripe Connect can replace the mock without redesigning the product.

Do not ask the owner questions that can be resolved safely from this specification. Prefer a reasonable, documented decision over blocking execution.

---

# 1. PRODUCT DEFINITION

## 1.1 Working product name

The working brand is **ZeroFee**.

ZeroFee is a creator-membership SaaS platform designed around one central promise:

> **ZeroFee does not take a percentage of a creator's sales.**

Creators pay ZeroFee a predictable flat monthly SaaS subscription. Their audience payments are processed through the creator's Stripe Connected Account rather than being collected into a ZeroFee wallet and later manually redistributed.

ZeroFee must NOT market itself as having “zero payment processing fees.” Payment processors still charge for payment processing. The ZeroFee promise is specifically:

- 0% ZeroFee platform transaction fee on creator membership sales;
- a predictable flat monthly ZeroFee SaaS subscription;
- transparent creator economics;
- no hidden ZeroFee payout fee;
- creators can choose the net earnings they want to target and ZeroFee can recommend a final retail price that incorporates expected payment-processing costs;
- the buyer sees the final customer-facing price before checkout rather than seeing an unpleasant surprise fee added at the final checkout step;
- Stripe/payment-processing costs remain real and must never be misrepresented.

Do not use deceptive copy such as:

- “keep every cent” without qualification;
- “no fees at all”;
- “Stripe is free”;
- “guaranteed exact net after every possible payment event”;
- “ZeroFee assumes all chargeback/refund losses.”

Preferred positioning examples:

- **0% platform fee. One flat monthly price.**
- **Your success should not make your platform more expensive.**
- **Choose what you want to earn. ZeroFee helps you price for it.**
- **No percentage tax on your growth.**
- **Your audience pays you. ZeroFee provides the software.**

All marketing claims must be written so they remain true even after the prototype evolves into production.

---

# 2. BUSINESS MODEL — AUTHORITATIVE FOR THIS PROTOTYPE

## 2.1 ZeroFee revenue

The prototype must implement a configurable creator SaaS plan whose default working price is:

**$50 USD / month**

This amount is a product configuration, not a hardcoded assumption scattered throughout the application.

Create a central plan/pricing configuration so the owner can later change:

- monthly price;
- annual price;
- trial duration;
- grace period;
- quotas;
- feature entitlements;
- supported currencies;
- whether a plan is publicly available.

For the first prototype, one paid creator plan is sufficient, but the data model and entitlement layer must support multiple plans later without migration pain.

A creator's ZeroFee SaaS subscription is financially separate from the audience's membership subscription to that creator.

There are therefore TWO different payment relationships:

### Relationship A — Creator pays ZeroFee

Creator → ZeroFee platform → flat SaaS subscription.

### Relationship B — Fan pays Creator

Fan → creator's Stripe Connected Account → creator membership subscription.

Do not conflate these two flows.

## 2.2 Core no-loss rule for ZeroFee

The architecture must be designed so ZeroFee does **not** subsidize creator payment-processing fees from the $50 SaaS fee.

ZeroFee must not promise:

> “Creator receives $X and ZeroFee pays whatever Stripe charges.”

That model becomes structurally unprofitable at high GMV.

Instead:

- payment-processing fees belong to the creator-side payment relationship;
- the customer-facing price can be increased in advance to target a desired creator net amount;
- ZeroFee does not absorb variable payment-processing costs unless a future owner-controlled feature explicitly enables a subsidy.

Create an invariant in the core domain model:

`platform_subsidizes_creator_processing = false`

for the initial product.

Do not implement an accidental path that violates this invariant.

---

# 3. CREATOR PRICING MODEL

Pricing is one of the most important differentiators of this product. Treat it as a first-class domain, not a small form field.

## 3.1 Two pricing modes

A creator tier must support two explicit pricing modes.

### Mode A — SIMPLE PRICE

Creator enters the customer-facing amount.

Example:

- creator sets $50/month;
- customer sees $50/month;
- payment-processing costs are deducted according to the connected account/payment processor rules;
- creator receives the remainder.

UI description:

> **Set the public price**  
> Your members pay exactly this amount. Payment-processing costs are deducted from your earnings.

### Mode B — TARGET NET — DEFAULT/RECOMMENDED

Creator enters the amount they want to target as their earnings before refunds, disputes, taxes, exceptional payment-method costs, or other later adjustments.

Example:

- creator enters desired target net: $50;
- ZeroFee Pricing Engine calculates a recommended public retail price, for example $52.xx depending on the active processing profile;
- creator sees the calculation before publishing;
- buyer sees only the final retail price, e.g. `$52.99/month`;
- buyer must not be surprised at checkout by a newly added “ZeroFee fee.”

The UI should make this feel simple:

**I want to earn**  
`$50.00`

**Recommended member price**  
`$52.99 / month`

**ZeroFee platform fee on this sale**  
`$0.00`

Do not copy these values literally as fee truth; use the Pricing Engine.

## 3.2 No hidden buyer surcharge

The preferred ZeroFee UX is NOT:

`Membership $50 + Processing fee $2.99 = $52.99`

Instead, after creator approval:

`Membership $52.99/month`

The public creator page, tier card, confirmation screen and checkout initiation must display the final price consistently.

Do not implement a surprise fee line item added only at the final checkout step.

This requirement is both a UX principle and a product principle.

## 3.3 Pricing Engine

Implement a dedicated server-side `PricingEngine` domain service.

Never calculate money with JavaScript floating-point arithmetic.

Use:

- integer minor units for monetary amounts, e.g. cents;
- decimal/fixed-point representation for rates;
- explicit currency metadata;
- explicit rounding strategy.

The engine must accept at minimum:

- currency;
- desired net amount OR desired public price;
- pricing mode;
- payment fee profile;
- billing fee profile if applicable;
- optional safety buffer;
- optional minimum transaction amount;
- allowed payment method group.

A fee profile should be able to describe:

- percentage component;
- fixed component;
- optional billing/subscription percentage;
- optional cross-border estimate;
- optional FX estimate;
- optional configurable safety margin;
- payment-method identifier;
- country/region applicability;
- currency applicability;
- effective-from/effective-to dates;
- enabled state.

Do not present example Stripe rates as universal truth.

Seed the prototype with clearly labeled **DEMO fee profiles**, not claimed global Stripe pricing.

Example profile metadata can resemble:

- `Demo domestic card`;
- percentage component;
- fixed component;
- optional recurring billing component.

The admin must be able to modify fee profiles without code changes.

## 3.4 Gross-up formula

For simple percentage + fixed-cost profiles, the mathematical model should be equivalent to:

`gross = (target_net + fixed_cost) / (1 - percentage_cost)`

then apply currency-aware rounding and optional safety buffer.

However, implement the calculation through the domain service rather than scattering this formula in UI components.

Unit-test:

- normal values;
- very small values;
- high values;
- percentages near configuration limits;
- zero fixed fee;
- zero percentage fee;
- invalid profiles;
- rounding boundaries;
- multiple currencies.

## 3.5 Target net is not an unlimited financial guarantee

The product copy must distinguish:

**target earnings for the successful supported payment**

from later events such as:

- refund;
- chargeback/dispute;
- FX adjustment;
- tax;
- exceptional payment-method pricing;
- Stripe account reserve;
- negative balance recovery;
- regulatory deductions.

Do not market the recommendation engine as an unconditional insurance policy.

For the prototype, use wording such as:

> “Target net estimate based on your active payment-cost profile. Refunds, disputes, taxes and exceptional processing costs can change final earnings.”

Keep this explanation available but do not clutter the primary UX.

## 3.6 Price versioning

Membership prices are versioned.

Changing the price of a tier must not silently alter existing subscriber economics.

Model:

- Tier = product concept;
- TierPriceVersion = immutable price/version used for subscriptions.

When creator changes pricing:

- new subscribers use the new active version;
- existing subscriptions remain on their version by default;
- future bulk migration is an explicit operation, not an accidental side effect.

---

# 4. STRIPE CONNECT ARCHITECTURE

## 4.1 Product intent

Creators should not need to operate Stripe manually as part of normal ZeroFee use.

The UX must say things such as:

- `Set up payouts`;
- `Verify your identity`;
- `Add payout account`;
- `Payouts active`.

Avoid making the creator feel they must learn a separate financial product.

The creator should be able to complete onboarding and later see payment/payout information within ZeroFee wherever Stripe's supported embedded components allow it.

## 4.2 Embedded onboarding

Use the current recommended Stripe Connect **embedded onboarding** architecture when live Stripe credentials/configuration are available.

Requirements:

- create/retrieve a connected account through the server;
- prefill legally allowed information already collected by ZeroFee;
- render Stripe-supported embedded onboarding within ZeroFee;
- allow Stripe to own identity verification/document collection where possible;
- never collect or store raw identity-document files in ZeroFee if Stripe can collect them directly;
- surface account requirements in a creator-friendly way;
- do not claim the creator is verified merely because they completed the ZeroFee form;
- verification/payment/payout readiness must be based on Stripe's actual account/capability state.

Stripe currently provides embedded onboarding and embedded account/payment/payout components. Use the API recommended by the Stripe documentation available at implementation time. Do not blindly use legacy account-type assumptions if Stripe's current Accounts API has evolved.

Reference during implementation:

- https://docs.stripe.com/connect/onboarding
- https://docs.stripe.com/connect/embedded-components
- https://stripe.com/connect/pricing

## 4.3 Direct charges

The intended creator membership payment architecture is **Direct Charges on the connected account**, subject to Stripe approving this platform and the exact Connect configuration.

Audience payments must not be designed as:

fan → ZeroFee wallet → manual ZeroFee payout to creator.

The intended architecture is:

fan → creator connected account → Stripe processing → creator balance/payout.

ZeroFee records the business event, membership entitlement and analytics, but ZeroFee does not create an internal custodial wallet for creator funds.

Do not build a fake “wallet balance” that implies ZeroFee is holding creator funds.

## 4.4 Stripe handles pricing for connected users

The preferred production direction is Stripe Connect's model where **Stripe handles pricing for connected users**, because Stripe currently describes this model as Stripe setting/collecting payment-processing fees directly from connected users and lists no additional platform account/payout-volume/per-payout Connect fees under that pricing mode, subject to region/configuration.

Reference:

- https://stripe.com/connect/pricing
- https://support.stripe.com/questions/monetizing-payments-with-stripe-connect

Do not hardcode this as legally guaranteed in every region. Implement a provider capability/configuration layer that can represent whether the active platform account supports the desired fee and loss-liability model.

## 4.5 Loss liability

The preferred ZeroFee model is one in which, for direct charges and the approved Connect configuration, the connected account is responsible for its Stripe fees/refunds/chargebacks and Stripe covers qualifying unrecoverable account losses rather than ZeroFee owning creator negative balances.

However:

- this is a Stripe contractual/configuration matter;
- do not represent it as active until the account/platform configuration confirms it;
- never implement an application-level promise that overrides Stripe's actual agreement.

Create an admin-visible capability/config state such as:

- `DIRECT_CHARGES_ENABLED`;
- `STRIPE_HANDLES_CONNECTED_PRICING`;
- `STRIPE_MANAGED_LOSS_LIABILITY_CONFIRMED`;
- `CONTENT_PLATFORM_APPROVAL_CONFIRMED`.

For prototype/mock mode these may be simulated, but they must be visibly marked `TEST/DEMO`.

## 4.6 Creator subscription billing to ZeroFee

The creator's $50/month ZeroFee SaaS subscription is a separate platform Billing subscription.

Build a `PlatformBillingProvider` interface separate from `CreatorPaymentsProvider`.

Even if both use Stripe initially, preserve this domain separation.

Creator states should include at minimum:

- no plan;
- trialing if enabled;
- active;
- past due;
- grace period;
- suspended;
- cancelled.

A creator who loses ZeroFee SaaS entitlement must not silently continue using paid creator functionality forever.

For the prototype:

- allow a configurable grace period;
- do not delete creator data immediately;
- prevent new paid sales once suspended, or use a clearly documented prototype policy;
- public content can remain visible depending on the suspension reason;
- admin can manually override billing entitlement with audit logging.

## 4.7 Webhooks

Implement Stripe webhook handling correctly from the first prototype.

Requirements:

- raw-body signature verification;
- separate platform and connected-account event routing as required by Stripe architecture;
- idempotency by Stripe event ID;
- persistent webhook event table;
- processing status;
- attempt count;
- error details safe for logs;
- replay capability in admin for failed internal processing;
- no duplicate membership creation;
- no duplicate entitlement transitions;
- no duplicate emails/notifications caused by repeated webhooks.

Important events will depend on the current Stripe API, but domain handling must cover:

- connected account updates/requirements;
- checkout/payment success/failure;
- subscription lifecycle;
- invoice payment success/failure;
- refund;
- dispute;
- payout/account status as relevant.

Do not trust browser redirects as proof of payment.

Payment state must be webhook/server-authoritative.

## 4.8 Missing Stripe credentials

The repository must remain runnable without live Stripe credentials.

Implement:

`PAYMENTS_PROVIDER=mock|stripe`

and equivalent configuration for platform billing if useful.

The mock provider must:

- use the same domain interfaces;
- simulate realistic states;
- simulate onboarding requirements;
- simulate approved/rejected/needs-info statuses;
- simulate payment success/failure;
- simulate subscription lifecycle;
- simulate refund/dispute events;
- make E2E testing deterministic.

The application must prominently show `TEST MODE` when mock/test financial providers are active.

Do not make mock mode visually indistinguishable from production money movement.

---

# 5. STRIPE / CONTENT PLATFORM APPROVAL — DO NOT IGNORE

ZeroFee is intended to host/distribute third-party creator content and enable creators to receive payments for exclusive content/memberships.

Stripe currently treats content-creation platforms as a restricted business category requiring additional due diligence/platform approval.

Reference:

- https://stripe.com/legal/restricted-businesses
- https://support.stripe.com/questions/prohibited-and-restricted-businesses-list-faqs

Therefore the prototype must make this requirement explicit in both architecture and documentation.

Create `docs/STRIPE_APPROVAL_READINESS.md` documenting:

- what ZeroFee does;
- why it is a content-creation platform;
- intended direct-charge architecture;
- creator pre-screening;
- prohibited-content controls;
- report/takedown workflow;
- auditability;
- creator KYC delegated to Stripe where applicable;
- ZeroFee's own content/business review;
- open questions requiring Stripe confirmation before production launch.

Do not claim production readiness until Stripe has approved the platform/configuration.

---

# 6. CREATOR COMPLIANCE PRE-SCREENING

Stripe identity verification is not the same as ZeroFee verifying what a creator intends to sell.

ZeroFee must perform a creator/business-content pre-screen before enabling payments.

## 6.1 Creator application

Collect:

- legal/display name distinction;
- creator display name;
- email;
- country;
- individual/business selection;
- public creator category;
- detailed description of what they plan to sell;
- examples of expected paid content;
- existing website/social URLs;
- approximate expected monthly revenue range;
- approximate audience size range;
- whether content includes uploads, downloads, live services or community access;
- confirmation of rights to sell/upload content;
- confirmation of prohibited-content policy;
- acceptance of Terms/Creator Agreement placeholders.

Do not collect unnecessary sensitive data just because it might be useful later.

## 6.2 Application state machine

Implement explicit states:

- `DRAFT`;
- `SUBMITTED`;
- `UNDER_REVIEW`;
- `NEEDS_INFORMATION`;
- `APPROVED_FOR_STRIPE_ONBOARDING`;
- `REJECTED`;
- `SUSPENDED_POST_APPROVAL`.

All transitions must be server-authorized and audit logged.

## 6.3 Admin review

Admin must be able to:

- view application;
- inspect creator description and links;
- add internal notes;
- approve;
- request additional information;
- reject with reason;
- suspend later;
- see history.

The creator must see a clear, non-technical status screen.

Example:

`Application under review` → `Approved` → `Set up payouts`.

Do not allow creator payment activation solely because a boolean field was modified client-side.

---

# 7. PROHIBITED CONTENT / PLATFORM SAFETY

For prototype purposes, implement a conservative policy framework.

ZeroFee must not be positioned as an adult-content/OnlyFans payment workaround.

At minimum prohibit in the prototype policy:

- illegal products/services;
- sexual/pornographic content where prohibited by payment-provider rules;
- non-consensual sexual content;
- sexual exploitation;
- CSAM or anything involving minors sexually;
- terrorism/extremism financing/content prohibited by law/provider;
- weapons sales where prohibited;
- drugs/controlled substances sales;
- stolen goods;
- financial scams;
- fraudulent fundraising;
- peer-to-peer money transmission disguised as creator payments;
- IP infringement/pirated material;
- doxxing/private-data sales;
- malware/credential theft;
- other categories prohibited by the payment provider.

Create:

- `/legal/acceptable-use`;
- `/legal/creator-terms`;
- `/legal/privacy` placeholder;
- `/legal/terms` placeholder;
- report-content flow;
- admin report queue;
- takedown/suspension actions;
- basic appeal/contact path.

These pages must clearly state prototype/draft legal status where appropriate; do not pretend owner has obtained legal review.

Create `docs/LEGAL_AND_COMPLIANCE_OPEN_ITEMS.md` listing items requiring qualified legal/compliance review before production.

---

# 8. USERS AND ROLES

Implement explicit role/permission boundaries.

Minimum roles:

## 8.1 Visitor

Can:

- view marketing site;
- view public creator pages;
- view public posts/previews;
- view public tier pricing;
- register/login.

## 8.2 Member / Fan

Can:

- maintain profile;
- subscribe to creator tiers;
- access content according to entitlements;
- see own memberships;
- cancel/manage membership according to provider capability;
- view billing/payment status;
- report content;
- manage account/security.

## 8.3 Creator

Can:

- apply for creator status;
- complete payout setup;
- pay ZeroFee SaaS plan;
- configure creator profile;
- create/edit/publish tiers;
- create free/paid posts;
- view subscribers;
- view earnings/payment data available through the provider;
- see payout status;
- see account/compliance requirements;
- handle relevant refunds/disputes through supported embedded/provider UI where appropriate;
- see basic analytics;
- manage settings.

## 8.4 Admin / Owner

Can:

- review creator applications;
- inspect creator account state;
- suspend/reactivate;
- manage reports;
- manage fee profiles;
- manage SaaS plan configuration;
- inspect webhook events;
- inspect audit events;
- manage platform feature flags;
- manage mock/Stripe capability visibility;
- see high-level platform metrics;
- manually grant/revoke test entitlements with audit reason;
- NEVER be given a UI that exposes raw secret keys.

Use RBAC/authorization middleware/server checks. UI hiding is not authorization.

---

# 9. CORE USER JOURNEYS

The prototype is not complete until the following journeys work end to end.

## Journey A — Creator starts from zero

1. Visitor lands on ZeroFee.
2. Understands 0% platform transaction fee + flat monthly plan.
3. Uses savings/pricing calculator.
4. Creates account.
5. Chooses `Become a creator`.
6. Completes creator application.
7. Submits.
8. Admin reviews.
9. Admin approves.
10. Creator receives in-app status update.
11. Creator enters `Set up payouts`.
12. Completes mock or real embedded Stripe Connect onboarding.
13. System confirms readiness based on provider state.
14. Creator activates ZeroFee $50/month plan in mock/test/live mode.
15. Creator sets public profile.
16. Creator creates first membership tier.
17. Defaults to Target Net pricing mode.
18. Creator enters desired net.
19. Pricing Engine recommends final public price.
20. Creator previews exactly what buyer will see.
21. Creator publishes tier/page.
22. Creator creates paid content.
23. Public page becomes ready for memberships.

## Journey B — Fan subscribes

1. Fan visits public creator page.
2. Sees final membership price from the beginning.
3. Understands benefits.
4. Signs in/registers.
5. Starts checkout.
6. Payment provider handles payment.
7. Browser success redirect alone does not grant access.
8. Webhook/provider event confirms subscription.
9. Membership entitlement becomes active.
10. Fan can immediately access members-only content.
11. Fan sees membership in own dashboard.

## Journey C — Creator pricing decision

1. Creator creates tier.
2. Selects Simple Price or Target Net.
3. Target Net is recommended/default.
4. Creator enters target net.
5. System calculates retail price using active profile.
6. UI displays calculation summary.
7. Creator can adjust target until retail price looks attractive.
8. Creator publishes.
9. Public side shows final retail price only.

## Journey D — Admin rejects creator

1. Application submitted.
2. Admin sees review queue.
3. Admin rejects with reason.
4. Audit event written.
5. Creator cannot activate payouts/sales.
6. Creator sees appropriate status and owner-configured reapply/contact path.

## Journey E — Additional information required

1. Admin marks `NEEDS_INFORMATION` and enters request.
2. Creator sees request.
3. Creator responds/updates allowed fields.
4. Resubmits.
5. State returns to review.
6. History is preserved.

## Journey F — Provider requires more KYC

1. Connected account previously existed.
2. Stripe/mock provider reports outstanding requirement.
3. ZeroFee creator dashboard shows actionable status.
4. `Complete verification` opens embedded onboarding/update flow.
5. Payments are enabled/disabled based on provider truth, not a local guessed flag.

## Journey G — Failed creator SaaS payment

1. Creator's $50 ZeroFee subscription becomes past due.
2. Creator sees billing warning.
3. Grace period is applied according to config.
4. After grace period, account becomes SaaS-suspended.
5. Existing data is preserved.
6. New monetization activity follows the documented suspension policy.
7. Restoring billing restores entitlement safely.

## Journey H — Refund/dispute simulation

1. Admin/test harness creates simulated refund/dispute provider event.
2. Event is idempotently processed.
3. Creator/member views show changed payment status.
4. Membership entitlement follows documented policy.
5. ZeroFee does not invent a platform reimbursement.

---

# 10. MARKETING SITE

Create a polished public marketing site.

Required sections/pages:

- Homepage;
- How it works;
- Pricing;
- Creator fee/savings calculator;
- Safety/compliance summary;
- FAQ;
- Sign up/Login.

## 10.1 Homepage narrative

The homepage must explain, in under one screen:

- typical percentage-based platforms become more expensive as creators grow;
- ZeroFee charges a flat creator SaaS subscription;
- ZeroFee takes 0% platform fee from creator membership sales;
- payment processing still exists;
- creator can set a desired net target and ZeroFee helps calculate retail pricing.

Avoid attacking named competitors with unsupported numerical claims.

The calculator may use a configurable competitor percentage as an example.

Example:

`Monthly creator revenue: $5,000`

`Example 10% platform fee: $500`

`ZeroFee flat subscription: $50`

`Difference: $450/month`

Clearly label assumptions.

## 10.2 Calculator

Build a real interactive calculator with:

- monthly revenue;
- competitor platform percentage;
- competitor flat fee optional;
- ZeroFee monthly plan price;
- monthly savings;
- annual savings;
- break-even revenue.

Break-even for percentage-only competitor should be correctly calculated.

Do not confuse payment-processing fees with platform fees in this calculator unless the user explicitly enables a payment-processing comparison.

---

# 11. DESIGN / UX DIRECTION

ZeroFee should look like a credible modern financial/creator SaaS, not a generic AI-generated dashboard.

## 11.1 Visual direction

Aim for:

- premium minimalism;
- high typography quality;
- confident spacing;
- strong numerical hierarchy;
- restrained use of cards;
- no unnecessary glassmorphism;
- no noisy gradients everywhere;
- no giant empty hero sections;
- excellent mobile behavior;
- financial information that is calm and legible;
- clear status colors and labels, but never color-only meaning.

Create a lightweight ZeroFee design system:

- typography scale;
- spacing scale;
- semantic colors/tokens;
- radii;
- shadows;
- form patterns;
- status badge patterns;
- data table patterns;
- empty states;
- skeleton/loading states;
- error/success banners;
- mobile bottom/sheet patterns where useful.

The brand must feel original. Do not clone Patreon, Stripe, OnlyFans, Substack, Raycast, Linear or another named product pixel-for-pixel.

## 11.2 Mobile first-quality

Every core journey must be deliberately designed for mobile, not merely responsive afterthought CSS.

Test at minimum:

- 390px-ish phone viewport;
- tablet;
- standard laptop;
- large desktop.

Creator onboarding, payout setup and tier pricing must be especially usable on mobile.

---

# 12. INFORMATION ARCHITECTURE

## Public

- `/`
- `/pricing`
- `/how-it-works`
- `/safety`
- `/faq`
- `/login`
- `/signup`
- `/c/[creatorSlug]`
- `/c/[creatorSlug]/posts/[postSlug]`
- `/legal/terms`
- `/legal/privacy`
- `/legal/creator-terms`
- `/legal/acceptable-use`

## Member application

- `/app`
- `/app/memberships`
- `/app/account`
- `/app/security`

## Creator application

- `/creator`
- `/creator/apply`
- `/creator/application-status`
- `/creator/onboarding`
- `/creator/profile`
- `/creator/tiers`
- `/creator/tiers/new`
- `/creator/tiers/[id]`
- `/creator/content`
- `/creator/content/new`
- `/creator/members`
- `/creator/earnings`
- `/creator/payouts`
- `/creator/billing`
- `/creator/settings`

## Admin

- `/admin`
- `/admin/applications`
- `/admin/applications/[id]`
- `/admin/creators`
- `/admin/creators/[id]`
- `/admin/reports`
- `/admin/fee-profiles`
- `/admin/plans`
- `/admin/webhooks`
- `/admin/audit`
- `/admin/settings`

Exact paths can change if implementation reasons justify it, but all capabilities must remain present.

---

# 13. CREATOR DASHBOARD

The creator dashboard must not be a vanity screen.

Show real prototype-domain data:

- public page status;
- application/compliance status;
- payout verification status;
- ZeroFee SaaS billing status;
- active members;
- monthly recurring creator membership revenue estimate;
- recent successful membership payments;
- recent membership changes;
- next actions;
- content performance basics;
- pricing plan/tier summary.

If data is unavailable in provider mode, show a correct empty/unavailable state rather than invented numbers.

## 13.1 Earnings terminology

Clearly distinguish:

- gross member sales;
- estimated processing;
- creator target net;
- actual provider-recorded net if available;
- refunds/disputes;
- ZeroFee SaaS fee.

Never mix ZeroFee SaaS revenue with creator membership revenue.

---

# 14. CREATOR PUBLIC PROFILE

Creator can configure:

- display name;
- slug;
- avatar;
- cover/banner;
- short bio;
- full about section;
- social links;
- public category;
- accent/theme selection from a constrained set;
- featured tier;
- featured posts.

Public profile must show:

- identity/branding;
- creator description;
- tier cards;
- final public membership prices;
- free posts;
- locked post previews;
- subscriber CTA;
- safety/report link.

Do not show sensitive/legal creator identity information.

---

# 15. MEMBERSHIP TIERS

Tier model must support:

- name;
- description;
- benefits list;
- active/inactive;
- monthly billing initially;
- annual billing architecture-ready;
- currency;
- pricing mode;
- target net;
- active public price version;
- member count;
- sort order;
- optional capacity limit later;
- draft/published/archived state.

For the first prototype, restrict complexity rather than implement every billing edge case.

Do not implement arbitrary donation/tip money transmission in prototype. Keep the core product to defined creator memberships and creator content.

---

# 16. CONTENT SYSTEM

The prototype needs enough content capability to prove the membership product.

Post fields:

- title;
- slug;
- excerpt;
- content/body;
- cover image optional;
- visibility: public / all paid members / selected tiers;
- draft/published/archived;
- publish timestamp;
- creator ownership.

For heavy media:

- do not build expensive custom video streaming infrastructure in Prompt 1;
- allow safe image uploads with strict limits OR use a local/mock object-storage abstraction;
- allow external video/embed link where safe;
- document future video architecture separately.

This is deliberate. The $50 flat-fee economics fail if prototype accidentally promises unlimited expensive video infrastructure.

Create quota abstractions from day one for:

- storage;
- bandwidth where measurable;
- email notifications;
- AI usage if ever introduced;
- team members later.

Do not necessarily enforce every future quota yet, but the plan entitlement model must support them.

---

# 17. MEMBER ENTITLEMENTS

Do not authorize paid content based only on a UI flag.

Implement server-side entitlement resolution.

Inputs can include:

- user;
- creator;
- membership subscription;
- tier;
- subscription status;
- content visibility requirements.

Output:

- allowed/denied;
- reason code.

Statuses must account for:

- active;
- trial if later supported;
- past due grace policy;
- cancelled at period end;
- expired;
- refunded/revoked if policy says so.

Unit-test entitlement logic thoroughly.

---

# 18. DATA MODEL

Use PostgreSQL from day one.

Use migrations.

Do not store the entire business in one giant JSON field.

Recommended relational entities, adapting names to the chosen ORM:

## Identity

- `User`
- `Session`
- `UserRole` / role mapping
- `SecurityEvent`

## Creator domain

- `CreatorProfile`
- `CreatorApplication`
- `CreatorApplicationRevision` or history
- `CreatorReviewNote`
- `CreatorComplianceStatus`
- `CreatorConnectedAccount`

## Platform SaaS billing

- `PlatformPlan`
- `PlatformSubscription`
- `PlatformEntitlement`

## Pricing

- `PaymentFeeProfile`
- `CreatorTier`
- `TierPriceVersion`

## Content

- `Post`
- `PostTierAccess`
- `MediaAsset`

## Fan memberships

- `MembershipSubscription`
- `MembershipPayment`
- `MembershipEvent`

## Provider integration

- `PaymentProviderEvent`
- `WebhookEvent`
- `ProviderCustomerReference`
- appropriate external-id mappings

## Safety/admin

- `ContentReport`
- `ModerationAction`
- `AuditLog`
- `AdminSetting`
- `FeatureFlag`

Use appropriate unique constraints and foreign keys.

Important constraints:

- unique normalized email where appropriate;
- unique creator slug;
- unique provider event ID per provider/account scope;
- immutable price version identity;
- no membership can point to another creator's tier;
- external provider IDs indexed;
- audit records append-only at application level;
- timestamps for creation/update;
- soft-delete/archive only where product semantics need history.

---

# 19. STATE MACHINES

Avoid random booleans such as:

`isApproved`, `isVerified`, `isPaid`, `isSuspended`, `isLive`

when the state is actually multi-step.

Create explicit state machines/enums and transition services for:

## Creator application

DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED / NEEDS_INFORMATION / REJECTED

with resubmission path.

## Connected account readiness

NOT_CREATED → ONBOARDING_REQUIRED → PENDING_REVIEW → RESTRICTED/NEEDS_INFO → READY → SUSPENDED/DISABLED as provider state dictates.

## ZeroFee SaaS billing

NONE → TRIALING(optional) → ACTIVE → PAST_DUE → GRACE → SUSPENDED → CANCELLED.

## Tier

DRAFT → PUBLISHED → ARCHIVED.

## Membership

PENDING_PAYMENT → ACTIVE → PAST_DUE → CANCEL_AT_PERIOD_END → CANCELLED / EXPIRED / REVOKED.

Map provider-specific statuses into ZeroFee domain statuses in one adapter layer.

Do not spread raw Stripe status strings throughout React components.

---

# 20. TECHNICAL ARCHITECTURE

The repository is empty. Establish a maintainable foundation without overengineering.

Preferred shape for this prototype:

- current stable **Next.js App Router** with TypeScript;
- PostgreSQL;
- a mature TypeScript ORM with migrations;
- Tailwind CSS;
- accessible component primitives;
- server-side domain/service layer;
- route handlers/server actions only where appropriate;
- Stripe official SDK;
- Stripe embedded components when provider mode is Stripe;
- Playwright for browser journeys;
- unit/integration test runner appropriate to stack;
- ESLint + formatting;
- pnpm.

You may choose exact current-stable versions at execution time. Lock versions in the repository.

Do not choose an experimental stack merely because it is new.

## 20.1 Suggested repository structure

A single full-stack app is acceptable for Prompt 1, but keep boundaries clear.

Suggested:

```text
/app
/components
/components/ui
/lib
/lib/auth
/lib/db
/lib/domain
/lib/payments
/lib/platform-billing
/lib/pricing
/lib/compliance
/lib/entitlements
/lib/security
/lib/observability
/prisma or /db
/tests
/docs
/scripts
/prompts
```

If you choose a workspace/monorepo, justify it in `docs/ARCHITECTURE.md`. Do not create monorepo complexity solely for appearance.

## 20.2 Domain/provider separation

Required provider interfaces:

- `CreatorPaymentsProvider`;
- `PlatformBillingProvider`;
- `MediaStorageProvider` if uploads are implemented;
- `NotificationProvider` if email is implemented.

The mock and Stripe providers must implement the same important domain contract.

## 20.3 Environment configuration

Create `.env.example` with all required values and comments, including:

- app URL;
- database URL;
- auth/session secrets;
- payment provider mode;
- Stripe platform keys/test values placeholders;
- Stripe webhook secret placeholders;
- Connect configuration placeholders where required;
- platform plan price configuration if not DB-seeded;
- storage provider config;
- email/mock notification config;
- admin seed credentials only as development variables, never hardcoded production credentials.

Validate environment configuration at startup.

Fail safely for missing production-required settings.

---

# 21. AUTHENTICATION AND ACCOUNT SECURITY

Implement real authentication, not a front-end mock.

Minimum prototype requirements:

- email/password or another secure first-party auth flow;
- strong password hashing;
- secure session cookies;
- session invalidation;
- login rate limiting;
- registration rate limiting;
- password reset architecture or clearly documented prototype limitation;
- email verification architecture-ready;
- CSRF protection appropriate to chosen framework patterns;
- authorization on all protected mutations;
- no secrets in client bundle.

Seed an admin account only for development/test mode.

Document development credentials in README or seed output, not production source code.

Do not expose whether arbitrary email addresses are registered through avoidable auth error differences.

---

# 22. SECURITY REQUIREMENTS

Treat this as a financial-adjacent platform even though Prompt 1 is a prototype.

At minimum review/fix:

- IDOR across creator/member/admin resources;
- role escalation;
- CSRF;
- XSS in creator posts/bios;
- unsafe rich text;
- SQL injection via ORM/raw queries;
- SSRF through external URL previews if any;
- unsafe file upload types;
- oversized uploads;
- path traversal;
- webhook spoofing;
- replay/idempotency;
- race conditions in subscription state changes;
- open redirects;
- sensitive logs;
- missing rate limits;
- insecure cookies;
- authorization gaps in server actions;
- accidental exposure of Stripe secrets;
- accidental exposure of KYC/private application data.

Use security headers where appropriate.

Create `docs/SECURITY.md` with:

- threat summary;
- protected assets;
- trust boundaries;
- known prototype limitations;
- production hardening backlog.

---

# 23. PRIVACY / PII MINIMIZATION

ZeroFee should not become a duplicate KYC vault.

Principles:

- Stripe collects identity documents directly where possible;
- store only references/statuses required to operate the product;
- do not store raw bank credentials;
- do not log private application fields unnecessarily;
- redact sensitive provider payloads in normal logs;
- admin UI follows least privilege;
- user-facing deletion/export requirements are documented for future production work.

---

# 24. ADMIN CONTROL PLANE

Build a serious owner/admin area.

## Dashboard

Show:

- total users;
- creators by application state;
- approved creators;
- connected-account readiness;
- active ZeroFee SaaS subscriptions;
- active fan memberships;
- platform MRR estimate from creator SaaS;
- creator GMV as a separate metric if available;
- open reports;
- failed webhook events.

Always label test/mock financial values.

## Applications

Functional review queue with filters and states.

## Creators

View:

- creator profile;
- compliance state;
- Stripe/mock account state;
- SaaS billing state;
- public page state;
- tier/member counts;
- moderation history;
- audit history.

## Fee profiles

Admin can:

- create/edit profile;
- set currency/region/payment method;
- set percentage/fixed/buffer values;
- activate/deactivate;
- preview calculations;
- see which tiers use a profile/version.

Do not retroactively alter historical price calculations without versioning/audit.

## Webhooks

Show:

- provider;
- external event ID;
- type;
- connected account scope;
- received time;
- processed time;
- status;
- attempts;
- safe error;
- replay internal processing button.

## Audit

Filter by:

- actor;
- action;
- resource;
- date;
- creator.

---

# 25. AUDIT LOGGING

Audit important mutations:

- creator submits application;
- admin approval/rejection/info request;
- connected-account linkage changes;
- creator tier publish/price change;
- plan entitlement override;
- creator suspension;
- report resolution;
- webhook replay;
- admin setting change;
- fee profile change.

Audit fields:

- actor user ID or system;
- action;
- resource type/id;
- timestamp;
- reason where needed;
- minimal before/after metadata where safe;
- request correlation ID where available.

Do not log secrets or full sensitive provider payloads.

---

# 26. NOTIFICATIONS

At minimum implement in-app notification records for:

- application submitted;
- application approved;
- additional information requested;
- rejected;
- payout verification action required;
- payout setup complete;
- creator SaaS payment problem;
- new membership;
- membership cancelled;
- content report action if relevant.

Email may use a mock provider in Prompt 1.

Do not block core flows on external SMTP credentials.

---

# 27. ERROR, LOADING, EMPTY AND PERMISSION STATES

Every important page must have intentional states.

Especially:

- no application yet;
- application under review;
- creator rejected;
- provider not configured;
- Stripe test mode;
- Connect onboarding incomplete;
- KYC additional information required;
- payouts disabled;
- ZeroFee SaaS billing past due;
- no tiers;
- no posts;
- no members;
- failed checkout;
- pending webhook confirmation;
- membership expired;
- unauthorized page;
- admin-only action forbidden;
- network/server failure.

Do not render blank dashboards.

---

# 28. CHECKOUT / FAN PAYMENT EXPERIENCE

The buyer must know the real final recurring price before initiating checkout.

Required public tier card information:

- tier name;
- final public price;
- currency;
- `/month`;
- benefits;
- cancellation language;
- creator identity.

Do not reveal internal target-net amount unless creator explicitly chooses to display it later.

Do not display a late-added ZeroFee transaction fee.

If tax must later be added depending on jurisdiction, keep it clearly separate from the “no hidden ZeroFee fee” promise and document that production tax architecture is pending.

For Prompt 1, tax can be disabled/mock, but code architecture must not imply taxes never exist.

---

# 29. REFUNDS, DISPUTES AND NEGATIVE BALANCES

The prototype must model these conceptually even if full Stripe production handling is not yet available.

Principles:

- refunds/disputes relate to the creator-side direct charge;
- ZeroFee must not automatically reimburse the creator from platform SaaS revenue;
- membership entitlement policy after a refund/dispute must be deterministic;
- creator sees the event;
- admin can see provider event;
- loss-liability configuration must reflect actual Stripe contract/configuration before production.

Create deterministic mock events for:

- full refund;
- dispute opened;
- dispute won;
- dispute lost;
- connected account negative/restricted state.

---

# 30. UNIT ECONOMICS PROTECTION FOR ZEROFEE

Flat-fee SaaS fails if infrastructure usage is truly unlimited.

Prompt 1 must therefore create the foundations for sustainable unit economics.

The default $50 creator plan should have configurable quotas/entitlements for expensive resources.

Examples:

- media storage;
- outbound email volume;
- advanced analytics retention;
- team seats;
- API usage later;
- AI generation later;
- heavy video bandwidth later.

Do not necessarily bill overages in Prompt 1.

But:

- create quota definitions;
- show usage where implemented;
- reject absurd oversized uploads;
- document cost-sensitive resources.

Create `docs/UNIT_ECONOMICS.md` containing:

- ZeroFee $50 creator SaaS revenue model;
- variable payment processing is not a ZeroFee subsidy;
- creator GMV is separate from ZeroFee SaaS revenue;
- major future variable-cost risks;
- why unlimited video/email/AI cannot be promised blindly;
- recommended metrics to track.

---

# 31. ANALYTICS

Prototype analytics should be useful and honest.

Creator:

- active members;
- new memberships over time;
- cancellations;
- gross membership sales;
- estimated processing cost where calculable;
- creator actual/estimated net distinction;
- top tier by members;
- public page conversion funnel where measurable.

Admin:

- creator SaaS MRR;
- approved creators;
- active creators;
- creator membership GMV;
- active member subscriptions;
- application conversion;
- failed payment/webhook counts.

Mock/test data must be clearly labeled.

Do not fabricate analytics that cannot be derived from stored events.

---

# 32. SEED / DEMO EXPERIENCE

A reviewer should be able to run the app and immediately understand ZeroFee.

Provide deterministic seed data:

- 1 admin;
- 1 approved/fully onboarded creator;
- 1 creator awaiting review;
- 1 creator needing information;
- 1 normal fan/member;
- 2-3 membership tiers demonstrating pricing modes;
- several public and paid posts;
- active membership;
- cancelled membership;
- simulated failed webhook;
- sample fee profiles;
- sample notifications/reports.

Never seed production secrets.

Provide a reset script for development demo data.

---

# 33. TESTING

The prototype is not complete because it builds.

## 33.1 Unit tests

At minimum:

- Pricing Engine;
- gross-up calculation;
- rounding;
- entitlement resolution;
- creator application transitions;
- SaaS billing transitions;
- membership transitions;
- authorization helpers;
- webhook idempotency service.

## 33.2 Integration tests

At minimum:

- creator application submit/review;
- approved creator can start onboarding;
- rejected creator cannot activate sales;
- fee profile calculation persists correct price version;
- webhook activates membership;
- duplicate webhook does not duplicate membership/payment;
- refund changes state according to policy;
- SaaS suspension changes creator entitlement;
- admin-only actions reject ordinary users;
- creator cannot mutate another creator's resources;
- member cannot access unentitled paid post.

## 33.3 Browser/E2E journeys

Use Playwright or equivalent.

Automate at minimum:

1. Visitor → creator signup/application.
2. Admin → approve application.
3. Creator → mock payout onboarding.
4. Creator → activate mock ZeroFee plan.
5. Creator → create Target Net tier.
6. Pricing preview calculation.
7. Creator → publish tier.
8. Fan → subscribe in mock payment mode.
9. Webhook/event → entitlement active.
10. Fan → open paid post.
11. Fan without membership → denied/upsell.
12. Creator SaaS past-due/grace/suspended state.
13. Admin → report moderation action.
14. Duplicate webhook idempotency.
15. Mobile viewport core journey smoke.

No core test should depend on live Stripe/network credentials.

If Stripe test credentials are available, add an optional live-test-mode integration suite separated from deterministic CI.

---

# 34. ACCESSIBILITY

Target WCAG 2.1 AA-quality fundamentals.

Ensure:

- keyboard navigation;
- visible focus;
- semantic headings;
- labeled controls;
- form errors associated with fields;
- accessible dialogs/sheets;
- contrast;
- no color-only statuses;
- reduced-motion respect;
- meaningful button names;
- sensible tab order;
- responsive text sizing.

Run automated accessibility checks on representative pages if tooling allows.

---

# 35. PERFORMANCE

Avoid prototype architecture that becomes unusable at moderate scale.

Requirements:

- paginate admin/member lists;
- server-side query limits;
- indexed common query fields;
- optimized images;
- no giant provider payloads shipped to client;
- avoid unnecessary client components;
- cache only where correctness allows;
- public creator page should be fast;
- no N+1 query patterns in obvious list pages.

Document any intentional prototype shortcuts.

---

# 36. OBSERVABILITY

Implement structured server logging with:

- request/correlation ID;
- severity;
- route/service context;
- provider event ID when relevant;
- redaction.

Add a basic health endpoint checking:

- application process;
- database connectivity;
- provider configuration state, without exposing secrets.

Create clear error boundaries/pages.

---

# 37. README

Create a professional root `README.md` covering:

- what ZeroFee is;
- product promise;
- architecture overview;
- local setup;
- required software;
- environment variables;
- database setup;
- migrations;
- seed;
- mock provider mode;
- optional Stripe test setup;
- running tests;
- screenshots or link to screenshot artifacts;
- current prototype limitations;
- explicit warning that production Stripe content-platform approval is required.

A new developer should be able to start the prototype from the README alone.

---

# 38. REQUIRED DOCUMENTATION

Create at minimum:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/PRICING_ENGINE.md`
- `docs/STRIPE_APPROVAL_READINESS.md`
- `docs/LEGAL_AND_COMPLIANCE_OPEN_ITEMS.md`
- `docs/SECURITY.md`
- `docs/UNIT_ECONOMICS.md`
- `docs/PROTOTYPE_LIMITATIONS.md`
- `docs/OWNER_NEXT_STEPS.md`

Documentation must describe what was actually implemented, not a fantasy future state.

---

# 39. IMPLEMENTATION PHASES — EXECUTE IN THIS ORDER

Do not create separate planning-only commits and stop. Execute all phases.

## PHASE 0 — Repository audit and bootstrap

1. Fetch/sync current default branch safely.
2. Record HEAD and working tree state.
3. Read every existing repository file before overwriting architectural decisions.
4. Preserve this prompt.
5. Bootstrap app/tooling.
6. Configure lint/typecheck/test/build.
7. Add environment validation.
8. Add PostgreSQL migration foundation.
9. Create initial README setup instructions.
10. Confirm clean local startup.

### Acceptance

- application starts;
- database connects;
- migration runs;
- lint/typecheck/build test harness executes.

## PHASE 1 — Domain model and auth

1. Implement user/session auth.
2. Implement roles/authorization.
3. Add creator application model.
4. Add plan/subscription models.
5. Add pricing/fee-profile/tier models.
6. Add member subscription/content models.
7. Add provider-event/audit/report models.
8. Add seed framework.

### Acceptance

- migrations work on clean database;
- seeded users can authenticate;
- role boundaries tested.

## PHASE 2 — Marketing + app shell + design system

1. Establish tokens/components/layout.
2. Build homepage.
3. Build pricing.
4. Build fee/savings calculator.
5. Build authenticated member/creator/admin shells.
6. Build responsive navigation.
7. Add polished empty/loading/error states.

### Acceptance

- mobile and desktop visually coherent;
- calculator mathematically correct;
- no dead primary CTA.

## PHASE 3 — Creator application/compliance

1. Creator application form.
2. Draft persistence.
3. Submission.
4. Admin review queue.
5. Needs-info loop.
6. Approval/rejection.
7. Audit.
8. Status notifications.
9. Legal/safety draft pages.

### Acceptance

- full review state machine works;
- creator cannot self-approve;
- admin actions audited.

## PHASE 4 — Payments provider abstraction + mock Connect

1. Implement provider interfaces.
2. Implement deterministic mock connected account.
3. Embedded-like local onboarding simulation.
4. Requirement states.
5. Readiness state mapping.
6. Mock payout/payment views.
7. Webhook/provider event infrastructure.

### Acceptance

- approved creator can become payment-ready in mock mode;
- non-approved creator cannot;
- provider events idempotent.

## PHASE 5 — Stripe Connect implementation boundary

1. Add Stripe SDK/provider.
2. Server-side connected-account creation/retrieval.
3. Current recommended embedded onboarding integration.
4. Account state sync.
5. Connect webhook handling.
6. Direct-charge subscription path architecture.
7. Embedded payment/payout/account components where supported and credentials available.
8. Clear test-mode badge.
9. Safe failure when platform Stripe configuration is incomplete.

### Acceptance

- code compiles without Stripe credentials in mock mode;
- Stripe provider path is real, not pseudocode;
- provider-specific code does not leak across domain UI.

If live Connect platform configuration is not available, do not fake actual Stripe readiness. Mark the live integration as `configuration required` while preserving functional mock mode.

## PHASE 6 — ZeroFee creator SaaS billing

1. Platform $50 plan config.
2. Mock platform billing.
3. Stripe platform-billing adapter where feasible.
4. Billing state machine.
5. Grace/suspension behavior.
6. Creator billing page.
7. Admin plan/config page.

### Acceptance

- creator entitlement depends on billing state;
- billing suspension is reversible;
- creator data is preserved.

## PHASE 7 — Pricing Engine

1. Implement fee profiles.
2. Implement money math.
3. Implement Simple Price.
4. Implement Target Net.
5. Implement creator pricing UI.
6. Implement recommended retail price.
7. Implement price versioning.
8. Implement admin fee-profile editor/preview.
9. Unit-test all calculations.

### Acceptance

- public price is deterministic;
- no float money bugs;
- historical price versions are preserved;
- no surprise buyer fee is appended at checkout.

## PHASE 8 — Creator profile, tiers, content

1. Profile editor.
2. Public creator page.
3. Tier create/edit/publish.
4. Content create/edit/publish.
5. Tier content restrictions.
6. Media restrictions/abstraction.
7. Mobile QA.

### Acceptance

- creator can go from approved to published membership page;
- public visitor can clearly understand offer and final price.

## PHASE 9 — Fan memberships and entitlements

1. Member dashboard.
2. Checkout initiation.
3. Mock success/failure.
4. Stripe direct-charge checkout/subscription integration boundary.
5. Webhook-authoritative activation.
6. Entitlement engine.
7. Cancellation lifecycle.
8. Paid content gating.
9. Refund/dispute simulation.

### Acceptance

- no access before authoritative activation;
- duplicate events do not duplicate subscription;
- unauthorized users cannot bypass content gate.

## PHASE 10 — Creator earnings + admin operations

1. Earnings dashboard.
2. Subscriber list.
3. Payment/event history.
4. Payout/account state.
5. Admin creator detail.
6. Admin reports/moderation.
7. Admin webhook inspector/replay.
8. Admin audit viewer.

### Acceptance

- financial concepts are separated correctly;
- mock/test values are labeled;
- no sensitive payload leakage.

## PHASE 11 — Hardening and quality

1. Security review.
2. IDOR tests.
3. Rate limits.
4. CSP/security headers as practical.
5. XSS/rich-text review.
6. Upload validation.
7. Webhook verification.
8. Accessibility QA.
9. Performance QA.
10. Responsive QA.
11. Clean database migration test.
12. E2E suite.
13. Build/lint/typecheck/tests all green.

## PHASE 12 — Visual QA and final documentation

1. Run application with seed data.
2. Capture actual rendered screenshots of core pages at desktop and mobile widths.
3. Inspect visually, not just technically.
4. Fix spacing, overflow, typography, hierarchy, broken states and awkward mobile layouts.
5. Update all required documentation to match reality.
6. Write owner next-step checklist.
7. Ensure working tree is clean.
8. Commit and push all work.

---

# 40. REQUIRED SCREENSHOT QA

Capture actual rendered screenshots for at least:

- homepage desktop;
- homepage mobile;
- pricing/calculator;
- creator application;
- admin application review;
- creator onboarding/payment readiness;
- creator dashboard;
- tier pricing builder Target Net mode;
- public creator page;
- fan membership dashboard;
- paid content locked/unlocked;
- admin dashboard.

Store screenshots under a sensible development artifact folder that is not accidentally deployed if inappropriate.

Inspect each screenshot for:

- clipping;
- horizontal scroll;
- broken cards;
- inconsistent spacing;
- giant blank areas;
- typography collisions;
- status clarity;
- CTA hierarchy;
- financial number readability;
- mobile usability.

Do not call UI complete before this pass.

---

# 41. ACCEPTANCE CRITERIA — PRODUCT

The Prompt 1 prototype is complete only if ALL of the following are true:

1. A visitor can understand ZeroFee's business model.
2. Marketing never falsely claims payment processing is free.
3. Creator can register.
4. Creator can submit application.
5. Admin can approve/reject/request information.
6. Approval history is preserved.
7. Approved creator can run payout onboarding in mock mode.
8. Stripe Connect production integration boundary exists and uses current supported architecture.
9. Creator does not need a normal stripe.com workflow in the intended embedded UX.
10. Creator can activate ZeroFee flat SaaS plan in mock mode.
11. Plan price is configurable and defaults to $50/month.
12. Creator can create a tier.
13. Creator can choose Simple Price.
14. Creator can choose Target Net.
15. Target Net is default/recommended.
16. Pricing Engine correctly gross-ups configured payment costs.
17. Public price is shown before checkout.
18. No surprise ZeroFee fee appears only at checkout.
19. Creator can publish public profile.
20. Creator can publish gated content.
21. Fan can create account.
22. Fan can subscribe in mock mode.
23. Webhook/provider event activates membership.
24. Browser redirect alone cannot activate membership.
25. Paid content is server-gated.
26. User cannot access another creator's admin resources.
27. Creator cannot self-approve.
28. Member cannot access admin.
29. Creator dashboard separates gross, estimated/actual processing and platform SaaS.
30. Refund/dispute states exist.
31. ZeroFee does not subsidize creator processing in the initial business model.
32. Admin can manage fee profiles.
33. Admin can inspect failed webhook events.
34. Audit log covers critical mutations.
35. Content reporting/moderation flow exists.
36. Acceptable-use/legal placeholders exist.
37. Stripe content-platform approval requirement is documented.
38. App works well on phone and desktop.
39. Tests cover critical domain rules.
40. Clean install/setup instructions work.
41. Build, lint, typecheck and test are green.
42. Final docs describe actual state accurately.

---

# 42. ACCEPTANCE CRITERIA — PAYMENT ECONOMICS

The following invariants are especially important:

## Invariant 1

ZeroFee's creator SaaS subscription revenue and creator fan-payment GMV are separate ledgers/concepts.

## Invariant 2

ZeroFee does not pay creator processing fees from its $50 subscription in the initial model.

## Invariant 3

Target Net mode gross-ups the customer-facing price based on an explicit fee profile.

## Invariant 4

The buyer sees the final customer-facing price before checkout.

## Invariant 5

ZeroFee's platform transaction fee for creator membership sales is zero in the initial product.

## Invariant 6

Payment processing is never marketed as zero.

## Invariant 7

Refunds/disputes are not silently insured by ZeroFee.

## Invariant 8

Direct charges are the intended production fan-payment architecture, subject to Stripe approval/configuration.

## Invariant 9

No internal custodial creator wallet is built in Prompt 1.

## Invariant 10

Exact Stripe fees and loss-liability status are configuration/provider facts, not marketing assumptions.

---

# 43. PROTOTYPE SCOPE EXCLUSIONS

Do NOT waste Prompt 1 time implementing these unless required by a dependency:

- native iOS app;
- native Android app;
- Apple/Google in-app purchases;
- custom video transcoding/streaming infrastructure;
- crypto payments;
- adult-content payment workaround;
- crowdfunding;
- peer-to-peer tips/transfers unrelated to defined creator products;
- affiliate marketplace;
- creator-to-creator transfers;
- complex tax filing automation;
- multi-processor smart routing;
- multi-language localization beyond architecture readiness;
- AI content generation;
- livestreaming;
- Discord integration;
- mobile push notification infrastructure;
- custom domain provisioning;
- teams/agencies;
- complex annual/proration migration logic;
- production card-network optimization.

Keep extension points clean, but do not dilute the prototype.

---

# 44. OWNER NEXT STEPS DOCUMENT

At completion create `docs/OWNER_NEXT_STEPS.md` as a checkbox-driven sequence for the owner.

It must include, in dependency order:

1. Review product wording.
2. Choose final ZeroFee company/legal entity.
3. Engage payments/legal counsel as needed.
4. Finalize acceptable-use/creator terms/privacy/consumer terms.
5. Contact Stripe for content-creation platform approval.
6. Confirm desired Connect architecture with Stripe.
7. Confirm Stripe handles pricing availability for target platform country.
8. Confirm direct charges.
9. Confirm connected-account loss-liability model.
10. Confirm target creator countries.
11. Confirm supported currencies.
12. Confirm payment methods.
13. Decide whether Target Net uses conservative buffer and by how much.
14. Decide public launch $50 plan price.
15. Decide quotas.
16. Configure Stripe platform account.
17. Configure Connect.
18. Configure real webhook endpoints.
19. Configure platform Billing.
20. Configure production database.
21. Configure storage/email/observability.
22. Run test-mode end-to-end payments.
23. Run refund/dispute tests.
24. Complete security review.
25. Complete privacy/compliance review.
26. Run closed beta with a few creators.
27. Recalculate unit economics from beta data.
28. Only then consider public launch.

The checklist must clearly distinguish coding tasks from external/legal/business tasks.

---

# 45. FINAL COMPLETION REPORT

When execution is complete, do NOT respond with a vague “done.”

Produce a concise but concrete completion report containing:

- final commit SHA;
- branch;
- whether pushed successfully;
- current repository clean/dirty state;
- major implemented product flows;
- architecture summary;
- database/migration status;
- test counts and results;
- lint/typecheck/build results;
- E2E results;
- screenshots captured;
- mock-provider status;
- Stripe integration status;
- exactly which live Stripe capabilities could not be verified because external approval/credentials were unavailable;
- security findings fixed;
- remaining prototype limitations;
- link/path to `docs/OWNER_NEXT_STEPS.md`.

Do not claim live-payment production readiness unless live Connect, content-platform approval, account configuration, legal review and real payment testing have actually happened.

---

# 46. DECISION PRINCIPLES WHEN SOMETHING IS AMBIGUOUS

When this prompt does not specify a small implementation detail:

1. Protect financial correctness first.
2. Protect authorization/security second.
3. Protect clear creator/buyer UX third.
4. Prefer simple architecture over premature infrastructure.
5. Prefer configuration over hardcoded commercial assumptions.
6. Prefer provider abstractions over Stripe strings leaking everywhere.
7. Prefer auditability for admin/compliance actions.
8. Prefer preserving data/history over destructive shortcuts.
9. Prefer clear `not configured` state over fake success.
10. Never solve a UX issue by lying about money movement.

---

# 47. CORE PRODUCT SENTENCE

Keep this sentence in mind throughout implementation:

> **ZeroFee is a flat-fee creator membership SaaS where the creator controls the economics, ZeroFee takes 0% of creator sales, payment processing remains transparent and real, and the buyer sees the final price upfront.**

Everything in Prompt 1 should make that statement technically and visually credible.

EXECUTE THE ENTIRE SPECIFICATION.
