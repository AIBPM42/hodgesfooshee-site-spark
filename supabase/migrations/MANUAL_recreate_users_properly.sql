-- Properly recreate test users using Supabase's auth functions
-- This ensures correct instance_id and other auth metadata
-- Run this in Supabase SQL Editor

-- IMPORTANT: First, manually delete the existing test users in Supabase Dashboard
-- Go to: Authentication > Users > Delete each test user
-- Then run this script

-- Create admin user
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create user via auth.users (Supabase will set correct instance_id)
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    'admin@hodgesfooshee.com',
    crypt('Admin123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false,
    'authenticated'
  )
  RETURNING id INTO new_user_id;

  -- Create profile
  INSERT INTO profiles (
    id,
    email,
    role,
    status,
    first_name,
    last_name,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'admin@hodgesfooshee.com',
    'super_admin',
    'active',
    'Hodges',
    'Fooshee',
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Created admin user with ID: %', new_user_id;
END $$;

-- Create agent user
DO $$
DECLARE
  new_user_id uuid;
  new_agent_profile_id uuid;
BEGIN
  -- Create user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    'testagent@hodgesfooshee.com',
    crypt('Agent123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false,
    'authenticated'
  )
  RETURNING id INTO new_user_id;

  -- Create profile
  INSERT INTO profiles (
    id,
    email,
    role,
    status,
    first_name,
    last_name,
    phone,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'testagent@hodgesfooshee.com',
    'agent',
    'active',
    'Jane',
    'Smith',
    '(615) 555-0100',
    NOW(),
    NOW()
  );

  -- Create agent profile with MLS integration
  INSERT INTO agent_profiles (
    user_id,
    mls_member_key,
    mls_member_id,
    office_key,
    office_name,
    photo_url,
    designations,
    last_mls_sync,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'TEST-MOCK-001',
    'AGENT001',
    'OFFICE-TEST-001',
    'Hodges & Fooshee Realty',
    'https://ui-avatars.com/api/?name=Jane+Smith&size=400&background=E87722&color=fff&bold=true',
    'ABR, GRI, CRS',
    NOW(),
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Created agent user with ID: %', new_user_id;
END $$;

-- Create buyer user
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    'buyer@test.com',
    crypt('Buyer123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false,
    'authenticated'
  )
  RETURNING id INTO new_user_id;

  -- Create profile
  INSERT INTO profiles (
    id,
    email,
    role,
    status,
    first_name,
    last_name,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'buyer@test.com',
    'public_user',
    'active',
    'Test',
    'Buyer',
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Created buyer user with ID: %', new_user_id;
END $$;

-- Verify all users
SELECT
  u.id,
  u.email,
  u.instance_id,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  p.role,
  p.first_name,
  p.last_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN ('admin@hodgesfooshee.com', 'testagent@hodgesfooshee.com', 'buyer@test.com')
ORDER BY u.email;
