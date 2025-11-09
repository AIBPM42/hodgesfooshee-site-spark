-- Check password hashing for test users
-- Run this in Supabase SQL Editor

-- Check if passwords are properly encrypted
SELECT
  email,
  LENGTH(encrypted_password) as password_length,
  LEFT(encrypted_password, 4) as hash_prefix,
  email_confirmed_at IS NOT NULL as email_confirmed,
  confirmation_token IS NULL as confirmation_done,
  deleted_at IS NULL as not_deleted,
  banned_until IS NULL as not_banned,
  aud,
  role as auth_role
FROM auth.users
WHERE email IN (
  'admin@hodgesfooshee.com',
  'testagent@hodgesfooshee.com',
  'buyer@test.com',
  'newtest@test.com'
)
ORDER BY email;

-- Compare with the Dashboard-created user
SELECT
  'Dashboard vs SQL created' as comparison,
  u1.email as dashboard_user,
  u2.email as sql_user,
  u1.encrypted_password = u2.encrypted_password as same_password,
  LENGTH(u1.encrypted_password) as dashboard_pwd_len,
  LENGTH(u2.encrypted_password) as sql_pwd_len,
  LEFT(u1.encrypted_password, 10) as dashboard_pwd_prefix,
  LEFT(u2.encrypted_password, 10) as sql_pwd_prefix
FROM auth.users u1
CROSS JOIN auth.users u2
WHERE u1.email = 'newtest@test.com'
  AND u2.email = 'admin@hodgesfooshee.com';
