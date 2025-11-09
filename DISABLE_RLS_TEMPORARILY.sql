-- =====================================================
-- Temporarily Disable RLS on Profiles for Registration
-- (We'll re-enable it after you create your account)
-- =====================================================

-- Disable RLS on profiles table
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Check if it's disabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles' AND schemaname = 'public';
