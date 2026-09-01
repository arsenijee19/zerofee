# ZeroFee — Platform Operating Model & Content Execution Prompt

**Prompt version:** 4.0  
**Status:** AUTHORITATIVE OPERATING-MODEL / CONTENT IMPLEMENTATION SPECIFICATION  
**Repository:** https://github.com/arsenijee19/zerofee  

---

# 0. START EXECUTION NOW

Work directly from the CURRENT `main` branch of:

https://github.com/arsenijee19/zerofee

Read completely before implementation:

1. `prompts/1_INITIAL_PROTOTYPE_MASTER_EXECUTION_PROMPT.md`
2. `prompts/2_DESIGN_SYSTEM_AND_UX_MASTER_PROMPT.md`
3. `prompts/3_REAL_APPLICATION_CONVERSION_MASTER_PROMPT.md`
4. this prompt
5. `docs/PLATFORM_OPERATING_MODEL.md`
6. all payment, tax, Stripe, pricing, security, content and architecture docs.

Do not summarize this prompt instead of executing it.

Do not stop after planning.

Do not ask whether to continue after a phase.

Continue autonomously until every internally solvable requirement below is implemented, tested, documented, committed and pushed.

Prompt 1 remains authoritative for ZeroFee business and financial rules.
Prompt 2 remains authoritative for visual/UX design.
Prompt 3 remains authoritative for converting the prototype into a real application.
Prompt 4 is authoritative for the operating model, merchant relationship, Stripe-account ownership model and V1 content-hosting scope.

If an earlier implementation conflicts with this operating model, update the implementation while preserving the core ZeroFee promise and financial invariants.

---

# 1. PRECISE OPERATING MODEL

ZeroFee must be implemented as a **SaaS and hosting infrastructure provider for independent creator businesses**.

The intended commercial structure is:

```text
FAN / MEMBER
    |
    | buys creator membership/content
    v
CREATOR
    = independent seller / merchant / publisher / service provider
    |
    | Direct Charge through the creator's own Stripe account
    v
CREATOR STRIPE ACCOUNT
    |
    +--> Stripe processing cost
    +--> refunds/disputes on creator commerce
    +--> creator tax obligations where applicable
    +--> creator payouts
    v
CREATOR BANK

CREATOR
    |
    | separate ZeroFee SaaS subscription
    v
ZEROFEE / PLATFORM OPERATING ENTITY
    = SaaS revenue only
```

ZeroFee's intended revenue model remains:

- fixed SaaS subscription paid by creator;
- 0% ZeroFee membership transaction fee;
- 0% payout markup;
- 0% payment-processing markup;
- 0 application fee on creator fan/member payments;
- no hidden spread;
- no capture of creator surplus.

ZeroFee must not economically participate in creator GMV except to the extent unavoidable third-party provider costs are transparently passed through or reflected in pricing calculations.

---

# 2. CORE PRODUCT POSITIONING

The implementation and copy should support the following truth:

> **Your Stripe. Your customers. Your money. Our software.**

and:

> **ZeroFee provides the software. Creator conducts the commerce.**

and:

> **Creators choose what they earn. ZeroFee takes 0% of membership revenue.**

Do not make claims that ZeroFee is legally never responsible for any tax/reporting/consumer-law obligation in every jurisdiction. Those issues remain country-specific and must be handled through the Commerce Responsibility / Country Capability architecture.

The product should nevertheless be technically and operationally designed to maximize the intended creator-as-seller model.

---

# 3. CREATOR OWNS THE STRIPE RELATIONSHIP

The preferred onboarding model is that the creator uses **their own Stripe account**.

Support both cases:

## Existing Stripe account

Creator already has a Stripe account.

ZeroFee should provide a clear path such as:

- `Connect existing Stripe account`

The creator explicitly authorizes their Stripe account to connect to ZeroFee through the supported Stripe Connect flow.

## Creator does not yet have Stripe

ZeroFee should provide a path such as:

- `Set up Stripe`

The user is sent through the official Stripe-hosted / embedded onboarding flow supported by the selected Connect architecture.

