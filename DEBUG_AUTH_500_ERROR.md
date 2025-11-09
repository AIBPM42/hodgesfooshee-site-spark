# Debug Authentication 500 Error

## Current Status
- ✅ Users exist in database with profiles
- ✅ Passwords are set and emails confirmed
- ❌ Login fails with "Database error querying schema"
- ❌ 500 error from `/auth/v1/token` endpoint
- ⚠️ All users (including Dashboard-created) have `instance_id = '00000000-0000-0000-0000-000000000000'`

## Diagnostic Steps

### Step 1: Check Browser Console and Network Tab

**Instructions:**
1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Clear console
4. Try logging in with `admin@hodgesfooshee.com` / `Admin123!`
5. Copy the full error message from console

**Then:**
1. Go to **Network** tab
2. Filter by "token" or "auth"
3. Find the failed request to `/auth/v1/token`
4. Click on it
5. Check the **Response** tab - does it show any error details?
6. Check the **Headers** tab - copy the Request Headers
7. Check the **Payload** tab - copy the request body

### Step 2: Run SQL Diagnostics

Run these queries in Supabase SQL Editor:

#### A. Check Password Verification
```sql
-- File: TEST_PASSWORD_VERIFICATION.sql
-- This tests if passwords are hashed correctly
SELECT
  email,
  encrypted_password = crypt('Admin123!', encrypted_password) as password_valid,
  LEFT(encrypted_password, 4) as hash_prefix,
  LENGTH(encrypted_password) as hash_length
FROM auth.users
WHERE email = 'admin@hodgesfooshee.com';
```

**Expected:** `password_valid = true`, `hash_prefix = $2a$` or `$2b$`, `hash_length = 60`

#### B. Check for Auth Triggers or Policies
```sql
-- File: CHECK_AUTH_TRIGGERS.sql
-- Run the entire file to check for interfering triggers/policies
```

#### C. Test Direct User Lookup
```sql
-- This mimics what Supabase Auth does
SET ROLE postgres;
SELECT
  id,
  email,
  instance_id,
  aud,
  role,
  email_confirmed_at IS NOT NULL as confirmed,
  encrypted_password IS NOT NULL as has_password,
  deleted_at IS NULL as not_deleted,
  banned_until IS NULL as not_banned
FROM auth.users
WHERE email = 'admin@hodgesfooshee.com';
```

**Expected:** All boolean fields should be `true`

### Step 3: Check Supabase Dashboard Logs

**Instructions:**
1. Go to: https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/logs/postgres-logs
2. Look for errors around the time you tried to log in
3. Filter by "error" or "500"
4. Copy any relevant error messages

Also check:
- **Auth Logs**: https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/logs/auth-logs
- **Edge Function Logs**: https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/logs/edge-logs

### Step 4: Check Auth Configuration

1. Go to: https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/auth/users
2. Click on **Configuration** (or **Settings**)
3. Check **Email Auth** settings:
   - Is "Enable Email Signup" turned ON?
   - Is "Enable Email Confirmations" turned ON or OFF?
   - Is "Secure email change" enabled?

4. Check **Auth Providers**:
   - Is Email provider enabled?

### Step 5: Compare Dashboard User vs SQL User

Run this to see ALL differences:

```sql
-- Get all fields from both users
(SELECT 'dashboard' as source, * FROM auth.users WHERE email = 'newtest@test.com')
UNION ALL
(SELECT 'sql' as source, * FROM auth.users WHERE email = 'admin@hodgesfooshee.com')
ORDER BY source;
```

Look for ANY field differences besides email, password, and timestamps.

## Potential Solutions

### Solution A: Restore Essential RLS Policies
If profiles table needs RLS for auth to work:

```sql
-- File: 20251017_restore_essential_rls_policies.sql
-- Run this migration
```

### Solution B: Update Passwords via Dashboard
If password hashing is the issue:

1. Go to Supabase Dashboard > Auth > Users
2. Find `admin@hodgesfooshee.com`
3. Click "..." > "Reset Password" or "Update User"
4. Set password to `Admin123!`
5. Try logging in again

### Solution C: Recreate Users via Admin API
If all else fails, delete and recreate users properly:

1. Delete all test users in Dashboard
2. Run this Node script:

```typescript
// Use Supabase Admin API to create users properly
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Get from Dashboard > Settings > API
)

const { data, error } = await supabase.auth.admin.createUser({
  email: 'admin@hodgesfooshee.com',
  password: 'Admin123!',
  email_confirm: true
})
```

### Solution D: Check Instance ID Issue
Some Supabase projects might have instance_id requirements:

```sql
-- Try to find correct instance_id from Supabase internal tables
SELECT id FROM auth.instances LIMIT 1;

-- Or from audit log
SELECT DISTINCT instance_id
FROM auth.audit_log_entries
WHERE instance_id != '00000000-0000-0000-0000-000000000000'
LIMIT 1;
```

## Next Actions

**Immediate:**
1. Run `TEST_PASSWORD_VERIFICATION.sql` - confirm passwords work
2. Check Supabase Postgres logs for actual error
3. Run `CHECK_AUTH_TRIGGERS.sql` - look for interference

**Then based on results:**
- If password verification fails → Update passwords via Dashboard
- If triggers/policies interfere → Remove them
- If logs show specific error → Address that error
- If nothing found → Contact Supabase support with logs

## Support Information

If all diagnostics fail, create Supabase support ticket with:
- Project ID: `xhqwmtzawqfffepcqxwf`
- Error: "500 from /auth/v1/token when attempting login"
- Symptoms: "Database error querying schema"
- What you've tried: List all diagnostic steps above
- Postgres log excerpts showing the actual error
