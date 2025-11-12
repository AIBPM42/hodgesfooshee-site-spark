# Coolify Deployment Guide

## 🚀 Deployment Checklist for hodges-demo.aicustomautomations.com

### 1. Coolify Project Setup

In your Coolify dashboard:

1. **Create New Application (if not already created)**
   - Type: Next.js Application
   - Repository: `https://github.com/AIBPM42/hodgesfooshee-site-spark`
   - Branch: `main`

2. **Build Settings**
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`
   - Port: `3000`
   - Node Version: `20.x` (required - see package.json)
   - Install Command: `npm ci` (faster and more reliable than npm install)

3. **Environment Variables Path**
   - All variables are listed in `COOLIFY_ENV_VARS.md`
   - Copy the entire contents from that file
   - Paste into Coolify's Environment Variables section

### 2. Environment Variables (CRITICAL!)

**See `COOLIFY_ENV_VARS.md` for the complete list with actual values.**

The file contains all your:
- ✅ Production settings (NEXT_PUBLIC_DEV_MODE=false, etc.)
- ✅ Supabase credentials
- ✅ n8n webhook URLs (your RAG system)
- ✅ AI API keys (FAL, OpenAI, Perplexity, Anthropic)
- ✅ Manus API key
- ⚠️ MLS credentials (need to locate these if not using mock data)

**Quick copy/paste from `COOLIFY_ENV_VARS.md` → Coolify Environment Variables section**

### 3. Cloudflare DNS Setup

Your DNS is already configured correctly:

1. **Current DNS (from screenshot):**
   - `hodges-demo` → `168.231.68.160` (Proxied)
   - This points to your DigitalOcean Coolify server

2. **No changes needed** - DNS already points to Coolify at 168.231.68.160

### 4. Coolify Domain Configuration

1. **In Coolify** → Your Application → Domains
2. **Add Domain:** `hodges-demo.aicustomautomations.com`
3. **Enable HTTPS:** Coolify will auto-generate Let's Encrypt SSL

### 5. Database Migration (Supabase)

Run this SQL in your Supabase SQL Editor to create test user profiles:

```sql
INSERT INTO public.profiles (id, email, role, status, first_name, last_name)
VALUES
  ('8ecab564-199f-47f3-a4b0-42da61b427d2', 'admin@test.com', 'super_admin', 'active', 'Test', 'Admin'),
  ('391ff60a-07bb-462f-a743-13e3b85905bb', 'agent@test.com', 'agent', 'active', 'Test', 'Agent'),
  ('27e65203-f8fb-451f-a073-79d424ae5d23', 'buyer@test.com', 'public_user', 'active', 'Test', 'Buyer')
ON CONFLICT (id) DO NOTHING;
```

### 6. Post-Deployment Testing

Once deployed, test these URLs:

- ✅ Homepage: `https://hodges-demo.aicustomautomations.com/`
- ✅ Sign In: `https://hodges-demo.aicustomautomations.com/signin`
- ✅ Register: `https://hodges-demo.aicustomautomations.com/register`
- ✅ Property Search: `https://hodges-demo.aicustomautomations.com/search/properties`
- ✅ Open Houses: `https://hodges-demo.aicustomautomations.com/open-houses`

**Test Accounts:**
- Admin: `admin@test.com` / `TestAdmin123!` → Should redirect to `/admin`
- Agent: `agent@test.com` / `TestAgent123!` → Should redirect to `/dashboard`
- Buyer: `buyer@test.com` / `TestBuyer123!` → Should redirect to `/dashboard`

### 7. Troubleshooting

**If build fails:**
- Check Node version (should be 18.x or 20.x)
- Verify all environment variables are set
- Check build logs in Coolify

**If site loads but auth doesn't work:**
- Verify Supabase environment variables
- Check Supabase project is accessible from Coolify server
- Ensure RLS policies are configured

**If images don't load:**
- Check public folder deployment
- Verify Next.js image optimization settings

### 8. Performance Optimization (Optional)

In Coolify:
- Enable HTTP/2
- Enable Brotli compression
- Set proper cache headers

### 9. Monitoring

- Monitor Coolify logs for errors
- Check Supabase dashboard for database issues
- Use Cloudflare Analytics for traffic insights

---

## 📋 Quick Deployment Steps

1. ✅ Push code to GitHub (DONE)
2. ✅ Coolify application exists (recovered after disk space cleanup)
3. ⏳ **NEXT: Add all environment variables from `COOLIFY_ENV_VARS.md`**
4. ✅ DNS configured correctly (hodges-demo → 168.231.68.160)
5. ⏳ Configure domain SSL in Coolify (if needed)
6. ✅ Supabase already configured (test accounts working)
7. ⏳ Trigger deployment and test
8. ⏳ Remove "Coming Soon" banner from RAG page

---

## 🎯 What's Included in This Deployment

- ✅ Beautiful glassmorphic UI design
- ✅ Role-based authentication system
- ✅ Nashville Insider Access signup with confetti
- ✅ Property search and open houses
- ✅ Market intelligence dashboard (for agents/admins)
- ✅ Admin panel (for super_admin/broker/admin roles)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ SEO optimized
- ✅ Performance optimized with Next.js 14

---

**Need help?** Check Coolify documentation or reach out for support!
