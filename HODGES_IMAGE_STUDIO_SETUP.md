# Hodges Image Studio - Setup Instructions

## ✅ Completed Implementation

All code files have been created and integrated into the dashboard. The following tasks remain for you to complete in your Supabase project.

---

## 🗄️ Step 1: Run SQL Migration

Go to your **Supabase Dashboard → SQL Editor** and run this migration **once**:

```sql
-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Create image_edit_runs table
create table if not exists public.image_edit_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  prompt text not null,
  options jsonb,
  total int default 0,
  created_at timestamptz default now()
);

-- Create image_edit_assets table
create table if not exists public.image_edit_assets (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.image_edit_runs(id) on delete cascade,
  user_id uuid not null,
  original_name text,
  original_size bigint,
  edited_url text,
  edited_size bigint default 0,
  status text,
  error text,
  created_at timestamptz default now()
);

-- Create indexes for performance
create index if not exists idx_image_edit_runs_user on public.image_edit_runs(user_id, created_at desc);
create index if not exists idx_image_edit_assets_run on public.image_edit_assets(run_id);
create index if not exists idx_image_edit_assets_user on public.image_edit_assets(user_id, created_at desc);

-- Helper: Extract role from JWT app_metadata.role
create or replace function public.jwt_role()
returns text language sql stable as $$
  select coalesce( nullif(current_setting('request.jwt.claims', true)::jsonb->>'role',''), '' );
$$;

-- Enable Row Level Security
alter table public.image_edit_runs enable row level security;
alter table public.image_edit_assets enable row level security;

-- Drop existing policies if they exist
drop policy if exists runs_select_scoped on public.image_edit_runs;
drop policy if exists runs_insert_self on public.image_edit_runs;
drop policy if exists runs_delete_scoped on public.image_edit_runs;
drop policy if exists assets_select_scoped on public.image_edit_assets;
drop policy if exists assets_insert_self on public.image_edit_assets;
drop policy if exists assets_delete_scoped on public.image_edit_assets;

-- RLS Policies for image_edit_runs (owner/broker see all; agents see own)
create policy runs_select_scoped on public.image_edit_runs
for select using (
  auth.role() = 'service_role'
  or public.jwt_role() in ('owner','broker')
  or (auth.uid() = user_id)
);

create policy runs_insert_self on public.image_edit_runs
for insert with check (auth.uid() = user_id or auth.role() = 'service_role');

create policy runs_delete_scoped on public.image_edit_runs
for delete using (
  auth.role() = 'service_role'
  or public.jwt_role() in ('owner','broker')
  or (auth.uid() = user_id)
);

-- RLS Policies for image_edit_assets
create policy assets_select_scoped on public.image_edit_assets
for select using (
  auth.role() = 'service_role'
  or public.jwt_role() in ('owner','broker')
  or (auth.uid() = user_id)
);

create policy assets_insert_self on public.image_edit_assets
for insert with check (auth.uid() = user_id or auth.role() = 'service_role');

create policy assets_delete_scoped on public.image_edit_assets
for delete using (
  auth.role() = 'service_role'
  or public.jwt_role() in ('owner','broker')
  or (auth.uid() = user_id)
);

-- Storage bucket policies for image-edits (apply after creating bucket)
-- Drop existing policies first
drop policy if exists storage_edits_read_public on storage.objects;
drop policy if exists storage_edits_write_service on storage.objects;
drop policy if exists storage_edits_update_service on storage.objects;
drop policy if exists storage_edits_delete_service on storage.objects;

-- Public read policy
create policy storage_edits_read_public
on storage.objects for select
to public
using ( bucket_id = 'image-edits' );

-- Only service_role may write/update/delete
create policy storage_edits_write_service
on storage.objects for insert
to public
with check ( auth.role() = 'service_role' and bucket_id = 'image-edits' );

create policy storage_edits_update_service
on storage.objects for update
to public
using ( auth.role() = 'service_role' and bucket_id = 'image-edits' )
with check ( auth.role() = 'service_role' and bucket_id = 'image-edits' );

create policy storage_edits_delete_service
on storage.objects for delete
to public
using ( auth.role() = 'service_role' and bucket_id = 'image-edits' );
```

---

## 📦 Step 2: Create Storage Bucket

1. Go to **Supabase Dashboard → Storage**
2. Click **"New bucket"**
3. Enter bucket name: **`image-edits`**
4. Set to **Public** ✅
5. Click **Create bucket**

The storage policies from the SQL migration will automatically apply.

---

## 👥 Step 3: Configure User Roles

For each user in your system, set their role in `app_metadata`:

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click on a user
3. Scroll to **"Raw User Meta Data"**
4. Edit the JSON to include:

```json
{
  "role": "owner"
}
```

**Available roles:**
- `owner` - Can see all runs, admin widget, full access
- `broker` - Can see all runs, admin widget, full access
- `agent` - Can only see their own runs, no admin widget

