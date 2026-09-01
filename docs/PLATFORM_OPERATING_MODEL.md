# ZeroFee — Platform Operating Model

**Status:** AUTHORITATIVE PRODUCT / COMMERCE / CONTENT OPERATING DECISION  
**Effective date:** 2026-09-01  
**Repository:** https://github.com/arsenijee19/zerofee

---

# 1. Purpose

This document defines the intended operating model for ZeroFee and should be treated as a product, payment, commerce-responsibility and content-hosting north star for implementation decisions.

ZeroFee should be designed to minimize the extent to which the platform economically or operationally steps into the creator's underlying commerce.

The desired model is:

> **ZeroFee provides SaaS, membership infrastructure and creator-content hosting tools. The creator independently operates the creator business and sells the membership/content to the member. ZeroFee earns only a separate SaaS subscription from the creator.**

This is an architectural and product intent, not a claim that contract wording can override applicable law. Country-specific marketplace, tax, reporting, consumer-protection or hosting obligations must still be tracked separately.

---

# 2. Commercial north star

The clean economic separation is:

```text
MEMBER / FAN
    |
    | buys membership/content from creator
    v
CREATOR
    |
    | creator-owned Stripe payment
    v
CREATOR STRIPE ACCOUNT
    |
    +-- Stripe/provider processing fees
    +-- creator refunds/disputes
    +-- creator balance
    +-- creator payout
    v
CREATOR BANK


CREATOR
    |
    | separate ZeroFee SaaS subscription
    v
ZEROFEE / PLATFORM OPERATING ENTITY
```

ZeroFee must not intentionally turn creator membership GMV into ZeroFee transaction revenue.

Core invariant:

```text
ZeroFee revenue = ZeroFee SaaS subscription revenue
ZeroFee membership transaction fee = 0
ZeroFee payout markup = 0
Creator membership GMV != ZeroFee revenue
```

---

# 3. Creator is intended to be the seller / merchant

Where applicable law permits the structure, the creator should be the seller, supplier and merchant for the creator's own membership and creator content.

The creator should control the substantive commercial offer, including:

- creator identity and public business/profile information;
- membership tiers;
- membership benefits;
- creator content;
- target earnings / approved customer retail price;
- publication of the offer;
- member relationship;
- creator-side customer support for the creator's offering;
- creator refund decisions within applicable law and platform minimum rules;
- creator tax registrations/settings where creator-side tax responsibility applies.

ZeroFee should be presented as technology infrastructure rather than the seller of the creator's membership.

Preferred member-facing concepts include:

- `Sold by: <Creator>`
- `Membership provided by: <Creator>`
- `Payment processed by Stripe`
- `Technology provided by ZeroFee`

Do not describe PWRS LLC / ZeroFee as the seller of creator memberships unless a specific jurisdiction or legal structure requires that result.

---

# 4. Creator should use their own Stripe account

The preferred ZeroFee payment model is creator-owned Stripe commerce connected to ZeroFee through Stripe Connect.

A creator may already have an ordinary Stripe account before using ZeroFee. ZeroFee should support the creator connecting an existing eligible Stripe account where Stripe's current Connect architecture permits it.

A creator who does not yet have Stripe should be able to proceed through Stripe-hosted / Stripe-managed onboarding and establish the required Stripe relationship through that flow.

Important distinction:

- a creator can independently have a Stripe account without ZeroFee;
- a `connected account` is the relationship between that Stripe account/account configuration and the ZeroFee Connect platform;
- ZeroFee should make that connection easy, but should not pretend that ZeroFee owns the creator's underlying merchant identity.

Preferred product language:

> **Your Stripe. Your customers. Your money. Our software.**

---

# 5. Preferred Stripe configuration

Subject to current Stripe APIs, country availability and Stripe approval/configuration, prefer the architecture that maximizes creator ownership and minimizes platform financial intermediation.

Desired characteristics:

- creator has a Stripe account / connected-account configuration appropriate for direct merchant activity;
- creator has Stripe Dashboard access where supported;
- Stripe performs KYC/onboarding directly with the creator through Stripe-hosted/embedded flows;
- membership payments use **Direct Charges** on the creator connected account;
- ZeroFee application/platform fee on membership transactions is **0**;
- Stripe/provider processing fees are creator-side where the chosen configuration supports this;
- connected-account losses/disputes should remain creator/Stripe-side where Stripe configuration permits it;
- creator balance belongs to the creator's provider account;
- payouts move funds already belonging to the creator;
- ZeroFee does not maintain a creator stored-value wallet.

