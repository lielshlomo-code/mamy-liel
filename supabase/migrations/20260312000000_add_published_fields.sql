-- Add published column to products (default true so existing products stay visible)
ALTER TABLE products ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

-- Add published column to blog_posts (default true so existing posts stay visible)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

-- Add published column to social_links (default true so existing links stay visible)
ALTER TABLE social_links ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

-- Add published column to short_links (default true so existing links stay visible)
ALTER TABLE short_links ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;
