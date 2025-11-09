-- Check if profiles exist for test users
SELECT
  u.id,
  u.email,
  p.id as profile_id,
  p.role,
  p.status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN ('admin@test.com', 'agent@test.com', 'buyer@test.com')
ORDER BY u.email;

-- If profiles are missing, create them
INSERT INTO public.profiles (id, email, role, status, first_name, last_name)
SELECT
  u.id,
  u.email,
  CASE
    WHEN u.email = 'admin@test.com' THEN 'super_admin'
    WHEN u.email = 'agent@test.com' THEN 'agent'
    WHEN u.email = 'buyer@test.com' THEN 'public_user'
  END::text,
  'active',
  CASE
    WHEN u.email = 'admin@test.com' THEN 'Test'
    WHEN u.email = 'agent@test.com' THEN 'Test'
    WHEN u.email = 'buyer@test.com' THEN 'Test'
  END,
  CASE
    WHEN u.email = 'admin@test.com' THEN 'Admin'
    WHEN u.email = 'agent@test.com' THEN 'Agent'
    WHEN u.email = 'buyer@test.com' THEN 'Buyer'
  END
FROM auth.users u
WHERE u.email IN ('admin@test.com', 'agent@test.com', 'buyer@test.com')
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );

-- Verify the fix
SELECT
  u.id,
  u.email,
  p.role,
  p.status,
  p.first_name,
  p.last_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN ('admin@test.com', 'agent@test.com', 'buyer@test.com')
ORDER BY u.email;
