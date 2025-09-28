-- Extend sync_log table for MLS sync tracking
ALTER TABLE public.sync_log 
ADD COLUMN IF NOT EXISTS fetched INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS inserted INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS run_source TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS triggered_by UUID;

-- Rename error_message to message for broader use
ALTER TABLE public.sync_log 
RENAME COLUMN error_message TO message;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS sync_log_started_at_desc_idx ON public.sync_log (started_at DESC);

-- Update RLS policies for admin-only access
DROP POLICY IF EXISTS "Public can read sync status" ON public.sync_log;
DROP POLICY IF EXISTS "Service role can manage sync logs" ON public.sync_log;

-- Create new RLS policies
CREATE POLICY "admins_can_read_sync_logs" ON public.sync_log
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "service_role_can_manage_sync_logs" ON public.sync_log
  FOR ALL
  USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);