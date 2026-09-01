# Migration Architecture

Migration Center supports a real persisted import path:
- Patreon/generic CSV parsing in `lib/server/migration-service.ts`;
- validation/error reporting for bad email/status/amount rows;
- spreadsheet formula neutralization;
- migration project persistence;
- mapped ZeroFee tier persistence;
- billing interval and external tier capture;
- secure hashed invitation token generation;
- import/invitation state tables for funnel tracking;
- UI coverage for field mapping, tier mapping, grandfathering, strategy, campaign, recovered MRR estimate and unconverted member export.

Payment credentials are not migrated. Fans must authorize new ZeroFee subscriptions.
