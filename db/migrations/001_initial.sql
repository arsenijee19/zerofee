CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  password_hash text NOT NULL,
  email_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('MEMBER','CREATOR','ADMIN')),
  PRIMARY KEY (user_id, role)
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  invalidated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE email_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE country_capabilities (
  code text PRIMARY KEY,
  launch_status text NOT NULL CHECK (launch_status IN ('UNSUPPORTED','WAITLIST','BETA','AVAILABLE','PAUSED')),
  individual_supported boolean NOT NULL,
  company_supported boolean NOT NULL,
  charges_enabled boolean NOT NULL,
  payouts_enabled boolean NOT NULL,
  supported_presentment_currencies text[] NOT NULL,
  supported_settlement_currencies text[] NOT NULL,
  guaranteed_earnings_enabled boolean NOT NULL,
  tax_readiness text NOT NULL,
  legal_review_state text NOT NULL,
  provider_approval_state text NOT NULL,
  evidence text NOT NULL,
  verified_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE creator_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  country_code text NOT NULL REFERENCES country_capabilities(code),
  category text NOT NULL,
  bio text NOT NULL DEFAULT '',
  support_email text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE creator_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  state text NOT NULL CHECK (state IN ('DRAFT','SUBMITTED','UNDER_REVIEW','NEEDS_INFORMATION','APPROVED_FOR_PAYOUT_ONBOARDING','REJECTED','SUSPENDED_POST_APPROVAL')),
  country_code text NOT NULL REFERENCES country_capabilities(code),
  business_type text NOT NULL CHECK (business_type IN ('individual','company')),
  offering text NOT NULL,
  rights_attested boolean NOT NULL DEFAULT false,
  aup_accepted boolean NOT NULL DEFAULT false,
  submitted_at timestamptz,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE creator_application_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES creator_applications(id) ON DELETE CASCADE,
  revision_number integer NOT NULL,
  snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (application_id, revision_number)
);

CREATE TABLE creator_review_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES creator_applications(id) ON DELETE CASCADE,
  admin_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE creator_connected_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL UNIQUE REFERENCES creator_profiles(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('mock','stripe')),
  external_account_id text NOT NULL,
  onboarding_state text NOT NULL,
  charges_enabled boolean NOT NULL DEFAULT false,
  payouts_enabled boolean NOT NULL DEFAULT false,
  dashboard_url text,
  requirements jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE platform_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE platform_plan_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES platform_plans(id) ON DELETE CASCADE,
  version integer NOT NULL,
  monthly_price_minor bigint NOT NULL,
  currency text NOT NULL,
  active_member_limit integer NOT NULL,
  storage_mb_limit integer NOT NULL,
  broadcast_limit integer NOT NULL,
  api_quota integer NOT NULL,
  effective_from timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plan_id, version)
);

CREATE TABLE platform_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL UNIQUE REFERENCES creator_profiles(id) ON DELETE CASCADE,
  plan_version_id uuid NOT NULL REFERENCES platform_plan_versions(id),
  provider text NOT NULL,
  state text NOT NULL CHECK (state IN ('NONE','TRIALING','ACTIVE','PAST_DUE','GRACE','SUSPENDED','CANCEL_AT_PERIOD_END','CANCELLED')),
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE provider_pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL UNIQUE,
  provider text NOT NULL,
  source_type text NOT NULL,
  source_reference text NOT NULL,
  creator_account_country text NOT NULL,
  issuer_region text NOT NULL,
  payment_method_family text NOT NULL,
  card_class text NOT NULL,
  presentment_currency text NOT NULL,
  settlement_currency text NOT NULL,
  percentage_bps integer NOT NULL,
  fixed_fee_minor bigint NOT NULL,
  billing_fee_minor bigint NOT NULL,
  cross_border_bps integer NOT NULL,
  fx_bps integer NOT NULL,
  fee_payer text NOT NULL,
  fee_confidence text NOT NULL CHECK (fee_confidence IN ('EXACT_FORMULA','VERIFIED_UPPER_BOUND','UNKNOWN_OR_VARIABLE')),
  status text NOT NULL CHECK (status IN ('DRAFT','TEST_ONLY','VERIFIED','EXPIRED','PAUSED')),
  production_enabled boolean NOT NULL DEFAULT false,
  verified_at timestamptz NOT NULL,
  revalidate_by timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE guarantee_eligibility_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL UNIQUE,
  provider text NOT NULL,
  creator_country text NOT NULL,
  issuer_region text NOT NULL,
  presentment_currency text NOT NULL,
  settlement_currency text NOT NULL,
  payment_method_family text NOT NULL,
  card_class text NOT NULL,
  pricing_rule_version text NOT NULL REFERENCES provider_pricing_rules(version),
  fee_confidence text NOT NULL,
  status text NOT NULL CHECK (status IN ('DISABLED','TEST_ONLY','ELIGIBLE','PAUSED')),
  evidence text NOT NULL,
  effective_from timestamptz NOT NULL,
  effective_to timestamptz NOT NULL
);

CREATE TABLE creator_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  benefits text NOT NULL,
  state text NOT NULL CHECK (state IN ('DRAFT','PUBLISHED','ARCHIVED')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (creator_id, name)
);

CREATE TABLE tier_price_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id uuid NOT NULL REFERENCES creator_tiers(id) ON DELETE CASCADE,
  version integer NOT NULL,
  pricing_mode text NOT NULL CHECK (pricing_mode IN ('GUARANTEED_EARNINGS','SIMPLE_PRICE')),
  billing_interval text NOT NULL CHECK (billing_interval IN ('monthly','annual')),
  currency text NOT NULL,
  creator_target_minor bigint NOT NULL,
  simple_retail_minor bigint,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tier_id, version)
);

