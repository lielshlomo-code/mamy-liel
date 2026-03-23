-- Add paint_cookies flag to short_links for affiliate cookie painting
ALTER TABLE short_links ADD COLUMN IF NOT EXISTS paint_cookies boolean DEFAULT false;
