# Owner Admin Dashboard - Implementation Plan

## Overview
Create a comprehensive admin dashboard for site owners (brokers) with operational controls, content management, agent monitoring, and blog management capabilities.

## Route Structure

```
/admin                          # Main admin dashboard (overview)
├── /admin/content              # Home page content management
├── /admin/analytics            # Agent activity monitoring
│   ├── /admin/analytics/agents # Per-agent activity breakdown
│   └── /admin/analytics/images # Image creation history
├── /admin/blog                 # Blog post management
│   ├── /admin/blog/new         # Create new blog post
│   ├── /admin/blog/[id]/edit   # Edit existing post
│   └── /admin/blog/automated   # Automated blog settings
└── /admin/settings             # Custom content and site settings
```

## Access Control

### Role Requirements
- **Only accessible to**: `super_admin` and `broker` roles
- **Block access from**: `agent` and `public_user` roles

### Middleware Updates
Update `/middleware.ts` to add admin route protection:
```typescript
const adminRoutes = ['/admin'];
const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

if (isAdminRoute) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['super_admin', 'broker'].includes(profile.role)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
}
```

## Database Schema

### 1. Site Content Management
```sql
CREATE TABLE site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL, -- 'hero', 'features', 'cta', 'about', etc.
  content_key text NOT NULL, -- 'headline', 'subheadline', 'button_text', etc.
  content_value text NOT NULL,
  content_type text DEFAULT 'text', -- 'text', 'html', 'image_url', 'json'
  brokerage_id uuid REFERENCES brokerages(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  UNIQUE(section, content_key, brokerage_id)
);

-- RLS Policies
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage site content" ON site_content
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents a
      JOIN profiles p ON p.id = a.user_id
      WHERE a.user_id = auth.uid()
        AND p.role IN ('super_admin', 'broker')
        AND a.brokerage_id = site_content.brokerage_id
    )
  );

CREATE POLICY "Public can view active site content" ON site_content
  FOR SELECT TO anon
  USING (is_active = true);
```

### 2. Blog Posts
```sql
CREATE TYPE blog_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE blog_source AS ENUM ('manual', 'automated');

CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  content text NOT NULL,
  content_html text, -- Rendered HTML
  featured_image text,
  author_id uuid REFERENCES auth.users(id),
  brokerage_id uuid REFERENCES brokerages(id),
  status blog_status DEFAULT 'draft',
  source blog_source DEFAULT 'manual',
  seo_title text,
  seo_description text,
  tags text[],
  published_at timestamptz,
  scheduled_for timestamptz,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(slug, brokerage_id)
);

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents a
      JOIN profiles p ON p.id = a.user_id
      WHERE a.user_id = auth.uid()
        AND p.role IN ('super_admin', 'broker')
        AND a.brokerage_id = blog_posts.brokerage_id
    )
  );

CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published');
```

### 3. Agent Activity Log
```sql
CREATE TYPE activity_type AS ENUM (
  'login',
  'image_create',
  'image_edit',
  'property_view',
  'search',
  'saved_search_create',
  'saved_search_run',
  'profile_update',
  'listing_view'
);

CREATE TABLE agent_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  brokerage_id uuid REFERENCES brokerages(id),
  activity_type activity_type NOT NULL,
  activity_details jsonb, -- Flexible data storage
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  metadata jsonb -- Additional tracking data
);

-- Index for performance
CREATE INDEX idx_agent_activity_agent_id ON agent_activity_log(agent_id);
CREATE INDEX idx_agent_activity_created_at ON agent_activity_log(created_at DESC);
CREATE INDEX idx_agent_activity_type ON agent_activity_log(activity_type);

-- RLS Policies
ALTER TABLE agent_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity logs" ON agent_activity_log
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents a
      JOIN profiles p ON p.id = a.user_id
      WHERE a.user_id = auth.uid()
        AND p.role IN ('super_admin', 'broker')
        AND a.brokerage_id = agent_activity_log.brokerage_id
    )
  );

CREATE POLICY "System can insert activity logs" ON agent_activity_log
  FOR INSERT TO authenticated
  WITH CHECK (true);
```