Stripe collects KYC/identity/legal/bank information where supported.

ZeroFee must not build its own unnecessary collection/storage of passport, bank-account or sensitive KYC data merely to mimic Stripe.

Do not fabricate a separate creator wallet owned by ZeroFee.

---

# 4. CONNECT ACCOUNT CONFIGURATION GOAL

Use the current Stripe-recommended configuration that most closely achieves the following desired responsibilities, subject to live platform approval and current Stripe capabilities:

- creator has their own Stripe relationship/account;
- full Stripe Dashboard where available;
- direct charges;
- creator is charge owner / merchant for fan commerce;
- Stripe fees are charged to the connected account rather than ZeroFee where supported;
- losses/negative-balance responsibility remains on Stripe/connected-account side where approved/configurable;
- creator controls payouts;
- creator can independently inspect payments, refunds, disputes, balance and payouts in Stripe;
- ZeroFee application fee is always 0;
- ZeroFee's own SaaS billing remains completely separate.

Do not hardcode outdated Standard/Express/Custom assumptions if current Stripe APIs use newer configuration primitives.

Research current official Stripe Connect documentation during implementation and document the exact selected configuration and any externally blocked capability.

---

# 5. DIRECT CHARGES ARE THE DEFAULT COMMERCE TOPOLOGY

The intended payment path is:

```text
Fan
  -> creator membership checkout
  -> direct charge on creator connected Stripe account
  -> creator Stripe balance
  -> creator payout
```

Not:

```text
Fan
  -> ZeroFee/PWRS balance
  -> internal creator wallet
  -> later transfer to creator
```

ZeroFee must not become custodian of creator funds merely for convenience.

The application's internal financial views may aggregate/provider-read creator payment information for UX and reconciliation, but this must not be represented as ZeroFee owing a creator an internal wallet balance unless the provider architecture genuinely requires it.

Use precise labels:

- Creator Earnings
- Provider Pending Balance
- Provider Available Balance
- Next Provider Payout
- ZeroFee Fee: 0

Do not use misleading labels such as `ZeroFee wallet` or `Withdraw from ZeroFee`.

---

# 6. CREATOR IS THE SELLER / PROVIDER IN PRODUCT UX

Where the configured Commerce Responsibility Profile allows creator-as-seller operation, product UX must reinforce the true relationship.

On public creator/member purchase surfaces, clearly identify the creator as the membership/content provider.

Examples of acceptable presentation:

- `Sold by [Creator Name]`
- `Membership provided by [Creator Name]`
- `Creator: [Creator Name]`
- `Payment processed by Stripe`
- `Technology provided by ZeroFee`

Do not make PWRS LLC / ZeroFee appear to be the seller of creator membership unless the applicable country profile explicitly requires platform seller responsibility.

Receipt/invoice architecture must support creator/seller identity and country-specific tax/legal requirements.

Do not hardcode one global seller assumption into receipt generation.

---

# 7. CREATOR CONTROLS THE COMMERCIAL OFFER

ZeroFee provides software tools, but the creator should meaningfully control their offer.

Creator controls at minimum:

- creator profile/business identity;
- membership tier names;
- benefits;
- included content;
- monthly/annual availability;
- Creator Earnings Target or Simple Price mode;
- publication/unpublication;
- permitted refund policy choices;
- content access rules;
- creator support/contact details where required.

For Guaranteed Earnings:

Creator chooses the target.

ZeroFee software computes the lowest safe buyer-facing retail price according to the eligible pricing context.

The creator then sees and approves/publishes the resulting pricing setup.

Do not frame this as ZeroFee arbitrarily setting the creator's selling price.

The implementation should preserve:

`creator target -> ZeroFee pricing engine -> buyer retail -> creator publishes`

---

# 8. REFUNDS, DISPUTES AND PAYOUTS

ZeroFee may provide a convenient UI over Stripe/provider operations, but the economic action should remain creator-side where the provider/account configuration allows it.

## Refunds

Creator may click `Refund` inside ZeroFee.

That action means:

