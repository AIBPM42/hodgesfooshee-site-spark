# Image Studio V2 Setup Guide

## 🎉 What's New

Image Studio V2 is a complete rewrite with:
- ✅ FAL Playground-inspired layout (left controls, right preview)
- ✅ Multi-image batch processing
- ✅ Real-time logs panel
- ✅ Before/After side-by-side comparison
- ✅ Complete analytics tracking (runs & downloads)
- ✅ Owner usage dashboard widget
- ✅ Same powerful `fal-ai/nano-banana/edit` AI model

## 📁 Files Created

```
app/
  dashboard/
    image-editor-v2/
      page.tsx                    # Main v2 page
  api/
    image-logs/
      route.ts                    # Logging API endpoint
    usage-summary/
      route.ts                    # Owner analytics API

components/
  UsageWidget.tsx                 # Owner dashboard widget

lib/
  usage.ts                        # Client logging helpers

supabase/
  migrations/
    20251101_create_image_analytics_tables.sql   # Database schema
```

## 🗄️ Database Setup

**IMPORTANT:** You need to run the SQL migration manually in your Supabase dashboard:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/20251101_create_image_analytics_tables.sql`
6. Paste and click **Run**

This creates:
- `image_edit_runs` table - tracks each AI editing session
- `image_downloads` table - tracks when users download images
- `top_edit_agents_this_month()` function - aggregates top 5 users
- RLS policies - owners see all data, agents see only their own

## 🔑 Environment Variables

Make sure you have in `.env.local`:

```bash
NEXT_PUBLIC_FAL_API_KEY=your_fal_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Get your FAL API key from: https://fal.ai/dashboard

## 🚀 Usage

### Access the New Version

Navigate to: `/dashboard/image-editor-v2`

### How to Use

1. **Upload Images** - Drop or browse to add images (max 10MB each)
2. **Write Prompt** - Describe your desired edit
3. **Adjust Settings** - Tweak strength, guidance, aspect ratio, etc.
4. **Click Run Edit** - Process all images in batch
5. **Review Results** - See before/after comparison
6. **Download** - Save edited images (downloads are tracked)

### Analytics Tracking

Every edit run automatically logs:
- User ID
- Prompt used
- Settings (strength, guidance, seed, etc.)
- Number of images in/out
- Storage bytes (if uploading to Supabase Storage)

Every download logs:
- User ID
- Associated run ID
- File URL
- File size

### Owner Dashboard

Add the UsageWidget to any owner-only page:

```tsx
import UsageWidget from '@/components/UsageWidget';

export default function DashboardHome() {
  return (
    <div>
      <UsageWidget />
      {/* other content */}
    </div>
  );
}
```

The widget shows:
- Total runs this month
- Total images edited this month
- Storage used (MB)
- Top 5 agents by edit count

## 🎨 Features

### Left Panel (Controls)
- File upload with drag & drop
- Prompt text area
- Advanced settings:
  - Strength (0-1)
  - Guidance Scale (1-10)
  - Random Seed
  - Preserve Background toggle
  - Output format (JPEG/PNG/WebP)
  - Aspect ratio presets
  - Sync mode toggle
- Run button with batch count

### Right Panel (Results)
- Image queue tabs with status indicators
- Before/After side-by-side viewer
- Download button
- Open in new tab button
- Real-time logs panel at bottom

### Status Indicators
- ⚪ Idle - Not yet processed
- 🔄 Processing - AI is working
- ✅ Done - Successfully edited
- ❌ Error - Something went wrong

## 🔄 Migration from V1

**DO NOT DELETE** `/dashboard/image-editor` yet!

To switch:

1. Test v2 thoroughly at `/dashboard/image-editor-v2`
2. When confident, update your navigation to point to v2
3. Monitor for a week
4. Delete old version when satisfied

## 🐛 Troubleshooting

### "Unauthorized" error on analytics
- Make sure you're logged in
- Check that your user has a `profiles` entry
- Verify RLS policies are applied

### FAL API errors
- Confirm `NEXT_PUBLIC_FAL_API_KEY` is set
- Check FAL dashboard for quota/billing issues
- Verify image is under 10MB

### Migration won't push
- Run SQL manually in Supabase dashboard (see Database Setup above)
- Don't use `supabase db push` if you have migration history issues

## 📊 Schema Reference

### image_edit_runs
```sql
id uuid primary key
user_id uuid not null
prompt text not null
options jsonb
images_in int
images_out int
storage_bytes bigint
created_at timestamptz
```

### image_downloads
```sql
id uuid primary key
user_id uuid not null
run_id uuid references image_edit_runs(id)
file_url text not null
bytes bigint
created_at timestamptz
```

## 🎯 Next Steps

1. Run the SQL migration
2. Test the new page at `/dashboard/image-editor-v2`
3. Upload test images and verify logging works
4. Check the UsageWidget displays correctly for owners
5. Update your nav menu to use v2
6. Train your team on the new interface

---

Built with ❤️ for Hodges & Fooshee by Claude