Do not use this flow as a categorical legal conclusion. Maintain provider capability flags and legal/tax country profiles as required elsewhere in the repository.

---

# 6. ZeroFee must not receive fan money first

Avoid platform custody/intermediation where not required.

Do not design the normal membership flow as:

```text
Fan -> ZeroFee/PWRS -> creator
```

The intended flow is:

```text
Fan -> creator's Stripe connected account -> creator balance -> creator payout
```

ZeroFee may receive provider data necessary to render creator dashboards, perform reconciliation, enforce memberships and provide SaaS automation, but should not treat creator GMV as ZeroFee's ordinary revenue.

---

# 7. ZeroFee monetization

ZeroFee monetization is deliberately simple:

```text
Creator -> ZeroFee -> fixed SaaS subscription
```

Potential plans can scale based on software value and resource usage such as:

- member limits;
- storage limits;
- email limits;
- API quotas;
- team seats;
- advanced analytics;
- integrations;
- automation;
- support level.

Do not monetize creator GMV through:

- application fees;
- transaction percentages;
- payout markups;
- provider-fee markups;
- hidden FX spread;
- retained Guaranteed Earnings surplus.

---

# 8. Guaranteed Earnings remains a creator-controlled pricing tool

Guaranteed Earnings remains a core ZeroFee product feature.

The creator chooses the economic goal:

```text
Creator Earnings Target = 10.00 EUR
```

ZeroFee software calculates the minimum eligible customer retail price for the resolved payment context.

The intended product/legal framing is:

1. creator chooses target earnings;
2. ZeroFee software calculates the required retail price;
3. creator sees the calculation;
4. creator approves/publishes the tier/price;
5. member buys from the creator;
6. Stripe charges on the creator's payment account;
7. ZeroFee reconciles provider-authoritative data.

Therefore, ZeroFee should not unnecessarily frame itself as independently setting the creator's commercial price.

Public positioning may emphasize:

> **Set what you earn.**

The stricter `Guaranteed Earnings` wording remains subject to final legal review before public live guarantee activation.

All existing financial invariants remain unchanged:

- ZeroFee transaction fee = 0;
- actual creator proceeds above target belong entirely to the creator;
- actual creator proceeds below target are a Guarantee Breach;
- unknown/unbounded fee routes cannot offer Guaranteed Earnings.

---

# 9. Refunds, disputes and payouts

The product should reinforce creator ownership of commerce.

## Refunds

ZeroFee may provide a convenient refund UI, but the semantic action should be:

> the creator instructs the payment provider to refund the creator's customer.

Refunds should hit the creator/provider payment relationship, not a ZeroFee wallet.

## Disputes

Where the Stripe configuration permits creator-side dispute ownership, disputes should be creator/provider-side and surfaced in ZeroFee as operational data.

ZeroFee can provide alerts, status, evidence guidance and shortcuts without pretending the transaction was ZeroFee revenue.

## Payouts

The preferred UX language is closer to:

- `Stripe balance`
- `Available for payout`
- `Manage payout`
- `Payout status`

rather than:

- `ZeroFee owes you`
- `Withdraw from ZeroFee wallet`

Payout does not create creator earnings; it moves funds already credited to the creator/provider balance.

---

# 10. Tax responsibility model

The desired commercial model is creator-side tax responsibility for creator-to-member commerce where applicable law permits that structure.

ZeroFee's own tax concern is its separate SaaS subscription sold to the creator.

However, software architecture must not globally hard-code:

```text
creator always tax liable everywhere
```

Maintain a jurisdiction/country responsibility profile capable of representing:

- `CREATOR_LIABLE_CONFIRMED`
- `PLATFORM_LIABLE_CONFIRMED`
- `SPECIAL_TREATMENT`
- `LEGAL_REVIEW_REQUIRED`
- `UNSUPPORTED`

Track separately:

- seller/supplier responsibility;
- VAT/GST/sales-tax responsibility;
- marketplace facilitator/deemed-supplier concerns;
- reporting obligations;
- invoice/receipt responsibility;
- consumer-law requirements.

Payment topology alone must not be used as proof of tax/legal characterization.

---

# 11. Avoid becoming a discovery marketplace in initial V1

To keep the operating model closer to creator SaaS infrastructure and farther from a generalized marketplace, initial ZeroFee should not depend on marketplace discovery.

Do not make these core V1 mechanics:

- marketplace-wide `Discover creators`;
- `Trending creators` marketplace ranking;
- general seller marketplace recommendations;
- paid placement in marketplace search;
- broad consumer marketplace browsing as the primary acquisition channel.