> creator instructs Stripe/provider to refund the creator's customer.

The refund should debit the relevant connected-account commerce according to Stripe/provider behavior.

Admin should not casually refund creator transactions as if ZeroFee owned them.

Any emergency/admin override must be privileged, audited and justified.

## Disputes

Surface provider dispute state to creator.

Where connected account is responsible, creator should be able to manage/verify disputes through Stripe as supported.

## Payouts

Do not present payouts as ZeroFee paying creator money from a ZeroFee wallet.

Use provider terminology such as:

- Stripe balance
- available
- pending
- payout schedule
- instant payout where supported
- manage in Stripe

ZeroFee payout fee remains 0.

---

# 9. ZEROFEE SAAS BILLING IS A COMPLETELY SEPARATE COMMERCE SYSTEM

Creator pays ZeroFee a SaaS subscription.

That transaction is ZeroFee revenue and must be modeled independently from creator fan/member commerce.

Architecture must not mingle:

- creator GMV
- ZeroFee SaaS revenue
- creator provider fees
- ZeroFee tax on SaaS
- creator fan-commerce tax

Keep separate provider references, invoices, accounting categories and admin metrics.

Admin dashboard should clearly distinguish:

- ZeroFee SaaS MRR
- Creator GMV
- active creators
- active memberships
- ZeroFee transaction fee = 0

Do not add creator GMV to ZeroFee revenue.

---

# 10. MARKETPLACE SCOPE — NO DISCOVERY MARKETPLACE IN INITIAL V1

Initial ZeroFee should behave more like creator business infrastructure than an open marketplace.

Do NOT prioritize or add in V1:

- creator marketplace discovery;
- trending creators;
- marketplace ranking;
- platform-curated creator recommendations;
- public seller catalog;
- marketplace bidding;
- creator-to-creator payments.

Creators primarily bring their own audience to their own ZeroFee page.

Example:

`zerofee.com/<creator>`

or later a custom domain.

Search inside authenticated Creator/Admin operations is still required.

This restriction exists to keep V1 product, regulatory and commercial scope simpler.

---

# 11. INITIAL COMMERCE SCOPE

V1 should focus on:

> recurring digital creator memberships and access to creator-provided content/community benefits.

Do not expand V1 commerce into:

- physical goods;
- crowdfunding;
- tipping/donations as a primary feature;
- P2P transfers;
- freelance marketplace work;
- custom paid gigs;
- 1:1 services marketplace;
- complex booking marketplace;
- resale marketplace.

This does not forbid future product expansion.

It defines the initial operating model.

---

# 12. CONTENT HOSTING IS A CORE ZEROFEE FEATURE

ZeroFee should allow creators to host and organize their own membership content.

ZeroFee is the technology/hosting provider.

Creator remains the publisher/content owner/licensor and is responsible for having the rights to the content they publish.

Support a content model capable of representing:

## Posts

- title
- slug
- body
- publish state
- publish date
- public/member/tier-specific visibility
- creator ownership
- attachments
- images
- optional YouTube video reference

## Courses / Collections

Support structured educational/member content such as:

```text
Course
  -> Sections / Modules
      -> Lessons
```

A lesson may contain:

- rich text;
- images;
- YouTube video;
- downloadable files;
- links;
- combination of these.

Support:

- draft;
- published;
- archived;
- ordering;
- tier access;
- public preview where desired;
- progress state where practical for V1.

Do not make the underlying content model dependent on one specific visual presentation.

---

# 13. TEXT CONTENT

Text lessons/posts should be stored by ZeroFee in the application's database/content system.

Use a safe structured/rich-text approach appropriate to the codebase.

Requirements:

- server-authoritative creator ownership;
- sanitized rendering;
- protection against stored XSS;
- reasonable formatting support;
- headings;
- lists;
- links;
- quotes/code blocks where appropriate;
- drafts;
- autosave or explicit save UX as appropriate;
- publish/unpublish;
- content revision timestamp.

Do not allow arbitrary executable HTML.

---

# 14. IMAGE HOSTING

ZeroFee may host creator-uploaded images.

