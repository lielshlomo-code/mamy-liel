-- =============================================
-- click_events table (unified click tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS click_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  target_id text NOT NULL,
  referrer text,
  user_agent text,
  country text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow all access" ON click_events FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX idx_click_events_type_created
  ON click_events (event_type, created_at DESC);

CREATE INDEX idx_click_events_target
  ON click_events (event_type, target_id, created_at DESC);

-- =============================================
-- Record short link click (replaces increment_short_link_clicks)
-- =============================================
CREATE OR REPLACE FUNCTION record_short_link_click(
  link_code text,
  click_referrer text DEFAULT NULL,
  click_user_agent text DEFAULT NULL,
  click_country text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE short_links SET clicks = clicks + 1 WHERE code = link_code;

  INSERT INTO click_events (event_type, target_id, referrer, user_agent, country)
  VALUES ('short_link', link_code, click_referrer, click_user_agent, click_country);
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Get top products by click count
-- =============================================
CREATE OR REPLACE FUNCTION get_top_products_by_clicks(days_back integer DEFAULT 30)
RETURNS TABLE (
  product_id text,
  product_name text,
  click_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.target_id AS product_id,
    COALESCE(p.name, ce.target_id) AS product_name,
    COUNT(*)::bigint AS click_count
  FROM click_events ce
  LEFT JOIN products p ON p.id = ce.target_id
  WHERE ce.event_type = 'product'
    AND ce.created_at >= now() - (days_back || ' days')::interval
  GROUP BY ce.target_id, p.name
  ORDER BY click_count DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
