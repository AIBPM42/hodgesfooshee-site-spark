-- Restore essential RLS policies for authentication to work
-- We removed ALL policies earlier, but some are required for auth lookups

-- First, ensure RLS is enabled on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Essential policy: Users can read their own profile
-- This is REQUIRED for AuthProvider to load the profile after login
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Essential policy: Service role can do everything (for Admin API)
DROP POLICY IF EXISTS "Service role has full access" ON profiles;
CREATE POLICY "Service role has full access"
  ON profiles
  FOR ALL
  USING (auth.role() = 'service_role');

-- Allow anon to read basic public profiles (needed for public pages)
DROP POLICY IF EXISTS "Public profiles are viewable" ON profiles;
CREATE POLICY "Public profiles are viewable"
  ON profiles
  FOR SELECT
  USING (status = 'active' AND role IN ('agent', 'public_user'));

-- Verify policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles::text,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
