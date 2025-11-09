-- COMPREHENSIVE AUTH DIAGNOSTIC
-- Run this in your Supabase SQL Editor to diagnose auth issues

-- Check 1: Verify auth.users RLS is DISABLED (should be false)
SELECT
  'auth.users RLS status' as check_name,
  CASE WHEN rowsecurity THEN '❌ ENABLED (BAD)' ELSE '✅ DISABLED (GOOD)' END as status
FROM pg_tables
WHERE schemaname = 'auth' AND tablename = 'users';

-- Check 2: Verify profiles RLS is ENABLED (should be true)
SELECT
  'profiles RLS status' as check_name,
  CASE WHEN rowsecurity THEN '✅ ENABLED (GOOD)' ELSE '❌ DISABLED (BAD)' END as status
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Check 3: Check for NULL email_change values (should be 0)
SELECT
  'NULL email_change count' as check_name,
  COUNT(*) FILTER (WHERE email_change IS NULL)::text || ' users' as status
FROM auth.users;

-- Check 4: List all policies on auth.users (should be empty)
SELECT
  'Policies on auth.users' as check_name,
  COALESCE(string_agg(policyname, ', '), '✅ None (GOOD)') as status
FROM pg_policies
WHERE schemaname = 'auth' AND tablename = 'users';

-- Check 5: List all policies on profiles
SELECT
  'Policies on profiles' as check_name,
  string_agg(policyname || ' (' || cmd || ')', E'\n') as status
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
GROUP BY check_name;

-- Check 6: Verify users and profiles exist
SELECT
  'User/Profile count' as check_name,
  (SELECT COUNT(*)::text FROM auth.users) || ' users, ' ||
  (SELECT COUNT(*)::text FROM profiles) || ' profiles' as status;

-- Check 7: Check for users WITHOUT profiles (orphaned users)
SELECT
  'Users without profiles' as check_name,
  COUNT(*)::text || ' orphaned users' as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Check 8: Sample a user to see their data structure
SELECT
  'Sample user data' as check_name,
  jsonb_build_object(
    'id', id,
    'email', email,
    'email_confirmed', email_confirmed_at IS NOT NULL,
    'has_profile', EXISTS(SELECT 1 FROM profiles WHERE profiles.id = auth.users.id)
  )::text as status
FROM auth.users
LIMIT 1;

-- Check 9: Check for any triggers that might interfere
SELECT
  'Triggers on profiles' as check_name,
  COALESCE(string_agg(trigger_name, ', '), '✅ None') as status
FROM information_schema.triggers
WHERE event_object_table = 'profiles';

-- Check 10: Verify service role grants
SELECT
  'Service role grants' as check_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.role_table_grants
      WHERE grantee = 'service_role' AND table_name = 'profiles'
    )
    THEN '✅ Has grants'
    ELSE '❌ Missing grants'
  END as status;
