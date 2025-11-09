-- Dashboard Core Tables
-- Non-Realtyna agent dashboard system

-- ============================================================================
-- PROFILES (Users/Agents)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT CHECK (role IN ('agent','admin','superadmin')) DEFAULT 'agent',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Self read" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin read" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id=auth.uid() AND p.role IN ('admin','superadmin'))
);

-- ============================================================================
-- LEADS
-- ============================================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT,                       -- portal, referral, soi, site, event, etc.
  stage TEXT DEFAULT 'new',          -- new, contacted, showing, offer, contract, closed, lost
  temperature TEXT DEFAULT 'COOL',   -- HOT/WARM/COOL/COLD
  score INT DEFAULT 0,               -- 0-100
  potential_commission NUMERIC(12,2),
  criteria JSONB,                    -- min/max price, beds, baths, neighborhoods
  next_action_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read" ON leads FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Owner can write" ON leads FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Admin can all" ON leads FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id=auth.uid() AND p.role IN ('admin','superadmin'))
);

-- ============================================================================
-- LEAD ACTIVITY STREAM
-- ============================================================================
CREATE TABLE lead_events (
  id BIGSERIAL PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT,                         -- view, favorite, message, call, showing, email_open, click, note, task
  meta JSONB,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- DEALS / PIPELINE
-- ============================================================================
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES profiles(id),
  lead_id UUID REFERENCES leads(id),
  address TEXT,
  city TEXT,
  zip_code TEXT,
  price NUMERIC(14,2),
  side TEXT CHECK (side IN ('buy','sell')),
  stage TEXT CHECK (stage IN ('active','offer','contract','ctc','closed','lost')) DEFAULT 'active',
  probability INT DEFAULT 25,        -- 0-100 for weighted pipeline
  close_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agent read" ON deals FOR SELECT USING (agent_id = auth.uid());
CREATE POLICY "Agent write" ON deals FOR UPDATE USING (agent_id = auth.uid());
CREATE POLICY "Admin all" ON deals FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id=auth.uid() AND p.role IN ('admin','superadmin'))
);

-- ============================================================================
-- INSIGHTS / OPPORTUNITIES
-- ============================================================================
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT,             -- 'price_cut','expired','hot_lead','task','market_shift'
  priority INT,          -- 1-5
  title TEXT,
  description TEXT,
  data JSONB,
  owner_id UUID REFERENCES profiles(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- ALERTS RULES
-- ============================================================================
CREATE TABLE alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id),
  name TEXT,
  conditions JSONB,      -- { event:'price_cut', area:'37215', pct:5 }
  channels JSONB,        -- { email:true, sms:false, inapp:true }
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- FORMS REGISTRY
-- ============================================================================
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT,             -- RF401, RF201, etc.
  name TEXT,
  latest_url TEXT,       -- base PDF/DOCX template (Supabase storage)
  language TEXT DEFAULT 'en', -- en/es/ar
  schema JSONB           -- field definitions for autofill mapping
);

-- ============================================================================
-- FORM INSTANCES
-- ============================================================================
CREATE TABLE form_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES forms(id),
  owner_id UUID REFERENCES profiles(id),
  lead_id UUID REFERENCES leads(id),
  data JSONB,            -- filled fields
  status TEXT DEFAULT 'draft', -- draft/sent/signed
  esign_envelope_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- MATERIALIZED VIEW - AGENT KPIs
-- ============================================================================
CREATE MATERIALIZED VIEW mv_agent_kpis AS
SELECT
  d.agent_id AS owner_id,
  COUNT(*) FILTER (WHERE d.stage IN ('active','offer','contract')) AS active_deals,
  SUM((d.price * (COALESCE(d.probability,25)/100.0))) AS weighted_pipeline,
  AVG(EXTRACT(DAY FROM (now()::date - d.created_at::date))) FILTER (WHERE d.stage='active') AS avg_days_active
FROM deals d
GROUP BY d.agent_id;

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_mv_agent_kpis() RETURNS VOID LANGUAGE SQL AS
$$ REFRESH MATERIALIZED VIEW CONCURRENTLY mv_agent_kpis; $$;
