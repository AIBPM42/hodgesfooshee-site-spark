-- ⚠️ MANUAL EXECUTION ONLY - DO NOT AUTO-RUN ⚠️
-- This script deletes test data to prepare for Realtyna MLS integration
--
-- BEFORE RUNNING:
-- 1. Backup your database: https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/database/backups
-- 2. Review what will be deleted
-- 3. Make sure you're not in production
--
-- TO RUN: Copy and paste into Supabase SQL Editor manually

-- ==================================================
-- OPTION A: Delete ONLY test users (SAFER)
-- ==================================================

BEGIN;

-- List what will be deleted (REVIEW THIS OUTPUT FIRST!)
SELECT 'Will delete these users:' as action;
SELECT id, email, created_at FROM auth.users
WHERE email LIKE '%test%' OR email LIKE '%@test.com';

-- Uncomment below to actually delete (after reviewing above)
/*
DELETE FROM agent_profiles WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email LIKE '%test%' OR email LIKE '%@test.com'
);

DELETE FROM profiles WHERE id IN (
  SELECT id FROM auth.users
  WHERE email LIKE '%test%' OR email LIKE '%@test.com'
);

DELETE FROM auth.users
WHERE email LIKE '%test%' OR email LIKE '%@test.com';
*/

ROLLBACK;  -- Change to COMMIT when ready

-- ==================================================
-- OPTION B: Complete wipe (DANGEROUS - DELETES EVERYTHING)
-- ==================================================

-- Uncomment ONLY if you want to start completely fresh
/*
BEGIN;

TRUNCATE agent_profiles CASCADE;
TRUNCATE profiles CASCADE;
DELETE FROM auth.users;

COMMIT;
*/
