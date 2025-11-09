-- Migration: Fix email_change NULL values causing auth errors
-- Based on Supabase support recommendation
-- Error: "sql: Scan error on column index 8, name \"email_change\": converting NULL to string is unsupported"

-- Fix the email_change column NULL values
UPDATE auth.users
SET email_change = ''
WHERE email_change IS NULL;

-- Also fix email_change_token_current and email_change_token_new if they have NULLs
UPDATE auth.users
SET email_change_token_current = ''
WHERE email_change_token_current IS NULL;

UPDATE auth.users
SET email_change_token_new = ''
WHERE email_change_token_new IS NULL;

-- Fix confirmation_token if NULL
UPDATE auth.users
SET confirmation_token = ''
WHERE confirmation_token IS NULL;

-- Fix recovery_token if NULL
UPDATE auth.users
SET recovery_token = ''
WHERE recovery_token IS NULL;

COMMENT ON COLUMN auth.users.email_change IS 'Fixed NULL values - must be empty string instead of NULL';
