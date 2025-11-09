># Test Login Scenarios

## Current Situation
- All users (including Dashboard-created `newtest@test.com`) have `instance_id = '00000000-0000-0000-0000-000000000000'`
- Getting 500 error from `/auth/v1/token` endpoint
- Error message: "Database error querying schema"

## Test Scenarios

### Scenario 1: Test Dashboard-Created User
**Purpose**: Determine if the issue is specific to SQL-created users or affects all users

**Test**: Try logging in with the Dashboard-created user
- Email: `newtest@test.com`
- Password: `Test123!`

**Expected Results**:
- ✅ **If login succeeds**: The issue is specific to how we created users via SQL (password hashing or other fields)
- ❌ **If login fails with same 500 error**: The issue is broader - could be project configuration, auth schema, or RLS policies

### Scenario 2: Check Password Hash Format
**Purpose**: Verify if SQL-created passwords use the correct bcrypt format

**Query**:
```sql
SELECT
  email,
  LEFT(encrypted_password, 7) as hash_type,
  LENGTH(encrypted_password) as hash_length,
  encrypted_password LIKE '$2a$%' OR encrypted_password LIKE '$2b$%' OR encrypted_password LIKE '$2y$%' as is_bcrypt
FROM auth.users
WHERE email IN ('newtest@test.com', 'admin@hodgesfooshee.com')
ORDER BY email;
```

**Expected**: Both should show `is_bcrypt = true` and `hash_type = '$2a$' or '$2b$'`

### Scenario 3: Check for Missing Required Fields
**Purpose**: Verify all required auth.users fields are populated

**Query**:
```sql
SELECT
  email,
  instance_id,
  aud,
  role,
  email_confirmed_at IS NOT NULL as email_confirmed,
  encrypted_password IS NOT NULL as has_password,
  confirmation_token IS NULL as no_pending_confirmation,
  recovery_token IS NULL as no_pending_recovery,
  email_change_token_current IS NULL as no_pending_email_change,
  banned_until IS NULL as not_banned,
  deleted_at IS NULL as not_deleted
FROM auth.users
WHERE email IN ('newtest@test.com', 'admin@hodgesfooshee.com', 'testagent@hodgesfooshee.com')
ORDER BY email;
```

**Expected**: All boolean checks should be `true`

### Scenario 4: Check RLS Policies on auth.users
**Purpose**: Verify if RLS is blocking auth lookups

**Query**:
```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'auth'
  AND tablename = 'users';
```

**Expected**: Should show no policies (auth.users typically doesn't use RLS) or only system policies

### Scenario 5: Try Password Reset Flow
**Purpose**: If password hashing is the issue, reset password via Dashboard

**Steps**:
1. Go to Supabase Dashboard > Authentication > Users
2. Find `admin@hodgesfooshee.com`
3. Click "..." menu > "Send Password Reset"
4. Or manually set a new password via "Update User"

### Scenario 6: Compare All Fields Between Dashboard and SQL Users
**Purpose**: Find ANY difference that might explain why SQL users fail

**Query**:
```sql
-- Get Dashboard user
SELECT 'dashboard' as source, * FROM auth.users WHERE email = 'newtest@test.com'
UNION ALL
-- Get SQL user
SELECT 'sql' as source, * FROM auth.users WHERE email = 'admin@hodgesfooshee.com';
```

Look for differences in:
- `aud` field
- `role` field
- `raw_app_meta_data`
- `raw_user_meta_data`
- `is_super_admin`
- `created_at` / `updated_at` format

## Next Steps Based on Results

### If Dashboard user CAN login:
1. Compare password hash formats between Dashboard and SQL users
2. Update SQL users' passwords using Supabase Dashboard
3. Or recreate users using the TypeScript script with Supabase Admin API

### If NO users can login:
1. Check Supabase project status in Dashboard (any outages?)
2. Check if email confirmation is required in Auth settings
3. Review Auth > Settings > Email Auth configuration
4. Check for IP restrictions or security policies
5. Look at Supabase Dashboard > Logs > Edge Functions for actual error details
6. Consider creating a support ticket with Supabase

### If it's a password issue:
1. Use Supabase Dashboard to update passwords for test users
2. Or delete and recreate using Admin API instead of SQL

## Debugging Commands

### Enable detailed Postgres logging:
```sql
SET log_min_messages TO DEBUG1;
SET log_error_verbosity TO VERBOSE;
```

### Test password verification:
```sql
-- This tests if the stored hash can verify against the password
SELECT
  email,
  encrypted_password = crypt('Admin123!', encrypted_password) as password_matches
FROM auth.users
WHERE email = 'admin@hodgesfooshee.com';
```

If this returns `true`, the password is hashed correctly and should work.
