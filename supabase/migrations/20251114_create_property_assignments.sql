-- Create property_agent_assignments table for manual MLS property assignments
-- This allows admins to assign specific H&F agents to specific MLS listings

CREATE TABLE IF NOT EXISTS public.property_agent_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_key TEXT NOT NULL,           -- MLS ListingKey (unique identifier for property)
  agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,  -- Who made the assignment
  property_data JSONB,                 -- Cached property details (address, price, beds, baths, etc.)
  assignment_type TEXT DEFAULT 'manual' CHECK (assignment_type IN ('manual', 'auto', 'territory', 'claimed')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  notes TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate assignments of same property to same agent
  CONSTRAINT unique_listing_agent UNIQUE(listing_key, agent_id)
);

-- Indexes for performance
CREATE INDEX idx_assignments_agent ON public.property_agent_assignments(agent_id) WHERE status = 'active';
CREATE INDEX idx_assignments_listing ON public.property_agent_assignments(listing_key) WHERE status = 'active';
CREATE INDEX idx_assignments_status ON public.property_agent_assignments(status);
CREATE INDEX idx_assignments_date ON public.property_agent_assignments(assigned_at DESC);

-- Enable RLS
ALTER TABLE public.property_agent_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Super admins and brokers can do everything
CREATE POLICY "Admins can manage all assignments"
  ON public.property_agent_assignments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'broker')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'broker')
    )
  );

-- Agents can view their own assignments
CREATE POLICY "Agents can view their own assignments"
  ON public.property_agent_assignments
  FOR SELECT
  TO authenticated
  USING (
    agent_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'agent'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_property_assignment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_property_assignment_timestamp
  BEFORE UPDATE ON public.property_agent_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_property_assignment_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.property_agent_assignments IS 'Tracks manual assignments of MLS properties to H&F agents for lead routing';
COMMENT ON COLUMN public.property_agent_assignments.listing_key IS 'MLS ListingKey - unique identifier from Realtyna RESO API';
COMMENT ON COLUMN public.property_agent_assignments.property_data IS 'Cached property details to avoid repeated API calls';
COMMENT ON COLUMN public.property_agent_assignments.assignment_type IS 'How assignment was made: manual (admin), auto (rule-based), territory (ZIP-based), claimed (agent requested)';
