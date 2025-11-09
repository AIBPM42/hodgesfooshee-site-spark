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
