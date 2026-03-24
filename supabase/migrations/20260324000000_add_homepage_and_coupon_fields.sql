ALTER TABLE short_links ADD COLUMN IF NOT EXISTS show_on_homepage boolean DEFAULT false;
ALTER TABLE short_links ADD COLUMN IF NOT EXISTS coupon_code text;
ALTER TABLE short_links ADD COLUMN IF NOT EXISTS coupon_note text;
ALTER TABLE short_links ADD COLUMN IF NOT EXISTS color text;
