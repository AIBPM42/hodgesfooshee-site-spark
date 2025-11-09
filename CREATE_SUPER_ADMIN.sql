-- =====================================================
-- Create Super Admin Account
-- Run this ONCE to create your super_admin account
-- =====================================================

-- INSTRUCTIONS:
-- 1. First, register a regular account at http://localhost:3000/register
--    Use your real email and password (you'll need these to login)
-- 2. Copy the user ID from the auth.users table (see below)
-- 3. Replace 'YOUR_USER_ID_HERE' with your actual UUID
-- 4. Replace 'your@email.com' with your actual email
-- 5. Run this script in Supabase SQL Editor

-- To find your user ID after registering:
-- SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 1;

-- Update the profile to super_admin
UPDATE public.profiles
SET
  role = 'super_admin',
  status = 'active'
WHERE email = 'your@email.com';

-- Verify it worked:
SELECT id, email, role, status, first_name, last_name
FROM public.profiles
WHERE role = 'super_admin';
