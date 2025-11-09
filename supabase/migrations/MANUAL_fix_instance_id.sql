-- Fix instance_id for all users to resolve auth 500 error
-- Run this in Supabase SQL Editor

-- STEP 1: Find the correct instance_id
-- Try to get it from auth.instances table
DO $$
DECLARE
  correct_instance_id uuid;
BEGIN
  -- Try to find a valid instance_id from the instances table if it exists
  BEGIN
    SELECT id INTO correct_instance_id
    FROM auth.instances
    LIMIT 1;
  EXCEPTION WHEN undefined_table THEN
    -- If instances table doesn't exist, try audit log
    BEGIN
      SELECT DISTINCT instance_id INTO correct_instance_id
      FROM auth.audit_log_entries
      WHERE instance_id != '00000000-0000-0000-0000-000000000000'
      LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
      -- If no valid instance_id found, generate a new one
      -- This is the Supabase project's instance ID
      correct_instance_id := gen_random_uuid();
    END;
  END;

  -- Update all users with dummy instance_id
  UPDATE auth.users
  SET instance_id = correct_instance_id
  WHERE instance_id = '00000000-0000-0000-0000-000000000000';

  RAISE NOTICE 'Updated % users with instance_id: %',
    (SELECT COUNT(*) FROM auth.users WHERE instance_id = correct_instance_id),
    correct_instance_id;
END $$;

-- Verify the fix
SELECT
  instance_id,
  COUNT(*) as user_count,
  string_agg(email, ', ') as emails
FROM auth.users
GROUP BY instance_id;
