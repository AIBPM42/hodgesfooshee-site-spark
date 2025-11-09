# 🔐 START HERE: Complete Auth Fix Guide

## What This Fixes

Based on Supabase Support and our investigation, we're fixing:
1. ✅ **Login errors** - "email_change NULL" scan error
2. ✅ **Instance_id issues** - Users created via SQL have wrong instance_id
3. ✅ **Route protection** - Dashboard accessible without login
4. ✅ **Role confusion** - Owner & Broker now have same permissions

---

## 📋 Step-by-Step Instructions

### STEP 1: Fix Critical Auth Error (5 minutes)

**Go to:** https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/sql

**Copy and paste this SQL:**

```sql
-- CRITICAL FIX from Supabase Support
-- Fixes: "sql: Scan error on column index 8, name email_change"

UPDATE auth.users SET email_change = '' WHERE email_change IS NULL;
UPDATE auth.users SET email_change_token_current = '' WHERE email_change_token_current IS NULL;
UPDATE auth.users SET email_change_token_new = '' WHERE email_change_token_new IS NULL;
UPDATE auth.users SET confirmation_token = '' WHERE confirmation_token IS NULL;
UPDATE auth.users SET recovery_token = '' WHERE recovery_token IS NULL;
```

**Click "Run"**

✅ **Result:** Login errors should now be fixed!

---

### STEP 2: Add Admin Role & Helpers (2 minutes)

**Still in SQL Editor, run this:**

Open file: `supabase/migrations/20251101_add_admin_role.sql`

Copy the entire contents and paste into SQL Editor, then click "Run"

✅ **Result:** Admin role added, helper functions created

---

### STEP 3: Update RLS Policies (2 minutes)

**Still in SQL Editor, run this:**

Open file: `supabase/migrations/20251101_update_rls_for_admin_role.sql`

Copy the entire contents and paste into SQL Editor, then click "Run"

✅ **Result:** All RLS policies now use admin helper

---

### STEP 4: Create Test Users (10 minutes)

**Go to:** https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/auth/users

#### Create Admin User:
1. Click "Add user" → "Create new user"
2. Email: `admin@test.com`
3. Password: `TestAdmin123!`
4. Auto Confirm User: ✅ **CHECK THIS BOX**
5. Click "Create user"

#### Create Agent User:
1. Click "Add user" → "Create new user"
2. Email: `agent@test.com`
3. Password: `TestAgent123!`
4. Auto Confirm User: ✅ **CHECK THIS BOX**
5. Click "Create user"

#### Create Buyer User:
1. Click "Add user" → "Create new user"
2. Email: `buyer@test.com`
3. Password: `TestBuyer123!`
4. Auto Confirm User: ✅ **CHECK THIS BOX**
5. Click "Create user"

---

### STEP 5: Set User Roles (3 minutes)

**Go back to SQL Editor:**

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

**Click "Run"**

✅ **Result:** All user roles are now set!

---

### STEP 6: Test Everything (10 minutes)

#### Test 1: Login as Admin
1. Go to http://localhost:3000/signin
2. Login with: `admin@test.com` / `TestAdmin123!`
3. ✅ Should succeed without errors
4. ✅ Should redirect to dashboard
5. Try accessing: http://localhost:3000/admin
6. ✅ Should work (admin has access)

#### Test 2: Login as Agent
1. Logout
2. Login with: `agent@test.com` / `TestAgent123!`
3. ✅ Should succeed
4. ✅ Can access /dashboard
5. Try accessing: http://localhost:3000/admin
6. ✅ Should redirect to /dashboard (agents cannot access admin)

#### Test 3: Login as Buyer
1. Logout
2. Login with: `buyer@test.com` / `TestBuyer123!`
3. ✅ Should succeed
4. Try accessing: http://localhost:3000/dashboard
5. ✅ Should redirect (public users cannot access dashboard)

#### Test 4: Route Protection
1. Logout completely
2. Try accessing: http://localhost:3000/dashboard
3. ✅ Should redirect to /signin

---

## ✅ Success Checklist

- [ ] Step 1: Fixed email_change NULL error
- [ ] Step 2: Admin role migration applied
- [ ] Step 3: RLS policies updated
- [ ] Step 4: Test users created via Dashboard
- [ ] Step 5: User roles assigned
- [ ] Step 6: Login works for all 3 users
- [ ] Step 6: Route protection working
- [ ] Step 6: Role-based access working

---

## 🚨 Troubleshooting

### "Wrong password" error
**Cause:** User created via SQL instead of Dashboard
**Fix:** Delete user and recreate via Dashboard (Step 4)

### "instance_id" error
**Cause:** User created via SQL
**Fix:** Delete user and recreate via Dashboard (Step 4)

### Can access /dashboard without login
**Cause:** Middleware not running
**Fix:**
1. Restart dev server: `Ctrl+C` then `npm run dev`
2. Clear browser cache/cookies
3. Check that `middleware.ts` exists in project root

### Admin redirected from /admin
**Cause:** Role not set correctly
**Fix:** Re-run Step 5 SQL to set roles

---

## 📚 Additional Documentation

- `MANUAL_AUTH_SETUP.md` - Detailed user setup guide
- `AUTH_FIX_SUMMARY.md` - Technical overview of changes
- `TESTING_CHECKLIST.md` - Comprehensive test scenarios
- `DIAGNOSE_AUTH_TRIGGERS.sql` - Diagnostic queries

---

## 🎯 What's Next?

Once auth is working:
- [ ] Create production users (replace test emails with real ones)
- [ ] Build agent profile pages (`/agents`, `/agents/[slug]`)
- [ ] Add email verification
- [ ] Consider OAuth (Google login)

---

## 💬 Need Help?

If you get stuck:
1. Check the troubleshooting section above
2. Run `DIAGNOSE_AUTH_TRIGGERS.sql` to check for issues
3. Check Supabase logs: https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/logs/explorer
4. Ping me and I'll help debug!
