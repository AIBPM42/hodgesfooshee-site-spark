-- Check Supabase Auth configuration
-- Run this in Supabase SQL Editor to diagnose the instance_id issue

-- 1. Check if auth.instances table exists and what's in it
SELECT
  'auth.instances' as check_name,
  COUNT(*) as count,
  jsonb_agg(jsonb_build_object('id', id, 'uuid', uuid, 'raw_base_config', raw_base_config)) as data
FROM auth.instances;

-- 2. Check auth.config if it exists
SELECT
  'auth.config' as check_name,
  *
FROM auth.config
LIMIT 5;

-- 3. Check if there are ANY users with a different instance_id
SELECT
  'User instance_ids' as check_name,
  instance_id,
  COUNT(*) as user_count,
  string_agg(DISTINCT email, ', ') as sample_emails
FROM auth.users
GROUP BY instance_id
ORDER BY user_count DESC;

-- 4. Check auth schema version
SELECT
  'Auth schema version' as check_name,
  version
FROM auth.schema_migrations
ORDER BY version DESC
LIMIT 5;

-- 5. Check if this might be a local Supabase instance
SELECT
  'Current database' as check_name,
  current_database() as database_name,
  current_schema() as current_schema,
  version() as postgres_version;
