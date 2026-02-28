CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  label text NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  url text NOT NULL,
  image text,
  featured boolean DEFAULT false,
  date_added date NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_posts (
  slug text PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  excerpt text NOT NULL,
  image text,
  media_url text,
  tags text[],
  content text NOT NULL
);

CREATE TABLE IF NOT EXISTS social_links (
  id text PRIMARY KEY,
  label text NOT NULL,
  url text NOT NULL,
  icon text NOT NULL,
  internal boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  type text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Allow all access" ON categories FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Allow all access" ON products FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Allow all access" ON blog_posts FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Allow all access" ON social_links FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Allow all access" ON contact_submissions FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
