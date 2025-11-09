-- Check existing users in auth.users
SELECT
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- Check existing profiles
SELECT
  id,
  email,
  role,
  status,
  first_name,
  last_name
FROM public.profiles
ORDER BY created_at DESC;
