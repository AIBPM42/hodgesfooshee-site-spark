-- Add tables for Smart Plan API endpoints

-- Members (Agents) table
CREATE TABLE public.mls_members (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_key TEXT UNIQUE NOT NULL,
  member_id TEXT,
  member_login_id TEXT,
  member_first_name TEXT,
  member_last_name TEXT,
  member_full_name TEXT,
  member_email TEXT,
  member_phone TEXT,
  member_mobile_phone TEXT,
  office_key TEXT,
  office_name TEXT,
  member_status TEXT,
  member_type TEXT,
  modification_timestamp TIMESTAMPTZ,
  rf_modification_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Offices table  
CREATE TABLE public.mls_offices (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  office_key TEXT UNIQUE NOT NULL,
  office_id TEXT,
  office_name TEXT,
  office_phone TEXT,
  office_address1 TEXT,
  office_city TEXT,
  office_state_or_province TEXT,
  office_postal_code TEXT,
  office_country TEXT,
  office_email TEXT,
  office_status TEXT,
  modification_timestamp TIMESTAMPTZ,
  rf_modification_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Open Houses table
CREATE TABLE public.mls_open_houses (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  open_house_key TEXT UNIQUE NOT NULL,
  open_house_id TEXT,
  listing_key TEXT,
  open_house_date DATE,
  open_house_start_time TIME,
  open_house_end_time TIME,
  open_house_remarks TEXT,
  showing_agent_key TEXT,
  showing_agent_first_name TEXT,
  showing_agent_last_name TEXT,
  modification_timestamp TIMESTAMPTZ,
  rf_modification_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Postal Codes (ZIP codes) table
CREATE TABLE public.mls_postal_codes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  postal_code_key TEXT UNIQUE NOT NULL,
  postal_code TEXT,
  postal_code_plus4 TEXT,
  city TEXT,
  state_or_province TEXT,
  country TEXT,
  county_or_parish TEXT,
  modification_timestamp TIMESTAMPTZ,
  rf_modification_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.mls_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mls_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mls_open_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mls_postal_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "mls_members_public_read" ON public.mls_members FOR SELECT USING (true);
CREATE POLICY "mls_offices_public_read" ON public.mls_offices FOR SELECT USING (true);
CREATE POLICY "mls_open_houses_public_read" ON public.mls_open_houses FOR SELECT USING (true);
CREATE POLICY "mls_postal_codes_public_read" ON public.mls_postal_codes FOR SELECT USING (true);

-- Create service role policies for write access
CREATE POLICY "mls_members_service_write" ON public.mls_members FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "mls_members_service_update" ON public.mls_members FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "mls_offices_service_write" ON public.mls_offices FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "mls_offices_service_update" ON public.mls_offices FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "mls_open_houses_service_write" ON public.mls_open_houses FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "mls_open_houses_service_update" ON public.mls_open_houses FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "mls_postal_codes_service_write" ON public.mls_postal_codes FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "mls_postal_codes_service_update" ON public.mls_postal_codes FOR UPDATE USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_mls_members_office_key ON public.mls_members(office_key);
CREATE INDEX idx_mls_members_status ON public.mls_members(member_status);
CREATE INDEX idx_mls_members_rf_mod ON public.mls_members(rf_modification_timestamp);

CREATE INDEX idx_mls_offices_status ON public.mls_offices(office_status);
CREATE INDEX idx_mls_offices_rf_mod ON public.mls_offices(rf_modification_timestamp);

CREATE INDEX idx_mls_open_houses_listing_key ON public.mls_open_houses(listing_key);
CREATE INDEX idx_mls_open_houses_date ON public.mls_open_houses(open_house_date);
CREATE INDEX idx_mls_open_houses_rf_mod ON public.mls_open_houses(rf_modification_timestamp);

CREATE INDEX idx_mls_postal_codes_postal_code ON public.mls_postal_codes(postal_code);
CREATE INDEX idx_mls_postal_codes_city ON public.mls_postal_codes(city);
CREATE INDEX idx_mls_postal_codes_rf_mod ON public.mls_postal_codes(rf_modification_timestamp);