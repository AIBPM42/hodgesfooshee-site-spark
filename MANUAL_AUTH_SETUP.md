# Manual Authentication Setup Instructions

## Step 0: Fix email_change NULL Issue (CRITICAL - Do This First!)

### This fixes the auth error identified by Supabase Support:
> Error: "sql: Scan error on column index 8, name \"email_change\": converting NULL to string is unsupported"

### Run this SQL in Supabase SQL Editor:

```sql
-- Fix email_change NULL values (critical fix from Supabase support)
UPDATE auth.users
SET email_change = ''
WHERE email_change IS NULL;

-- Also fix related token fields
UPDATE auth.users
SET email_change_token_current = ''
WHERE email_change_token_current IS NULL;

UPDATE auth.users
SET email_change_token_new = ''
WHERE email_change_token_new IS NULL;

UPDATE auth.users
SET confirmation_token = ''
WHERE confirmation_token IS NULL;

UPDATE auth.users
SET recovery_token = ''
WHERE recovery_token IS NULL;
```

✅ After running this, your login errors should be fixed!

---

## Step 1: Create Test Users in Supabase Dashboard

Since SQL-based user creation causes instance_id issues, create test users via Supabase Dashboard:

### 1. Go to Supabase Dashboard
- Navigate to: https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/auth/users
- Click "Add user" → "Create new user"

### 2. Create Admin User
- Email: `admin@test.com`
- Password: `TestAdmin123!`
- Auto Confirm User: ✅ YES
- Click "Create user"

### 3. Create Agent User
- Email: `agent@test.com`
- Password: `TestAgent123!`
- Auto Confirm User: ✅ YES
- Click "Create user"

### 4. Create Buyer User
- Email: `buyer@test.com`
- Password: `TestBuyer123!`
- Auto Confirm User: ✅ YES
- Click "Create user"

## Step 2: Update User Profiles

After creating users, their profiles should auto-create via trigger. But roles need to be set:

### Run this SQL in Supabase SQL Editor:

```sql
-- Update admin user role
UPDATE public.profiles
SET role = 'super_admin',
    status = 'active',
    first_name = 'Test',
    last_name = 'Admin'
WHERE email = 'admin@test.com';

-- Update agent user role
UPDATE public.profiles
SET role = 'agent',
    status = 'active',
    first_name = 'Test',
    last_name = 'Agent'
WHERE email = 'agent@test.com';

-- Update buyer user role
UPDATE public.profiles
SET role = 'public_user',
    status = 'active',
    first_name = 'Test',
    last_name = 'Buyer'
WHERE email = 'buyer@test.com';

-- Create agent profile for test agent
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
```

## Step 3: Test Login

Try logging in with each account at: http://localhost:3000/signin

- admin@test.com / TestAdmin123!
- agent@test.com / TestAgent123!
- buyer@test.com / TestBuyer123!

All should work without instance_id or password hash errors.

## Why This Approach?

Creating users via Supabase Dashboard:
- ✅ Properly sets instance_id
- ✅ Uses correct password hashing
- ✅ Handles all auth triggers
- ✅ Creates proper session tokens

Direct SQL INSERT into auth.users:
- ❌ Wrong instance_id
- ❌ Password hash mismatch
- ❌ Missing auth fields
- ❌ Breaks login flow
