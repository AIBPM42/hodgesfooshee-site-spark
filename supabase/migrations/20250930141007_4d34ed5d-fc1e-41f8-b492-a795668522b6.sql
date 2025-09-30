-- Create mls_sync_state table to track incremental sync progress
CREATE TABLE IF NOT EXISTS public.mls_sync_state (
  resource text PRIMARY KEY CHECK (resource IN ('Property', 'Member', 'Office', 'OpenHouse', 'PostalCode')),
  last_mod timestamptz,
  last_run timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mls_sync_state ENABLE ROW LEVEL SECURITY;

-- Service role can manage sync state
CREATE POLICY "Service role can manage sync state"
ON public.mls_sync_state
FOR ALL
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

-- Admins can read sync state
CREATE POLICY "Admins can read sync state"
ON public.mls_sync_state
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add indexes for common queries on existing tables
CREATE INDEX IF NOT EXISTS idx_mls_listings_status ON public.mls_listings(standard_status) WHERE standard_status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mls_listings_city ON public.mls_listings(city) WHERE city IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mls_listings_modtime ON public.mls_listings(modification_timestamp DESC NULLS LAST) WHERE modification_timestamp IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mls_listings_price ON public.mls_listings(list_price) WHERE list_price IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mls_listings_rf_modtime ON public.mls_listings(rf_modification_timestamp DESC NULLS LAST) WHERE rf_modification_timestamp IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_mls_members_office ON public.mls_members(office_key) WHERE office_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mls_members_modtime ON public.mls_members(modification_timestamp DESC NULLS LAST) WHERE modification_timestamp IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_mls_offices_modtime ON public.mls_offices(modification_timestamp DESC NULLS LAST) WHERE modification_timestamp IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mls_offices_city ON public.mls_offices(office_city) WHERE office_city IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_mls_open_houses_date ON public.mls_open_houses(open_house_date) WHERE open_house_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mls_open_houses_listing ON public.mls_open_houses(listing_key) WHERE listing_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mls_open_houses_modtime ON public.mls_open_houses(modification_timestamp DESC NULLS LAST) WHERE modification_timestamp IS NOT NULL;

-- Update trigger for mls_sync_state
CREATE OR REPLACE FUNCTION public.update_mls_sync_state_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_mls_sync_state_updated_at
BEFORE UPDATE ON public.mls_sync_state
FOR EACH ROW
EXECUTE FUNCTION public.update_mls_sync_state_updated_at();