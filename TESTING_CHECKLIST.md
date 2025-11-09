# Authentication Testing Checklist

## Before Testing

### 0. Fix Critical Auth Error (DO THIS FIRST!)

**Issue from Supabase Support:**
> "sql: Scan error on column index 8, name \"email_change\": converting NULL to string is unsupported"

Run this in Supabase SQL Editor:

```sql
-- CRITICAL FIX: Fix email_change NULL values
UPDATE auth.users SET email_change = '' WHERE email_change IS NULL;
UPDATE auth.users SET email_change_token_current = '' WHERE email_change_token_current IS NULL;
UPDATE auth.users SET email_change_token_new = '' WHERE email_change_token_new IS NULL;
UPDATE auth.users SET confirmation_token = '' WHERE confirmation_token IS NULL;
UPDATE auth.users SET recovery_token = '' WHERE recovery_token IS NULL;
```

### 1. Apply Migrations

Run these SQL scripts in Supabase SQL Editor (https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/sql):

```sql
-- Step 1: Add admin role and helper functions
-- Copy/paste contents of: supabase/migrations/20251101_add_admin_role.sql

-- Step 2: Update RLS policies
-- Copy/paste contents of: supabase/migrations/20251101_update_rls_for_admin_role.sql
```

### 2. Create Test Users

Follow steps in `MANUAL_AUTH_SETUP.md`:

1. Create users via Supabase Dashboard:
   - admin@test.com / TestAdmin123!
   - agent@test.com / TestAgent123!
   - buyer@test.com / TestBuyer123!

2. Update roles via SQL Editor:
   ```sql
   -- Copy/paste the role update SQL from MANUAL_AUTH_SETUP.md
   ```

## Testing Scenarios

### ✅ Test 1: Login Flow

- [ ] Go to http://localhost:3000/signin
- [ ] Try logging in with admin@test.com / TestAdmin123!
  - [ ] Should succeed without errors
  - [ ] Should redirect to dashboard
  - [ ] No instance_id errors
  - [ ] No password hash errors

- [ ] Logout
- [ ] Try logging in with agent@test.com / TestAgent123!
  - [ ] Should succeed
  - [ ] Should redirect to dashboard

- [ ] Logout
- [ ] Try logging in with buyer@test.com / TestBuyer123!
  - [ ] Should succeed
  - [ ] Should redirect somewhere (not dashboard)

### ✅ Test 2: Route Protection (Not Logged In)

- [ ] Logout completely
- [ ] Try accessing http://localhost:3000/dashboard
  - [ ] Should redirect to /signin
  - [ ] URL should include `?redirectTo=/dashboard`

- [ ] Try accessing http://localhost:3000/admin
  - [ ] Should redirect to /signin
  - [ ] URL should include `?redirectTo=/admin`

### ✅ Test 3: Role-Based Access (Admin)

- [ ] Login as admin@test.com
- [ ] Try accessing http://localhost:3000/dashboard
  - [ ] Should work - page loads
- [ ] Try accessing http://localhost:3000/admin
  - [ ] Should work - admin page loads
- [ ] Check that you can see all leads (not just your own)

### ✅ Test 4: Role-Based Access (Agent)

- [ ] Login as agent@test.com
- [ ] Try accessing http://localhost:3000/dashboard
  - [ ] Should work - dashboard loads
- [ ] Try accessing http://localhost:3000/admin
  - [ ] Should redirect to /dashboard
  - [ ] Agent cannot access admin area
- [ ] Check that you only see your own leads (not all leads)

### ✅ Test 5: Role-Based Access (Public User)

- [ ] Login as buyer@test.com
- [ ] Try accessing http://localhost:3000/dashboard
  - [ ] Should redirect to /signin or homepage
  - [ ] Public users cannot access dashboard
- [ ] Try accessing http://localhost:3000/admin
  - [ ] Should redirect to /signin or homepage
- [ ] Verify you can:
  - [ ] Search properties
  - [ ] Save searches
  - [ ] Add favorites

### ✅ Test 6: Session Persistence

- [ ] Login as any user
- [ ] Refresh the page
  - [ ] Should stay logged in
  - [ ] Should not redirect to signin

- [ ] Close browser tab
- [ ] Open new tab to http://localhost:3000
  - [ ] Should still be logged in

- [ ] Click logout
  - [ ] Should redirect to /login or /signin
  - [ ] Session should be cleared

### ✅ Test 7: RLS Policies

Open browser console and try these Supabase queries:

```javascript
// Login as admin
const { data: adminLeads } = await supabase
  .from('leads')
  .select('*');
console.log('Admin sees leads:', adminLeads?.length);
// Should see ALL leads

// Login as agent
const { data: agentLeads } = await supabase
  .from('leads')
  .select('*');
console.log('Agent sees leads:', agentLeads?.length);
// Should only see assigned leads

// Login as admin
const { data: allProfiles } = await supabase
  .from('profiles')
  .select('*');
console.log('Admin sees profiles:', allProfiles?.length);
// Should see all profiles

// Login as agent
const { data: ownProfile } = await supabase
  .from('profiles')
  .select('*');
console.log('Agent sees profiles:', ownProfile?.length);
// Should only see own profile (length = 1)
```

## Common Issues & Fixes

### Issue: "instance_id error" or "500 error"
**Fix:** Users were created via SQL. Delete and recreate via Supabase Dashboard.

### Issue: "Wrong password" even with correct password
**Fix:** Password hash mismatch. Delete user and recreate via Dashboard.

### Issue: Middleware not working / Can access dashboard without login
**Fix:**
1. Check that middleware.ts exists in root
2. Restart dev server: `npm run dev`
3. Clear browser cache/cookies

### Issue: Admin user redirected from /admin
**Fix:**
1. Check role is set to 'super_admin', 'broker', or 'admin' in profiles table
2. Run: `SELECT id, email, role FROM profiles WHERE email = 'admin@test.com';`

### Issue: RLS denies access even for admin
**Fix:**
1. Verify migrations were applied
2. Check `is_admin()` function exists:
   ```sql
   SELECT public.is_admin('admin'); -- Should return true
   SELECT public.is_admin('agent'); -- Should return false
   ```

## Success Criteria

All checkboxes above should be checked ✅

If any test fails, refer to Common Issues section or check:
- `/AUTH_FIX_SUMMARY.md` - Overview of changes
- `/MANUAL_AUTH_SETUP.md` - User setup instructions
- Supabase Dashboard → Auth → Users - Verify users exist
- Supabase Dashboard → Database → Functions - Verify `is_admin()` exists
