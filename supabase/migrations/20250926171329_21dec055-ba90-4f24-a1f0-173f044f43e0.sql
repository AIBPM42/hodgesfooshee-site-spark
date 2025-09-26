-- Set up cron jobs for automated sync
-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule token refresh every 25 minutes with 3-minute jitter
SELECT cron.schedule(
  'realtyna-token-refresh',
  '*/25 * * * *',
  $$
  SELECT net.http_post(
    url:='https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/realtyna-refresh',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg"}'::jsonb
  );
  $$
);

-- Schedule MLS listings sync every 15 minutes
SELECT cron.schedule(
  'sync-mls-listings',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url:='https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/sync_realtyna',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg"}'::jsonb
  );
  $$
);

-- Schedule open houses sync every hour
SELECT cron.schedule(
  'sync-open-houses',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url:='https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/sync_openhouses',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg"}'::jsonb
  );
  $$
);

-- Schedule members and offices sync every 12 hours
SELECT cron.schedule(
  'sync-members-offices',
  '0 */12 * * *',
  $$
  SELECT net.http_post(
    url:='https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/sync_members',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg"}'::jsonb
  );
  
  SELECT net.http_post(
    url:='https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/sync_offices',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg"}'::jsonb
  );
  $$
);

-- Schedule postal codes sync weekly
SELECT cron.schedule(
  'sync-postal-codes',
  '0 2 * * 0',
  $$
  SELECT net.http_post(
    url:='https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/sync_postalcodes',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MDEwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg"}'::jsonb
  );
  $$
);