CREATE TABLE membership_price_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  tier_id uuid NOT NULL REFERENCES creator_tiers(id) ON DELETE CASCADE,
  tier_price_version_id uuid NOT NULL REFERENCES tier_price_versions(id),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  target_minor bigint NOT NULL,
  retail_minor bigint NOT NULL,
  tax_minor bigint NOT NULL,
  provider_cost_minor bigint NOT NULL,
  modeled_creator_proceeds_minor bigint NOT NULL,
  platform_fee_minor bigint NOT NULL DEFAULT 0 CHECK (platform_fee_minor = 0),
  currency text NOT NULL,
  pricing_rule_version text NOT NULL,
  eligibility_profile_version text NOT NULL,
  payment_context jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('ACTIVE','ACCEPTED','EXPIRED','USED')),
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE membership_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  member_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier_id uuid NOT NULL REFERENCES creator_tiers(id) ON DELETE RESTRICT,
  quote_id uuid REFERENCES membership_price_quotes(id),
  state text NOT NULL,
  current_period_end timestamptz,
  provider_subscription_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (creator_id, member_user_id, tier_id)
);

CREATE TABLE membership_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES membership_subscriptions(id) ON DELETE CASCADE,
  quote_id uuid NOT NULL REFERENCES membership_price_quotes(id),
  provider_payment_id text NOT NULL UNIQUE,
  gross_minor bigint NOT NULL,
  currency text NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE guarantee_reconciliations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL UNIQUE REFERENCES membership_payments(id) ON DELETE CASCADE,
  quote_id uuid NOT NULL REFERENCES membership_price_quotes(id),
  target_minor bigint NOT NULL,
  customer_charged_minor bigint NOT NULL,
  actual_tax_minor bigint NOT NULL,
  actual_provider_fee_minor bigint NOT NULL,
  actual_creator_proceeds_minor bigint NOT NULL,
  zero_fee_platform_fee_minor bigint NOT NULL DEFAULT 0 CHECK (zero_fee_platform_fee_minor = 0),
  surplus_minor bigint NOT NULL,
  shortfall_minor bigint NOT NULL,
  currency text NOT NULL,
  status text NOT NULL,
  provider_transaction_reference text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE guarantee_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_id uuid NOT NULL UNIQUE REFERENCES guarantee_reconciliations(id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  pricing_rule_version text NOT NULL,
  status text NOT NULL,
  severity text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  body text NOT NULL,
  visibility text NOT NULL CHECK (visibility IN ('PUBLIC','ALL_PAID','SELECTED_TIERS')),
  state text NOT NULL CHECK (state IN ('DRAFT','PUBLISHED','ARCHIVED','UNPUBLISHED_BY_MODERATION')),
  youtube_video_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (creator_id, slug)
);

CREATE TABLE post_tier_access (
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tier_id uuid NOT NULL REFERENCES creator_tiers(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tier_id)
);

CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  state text NOT NULL CHECK (state IN ('DRAFT','PUBLISHED','ARCHIVED','UNPUBLISHED_BY_MODERATION')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (creator_id, slug)
);

CREATE TABLE course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  sort_order integer NOT NULL
);

CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  body text NOT NULL,
  youtube_video_id text,
  visibility text NOT NULL,
  state text NOT NULL,
  sort_order integer NOT NULL,
  UNIQUE (module_id, slug)
);

CREATE TABLE media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  object_key text NOT NULL UNIQUE,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  visibility text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE migration_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  source text NOT NULL,
  name text NOT NULL,
  state text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE migration_import_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES migration_projects(id) ON DELETE CASCADE,
  external_member_id text,
  member_name text NOT NULL,
  email text NOT NULL,
  external_tier text NOT NULL,
  mapped_tier_id uuid REFERENCES creator_tiers(id),
  status text NOT NULL,
  interval text NOT NULL,
  amount_minor bigint NOT NULL,
  currency text NOT NULL,
  raw_fields jsonb NOT NULL DEFAULT '{}',
  row_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, row_hash)
);

CREATE TABLE migration_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_row_id uuid NOT NULL UNIQUE REFERENCES migration_import_rows(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  clicked_at timestamptz,
  converted_at timestamptz,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_event_id text NOT NULL,
  connected_account_id text,
  event_type text NOT NULL,
  payload_hash text NOT NULL,
  status text NOT NULL,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_event_id)
);

CREATE TABLE webhook_processing_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  status text NOT NULL,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  key_hash text NOT NULL UNIQUE,
  scopes text[] NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE outbound_webhook_endpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  url text NOT NULL,
  secret_hash text NOT NULL,
  disabled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE,
  member_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  category text NOT NULL,
  title text NOT NULL,
  state text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE SET NULL,
  reason text NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_creator_tiers_creator ON creator_tiers(creator_id);
CREATE INDEX idx_quotes_creator ON membership_price_quotes(creator_id);
CREATE INDEX idx_subscriptions_creator_member ON membership_subscriptions(creator_id, member_user_id);
CREATE INDEX idx_posts_creator_visibility ON posts(creator_id, visibility, state);
CREATE INDEX idx_migration_project ON migration_import_rows(project_id);
CREATE INDEX idx_search_users_email ON users USING gin (to_tsvector('simple', email || ' ' || name));