Preferred acquisition model:

```text
creator brings own audience
        -> zerofee.com/<creator>
        -> creator offer
        -> creator membership
```

ZeroFee can still provide public creator pages, SEO, share links and creator growth tools.

This product decision is intended to strengthen the SaaS-platform characterization and reduce unnecessary marketplace complexity. It is not a substitute for jurisdiction-specific legal analysis.

---

# 12. Initial commerce scope

Initial V1 should focus narrowly on digital creator memberships and access.

Preferred supported scope:

- recurring creator membership;
- text lessons;
- posts/articles;
- images;
- downloadable creator files where permitted;
- YouTube-hosted video embedded in ZeroFee lessons/posts;
- comments/community features;
- Discord/Telegram integrations;
- newsletters/broadcasts;
- creator API/webhooks.

Avoid expanding initial V1 into unrelated regulated or high-complexity commerce such as:

- physical goods marketplace;
- crowdfunding;
- peer-to-peer payments;
- generalized donations/tipping product;
- marketplace freelance services;
- creator booking marketplace;
- on-demand personal-service marketplace.

Future expansion requires separate product/legal/tax review.

---

# 13. ZeroFee content-hosting role

ZeroFee should remain useful as a real creator-membership product, not merely a payment-link wrapper.

ZeroFee may host creator-managed content such as:

- text lessons;
- articles/posts;
- images;
- PDFs;
- downloads/files where supported;
- comments;
- lesson/module structure;
- membership entitlement metadata.

Creator remains responsible for having the necessary rights to publish and sell access to creator content.

ZeroFee provides:

- editor;
- storage for supported non-video assets;
- access control;
- membership entitlement enforcement;
- content organization;
- analytics;
- creator/member UI;
- reporting/moderation tools.

Preferred conceptual roles:

> Creator = publisher/content provider/seller  
> ZeroFee = SaaS + hosting + membership infrastructure

This does not remove ZeroFee's own hosting/intermediary obligations under applicable law.

---

# 14. V1 video decision — YouTube only

**Initial ZeroFee V1 MUST NOT implement native video upload, native video transcoding, native video streaming or ZeroFee-hosted video files.**

For V1, creator video content is supported only through **YouTube-hosted videos rendered through the official YouTube embedded player**.

Creator workflow:

```text
Creator uploads/manages video on YouTube
        ->
Creator pastes supported YouTube URL into ZeroFee
        ->
ZeroFee validates/parses the URL
        ->
ZeroFee stores only the YouTube video reference / safe metadata
        ->
ZeroFee checks member entitlement to the lesson/page
        ->
ZeroFee renders the official YouTube embedded player
```

ZeroFee must not:

- download the YouTube video;
- copy/rehost the video file;
- strip YouTube branding/player requirements;
- bypass embedding restrictions;
- bypass age restrictions;
- circumvent YouTube security or access controls;
- impersonate a native ZeroFee video CDN;
- promise DRM that the YouTube embed model does not provide.

Official YouTube embed/player terms and developer policies apply to the embedded player.

---

# 15. Why YouTube-only video is preferred for initial V1

Using YouTube as the video host reduces ZeroFee's initial technical and moderation surface for video files.

YouTube, rather than ZeroFee, performs the underlying video hosting and applies YouTube's own Terms, Community Guidelines, copyright systems and platform enforcement to videos hosted on YouTube.

This means ZeroFee does not initially need to build:

- video ingestion infrastructure;
- transcoding pipeline;
- HLS/DASH packaging;
- video CDN;
- video malware processing pipeline;
- video codec/device compatibility layer;
- video copyright matching system;
- native video moderation pipeline.

However, the correct statement is **not**:

> `YouTube checks the terms so ZeroFee has zero responsibility.`

The correct model is:

> **YouTube is responsible for hosting and enforcing YouTube's own rules on YouTube-hosted video. ZeroFee still enforces ZeroFee's own platform rules and any legal obligations applicable to the ZeroFee page/account/content relationship.**

For example, ZeroFee must still be able to remove a lesson/embed/account from ZeroFee even if the underlying YouTube video remains available on YouTube.

---

# 16. YouTube embed implementation rules

V1 implementation should use the official embeddable YouTube player.

Support normalized YouTube URL forms as appropriate, for example:

- `youtube.com/watch?v=...`
- `youtu.be/...`
- supported Shorts/video URLs where they resolve to an embeddable video.

Store a normalized YouTube video identifier/reference rather than unsafe arbitrary iframe HTML supplied by the creator.

