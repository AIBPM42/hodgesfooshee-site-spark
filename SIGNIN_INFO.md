# Sign In Information

## Sign In Page
🔗 **URL**: http://localhost:3000/signin

## Test Credentials

### Test Accounts (Development)
- **Admin**: `admin@test.com` / `admin123`
- **Agent**: `agent@test.com` / `agent123`
- **Buyer**: `buyer@test.com` / `buyer123`

### Owner Accounts (Production)
- **Primary**: `aicustomautomations@gmail.com` / [Your Supabase password]
- **Secondary**: `kelvin.g4277@gmail.com` / [Your Supabase password]
- **Marketing**: `brandingandpublicitymarketing@gmail.com` / [Your Supabase password]

## How Authentication Works

1. **Sign In Page**: [/signin](app/(auth)/signin/page.tsx)
   - Beautiful glassmorphic design
   - Email/password authentication
   - Optional Google OAuth
   - Dark/light mode support

2. **Route Protection**: [dashboard/layout.tsx](app/dashboard/layout.tsx)
   - Server-side authentication check
   - Redirects to `/signin` if not authenticated
   - Protects all `/dashboard/*` routes

3. **OAuth Callback**: [/auth/callback/route.ts](app/auth/callback/route.ts)
   - Handles Google OAuth redirect
   - Exchanges code for session
   - Redirects to dashboard

4. **Legacy Login**: `/login` redirects to `/signin`

## After Sign In
Once authenticated, you'll be redirected to `/dashboard` and can access:
- **Realty Intelligence**: `/dashboard/ask`
- **Image Studio**: `/dashboard/image-editor`
- All other dashboard features

## Image Studio Access
The Image Studio requires authentication because:
- It uploads images to FAL storage (needs user tracking)
- It saves editing history to Supabase (needs user ID)
- It enforces role-based access (owner/broker/agent)
- It protects API keys on the server side

## Troubleshooting
If you see "image not authenticated":
1. Make sure you're signed in at `/signin`
2. Check browser console for auth errors
3. Verify Supabase session exists in browser storage
