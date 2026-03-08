-- Add display_order column to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Add display_order column to subcategories
ALTER TABLE subcategories ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Initialize display_order for existing categories based on alphabetical order
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn
  FROM categories
)
UPDATE categories SET display_order = ordered.rn
FROM ordered WHERE categories.id = ordered.id;

-- Initialize display_order for existing subcategories based on alphabetical order within each category
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY id) as rn
  FROM subcategories
)
UPDATE subcategories SET display_order = ordered.rn
FROM ordered WHERE subcategories.id = ordered.id;
