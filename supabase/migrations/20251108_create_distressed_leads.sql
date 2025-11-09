-- Create distressed_leads table
CREATE TABLE IF NOT EXISTS distressed_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Property Info
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'TN',
  zip TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('Pre-Foreclosure', 'Foreclosure', 'Tax Lien', 'Probate Sale', 'Expired Listing')),

  -- Financial
  estimated_value INTEGER NOT NULL,
  estimated_equity INTEGER NOT NULL,
  days_in_distress INTEGER NOT NULL,

  -- AI Analysis
  ai_insight TEXT NOT NULL,
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),

  -- Source
  source TEXT NOT NULL,
  found_date TIMESTAMPTZ NOT NULL,

  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'claimed_by_broker', 'assigned_to_agent', 'archived')),
  claimed_by UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  assigned_date TIMESTAMPTZ,

  -- Featured
  is_featured BOOLEAN DEFAULT FALSE,
  featured_date TIMESTAMPTZ,

  -- Agent Actions
  contacted BOOLEAN DEFAULT FALSE,
  contact_attempts INTEGER DEFAULT 0,
  last_contact_date TIMESTAMPTZ,
  agent_notes TEXT,
  follow_up_date TIMESTAMPTZ,
  lead_status TEXT CHECK (lead_status IN ('working', 'pending', 'closed_won', 'closed_lost')),

  -- Images
  property_images TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON distressed_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON distressed_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_claimed_by ON distressed_leads(claimed_by);
CREATE INDEX IF NOT EXISTS idx_leads_is_featured ON distressed_leads(is_featured);
CREATE INDEX IF NOT EXISTS idx_leads_found_date ON distressed_leads(found_date DESC);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON distressed_leads(priority);

-- Create lead_hunter_settings table
CREATE TABLE IF NOT EXISTS lead_hunter_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'every_2_days', 'weekly', 'manual')),
  run_time TEXT NOT NULL,
  target_counties TEXT[] NOT NULL,
  min_equity INTEGER NOT NULL,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO lead_hunter_settings (frequency, run_time, target_counties, min_equity)
VALUES ('daily', '06:00', ARRAY['Davidson', 'Williamson', 'Rutherford'], 50000)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE distressed_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_hunter_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Brokers see all leads" ON distressed_leads;
DROP POLICY IF EXISTS "Agents see assigned leads" ON distressed_leads;
DROP POLICY IF EXISTS "Public sees featured leads" ON distressed_leads;
DROP POLICY IF EXISTS "Brokers can update all leads" ON distressed_leads;
DROP POLICY IF EXISTS "Agents can update assigned leads" ON distressed_leads;
DROP POLICY IF EXISTS "Brokers can insert leads" ON distressed_leads;
DROP POLICY IF EXISTS "Admins see settings" ON lead_hunter_settings;
DROP POLICY IF EXISTS "Admins update settings" ON lead_hunter_settings;

-- RLS Policies for distressed_leads

-- SELECT Policies
CREATE POLICY "Brokers see all leads"
  ON distressed_leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin', 'broker')
    )
  );

CREATE POLICY "Agents see assigned leads"
  ON distressed_leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'agent'
      AND distressed_leads.assigned_to = auth.uid()
    )
  );

CREATE POLICY "Public sees featured leads"
  ON distressed_leads FOR SELECT
  USING (is_featured = TRUE);

-- UPDATE Policies
CREATE POLICY "Brokers can update all leads"
  ON distressed_leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin', 'broker')
    )
  );

CREATE POLICY "Agents can update assigned leads"
  ON distressed_leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'agent'
      AND distressed_leads.assigned_to = auth.uid()
    )
  );

-- INSERT Policy
CREATE POLICY "Brokers can insert leads"
  ON distressed_leads FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin', 'broker')
    )
  );

-- RLS Policies for lead_hunter_settings
CREATE POLICY "Admins see settings"
  ON lead_hunter_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin', 'broker')
    )
  );

CREATE POLICY "Admins update settings"
  ON lead_hunter_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin', 'broker')
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_distressed_leads_updated_at ON distressed_leads;
CREATE TRIGGER update_distressed_leads_updated_at
  BEFORE UPDATE ON distressed_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lead_hunter_settings_updated_at ON lead_hunter_settings;
CREATE TRIGGER update_lead_hunter_settings_updated_at
  BEFORE UPDATE ON lead_hunter_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