Use the real `MediaStorageProvider` abstraction required by Prompt 3.

V1 may use a local deterministic adapter for tests and a production-ready S3/R2-compatible adapter boundary.

Requirements:

- authenticated creator upload;
- creator ownership metadata;
- validated MIME/type;
- size limits;
- safe filenames/generated keys;
- no path traversal;
- image display via safe URLs;
- deletion/archive behavior;
- entitlement-aware use where applicable;
- admin moderation capability;
- storage quota accounting.

Do not accept arbitrary uploaded executable content disguised as an image.

---

# 15. FILE / DOWNLOAD HOSTING

Creators may attach permitted files such as PDFs/downloadable resources.

Implement:

- allowed MIME/type configuration;
- size limits;
- creator ownership;
- storage quota accounting;
- server-authoritative access check;
- signed/short-lived URLs where production storage adapter supports them;
- no direct predictable public object path for paid-only resources;
- audit/moderation metadata.

Do not claim perfect DRM.

The goal is access control, not impossible anti-copy guarantees.

---

# 16. VIDEO V1 — YOUTUBE ONLY

This is a deliberate V1 scope decision.

ZeroFee MUST NOT implement native creator video upload/hosting/transcoding/streaming in the initial version.

Do not build:

- ZeroFee video upload pipeline;
- native video transcoding;
- HLS packaging;
- video CDN;
- video encoding workers;
- native video storage;
- custom DRM;
- Cloudflare Stream/Mux integration in V1 unless later explicitly requested.

Instead:

> **All creator video content in initial V1 is provided through YouTube.**

The creator supplies a supported YouTube URL/video ID.

ZeroFee stores a normalized YouTube video reference and renders the official supported YouTube embed/player.

This materially reduces ZeroFee's video-storage, encoding, bandwidth and video-moderation burden for V1.

---

# 17. YOUTUBE VIDEO INPUT RULES

Do not allow creators to paste arbitrary iframe HTML.

Accept supported YouTube URL formats and normalize them server-side.

Examples may include current supported forms such as:

- `youtube.com/watch?v=...`
- `youtu.be/...`
- official Shorts/watch URL forms where embeddable.

Extract/store only the validated video ID plus safe metadata needed by the app.

Reject:

- arbitrary iframe code;
- javascript URLs;
- non-YouTube hosts;
- malformed IDs;
- HTML injection attempts.

Build a reusable YouTube parser/validator with tests.

---

# 18. YOUTUBE EMBED BEHAVIOR

Use the official YouTube embed mechanism.

Where appropriate and supported, prefer privacy-enhanced embed behavior/domain.

Respect YouTube behavior and restrictions.

Do not attempt to bypass:

- embedding disabled by uploader;
- age restrictions;
- removed/private videos;
- geographic restrictions;
- YouTube authentication requirements;
- copyright blocks;
- YouTube player restrictions.

If YouTube refuses playback, display a clear content-unavailable state.

Do not proxy or restream the video to evade YouTube restrictions.

---

# 19. YOUTUBE TERMS / MODERATION BOUNDARY

YouTube hosts the actual video and applies its own platform rules, copyright systems, Community Guidelines and video availability decisions to content hosted on YouTube.

This reduces ZeroFee's burden for the underlying video-hosting layer.

However, DO NOT make the false claim that YouTube eliminates every ZeroFee moderation/legal obligation.

ZeroFee still controls:

- whether a creator/account may use ZeroFee;
- whether a lesson/post containing the video reference remains published on ZeroFee;
- ZeroFee text/image/file content surrounding the video;
- reports made to ZeroFee;
- creator access to ZeroFee services;
- enforcement of ZeroFee Acceptable Use Policy.

If a reported ZeroFee lesson embeds prohibited or unlawful content, admins must be able to remove/unpublish the lesson or suspend the creator even if YouTube has not yet removed the underlying video.

Do not imply YouTube has approved the creator merely because a video is currently available on YouTube.

---

# 20. YOUTUBE IS NOT DRM

Paid-content UX must be honest.

