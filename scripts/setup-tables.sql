-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  label text NOT NULL
);

-- Create products table
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

-- Create blog_posts table
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

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id text PRIMARY KEY,
  label text NOT NULL,
  url text NOT NULL,
  icon text NOT NULL,
  internal boolean DEFAULT false
);

-- Create short_links table
CREATE TABLE IF NOT EXISTS short_links (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code text UNIQUE NOT NULL,
  target_url text NOT NULL,
  title text,
  clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create function to increment clicks
CREATE OR REPLACE FUNCTION increment_short_link_clicks(link_code text)
RETURNS void AS $$
BEGIN
  UPDATE short_links SET clicks = clicks + 1 WHERE code = link_code;
END;
$$ LANGUAGE plpgsql;

-- Create contact_submissions table
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

-- Enable Row Level Security (allow all via service role key)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for service role (full access)
CREATE POLICY "Allow service role full access" ON categories FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON products FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON blog_posts FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON social_links FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON short_links FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON contact_submissions FOR ALL USING (true);
