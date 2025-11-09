-- Migration: Recreate test users with proper Supabase auth
-- This fixes the instance_id and password hash issues

-- Step 1: Clean up existing test users
DELETE FROM auth.users WHERE email IN ('admin@test.com', 'agent@test.com', 'buyer@test.com');
DELETE FROM public.profiles WHERE email IN ('admin@test.com', 'agent@test.com', 'buyer@test.com');

-- Step 2: Create test users using Supabase auth.users structure
-- NOTE: These should ideally be created via Supabase Dashboard or Admin API
-- But for migration purposes, we'll use proper instance_id

-- Get the current instance_id from auth.instances
DO $$
DECLARE
  v_instance_id uuid;
BEGIN
  SELECT id INTO v_instance_id FROM auth.instances LIMIT 1;

  -- Create admin user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_current,
    email_change_token_new
  ) VALUES (
    v_instance_id,
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@test.com',
    crypt('TestAdmin123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- Create agent user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_current,
    email_change_token_new
  ) VALUES (
    v_instance_id,
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'agent@test.com',
    crypt('TestAgent123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- Create buyer user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_current,
    email_change_token_new
  ) VALUES (
    v_instance_id,
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'buyer@test.com',
    crypt('TestBuyer123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );
END $$;

-- Step 3: Create corresponding profiles
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
ON CONFLICT (id) DO NOTHING;

-- Step 4: Create agent profile for test agent
INSERT INTO public.agent_profiles (
  user_id,
  license_number,
  bio,
  years_experience,
  mls_member_key,
  mls_member_id
)
SELECT
  p.id,
  'TEST-LIC-001',
  'Test agent for development and testing',
  5,
  'TEST-AGENT-001',
  'TESTAGENT001'
FROM public.profiles p
WHERE p.email = 'agent@test.com'
ON CONFLICT (user_id) DO NOTHING;