ZeroFee can protect access to the **ZeroFee lesson/page** using real membership entitlement checks.

However, a YouTube embed/video ID cannot be treated as perfect DRM.

If a creator uses an unlisted/public YouTube video and a member discovers/shares its direct link, ZeroFee cannot guarantee the video itself is inaccessible outside ZeroFee.

Therefore:

- protect the lesson/page;
- do not expose unnecessary video metadata before entitlement;
- render video only after entitlement;
- do not claim `video cannot be shared/copied`;
- clearly document the YouTube limitation to creators.

This is an accepted V1 tradeoff.

---

# 21. REAL CONTENT ENTITLEMENT

Content access must be server authoritative.

For every member-only/tier-only post, lesson, file or course:

server must determine:

- authenticated member;
- active membership state;
- creator relationship;
- permitted tier(s);
- content publication state;
- grace/revoked/refunded/cancelled membership rules.

Do not simply hide locked content in React and leave the content/body/API accessible.

Test direct URL access.

Test file/download URL access.

Test cross-creator membership misuse.

Test cancelled/refunded/revoked membership behavior.

---

# 22. CREATOR CONTENT OWNERSHIP / RIGHTS

Creator onboarding/terms architecture should capture or require acknowledgement that creator:

- owns or has sufficient rights to publish/use the content;
- is responsible for creator-provided claims/materials;
- may not upload prohibited content;
- may not infringe copyright/trademark/privacy rights;
- must comply with YouTube terms for YouTube-hosted videos;
- remains responsible for their creator business and member offering.

Do not phrase this as ZeroFee disclaiming every possible legal responsibility.

Implement the product states and policy hooks needed for legal counsel to finalize Terms/AUP wording later.

---

# 23. REPORTING / MODERATION / TAKEDOWN

Because ZeroFee hosts creator-supplied text/images/files and embeds third-party video, V1 must include a basic real moderation/reporting system.

At minimum:

- `Report content` action where appropriate;
- report reason;
- reporter/contact details as appropriate;
- target creator/content reference;
- admin moderation queue;
- status lifecycle;
- internal notes;
- unpublish content;
- suspend creator;
- restore content/account where appropriate;
- audit log;
- copyright/takedown category;
- illegal/prohibited content category;
- appeal/review state architecture.

Do not create fake moderation UI without persisted reports/actions.

No need to build a massive social-network moderation platform for V1.

Keep it operational and real.

---

# 24. CHECKOUT UX

Checkout must preserve the creator-as-seller model where the configured commerce profile permits it.

Before payment authorization, buyer should see:

- creator/seller identity;
- tier/membership name;
- billing interval;
- final price;
- taxes where applicable/known;
- recurring nature;
- cancellation terms or link;
- ZeroFee fee if surfaced = 0;
- payment processor identity/context where appropriate.

Avoid UI that makes the member believe they are purchasing a generic ZeroFee subscription when they are actually buying creator membership.

ZeroFee SaaS subscription screens must be completely separate and creator-facing.

---

# 25. CREATOR STRIPE CONTROL / VERIFY IN STRIPE

Where supported by the selected Stripe account configuration, creators should be able to independently verify their financial state.

Provide suitable links/components for:

- Stripe Dashboard;
- payment verification;
- balances;
- payouts;
- disputes;
- refunds;
- account/KYC requirements;
- tax settings where creator is responsible.

ZeroFee UI can be the primary convenience layer.

But do not intentionally trap creator financial information inside ZeroFee when Stripe can expose the authoritative provider record.

Financial Verification should clearly distinguish ZeroFee-calculated/modelled data from Stripe/provider-authoritative data.

---

# 26. TAX / COMMERCE RESPONSIBILITY PROFILE

The desired operating model is creator-as-seller, but do not hardcode a universal legal conclusion.

Maintain the Prompt 1 `CommerceResponsibilityProfile` / country capability concept.

For each supported country/jurisdiction, architecture should be able to represent:

- seller party: CREATOR / PLATFORM / UNKNOWN;
- tax-liable party: CREATOR / PLATFORM / UNKNOWN;
- invoice/receipt responsibility;
- tax provider configuration;
- legal review status;
- country launch state.

