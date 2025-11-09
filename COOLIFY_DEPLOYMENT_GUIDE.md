# Coolify Deployment Guide

## 🚀 Deployment Checklist for hodges-demo.aicustomautomations.com

### 1. Coolify Project Setup

In your Coolify dashboard:

1. **Create New Application**
   - Type: Next.js Application
   - Repository: `https://github.com/AIBPM42/hodgesfooshee-site-spark`
   - Branch: `claude-install-audit` (or merge to main first)

2. **Build Settings**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Port: `3000`
   - Node Version: `18.x` or `20.x`

### 2. Environment Variables (CRITICAL!)

Add these in Coolify's Environment Variables section:

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Development Mode (set to false for production)
NEXT_PUBLIC_DEV_MODE=false

# API Keys (Optional but recommended)
MANUS_API_KEY=your_manus_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key
OPENAI_API_KEY=your_openai_api_key

# N8N RAG Integration (if using)
N8N_EMBED_WEBHOOK_URL=your_n8n_webhook_url
N8N_EMBED_WEBHOOK_SECRET=your_n8n_secret
```

### 3. Cloudflare DNS Setup

Point your domain to Coolify:

1. **Go to Cloudflare Dashboard** → DNS
2. **Add/Update A Record:**
   - Type: `A`
   - Name: `hodges-demo` (or `@` for root domain)
   - Content: `YOUR_COOLIFY_SERVER_IP`
   - Proxy status: Proxied (orange cloud)
   - TTL: Auto

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
2. ⏳ Create Coolify application
3. ⏳ Add environment variables
4. ⏳ Configure domain in Coolify
5. ⏳ Update Cloudflare DNS
6. ⏳ Run Supabase migration
7. ⏳ Deploy and test

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
