# Fix Authentication 500 Error

## Problem
All users have `instance_id = '00000000-0000-0000-0000-000000000000'` (dummy value), causing Supabase Auth to return 500 errors on login.

## Root Cause
Users were created by directly inserting into `auth.users` table, bypassing Supabase's auth system which automatically sets the correct `instance_id`.

## Solution Options

### Option 1: Find and Update Instance ID (RECOMMENDED - FASTEST)

Run this query in Supabase SQL Editor to find the correct instance_id:

```sql
-- Check if there are any users with a valid instance_id
SELECT DISTINCT instance_id, COUNT(*) as count
FROM auth.users
GROUP BY instance_id;

-- If the above shows only the dummy ID, try to find it from auth schema
SELECT current_setting('request.jwt.claims', true)::json->>'iss';
```

If you can identify the correct instance_id, update all users:

```sql
-- Replace 'CORRECT-INSTANCE-ID-HERE' with the actual instance_id
UPDATE auth.users
SET instance_id = 'CORRECT-INSTANCE-ID-HERE'
WHERE instance_id = '00000000-0000-0000-0000-000000000000';
```

### Option 2: Create One User via Dashboard (EASIEST)

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf/auth/users
2. Click **"Invite user"** or **"Add user"**
3. Create a test user: `newtest@test.com` with password `Test123!`
4. Check **"Auto Confirm User"**
5. Click **"Invite"** or **"Create"**

Then run this query to see what instance_id Supabase assigned:

```sql
SELECT instance_id, email
FROM auth.users
WHERE email = 'newtest@test.com';
```

Once you have the correct instance_id, update all other users:

```sql
-- Copy the instance_id from the query above and use it here
UPDATE auth.users
SET instance_id = (SELECT instance_id FROM auth.users WHERE email = 'newtest@test.com')
WHERE instance_id = '00000000-0000-0000-0000-000000000000';
```

Then verify:

```sql
SELECT
  email,
  instance_id,
  email_confirmed_at IS NOT NULL as confirmed,
  LENGTH(encrypted_password) as has_password
FROM auth.users
WHERE email IN ('admin@hodgesfooshee.com', 'testagent@hodgesfooshee.com', 'buyer@test.com')
ORDER BY email;
```

### Option 3: Recreate Users Properly (CLEANEST)

Delete existing test users and recreate them using Supabase client library:

1. **Delete existing test users** in Supabase Dashboard (Authentication > Users)

2. **Create a migration script** that uses Supabase Admin API:

```typescript
// create-test-users.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Get from Supabase Dashboard

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUsers() {
  // Admin user
  const { data: admin, error: adminError } = await supabase.auth.admin.createUser({
    email: 'admin@hodgesfooshee.com',
    password: 'Admin123!',
    email_confirm: true,
    user_metadata: {
      first_name: 'Hodges',
      last_name: 'Fooshee',
      role: 'super_admin'
    }
  })

  if (adminError) throw adminError

  // Create profile
  await supabase.from('profiles').insert({
    id: admin.user.id,
    email: 'admin@hodgesfooshee.com',
    role: 'super_admin',
    status: 'active',
    first_name: 'Hodges',
    last_name: 'Fooshee'
  })

  console.log('Created admin user:', admin.user.id)

  // Agent user
  const { data: agent, error: agentError } = await supabase.auth.admin.createUser({
    email: 'testagent@hodgesfooshee.com',
    password: 'Agent123!',
    email_confirm: true,
    user_metadata: {
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'agent'
    }
  })

  if (agentError) throw agentError

  await supabase.from('profiles').insert({
    id: agent.user.id,
    email: 'testagent@hodgesfooshee.com',
    role: 'agent',
    status: 'active',
    first_name: 'Jane',
    last_name: 'Smith',
    phone: '(615) 555-0100'
  })

  await supabase.from('agent_profiles').insert({
    user_id: agent.user.id,
    mls_member_key: 'TEST-MOCK-001',
    mls_member_id: 'AGENT001',
    office_key: 'OFFICE-TEST-001',
    office_name: 'Hodges & Fooshee Realty',
    photo_url: 'https://ui-avatars.com/api/?name=Jane+Smith&size=400&background=E87722&color=fff&bold=true',
    designations: 'ABR, GRI, CRS',
    last_mls_sync: new Date().toISOString()
  })

  console.log('Created agent user:', agent.user.id)

  // Buyer user
  const { data: buyer, error: buyerError } = await supabase.auth.admin.createUser({
    email: 'buyer@test.com',
    password: 'Buyer123!',
    email_confirm: true,
    user_metadata: {
      first_name: 'Test',
      last_name: 'Buyer',
      role: 'public_user'
    }
  })

  if (buyerError) throw buyerError

  await supabase.from('profiles').insert({
    id: buyer.user.id,
    email: 'buyer@test.com',
    role: 'public_user',
    status: 'active',
    first_name: 'Test',
    last_name: 'Buyer'
  })

  console.log('Created buyer user:', buyer.user.id)
}

createTestUsers().catch(console.error)
```

## Recommended Approach

**I recommend Option 2** - it's the fastest and safest:

1. Create one user via Supabase Dashboard UI
2. Query to get the correct instance_id
3. Update all existing users with that instance_id
4. Test login

This preserves all existing data and takes less than 2 minutes.

## After Fixing

Test login with these credentials:
- **Admin**: admin@hodgesfooshee.com / Admin123!
- **Agent**: testagent@hodgesfooshee.com / Agent123!
- **Buyer**: buyer@test.com / Buyer123!

All should redirect to appropriate dashboards after successful login.
