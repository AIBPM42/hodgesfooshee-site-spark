# Admin Dashboard Setup Instructions

## Step 1: Run the Database Migration

The migration file is ready at: `supabase/migrations/20251103_owner_admin_dashboard.sql`

**To apply it:**

1. Go to your Supabase project: https://supabase.com/dashboard/project/xhqwmtzawqfffepcqxwf
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Open the file `supabase/migrations/20251103_owner_admin_dashboard.sql`
5. Copy the entire contents
6. Paste into the Supabase SQL Editor
7. Click "Run" or press Cmd+Enter

**This will create:**
- `site_content` - Home page content management
- `blog_posts` - Blog post system (manual + automated)
- `agent_activity_log` - Activity tracking for analytics
- `image_creations` - Image processing history
- `automated_blog_settings` - Auto-blog configuration
- `site_content_history` - Version control for content changes
- Helper functions for analytics queries

## Step 2: Verify Tables Were Created

Run this query in the SQL Editor to verify:

```sql
SELECT
  tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'site_content',
    'blog_posts',
    'agent_activity_log',
    'image_creations',
    'automated_blog_settings',
    'site_content_history'
  )
ORDER BY tablename;
```

You should see all 6 tables listed.

## Step 3: Initialize Default Content

After the tables are created, run this to add default home page content:

```sql
-- Get your brokerage ID first
SELECT id, name FROM brokerages LIMIT 5;

-- Then initialize default content (replace YOUR_BROKERAGE_ID)
SELECT initialize_default_site_content('YOUR_BROKERAGE_ID'::uuid);
```

## Step 4: Development is Ready

Once the migration runs successfully, I can proceed with:
- Building the admin UI pages
- Adding middleware protection for `/admin` routes
- Creating the content management interface
- Building the analytics dashboard

Let me know when you've run the migration and I'll continue with the admin pages!

## What This Enables

After setup, the owner will be able to:
- Edit home page content (hero, features, CTAs) without code
- Create and manage blog posts (manual and automated)
- View agent activity (logins, images created, searches)
- Track all image processing with costs
- Configure automated blog posting
- Monitor site usage and performance