Never allow creators to paste arbitrary iframe HTML into the page renderer.

Where useful and permitted, use YouTube metadata/API checks to determine whether a video is embeddable. If a video cannot be embedded, fail gracefully and ask the creator to provide an embeddable video.

YouTube can disable embedding and some videos may be unavailable in third-party embeds because of age restrictions, platform policy or third-party claims. ZeroFee must handle that state honestly.

Prefer YouTube Privacy-Enhanced Mode (`youtube-nocookie.com`) where it is appropriate and compatible with product/privacy requirements.

Do not suppress required HTTP Referer behavior or otherwise interfere with YouTube player requirements.

If YouTube API credentials are not necessary for V1, prefer the lowest-privilege implementation. Do not request creator YouTube OAuth scopes merely to render an embed.

---

# 17. Paid membership video security limitation

A YouTube embed behind a ZeroFee entitlement gate is **not hard DRM**.

ZeroFee can enforce:

```text
member must have entitlement -> ZeroFee lesson page renders embed
```

but should not promise that an entitled member can never discover/share the underlying YouTube video reference.

If a creator chooses an unlisted YouTube video, access protection remains subject to YouTube's behavior. Anyone who obtains a usable link/reference may potentially access or share it outside ZeroFee.

Therefore:

- clearly document the limitation to creators;
- do not market YouTube-based V1 video as piracy-proof/DRM-secure;
- later native/private video hosting can be evaluated using a dedicated streaming provider if stronger access control becomes a product requirement.

This limitation is acceptable for V1 and is intentionally preferred over building a large native video infrastructure prematurely.

---

# 18. Text, images and files

Unlike V1 video, text lessons and supported image/file assets may be hosted by ZeroFee.

## Text

Store structured/sanitized creator content in the ZeroFee application/database.

Requirements:

- safe rich-text rendering;
- XSS protection;
- version/edit metadata where useful;
- creator ownership checks;
- entitlement enforcement for paid content.

## Images/files

Use an object-storage abstraction suitable for production, such as S3/R2-compatible storage.

Requirements:

- server-authorized uploads;
- file-size/type restrictions;
- MIME/content validation;
- randomized object keys;
- no executable content rendering;
- access policy/signed URLs where needed;
- creator ownership metadata;
- entitlement-aware access for private assets;
- deletion/takedown support.

Do not conflate non-video asset hosting with the YouTube-only video decision.

---

# 19. Content responsibility and moderation

Because ZeroFee hosts text/images/files and displays creator-controlled pages and YouTube embeds, ZeroFee still needs a platform safety/compliance layer.

Maintain at least:

- Terms of Service;
- Creator Agreement;
- Acceptable Use Policy;
- prohibited-content rules;
- report-content flow;
- copyright/takedown workflow;
- illegal-content reporting where required;
- account/content suspension;
- moderation audit trail;
- appeal/review path where appropriate;
- repeat-infringer policy;
- urgent prohibited-content escalation procedures.

The platform should be able to disable the ZeroFee page/content reference independently from whatever action YouTube takes on the underlying video.

Adult/high-risk content remains subject to Stripe/processor and ZeroFee policies defined elsewhere.

---

# 20. Product UX consequences

Creator content editor should support content blocks such as:

- Heading
- Rich text
- Image
- Gallery where supported
- YouTube video
- Download/file
- Callout
- Divider
- Membership CTA where relevant

Do not show a generic `Upload video` control in V1.

Instead use wording such as:

> **Add YouTube video**

Creator provides the YouTube URL.

The preview should use the real YouTube embed behavior rather than a fake local video card.

Member entitlement is checked before rendering paid lesson/post content.

---

# 21. Creator-facing disclosure for YouTube video

The creator UI should communicate the essential behavior without excessive legal text.

Suggested product-level explanation:

> Videos are hosted and streamed by YouTube. Add a YouTube link to include a video in your lesson. The video must allow embedding and remains subject to YouTube's availability and policies.

For paid content, also communicate:

> ZeroFee restricts access to the lesson, but YouTube embeds are not DRM. Do not use this option for content that requires strong anti-sharing protection.

Do not claim ZeroFee reviews or guarantees YouTube copyright/license rights.

Creator remains responsible for having rights to use the content in the creator's paid offering.

---

# 22. Search/discovery and content model

ZeroFee should allow creators to create high-quality branded public/member pages while keeping the first version creator-led rather than marketplace-led.

A creator can share:

