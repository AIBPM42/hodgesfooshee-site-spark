-- Create scheduled function for MLS sync every 4 hours
-- Note: This will be created disabled by default. To enable:
-- SELECT cron.schedule('mls-sync-auto', '0 */4 * * *', 'SELECT net.http_post(url:=''https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/sync-mls-data'', headers:=''{"Content-Type": "application/json", "Authorization": "Bearer ' || (SELECT value FROM secrets.decrypted_secrets WHERE name = ''SUPABASE_SERVICE_ROLE_KEY'') || '", "x-run-source": "schedule"}''::jsonb, body:=''{}''::jsonb);');

-- For now, just create a comment to document the schedule command
-- The user can enable this manually when ready
COMMENT ON SCHEMA public IS 'MLS Auto-sync schedule command (disabled): SELECT cron.schedule(''mls-sync-auto'', ''0 */4 * * *'', ''SELECT net.http_post(url:=''''https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/sync-mls-data'''', headers:=''''{"Content-Type": "application/json", "Authorization": "Bearer SERVICE_ROLE_KEY", "x-run-source": "schedule"}''''::jsonb, body:=''''{}''''::jsonb);'');';