-- Create helper function to get sync counts
CREATE OR REPLACE FUNCTION public.get_sync_counts()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'listings', (SELECT count(*) FROM mls_listings),
    'members', (SELECT count(*) FROM mls_members), 
    'offices', (SELECT count(*) FROM mls_offices),
    'openhouses', (SELECT count(*) FROM mls_open_houses),
    'postalcodes', (SELECT count(*) FROM mls_postal_codes),
    'active_listings', (SELECT count(*) FROM mls_listings WHERE standard_status = 'Active'),
    'recent_listings', (SELECT count(*) FROM mls_listings WHERE modification_timestamp > now() - interval '7 days')
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Create sync log table for tracking
CREATE TABLE IF NOT EXISTS public.sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name text NOT NULL,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  success boolean DEFAULT false,
  error_message text,
  records_processed integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.sync_log ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage sync logs
CREATE POLICY "Service role can manage sync logs"
ON public.sync_log
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Allow public read access to sync status
CREATE POLICY "Public can read sync status"
ON public.sync_log
FOR SELECT
USING (true);