-- Fix authentication 500 error
-- This addresses the "Database error querying schema" issue

-- STEP 1: Ensure auth.users has NO RLS (it should be managed by Supabase internally)
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- STEP 2: Remove any policies on auth.users (there should be none)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'auth' AND tablename = 'users'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON auth.users', pol.policyname);
    RAISE NOTICE 'Dropped policy: %', pol.policyname;
  END LOOP;
END $$;

-- STEP 3: Ensure profiles table has proper RLS for auth to work
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role has full access" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;

-- Create minimal, safe policies for auth to work
-- Policy 1: Users can read their own profile (REQUIRED for AuthProvider)
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Service role has full access (REQUIRED for Admin API)
CREATE POLICY "Service role has full access"
  ON profiles
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy 3: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy 4: Allow user creation during signup
CREATE POLICY "Enable insert for authenticated users during signup"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- STEP 4: Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT SELECT ON auth.users TO anon, authenticated;

-- STEP 5: Check for any problematic triggers
-- List all triggers on profiles that might interfere
SELECT
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'profiles'
ORDER BY trigger_name;

-- STEP 6: Verify the fix
SELECT
  'auth.users RLS' as check_name,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'auth' AND tablename = 'users'

UNION ALL

SELECT
  'profiles RLS' as check_name,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Should show: auth.users RLS = false, profiles RLS = true
