-- Phase 1: Brokerage Analytics - Database Schema & Auth Foundation

-- Create agent role enum
CREATE TYPE agent_role AS ENUM ('broker', 'agent', 'staff', 'admin');

-- Create brokerages table
CREATE TABLE brokerages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  license_number text,
  phone text,
  email text,
  address text,
  city text,
  state text DEFAULT 'TN',
  zip text,
  website text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create agents table linked to auth users
CREATE TABLE agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  brokerage_id uuid REFERENCES brokerages(id) NOT NULL,
  office_id uuid NULL, -- for future office subdivisions
  role agent_role NOT NULL DEFAULT 'agent',
  first_name text,
  last_name text,
  email text,
  phone text,
  license_number text,
  hire_date date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE brokerages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Add agent/brokerage tracking columns to mls_listings
ALTER TABLE mls_listings ADD COLUMN listing_agent_key text;
ALTER TABLE mls_listings ADD COLUMN listing_office_key text;
ALTER TABLE mls_listings ADD COLUMN brokerage_id uuid REFERENCES brokerages(id);
ALTER TABLE mls_listings ADD COLUMN days_on_market integer;
ALTER TABLE mls_listings ADD COLUMN original_list_price numeric;
ALTER TABLE mls_listings ADD COLUMN price_reduction_count integer DEFAULT 0;
ALTER TABLE mls_listings ADD COLUMN first_seen_at timestamptz DEFAULT now();

-- Create indexes for performance
CREATE INDEX idx_mls_listings_brokerage_id ON mls_listings(brokerage_id);
CREATE INDEX idx_mls_listings_listing_agent_key ON mls_listings(listing_agent_key);
CREATE INDEX idx_mls_listings_first_seen_at ON mls_listings(first_seen_at);
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_brokerage_id ON agents(brokerage_id);

-- RLS Policies for brokerages
CREATE POLICY "Brokerage members can read their brokerage" ON brokerages
  FOR SELECT TO authenticated 
  USING (
    id = (
      SELECT a.brokerage_id FROM agents a 
      WHERE a.user_id = auth.uid()
    )
  );

-- RLS Policies for agents  
CREATE POLICY "Users can read own agent profile" ON agents
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Brokerage members can read other agents in same brokerage" ON agents
  FOR SELECT TO authenticated
  USING (
    brokerage_id = (
      SELECT a.brokerage_id FROM agents a 
      WHERE a.user_id = auth.uid()
    )
  );

-- Update mls_listings RLS policy for brokerage access
CREATE POLICY "Brokerage members can read their listings" ON mls_listings
  FOR SELECT TO authenticated 
  USING (
    brokerage_id = (
      SELECT a.brokerage_id FROM agents a 
      WHERE a.user_id = auth.uid()
    )
    OR brokerage_id IS NULL -- Allow access to unassigned listings for now
  );

-- Service role policies for data management
CREATE POLICY "Service role can manage brokerages" ON brokerages
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage agents" ON agents
  FOR ALL  
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Add updated_at triggers
CREATE TRIGGER update_brokerages_updated_at
  BEFORE UPDATE ON brokerages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get user's agent role and brokerage
CREATE OR REPLACE FUNCTION public.get_user_agent_context()
RETURNS TABLE(
  agent_id uuid,
  brokerage_id uuid,
  role agent_role,
  first_name text,
  last_name text
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    a.id,
    a.brokerage_id,
    a.role,
    a.first_name,
    a.last_name
  FROM agents a
  WHERE a.user_id = auth.uid()
  AND a.status = 'active';
$$;