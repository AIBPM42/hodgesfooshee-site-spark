-- Diagnostic: Check for triggers and functions on auth.users
-- Based on Supabase support: "A database trigger or functions tight to your auth.users table"

-- 1. Check all triggers on auth.users
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND event_object_table = 'users'
ORDER BY trigger_name;

-- 2. Check functions that reference auth.users
SELECT
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE pg_get_functiondef(p.oid) ILIKE '%auth.users%'
  AND n.nspname = 'public'
ORDER BY schema_name, function_name;

-- 3. Check RLS policies that reference auth.users or auth.uid()
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND (qual::text ILIKE '%auth.%' OR with_check::text ILIKE '%auth.%')
ORDER BY tablename, policyname;

-- 4. Check for profile creation trigger (common pattern)
SELECT
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname ILIKE '%profile%'
  AND pg_get_functiondef(p.oid) ILIKE '%auth.users%'
ORDER BY function_name;

-- 5. Check current auth.users for any problematic NULL values
SELECT
  id,
  email,
  CASE WHEN email_change IS NULL THEN 'NULL' ELSE 'OK' END as email_change_status,
  CASE WHEN email_change_token_current IS NULL THEN 'NULL' ELSE 'OK' END as token_current_status,
  CASE WHEN email_change_token_new IS NULL THEN 'NULL' ELSE 'OK' END as token_new_status,
  CASE WHEN confirmation_token IS NULL THEN 'NULL' ELSE 'OK' END as confirmation_status,
  CASE WHEN recovery_token IS NULL THEN 'NULL' ELSE 'OK' END as recovery_status
FROM auth.users
ORDER BY email;
