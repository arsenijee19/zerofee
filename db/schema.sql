-- ZeroFee prototype schema reference for PostgreSQL migrations.
CREATE TABLE IF NOT EXISTS users (id text PRIMARY KEY, email text UNIQUE NOT NULL, password_hash text, email_verified boolean NOT NULL DEFAULT false);
CREATE TABLE IF NOT EXISTS creator_profiles (id text PRIMARY KEY, user_id text NOT NULL, slug text UNIQUE NOT NULL, country text NOT NULL);
CREATE TABLE IF NOT EXISTS provider_pricing_rules (id text PRIMARY KEY, version text UNIQUE NOT NULL, provider text NOT NULL, status text NOT NULL, revalidate_by date NOT NULL);
CREATE TABLE IF NOT EXISTS guarantee_eligibility_profiles (id text PRIMARY KEY, version text UNIQUE NOT NULL, pricing_rule_version text NOT NULL, status text NOT NULL);
CREATE TABLE IF NOT EXISTS membership_price_quotes (id text PRIMARY KEY, creator_id text NOT NULL, tier_id text NOT NULL, target_minor integer NOT NULL, retail_minor integer NOT NULL, currency text NOT NULL, status text NOT NULL);
CREATE TABLE IF NOT EXISTS guarantee_reconciliations (id text PRIMARY KEY, quote_id text NOT NULL, status text NOT NULL, actual_creator_proceeds_minor integer NOT NULL, surplus_minor integer NOT NULL, shortfall_minor integer NOT NULL);
CREATE TABLE IF NOT EXISTS webhook_events (id text PRIMARY KEY, provider_event_id text UNIQUE NOT NULL, signature_verified boolean NOT NULL, processed_at timestamptz);
