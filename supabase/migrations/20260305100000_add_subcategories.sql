CREATE TABLE IF NOT EXISTS subcategories (
  id text PRIMARY KEY,
  label text NOT NULL,
  category_id text NOT NULL REFERENCES categories(id) ON DELETE CASCADE
);

ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory text;

ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Allow all access" ON subcategories FOR ALL USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
