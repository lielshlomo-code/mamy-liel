ALTER TABLE short_links ADD COLUMN IF NOT EXISTS show_in_popup boolean DEFAULT false;
ALTER TABLE social_links ADD COLUMN IF NOT EXISTS show_in_popup boolean DEFAULT false;
