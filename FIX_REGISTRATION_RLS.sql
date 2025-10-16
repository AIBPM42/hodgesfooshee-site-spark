-- =====================================================
-- Keep RLS Disabled for Now (Development Mode)
-- We'll add proper policies later
-- =====================================================

-- Confirm RLS is disabled
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Check status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles' AND schemaname = 'public';

-- This should show: rowsecurity = false
