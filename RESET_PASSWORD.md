# Password Reset Options

## Option 1: Reset via Supabase Dashboard (Fastest)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Users**
4. Find user: `aicustomautomations@gmail.com`
5. Click the **•••** menu next to the user
6. Click **"Send password recovery email"**
7. Check your email inbox
8. Click the reset link and set a new password

## Option 2: Manually Set Password via SQL (Immediate)

Run this SQL query in your Supabase SQL Editor:

```sql
-- Replace 'your_new_password' with your desired password
UPDATE auth.users 
SET encrypted_password = crypt('your_new_password', gen_salt('bf'))
WHERE email = 'aicustomautomations@gmail.com';
```

**Example:**
```sql
UPDATE auth.users 
SET encrypted_password = crypt('TestPass123!', gen_salt('bf'))
WHERE email = 'aicustomautomations@gmail.com';
```

After running this, you can sign in with:
- Email: `aicustomautomations@gmail.com`
- Password: `TestPass123!` (or whatever you set)

## Option 3: Use the Forgot Password Page (I can build this)

I can create a `/auth/forgot` page that:
1. Sends a password reset email via Supabase
2. Provides a reset password form
3. Matches the glassmorphic design

Let me know if you want this option!

## Recommended: Option 2 (SQL)

This is the fastest way to get you signed in right now.
Just run the SQL query above with your desired password.