Where legal/tax review has not confirmed the intended creator-responsible model, mark appropriately and block unsafe production enablement rather than silently guessing.

This is an external legal/tax dependency, not a reason to leave the software architecture incomplete.

---

# 27. PRODUCT COPY RULES

Prefer product language consistent with the actual model:

- `Your Stripe. Your customers. Your money.`
- `Technology provided by ZeroFee.`
- `ZeroFee takes 0% of your membership revenue.`
- `Your payment processing stays with Stripe.`
- `Set what you earn.`
- `Verify your payments in Stripe.`

Avoid unsupported absolute legal claims such as:

- `ZeroFee is never responsible for tax anywhere.`
- `YouTube makes ZeroFee legally immune from video content.`
- `All creator tax is always solely the creator's responsibility worldwide.`

The product goal is to structure the system so creator responsibility is maximized where law permits, not to fake legal certainty.

---

# 28. REQUIRED IMPLEMENTATION CHANGES

After Prompt 3 establishes real persistence/auth/server architecture, implement/reconcile at minimum:

## Payments / creator account

- existing-Stripe / new-Stripe onboarding UX;
- persisted connected-account relationship;
- Stripe account status sync;
- provider responsibility/status display;
- direct-charge implementation boundary;
- application fee hard invariant = 0;
- creator-owned refund flow;
- provider balance/payout presentation;
- Verify in Stripe.

## Content

- Post model;
- Course/Collection model;
- Module/Section model;
- Lesson model;
- tier entitlement mapping;
- rich text;
- image asset references;
- file/download references;
- YouTube video reference;
- draft/publish/archive;
- ordering;
- public/member/tier access.

## Moderation

- real report model;
- admin moderation workflow;
- unpublish/suspend actions;
- audit trail.

## UX

- creator content editor;
- course builder;
- lesson editor;
- YouTube URL field + preview;
- public/locked/unlocked member views;
- clear Stripe ownership/payment setup screens.

---

# 29. REQUIRED TESTS

Add tests against the REAL application/service boundary.

At minimum:

## Stripe / commerce invariants

- ZeroFee application fee cannot become non-zero;
- creator payment is bound to correct connected account;
- one creator cannot use another creator's connected account;
- refund belongs to correct creator/payment;
- buyer checkout identifies correct creator/tier;
- SaaS billing remains separate from creator payment records.

## Content authorization

- public content accessible;
- member content blocked without membership;
- correct tier unlocks content;
- wrong tier remains locked;
- cancelled/revoked membership loses access according to policy;
- one creator's membership does not unlock another creator's content;
- direct route/API access cannot bypass entitlement.

## YouTube

- valid YouTube URL normalizes correctly;
- supported URL variants normalize to same video ID;
- non-YouTube URL rejected;
- malformed ID rejected;
- arbitrary iframe/HTML rejected;
- XSS payload rejected;
- only entitled member page renders paid YouTube embed;
- disabled/unavailable video produces safe fallback state where testable.

## Files/images

- MIME validation;
- unauthorized download denied;
- cross-creator asset access denied;
- signed access behavior where applicable;
- storage quota enforcement.

## Moderation

- report persists;
- creator cannot dismiss admin-only report action;
- admin can unpublish flagged content;
- audit event created.

---

# 30. REQUIRED E2E JOURNEYS

Create/extend real E2E flows covering:

### Creator Stripe setup

creator signup
→ creator approval
→ payments setup
→ existing/new Stripe path in deterministic test mode
→ connected account state persisted
→ creator financial settings page.

### Creator course

creator login
→ create course
→ create module
→ create text lesson
→ add image/file
→ add YouTube URL
→ preview
→ restrict to tier
→ publish.

### Member entitlement

member without subscription
→ opens creator course
→ sees locked state
→ subscribes through test payment
→ provider-authoritative activation
→ returns to course
→ text/image/file/YouTube lesson accessible.

### Cancellation/refund

