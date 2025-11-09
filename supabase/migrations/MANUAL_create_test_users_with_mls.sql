-- ⚠️ MANUAL EXECUTION ONLY ⚠️
-- Creates test users with proper Realtyna MLS integration structure
--
-- Run this AFTER:
-- 1. Running the schema migration (20251017_add_mls_fields_to_agent_profiles.sql)
-- 2. Cleaning up old test data (if needed)
--
-- TO RUN: Copy and paste into Supabase SQL Editor

BEGIN;

-- ==================================================
-- 1. SUPER ADMIN (Broker/Owner)
-- ==================================================
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@hodgesfooshee.com') THEN
    RAISE NOTICE 'Admin user already exists, skipping';
  ELSE
    -- Create auth user
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
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@hodgesfooshee.com',
      crypt('adminpass123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Hodges Fooshee"}',
      false,
      '',
      ''
    ) RETURNING id INTO admin_user_id;

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
      admin_user_id,
      'admin@hodgesfooshee.com',
      'super_admin',
      'active',
      'Hodges',
      'Fooshee',
      NOW(),
      NOW()
    );

    RAISE NOTICE 'Created admin user: admin@hodgesfooshee.com';
  END IF;
END $$;

-- ==================================================
-- 2. TEST AGENT (with mock MLS integration)
-- ==================================================
DO $$
DECLARE
  agent_user_id UUID;
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'agent@hodgesfooshee.com') THEN
    RAISE NOTICE 'Agent user already exists, skipping';
  ELSE
    -- Create auth user
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
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'agent@hodgesfooshee.com',
      crypt('agentpass123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Jane Smith"}',
      false,
      '',
      ''
    ) RETURNING id INTO agent_user_id;

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
      agent_user_id,
      'agent@hodgesfooshee.com',
      'agent',
      'active',
      'Jane',
      'Smith',
      '(615) 555-0100',
      NOW(),
      NOW()
    );

    -- Create agent profile WITH Realtyna MLS fields
    INSERT INTO agent_profiles (
      id,
      user_id,
      license_number,
      bio,
      specialties,
      areas_served,
      years_experience,
      languages,
      certifications,
      social_links,
      office_location,
      is_featured,
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
      gen_random_uuid(),
      agent_user_id,
      'TN-12345-TEST',
      'Experienced real estate agent specializing in Nashville residential properties.',
      ARRAY['Residential', 'First-Time Buyers', 'Luxury Homes'],
      ARRAY['Nashville', 'Franklin', 'Brentwood'],
      5,
      ARRAY['English', 'Spanish'],
      ARRAY['ABR', 'GRI'],
      '{"linkedin": "https://linkedin.com/in/janesmith", "facebook": "https://facebook.com/janesmith"}'::jsonb,
      'Downtown Nashville',
      true,
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

    RAISE NOTICE 'Created agent user: agent@hodgesfooshee.com';
  END IF;
END $$;

-- ==================================================
-- 3. PUBLIC USER (Buyer/Seller)
-- ==================================================
DO $$
DECLARE
  public_user_id UUID;
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'buyer@test.com') THEN
    RAISE NOTICE 'Buyer user already exists, skipping';
  ELSE
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
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'buyer@test.com',
      crypt('buyerpass123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"John Buyer"}',
      false,
      '',
      ''
    ) RETURNING id INTO public_user_id;

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
      public_user_id,
      'buyer@test.com',
      'public_user',
      'active',
      'John',
      'Buyer',
      NOW(),
      NOW()
    );

    RAISE NOTICE 'Created buyer user: buyer@test.com';
  END IF;
END $$;

COMMIT;

-- ==================================================
-- VERIFY USERS CREATED
-- ==================================================
SELECT
  u.email,
  p.role,
  p.status,
  p.first_name,
  p.last_name,
  CASE
    WHEN ap.mls_member_key IS NOT NULL THEN 'Has MLS integration'
    ELSE 'No MLS data'
  END as mls_status
FROM auth.users u
JOIN profiles p ON u.id = p.id
LEFT JOIN agent_profiles ap ON u.id = ap.user_id
WHERE u.email IN ('admin@hodgesfooshee.com', 'agent@hodgesfooshee.com', 'buyer@test.com')
ORDER BY p.role DESC;
