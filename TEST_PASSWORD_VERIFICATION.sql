-- Test if password hashing works correctly
-- Run in Supabase SQL Editor

-- Test password verification for our test users
SELECT
  email,
  -- Test if the stored hash matches the password
  encrypted_password = crypt('Admin123!', encrypted_password) as admin_password_matches,
  encrypted_password = crypt('Agent123!', encrypted_password) as agent_password_matches,
  encrypted_password = crypt('Buyer123!', encrypted_password) as buyer_password_matches,
  encrypted_password = crypt('Test123!', encrypted_password) as test_password_matches,
  -- Show hash format
  LEFT(encrypted_password, 4) as hash_prefix,
  LENGTH(encrypted_password) as hash_length
FROM auth.users
WHERE email IN (
  'admin@hodgesfooshee.com',
  'testagent@hodgesfooshee.com',
  'buyer@test.com',
  'newtest@test.com'
)
ORDER BY email;

-- Also check raw_app_meta_data and raw_user_meta_data
SELECT
  email,
  raw_app_meta_data::text as app_metadata,
  raw_user_meta_data::text as user_metadata,
  aud,
  role,
  confirmed_at,
  email_confirmed_at
FROM auth.users
WHERE email IN (
  'admin@hodgesfooshee.com',
  'newtest@test.com'
)
ORDER BY email;