active member
→ creator refunds/cancels according to supported flow
→ provider/domain state updates
→ entitlement changes correctly.

### Moderation

member reports content
→ admin sees real persisted report
→ admin unpublishes content
→ content becomes unavailable
→ audit event exists.

These must exercise real DB-backed state transitions, not merely switch seeded UI views.

---

# 31. DOCUMENTATION UPDATES

Update relevant docs to match the implemented operating model.

At minimum update/maintain:

- `docs/PLATFORM_OPERATING_MODEL.md`
- `docs/ARCHITECTURE.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/PAYOUTS_AND_BALANCES.md`
- `docs/STRIPE_APPROVAL_READINESS.md`
- `docs/MERCHANT_AND_TAX_RESPONSIBILITY.md`
- `docs/TAX_ARCHITECTURE.md`
- `docs/SECURITY.md`
- `docs/PROTOTYPE_LIMITATIONS.md`
- `docs/OWNER_NEXT_STEPS.md`
- `docs/EXECUTION_STATE.md`

Add a dedicated content document if useful, e.g.:

- `docs/CONTENT_ARCHITECTURE.md`

Document explicitly:

- creator is intended merchant/seller where legally supported;
- creator uses own connected Stripe account;
- direct charges;
- ZeroFee SaaS billing separate;
- ZeroFee transaction fee 0;
- YouTube-only video in V1;
- YouTube is hosting/provider for the underlying video;
- ZeroFee still retains AUP/report/takedown responsibilities for its own platform;
- YouTube embed is not DRM;
- native video upload/transcoding is out of V1 scope.

---

# 32. EXTERNAL BLOCKERS MUST BE HONEST

It is acceptable for final production activation to remain blocked by:

- Stripe content/platform approval;
- current Connect configuration approval;
- live Stripe credentials;
- country-specific legal/tax review;
- production storage credentials;
- production email credentials;
- final Terms/AUP/privacy documents.

It is NOT acceptable to use those blockers to avoid implementing:

- provider interfaces;
- Stripe test adapter;
- real connected-account model;
- direct-charge architecture;
- real content persistence;
- YouTube validation/embed;
- entitlement;
- report/moderation system;
- real E2E/security tests.

Implement everything internally possible first.

---

# 33. DEFINITION OF DONE

This prompt is complete only when:

### OPERATING MODEL

The application clearly implements ZeroFee as SaaS infrastructure rather than an internal creator-wallet marketplace.

### CREATOR STRIPE

Creator can connect/use their own Stripe relationship through the supported Connect architecture/test boundary.

### DIRECT CHARGES

Fan commerce is modeled and implemented against creator connected-account context.

### ZERO FEE

ZeroFee application/platform transaction fee is hard-invariant 0.

### SAAS SEPARATION

ZeroFee SaaS billing is operationally/data-model separate from creator GMV.

### CONTENT

Creators can create real DB-backed posts/courses/lessons with text, images/files and YouTube video references.

### VIDEO

V1 contains no native ZeroFee video pipeline; YouTube-only behavior is correctly implemented and documented.

### ENTITLEMENT

Paid content is protected server-side.

### MODERATION

Reports and admin takedown/unpublish actions are real and persisted.

### TESTS

Real service/API/E2E tests prove the above rather than testing fake local helpers.

### DOCUMENTATION

Operating model and limitations are explicit.

### REPOSITORY

All work is committed and pushed, working tree clean.

---

# 34. FINAL EXECUTION RULE

Do not stop after documenting the operating model.

Do not merely add mock screens.

Do not rebuild the design for no reason.

Do not implement native video hosting in V1.

Do not route creator fan revenue through a ZeroFee wallet.

Do not introduce a percentage transaction fee.

Do not capture creator surplus.

Do not pretend YouTube removes all ZeroFee platform obligations.

Do not wait for owner confirmation between phases.

Execute the operating model through the real application architecture created by Prompt 3.

When something is internally solvable, solve it before final reporting.

Only after implementation, tests, E2E, documentation, commit and push are complete, provide the final completion report with exact SHA, test counts, remaining external blockers and any genuine limitations.