### 4. Image Creations Tracking
```sql
-- Extend existing image_history or create new table
CREATE TABLE image_creations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  brokerage_id uuid REFERENCES brokerages(id),
  original_image_url text NOT NULL,
  processed_image_url text,
  processing_type text, -- 'virtual_staging', 'enhancement', etc.
  fal_request_id text,
  cost_credits numeric(10,2),
  processing_time_ms integer,
  status text DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  error_message text,
  metadata jsonb, -- Property info, room type, style, etc.
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- RLS Policies
ALTER TABLE image_creations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all image creations" ON image_creations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents a
      JOIN profiles p ON p.id = a.user_id
      WHERE a.user_id = auth.uid()
        AND p.role IN ('super_admin', 'broker')
        AND a.brokerage_id = image_creations.brokerage_id
    )
  );

CREATE POLICY "Agents can view their own image creations" ON image_creations
  FOR SELECT TO authenticated
  USING (
    agent_id = (
      SELECT id FROM agents WHERE user_id = auth.uid()
    )
  );
```

### 5. Automated Blog Settings
```sql
CREATE TABLE automated_blog_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brokerage_id uuid REFERENCES brokerages(id) UNIQUE,
  is_enabled boolean DEFAULT false,
  frequency text DEFAULT 'weekly', -- 'daily', 'weekly', 'biweekly', 'monthly'
  topics text[], -- Market trends, local events, tips, etc.
  tone text DEFAULT 'professional', -- 'professional', 'casual', 'friendly'
  target_word_count integer DEFAULT 800,
  include_images boolean DEFAULT true,
  auto_publish boolean DEFAULT false, -- Auto-publish or save as draft
  last_generated_at timestamptz,
  next_scheduled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE automated_blog_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage blog settings" ON automated_blog_settings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents a
      JOIN profiles p ON p.id = a.user_id
      WHERE a.user_id = auth.uid()
        AND p.role IN ('super_admin', 'broker')
        AND a.brokerage_id = automated_blog_settings.brokerage_id
    )
  );
```

## Feature Breakdown

### 1. Main Admin Dashboard (`/admin`)
**Purpose**: Overview of site operations and key metrics

**Components**:
- Summary cards: Total agents, active listings, blog posts, images created
- Recent agent activity (last 10 actions)
- Quick actions: Create blog post, update home page, view analytics
- System health indicators: API status, database status

### 2. Home Page Content Management (`/admin/content`)
**Purpose**: Edit home page sections without code changes

**Sections Configurable**:
- Hero section (headline, subheadline, CTA button text, background image)
- Features section (title, description, feature cards)
- About section (text, images)
- CTA sections (text, buttons)
- Footer content

**UI Features**:
- Live preview of changes
- Revert to previous versions
- Schedule content changes
- Mobile/desktop preview toggle

### 3. Agent Analytics Dashboard (`/admin/analytics`)
**Purpose**: Monitor agent activity and usage patterns

**Metrics Displayed**:
- Login frequency per agent
- Images created (total, this week, this month)
- Property views
- Searches performed
- Saved searches created/run
- Most active agents (leaderboard)
- Activity timeline (hourly/daily/weekly views)

**Filtering**:
- Date range selector
- Agent selector (individual or all)
- Activity type filter

**Export Options**:
- CSV export
- PDF report generation

### 4. Image Creation History (`/admin/analytics/images`)
**Purpose**: Track all virtual staging and image edits

**Data Displayed**:
- Thumbnail of original and processed images
- Agent who created it
- Date/time created
- Processing time
- Cost (if applicable)
- Property associated with

**Features**:
- Search by agent, date, property
- Download images
- View processing details
- Cost analysis (total spend, per-agent)

### 5. Blog Post Management (`/admin/blog`)
**Purpose**: Create, edit, and manage blog content

**Features**:
- Rich text editor (Markdown or WYSIWYG)
- SEO fields (title, description, slug)
- Featured image upload
- Tag management
- Status: Draft, Scheduled, Published, Archived
- Preview mode
- Analytics: View count, engagement

**Automated Blog System** (`/admin/blog/automated`):
- Enable/disable automated posting
- Set frequency (daily, weekly, monthly)
- Choose topics (market trends, buyer tips, local events)
- Set tone and style
- Auto-publish or save as draft
- Preview generated content before publishing
- Edit automated posts before publishing

