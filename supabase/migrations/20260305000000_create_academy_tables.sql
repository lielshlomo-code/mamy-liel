-- Course categories
CREATE TABLE IF NOT EXISTS course_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  image TEXT,
  is_free BOOLEAN NOT NULL DEFAULT false,
  price TEXT,
  payment_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  date_added TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Course lessons
CREATE TABLE IF NOT EXISTS course_lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL DEFAULT '',
  duration TEXT,
  is_preview BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true
);

-- Index for fast lesson lookup
CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON course_lessons(course_id);

-- Insert default category
INSERT INTO course_categories (id, label) VALUES ('affiliate-marketing', 'שיווק שותפים') ON CONFLICT DO NOTHING;
