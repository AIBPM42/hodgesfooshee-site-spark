-- CRITICAL FIX: Disable RLS on auth.users table
-- RLS should NEVER be enabled on auth.users - it blocks Supabase Auth service

-- This must run with elevated privileges
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;
