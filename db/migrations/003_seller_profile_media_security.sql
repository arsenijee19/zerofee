-- Seller profile, media purposes, post attachments, auth rate limiting.

ALTER TABLE media_assets
  ADD COLUMN purpose text NOT NULL DEFAULT 'ATTACHMENT' CHECK (purpose IN ('AVATAR','BANNER','POST_COVER','ATTACHMENT')),
  ADD COLUMN alt_text text NOT NULL DEFAULT '',
  ADD COLUMN sha256 text,
  ADD COLUMN storage_provider text NOT NULL DEFAULT 'local';

ALTER TABLE creator_profiles
  ADD COLUMN tagline text NOT NULL DEFAULT '' CHECK (char_length(tagline) <= 140),
  ADD COLUMN avatar_asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  ADD COLUMN banner_asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  ADD COLUMN website_url text;

CREATE TABLE creator_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  label text NOT NULL CHECK (char_length(label) BETWEEN 1 AND 40),
  url text NOT NULL CHECK (url ~* '^https://'),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_creator_links_creator ON creator_links(creator_id, sort_order);

ALTER TABLE posts
  ADD COLUMN excerpt text NOT NULL DEFAULT '' CHECK (char_length(excerpt) <= 300),
  ADD COLUMN cover_asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  ADD COLUMN published_at timestamptz;
UPDATE posts SET published_at = created_at WHERE state = 'PUBLISHED';

CREATE TABLE post_attachments (
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, asset_id)
);

CREATE TABLE auth_attempts (
  id bigserial PRIMARY KEY,
  bucket text NOT NULL,
  key_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_auth_attempts_lookup ON auth_attempts(bucket, key_hash, created_at DESC);
CREATE INDEX idx_media_creator_purpose ON media_assets(creator_id, purpose);
CREATE INDEX idx_sessions_user ON sessions(user_id);
