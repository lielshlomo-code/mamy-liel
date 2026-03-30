-- Clients CRM tables

-- Main clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  collaboration_type TEXT NOT NULL DEFAULT 'monthly',
  -- monthly, one_time, ongoing, other
  monthly_videos INTEGER NOT NULL DEFAULT 0,
  monthly_stories INTEGER NOT NULL DEFAULT 0,
  monthly_reels INTEGER NOT NULL DEFAULT 0,
  monthly_posts INTEGER NOT NULL DEFAULT 0,
  payment_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_day INTEGER, -- day of month (1-31) when payment is due
  currency TEXT NOT NULL DEFAULT 'ILS',
  status TEXT NOT NULL DEFAULT 'active',
  -- active, paused, completed
  notes TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Content schedule - individual content items to upload
CREATE TABLE IF NOT EXISTS client_content_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL DEFAULT 'video',
  -- video, story, reel, post
  title TEXT,
  description TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  platform TEXT DEFAULT 'instagram',
  -- instagram, tiktok, youtube, facebook, other
  status TEXT NOT NULL DEFAULT 'pending',
  -- pending, in_progress, ready, published
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payment tracking
CREATE TABLE IF NOT EXISTS client_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ILS',
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  -- pending, paid, overdue, cancelled
  invoice_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_client_content_client_id ON client_content_schedule(client_id);
CREATE INDEX idx_client_content_scheduled_date ON client_content_schedule(scheduled_date);
CREATE INDEX idx_client_content_status ON client_content_schedule(status);
CREATE INDEX idx_client_payments_client_id ON client_payments(client_id);
CREATE INDEX idx_client_payments_status ON client_payments(status);
CREATE INDEX idx_client_payments_due_date ON client_payments(due_date);

-- RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_content_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to client_content_schedule" ON client_content_schedule FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to client_payments" ON client_payments FOR ALL USING (true) WITH CHECK (true);
