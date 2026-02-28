CREATE TABLE IF NOT EXISTS short_links (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code text UNIQUE NOT NULL,
  target_url text NOT NULL,
  title text,
  clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE short_links ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Allow all access" ON short_links FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION increment_short_link_clicks(link_code text)
RETURNS void AS $$
BEGIN
  UPDATE short_links SET clicks = clicks + 1 WHERE code = link_code;
END;
$$ LANGUAGE plpgsql;
