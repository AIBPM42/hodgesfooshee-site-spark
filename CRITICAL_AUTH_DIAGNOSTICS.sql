-- CRITICAL: Run these queries one by one in Supabase SQL Editor
-- Copy the results of each query

-- 1. Test if we can read from auth.users at all
SELECT COUNT(*) as total_users FROM auth.users;

-- 2. Test reading a specific user
SELECT
  id,
  email,
  encrypted_password IS NOT NULL as has_password,
  email_confirmed_at IS NOT NULL as email_confirmed
FROM auth.users
WHERE email = 'admin@hodgesfooshee.com';

-- 3. Check if RLS is blocking auth.users (it shouldn't be)
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'auth'
  AND tablename = 'users';

-- 4. Check for any policies on auth.users (should be NONE)
SELECT
  policyname,
  cmd,
  roles::text
FROM pg_policies
WHERE schemaname = 'auth'
  AND tablename = 'users';

-- 5. Test password verification
SELECT
  email,
  encrypted_password = crypt('Admin123!', encrypted_password) as password_matches
FROM auth.users
WHERE email = 'admin@hodgesfooshee.com';

-- 6. Check auth.users permissions
SELECT
  grantee,
  string_agg(privilege_type, ', ') as privileges
FROM information_schema.role_table_grants
WHERE table_schema = 'auth'
  AND table_name = 'users'
GROUP BY grantee
ORDER BY grantee;

-- 7. Check if profiles table RLS is too restrictive
SELECT
  policyname,
  cmd,
  qual::text as using_clause,
  with_check::text as with_check_clause
FROM pg_policies
WHERE tablename = 'profiles';