- public creator profile;
- membership tiers;
- public posts;
- free previews;
- member-only lessons/posts;
- direct links to campaigns/tiers.

Do not require marketplace discovery for the business to function.

---

# 23. Application architecture consequences

Implementation must reflect the commercial model rather than only documenting it.

Required domain boundaries include:

```text
Platform SaaS Billing
    !=
Creator Membership Payments
```

and:

```text
Creator Stripe Connected Account
    !=
ZeroFee Platform Stripe Account
```

and:

```text
Creator provider balance
    !=
ZeroFee wallet
```

and:

```text
YouTube video reference
    !=
ZeroFee-hosted media asset
```

Recommended separate abstractions:

- `CreatorPaymentsProvider`
- `PlatformBillingProvider`
- `TaxProvider`
- `MediaStorageProvider` for supported non-video assets
- `ExternalVideoProvider` / YouTube embed resolver for V1 video
- `EntitlementService`
- `CommerceResponsibilityProfile`

Do not route YouTube video files through `MediaStorageProvider` in V1.

---

# 24. Hard product invariants

The following should be treated as non-negotiable unless the owner explicitly changes the strategy:

1. ZeroFee is primarily a SaaS/hosting infrastructure provider for independent creator businesses.
2. Creator is intended to be the seller/provider to the member where applicable law permits.
3. Creator membership payments should use creator-owned connected payment infrastructure.
4. ZeroFee membership transaction fee remains 0.
5. ZeroFee payout markup remains 0.
6. ZeroFee does not intentionally capture creator surplus.
7. ZeroFee earns a separate SaaS subscription.
8. Creator GMV and ZeroFee SaaS revenue must remain separately represented in code, reporting and UI.
9. Initial V1 is creator-led, not dependent on a consumer discovery marketplace.
10. Initial V1 focuses on digital membership/access rather than broad marketplace commerce.
11. ZeroFee may host text/images/files and membership pages.
12. Initial V1 video is **YouTube embed only**.
13. ZeroFee does not upload/rehost/transcode YouTube videos.
14. YouTube's rules apply to the hosted YouTube video, but ZeroFee still maintains its own AUP/moderation/takedown capability.
15. A YouTube embed behind a membership gate must not be marketed as hard DRM.
16. Country-specific legal/tax responsibility remains configurable rather than globally assumed.

---

# 25. Launch posture

The initial launch posture should aim for the simplest defensible product:

```text
ZeroFee = B2B SaaS + creator hosting/membership infrastructure
Creator = independent merchant/publisher
Stripe = creator payment processor via connected account
YouTube = V1 video host/player
ZeroFee = text/image/file hosting + membership access + software
```

This gives ZeroFee a strong product while keeping these concerns out of the first launch scope:

- native video streaming infrastructure;
- native video transcoding;
- native video copyright matching;
- platform-held creator funds;
- creator wallet custody;
- transaction-margin monetization;
- broad general-purpose marketplace commerce.

---

# 26. External verification still required

Before production launch, obtain targeted external verification for:

- Stripe Connect platform approval/configuration;
- creator-account/direct-charge configuration;
- connected-account fee/loss responsibilities;
- launch-country commerce responsibility;
- VAT/GST/sales-tax allocation;
- US marketplace facilitator exposure where relevant;
- EU deemed-supplier/intermediary analysis where relevant;
- creator/member contractual wording;
- ZeroFee SaaS tax obligations;
- platform reporting obligations;
- YouTube embedded-player/API policy compliance if implementation uses YouTube APIs beyond standard embedding.

These are launch validations, not reasons to convert the product into a platform-held-money marketplace by default.

---

# 27. Official implementation references

Implementation should re-check current official documentation at execution time.

Primary references include:

- Stripe Connect / Direct Charges documentation
- Stripe connected-account configuration / dashboard documentation
- Stripe Connect Account Agreement
- YouTube Help: Embed videos and playlists
- YouTube API Terms of Service / Developer Policies
- YouTube Data API video `embeddable` behavior

As of this document date, YouTube officially permits showing videos through its embeddable player subject to its Terms/API policies, and videos may become non-embeddable or fail playback due to uploader settings, age restrictions, YouTube policy or third-party claims.

---

# 28. Final north star

The implementation should make this statement economically and technically true as far as the architecture can control:

> **Your Stripe. Your customers. Your money. Our software.**

And for content:

> **Build and host your membership on ZeroFee. For V1 video, bring your YouTube videos and ZeroFee handles the membership experience around them.**

ZeroFee should make creator commerce easier without unnecessarily becoming the owner of creator money or the native host of creator video files.
