-- Enable required extensions for cron scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create scheduled job for sync_realtyna every 10 minutes
SELECT cron.schedule(
  'sync_realtyna_10m',
  '*/10 * * * *', -- every 10 minutes
  $$
  SELECT
    net.http_post(
        url:='https://xhqwmtzawqfffepcqxwf.functions.supabase.co/sync_realtyna',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg"}'::jsonb,
        body:='{"scheduled": true, "jitter_s": 120, "timeout_s": 120}'::jsonb,
        timeout_milliseconds:=120000
    ) as request_id;
  $$
);

-- Verify the job was created
SELECT jobname, schedule, command FROM cron.job WHERE jobname = 'sync_realtyna_10m';