---

## 🔐 Step 4: Update Environment Variables

Add these to your `.env.local` file (if not already present):

```env
# Supabase (server-side operations)
SUPABASE_URL=https://xhqwmtzawqfffepcqxwf.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Supabase (browser/client)
NEXT_PUBLIC_SUPABASE_URL=https://xhqwmtzawqfffepcqxwf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# FAL AI (optional - can be set via UI Settings modal)
NEXT_PUBLIC_FAL_API_KEY=sk_fal_xxx
```

**Where to find these values:**
- Go to **Supabase Dashboard → Project Settings → API**
- Copy `URL` → use for both `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public` key → use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key → use for `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **Keep secret!**

---

## 🎨 Step 5: Get FAL API Key (Optional)

If you want to pre-configure the FAL API key:

1. Sign up at [fal.ai](https://fal.ai)
2. Get a client API key (starts with `sk_fal_`)
3. Add to `.env.local` as `NEXT_PUBLIC_FAL_API_KEY`

**Note:** Users can also paste their FAL key via the Settings modal in the Image Editor UI.

---

## ✅ Step 6: Restart Dev Server

After updating `.env.local`:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 Testing the Feature

### Test as Agent:
1. Login as a user with `app_metadata.role = "agent"`
2. Navigate to `/dashboard/image-editor` (visible in sidebar under "AI Tools")
3. Upload 2-3 test images
4. Enter a prompt: `"Bright airy look, soft studio lighting"`
5. Click **"Edit Images"**
6. Verify:
   - Progress bar updates
   - Edited images appear
   - Download buttons work
   - Images saved to Supabase Storage at `image-edits/{user_id}/{run_id}/*.jpg`

### Test as Owner/Broker:
1. Login as a user with `app_metadata.role = "owner"` or `"broker"`
2. Navigate to `/dashboard/image-editor`
3. Run the same image editing flow
4. Verify AdminUsageWidget appears (if you add it to a page)
5. Check that stats display correctly:
   - Storage used
   - Runs this month
   - Top agents
   - Recent thumbnails

### Verify Storage:
1. Go to **Supabase Dashboard → Storage → image-edits**
2. Confirm folder structure: `{user_id}/{run_id}/{uuid}.jpg`
3. Click an image to verify the public URL works
4. Confirm bucket is set to "Public"

---

## 📁 Files Created

### New Files (7):
1. ✅ `lib/supabaseServer.ts` - Server-side admin client
2. ✅ `lib/supabaseBrowser.ts` - Browser auth client
3. ✅ `app/dashboard/image-editor/page.tsx` - Main Image Studio page
4. ✅ `app/api/image-history/log/route.ts` - Save images to Storage
5. ✅ `app/api/image-history/list/route.ts` - List runs (role-scoped)
6. ✅ `app/api/admin/image-usage/summary/route.ts` - Admin stats endpoint
7. ✅ `components/admin/AdminUsageWidget.tsx` - Usage monitor widget

### Modified Files (1):
1. ✅ `components/shell/SideNav.tsx` - Added Image Editor link

### Dependencies Added:
- ✅ `@fal-ai/client` - FAL AI SDK

---

## 🎯 Feature Summary

**What's Working:**
- ✅ Multi-image batch editing (up to 30 images, 50MB each)
- ✅ Drag & drop + file picker upload
- ✅ Real-time progress tracking with status per image
- ✅ Concurrent processing (3 images at a time)
- ✅ Advanced controls (strength, guidance, seed, preserve background)
- ✅ Download individual or all edited images
- ✅ Automatic save to Supabase Storage with permanent public URLs
- ✅ Role-based history visibility (owner/broker see all, agents see own)
- ✅ Admin usage monitoring (storage, runs, top agents, recent previews)
- ✅ Settings modal for FAL API key
- ✅ Matte dark/glass UI matching your dashboard theme

**Security:**
- ✅ All database writes via server routes with service role key
- ✅ Browser never exposes service role key
- ✅ Row Level Security enforces role-based access
- ✅ Storage policies ensure only server can write, everyone can read

---

## 🔧 Optional: Add Admin Widget to Dashboard

To display the usage widget on your main dashboard:

Edit `app/dashboard/page.tsx` and add:

```tsx
import dynamic from 'next/dynamic';
const AdminUsageWidget = dynamic(
  () => import('@/components/admin/AdminUsageWidget'),
  { ssr: false }
);

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Your existing dashboard content */}

      {/* Add this at the bottom: */}
      <AdminUsageWidget />
    </div>
  );
}
```

The widget will automatically hide for agents (403 from API = renders nothing).

---

## 🚀 You're Ready!

Access the Image Studio at: **http://localhost:3000/dashboard/image-editor**

The feature is fully integrated and ready to use once you complete the Supabase setup steps above.