### 6. Custom Settings (`/admin/settings`)
**Purpose**: Site-wide configuration

**Settings**:
- Brokerage info (name, logo, contact)
- Branding (colors, fonts)
- Feature flags (enable/disable features)
- API keys management (view/rotate)
- Custom content blocks
- Email notifications preferences

## Implementation Phases

### Phase 1: Foundation (Priority 1)
1. Create database migrations for all new tables
2. Update middleware for admin route protection
3. Create base admin layout component
4. Build main admin dashboard page

### Phase 2: Content Management (Priority 2)
1. Implement site content management system
2. Create content editor UI
3. Add live preview functionality
4. Build version history system

### Phase 3: Analytics & Monitoring (Priority 3)
1. Implement activity logging middleware
2. Build analytics dashboard UI
3. Create agent activity reports
4. Add image creation tracking

### Phase 4: Blog System (Priority 4)
1. Create blog post CRUD operations
2. Build blog editor with rich text
3. Implement blog public pages
4. Add SEO optimization features

### Phase 5: Automated Blog (Priority 5)
1. Integrate AI content generation (Claude API)
2. Build scheduling system
3. Create automated blog settings UI
4. Implement auto-publishing workflow

### Phase 6: Polish & Testing (Priority 6)
1. Add export functionality
2. Implement email notifications
3. Mobile responsiveness
4. Security testing
5. Performance optimization

## Activity Logging Integration

To automatically track agent activity, create a reusable logging function:

```typescript
// lib/activityLogger.ts
export async function logActivity(
  agentId: string,
  activityType: ActivityType,
  details?: Record<string, any>,
  metadata?: Record<string, any>
) {
  const supabase = createClientComponentClient();

  // Get brokerage_id for the agent
  const { data: agent } = await supabase
    .from('agents')
    .select('brokerage_id')
    .eq('id', agentId)
    .single();

  if (!agent) return;

  await supabase.from('agent_activity_log').insert({
    agent_id: agentId,
    brokerage_id: agent.brokerage_id,
    activity_type: activityType,
    activity_details: details,
    metadata: metadata
  });
}
```

**Usage Example**:
```typescript
// When agent creates an image
await logActivity(
  agentId,
  'image_create',
  {
    image_url: processedUrl,
    processing_type: 'virtual_staging'
  },
  {
    property_id: propertyId,
    cost_credits: 2.5
  }
);
```

## UI Components Needed

### Admin Layout
- Sidebar navigation (content, analytics, blog, settings)
- Top bar with user menu and notifications
- Breadcrumb navigation

### Shared Components
- `<AdminCard>` - Metric display cards
- `<DataTable>` - Sortable, filterable tables
- `<DateRangePicker>` - Date selection for analytics
- `<RichTextEditor>` - Blog post editor
- `<ImageUploader>` - Featured image upload
- `<ActivityTimeline>` - Agent activity feed
- `<ExportButton>` - CSV/PDF export

### Charts (using Recharts)
- Line chart for activity over time
- Bar chart for agent comparisons
- Pie chart for activity type breakdown
- Area chart for cumulative metrics

## Security Considerations

1. **Access Control**: Double-check role on server-side for all admin API routes
2. **Activity Logging**: Only log non-sensitive data, avoid PII
3. **Content Validation**: Sanitize all user-input content before saving
4. **Rate Limiting**: Prevent abuse of automated blog generation
5. **Audit Trail**: Log all admin actions for accountability

## Testing Checklist

- [ ] Admin routes blocked for agent role
- [ ] Admin routes blocked for public users
- [ ] Content changes reflect on home page
- [ ] Activity logging fires on all tracked actions
- [ ] Blog posts display correctly on public pages
- [ ] Automated blog generation works
- [ ] Analytics data is accurate
- [ ] Export functions work (CSV, PDF)
- [ ] Mobile responsive on all admin pages
- [ ] Performance: Admin dashboard loads in <2s

## Future Enhancements

- Email digest of weekly agent activity
- Advanced analytics (cohort analysis, retention)
- A/B testing for home page content
- Automated social media posting for blog posts
- Integration with Google Analytics
- Custom reports builder
- Agent performance goals and tracking
