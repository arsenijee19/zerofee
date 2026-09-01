# ZeroFee Prompt Execution Order

This directory contains the accumulated ZeroFee V1 specifications.

## Current instruction for the next implementation run

**Run only:**

`prompts/5_COMPLETE_REMAINING_V1_BACKEND_EXECUTION_PROMPT.md`

Prompt 5 is the current execution orchestrator. It requires the agent to read Prompts 1–4 completely and then implement all remaining V1 work from the current repository state.

Do **not** independently rerun Prompt 1 from Phase 0.
Do **not** independently rerun Prompt 2 as a fresh redesign.
Do **not** execute Prompt 3 and stop before Prompt 4 requirements.

The owner already executed Prompt 1 once. That run produced the visual/mock baseline around commit `0a4c005509236deb9d0b5fe90568477648d457d9`. Prompts 3–5 were written after the audit of that implementation and have not yet been executed by the implementation agent.

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

**Current final execution orchestrator.**

It combines all remaining internally solvable requirements from Prompts 1–4, adds missing backend depth and acceptance evidence, and defines the exact implementation order.

Prompt 5 is authoritative for:

- execution order;
- backend completeness;
- no-stop behavior;
- evidence required for `VERIFIED`;
- final Definition of Done;
- final completion report.

## Core rule

A feature is not complete because it has a screen, seed state, interface, documentation, or screenshot.

For an internally solvable V1 feature, `VERIFIED` requires the relevant combination of:

- real application code;
- real PostgreSQL persistence;
- server authorization;
- provider/domain integration;
- automated test evidence;
- real DB-backed E2E where applicable.

External Stripe/legal/tax/production dependencies may remain explicitly blocked, but they must never be used to hide unfinished internal coding work.
