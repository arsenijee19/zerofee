# ZeroFee Prompt Execution Order

This directory contains the accumulated ZeroFee V1 specifications.

## Current repository history

- Prompt 1 was executed once and produced the original visual/mock prototype around `0a4c005509236deb9d0b5fe90568477648d457d9`.
- Prompt 5 was subsequently executed and produced the PostgreSQL/server-domain backend pass ending around `1ec2034d774659f575e5787406013a902e395ef3`.
- An independent audit of that pass found that the backend foundation materially improved, but the browser application still requires full real-route/form/session/DB/provider wiring and genuine functional E2E before V1 can be considered complete.
- Prompt 6 adds the newest authoritative financial-risk/product decisions: grandfathered pricing, real Guarantee Top-Ups, current Stripe fee matrices, payment-route-aware pricing, self-correcting route rules, guarantee reserve controls, and the creator/owner Stripe access model.

Do **not** independently rerun Prompt 1 from Phase 0.
Do **not** rerun Prompt 2 as a fresh redesign.
Preserve the approved design and correct existing financial work.

## Authority map

### Prompt 1
`1_INITIAL_PROTOTYPE_MASTER_EXECUTION_PROMPT.md`

Authoritative source for:

- product scope;
- ZeroFee economic invariants;
- Guaranteed Earnings;
- membership lifecycle;
- original V1 feature requirements;
- financial correctness;
- country/tax architecture;
- integrations/search/admin/member/creator requirements.

It is a requirements source now, not the command to restart implementation from zero.

### Prompt 2
`2_DESIGN_SYSTEM_AND_UX_MASTER_PROMPT.md`

Authoritative source for:

- design system;
- visual hierarchy;
- UX;
- responsive/mobile behavior;
- screenshot quality bar.

The design was already substantially applied. Future execution should preserve it and perform targeted regression fixes only unless a concrete defect requires change.

### Prompt 3
`3_REAL_APPLICATION_CONVERSION_MASTER_PROMPT.md`

Authoritative source for:

- correcting the first implementation's mock/seed-only architecture;
- real PostgreSQL;
- auth/session/RBAC;
- real routes/server services;
- Stripe adapter/webhooks;
- real Patreon import;
- real search/security/E2E.

### Prompt 4
`4_PLATFORM_OPERATING_MODEL_AND_CONTENT_EXECUTION_PROMPT.md`

Newer authoritative source for:

- ZeroFee as SaaS/hosting infrastructure;
- creator as intended seller/merchant where legally supported;
- creator-owned Stripe relationship;
- direct-charge topology;
- ZeroFee SaaS-only revenue;
- no discovery marketplace in initial V1;
- content/courses/lessons;
- ZeroFee-hosted text/images/files;
- **YouTube-only video in V1**;
- moderation/takedown consequences.

Where Prompt 4 intentionally changes an operating/content assumption from Prompt 1, Prompt 4 wins.

### Prompt 5
`5_COMPLETE_REMAINING_V1_BACKEND_EXECUTION_PROMPT.md`

Backend-completeness orchestrator that was executed after the first audit.

Its requirements remain applicable, but its prior execution report must not be treated as proof that browser wiring/E2E is complete. The actual repository state is authoritative.

### Prompt 6
`6_GUARANTEE_PRICING_MATRIX_AND_SELF_CORRECTING_RISK_ENGINE_PROMPT.md`

**Newest authoritative financial-risk / pricing continuation specification.**

Prompt 6 is authoritative for:

- optional existing-member grandfathering when publishing a new tier price version;
- `Keep existing members at their current price` as the recommended/default creator-friendly choice;
- a real ZeroFee Guarantee Top-Up when an eligible successful payment falls below the promised creator target;
- immutable/idempotent top-up ledger and funding boundary;
- current versioned Stripe fee matrices and source provenance;
- IP as preview only, never authoritative payment-fee classification;
- final pricing based on the strongest payment-method/card route context available before buyer confirmation;
- safe upper bounds when exact pre-charge card classification is unavailable;
- automatic bounded route correction after deterministic shortfalls;
- circuit-breaker pause for unexplained pricing anomalies;
- guarantee reserve/exposure monitoring;
- creator surplus always remaining creator-owned;
- creator full Stripe Dashboard access where supported plus ZeroFee platform/API operational visibility without creator impersonation.

Prompt 6 intentionally strengthens the earlier Guarantee Breach behavior: a valid covered shortfall is not only recorded; ZeroFee must create the corresponding guarantee obligation/top-up and then correct or pause the unsafe route.

## Core rule

A feature is not complete because it has a screen, seed state, interface, documentation, or screenshot.

For an internally solvable V1 feature, `VERIFIED` requires the relevant combination of:

- real application code;
- real PostgreSQL persistence;
- server authorization;
- provider/domain integration;
- automated test evidence;
- real DB-backed browser E2E where applicable.

External Stripe/legal/tax/production dependencies may remain explicitly blocked, but they must never be used to hide unfinished internal coding work.
