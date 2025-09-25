-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension if not already enabled  
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job to sync Realtyna data every 30 minutes
SELECT cron.schedule(
  'sync-realtyna-listings',
  '*/30 * * * *', -- every 30 minutes
  $$
  SELECT
    net.http_post(
        url:='https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/sync_realtyna',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDYwNDA4MSwiZXhwIjoyMDcwMTgwMDgxfQ.bG-3rRLLxEg23DrcLTY8kTGWWsKRDASNJE_L5qdz3xw"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);