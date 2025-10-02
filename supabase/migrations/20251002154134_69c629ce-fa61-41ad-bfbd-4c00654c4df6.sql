-- Create integration_settings table for storing API credentials and configuration
CREATE TABLE IF NOT EXISTS public.integration_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write integration settings
CREATE POLICY "Admins can manage integration settings"
ON public.integration_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create mls_sync_cursor table for tracking incremental sync progress
CREATE TABLE IF NOT EXISTS public.mls_sync_cursor (
  resource text PRIMARY KEY,
  last_rf_modification_timestamp timestamptz NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mls_sync_cursor ENABLE ROW LEVEL SECURITY;

-- Service role and admins can manage sync cursors
CREATE POLICY "Service role can manage sync cursors"
ON public.mls_sync_cursor
FOR ALL
USING (auth.role() = 'service_role'::text);

CREATE POLICY "Admins can read sync cursors"
ON public.mls_sync_cursor
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed initial cursor timestamps
INSERT INTO public.mls_sync_cursor (resource, last_rf_modification_timestamp) VALUES
  ('Property', '2020-01-01'::timestamptz),
  ('Member', '2020-01-01'::timestamptz),
  ('Office', '2020-01-01'::timestamptz),
  ('OpenHouse', '2020-01-01'::timestamptz)
ON CONFLICT (resource) DO NOTHING;