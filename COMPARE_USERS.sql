-- Compare Dashboard-created user vs SQL-created user
-- Run in Supabase SQL Editor

-- 1. Check password hash format
SELECT
  email,
  LEFT(encrypted_password, 7) as hash_type,
  LENGTH(encrypted_password) as hash_length,
  (encrypted_password LIKE '$2a$%' OR encrypted_password LIKE '$2b$%' OR encrypted_password LIKE '$2y$%') as is_bcrypt
FROM auth.users
WHERE email IN ('newtest@test.com', 'admin@hodgesfooshee.com')
ORDER BY email;

-- 2. Compare all key auth fields
SELECT
  email,
  instance_id,
  aud,
  role,
  email_confirmed_at IS NOT NULL as email_confirmed,
  confirmation_token IS NULL as no_pending_confirmation,
  raw_app_meta_data::text as app_metadata,
  raw_user_meta_data::text as user_metadata,
  is_super_admin,
  created_at,
  updated_at,
  banned_until IS NULL as not_banned,
  deleted_at IS NULL as not_deleted
FROM auth.users
WHERE email IN ('newtest@test.com', 'admin@hodgesfooshee.com', 'testagent@hodgesfooshee.com')
ORDER BY email;

-- 3. Test if password hash validates correctly
SELECT
  email,
  encrypted_password = crypt('Admin123!', encrypted_password) as admin_password_valid,
  encrypted_password = crypt('Test123!', encrypted_password) as test_password_valid
FROM auth.users
WHERE email IN ('admin@hodgesfooshee.com', 'newtest@test.com');

-- 4. Check for any RLS policies on auth schema
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles::text,
  cmd,
  LEFT(qual::text, 100) as qual_preview
FROM pg_policies
WHERE schemaname = 'auth'
ORDER BY tablename, policyname;
