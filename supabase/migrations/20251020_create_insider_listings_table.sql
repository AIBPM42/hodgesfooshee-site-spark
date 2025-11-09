-- Create insider_listings table for Manus data synced via n8n
-- This table stores exclusive/coming-soon/off-market listings
-- Data is populated by n8n workflow from Manus

CREATE TABLE IF NOT EXISTS public.insider_listings (
  id TEXT PRIMARY KEY,
  tag TEXT NOT NULL CHECK (tag IN ('EXCLUSIVE', 'COMING SOON', 'OFF-MARKET')),
  title TEXT NOT NULL,
  subtitle TEXT,
  stat_left_label TEXT NOT NULL,
  stat_left_value TEXT NOT NULL,
  stat_right_label TEXT NOT NULL,
  stat_right_value TEXT NOT NULL,
  image TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for active listings query
CREATE INDEX IF NOT EXISTS idx_insider_listings_active_sort
  ON public.insider_listings(is_active, sort_order)
  WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.insider_listings ENABLE ROW LEVEL SECURITY;

-- Public read access (for homepage)
CREATE POLICY "insider_listings_public_read"
  ON public.insider_listings
  FOR SELECT
  USING (is_active = true);

-- Service role full access (for n8n workflow)
CREATE POLICY "insider_listings_service_role_all"
  ON public.insider_listings
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_insider_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insider_listings_updated_at
  BEFORE UPDATE ON public.insider_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_insider_listings_updated_at();

-- Add comment
COMMENT ON TABLE public.insider_listings IS 'Exclusive property listings synced from Manus via n8n workflow';
