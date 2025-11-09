-- FIX: Auth sign-in error caused by NULL email_change column
-- Issue: "sql: Scan error on column index 8, name \"email_change\": converting NULL to string is unsupported"
-- Solution: Set NULL email_change values to empty string
-- Reference: Supabase Support (Oct 17, 2024)

UPDATE auth.users
SET email_change = ''
WHERE email_change IS NULL;

-- Verify fix
SELECT
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE email_change IS NULL) as null_email_change,
  COUNT(*) FILTER (WHERE email_change = '') as empty_email_change
FROM auth.users;
