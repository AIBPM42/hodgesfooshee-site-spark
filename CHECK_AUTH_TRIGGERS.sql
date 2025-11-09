-- Check for any triggers or functions that might interfere with auth
-- Run in Supabase SQL Editor

-- 1. Check all triggers on auth.users table
SELECT
  t.tgname as trigger_name,
  c.relname as table_name,
  p.proname as function_name,
  t.tgenabled as enabled,
  CASE t.tgtype::integer & 66
    WHEN 2 THEN 'BEFORE'
    WHEN 64 THEN 'INSTEAD OF'
    ELSE 'AFTER'
  END as trigger_type,
  CASE t.tgtype::integer & 28
    WHEN 4 THEN 'INSERT'
    WHEN 8 THEN 'DELETE'
    WHEN 16 THEN 'UPDATE'
    WHEN 20 THEN 'INSERT OR UPDATE'
    WHEN 24 THEN 'UPDATE OR DELETE'
    WHEN 28 THEN 'INSERT OR UPDATE OR DELETE'
    ELSE 'UNKNOWN'
  END as trigger_event
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth'
  AND c.relname = 'users'
  AND NOT t.tgisinternal
ORDER BY t.tgname;

-- 2. Check if auth.users has RLS enabled (it shouldn't)
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'auth'
  AND tablename = 'users';

-- 3. Check for any policies on auth.users (shouldn't exist)
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual::text as using_expression
FROM pg_policies
WHERE schemaname = 'auth'
  AND tablename = 'users';

-- 4. Check auth.users table permissions
SELECT
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'auth'
  AND table_name = 'users'
ORDER BY grantee, privilege_type;

-- 5. Try a direct auth lookup to see what error we get
-- This mimics what Supabase Auth does internally
DO $$
DECLARE
  test_user RECORD;
BEGIN
  -- Try to select user like auth service would
  SELECT * INTO test_user
  FROM auth.users
  WHERE email = 'admin@hodgesfooshee.com'
  LIMIT 1;

  IF FOUND THEN
    RAISE NOTICE 'User found: %', test_user.email;
    RAISE NOTICE 'Instance ID: %', test_user.instance_id;
    RAISE NOTICE 'Email confirmed: %', test_user.email_confirmed_at IS NOT NULL;
    RAISE NOTICE 'Has password: %', test_user.encrypted_password IS NOT NULL;
  ELSE
    RAISE NOTICE 'User not found';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error during lookup: %', SQLERRM;
  RAISE NOTICE 'Error detail: %', SQLSTATE;
END $$;
