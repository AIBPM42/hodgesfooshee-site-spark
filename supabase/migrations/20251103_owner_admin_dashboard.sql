-- Owner Admin Dashboard Migration
-- Creates tables for site content management, blog posts, activity logging, and image tracking

-- ============================================================================
-- 1. SITE CONTENT MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL, -- 'hero', 'features', 'cta', 'about', etc.
  content_key text NOT NULL, -- 'headline', 'subheadline', 'button_text', etc.
  content_value text NOT NULL,
  content_type text DEFAULT 'text', -- 'text', 'html', 'image_url', 'json'
  brokerage_id uuid REFERENCES brokerages(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  UNIQUE(section, content_key, brokerage_id)
);

-- RLS Policies for site_content
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
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- ============================================================================
-- 2. BLOG POSTS
-- ============================================================================

-- Blog status enum
DO $$ BEGIN
  CREATE TYPE blog_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Blog source enum
DO $$ BEGIN
  CREATE TYPE blog_source AS ENUM ('manual', 'automated');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  content text NOT NULL,
  content_html text, -- Rendered HTML
  featured_image text,
  author_id uuid REFERENCES auth.users(id),
  brokerage_id uuid REFERENCES brokerages(id) ON DELETE CASCADE,
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

-- Indexes for blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_brokerage_id ON blog_posts(brokerage_id);

-- RLS Policies for blog_posts
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
  USING (status = 'published' AND published_at <= now());

-- ============================================================================
-- 3. AGENT ACTIVITY LOG
-- ============================================================================

-- Activity type enum
DO $$ BEGIN
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
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS agent_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  brokerage_id uuid REFERENCES brokerages(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  activity_details jsonb, -- Flexible data storage
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  metadata jsonb -- Additional tracking data
);

-- Indexes for agent_activity_log (critical for performance)
CREATE INDEX IF NOT EXISTS idx_agent_activity_agent_id ON agent_activity_log(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_activity_brokerage_id ON agent_activity_log(brokerage_id);
CREATE INDEX IF NOT EXISTS idx_agent_activity_created_at ON agent_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_activity_type ON agent_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_agent_activity_composite ON agent_activity_log(brokerage_id, created_at DESC);

-- RLS Policies for agent_activity_log
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
  WITH CHECK (
    agent_id = (
      SELECT id FROM agents WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- 4. IMAGE CREATIONS TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS image_creations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  brokerage_id uuid REFERENCES brokerages(id) ON DELETE CASCADE,
  original_image_url text NOT NULL,
  processed_image_url text,
  processing_type text, -- 'virtual_staging', 'enhancement', 'object_removal', etc.
  fal_request_id text,
  cost_credits numeric(10,2),
  processing_time_ms integer,
  status text DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  error_message text,
  metadata jsonb, -- Property info, room type, style, etc.
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Indexes for image_creations
CREATE INDEX IF NOT EXISTS idx_image_creations_agent_id ON image_creations(agent_id);
CREATE INDEX IF NOT EXISTS idx_image_creations_brokerage_id ON image_creations(brokerage_id);
CREATE INDEX IF NOT EXISTS idx_image_creations_created_at ON image_creations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_image_creations_status ON image_creations(status);

-- RLS Policies for image_creations
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

CREATE POLICY "Agents can insert their own image creations" ON image_creations
  FOR INSERT TO authenticated
  WITH CHECK (
    agent_id = (
      SELECT id FROM agents WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. AUTOMATED BLOG SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS automated_blog_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brokerage_id uuid REFERENCES brokerages(id) ON DELETE CASCADE UNIQUE,
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

-- RLS Policies for automated_blog_settings
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

-- ============================================================================
-- 6. CONTENT VERSION HISTORY (for rollback capability)
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_content_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES site_content(id) ON DELETE CASCADE,
  section text NOT NULL,
  content_key text NOT NULL,
  content_value text NOT NULL,
  content_type text,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now()
);

-- Index for content history
CREATE INDEX IF NOT EXISTS idx_content_history_content_id ON site_content_history(content_id, changed_at DESC);

-- RLS Policies for site_content_history
ALTER TABLE site_content_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view content history" ON site_content_history
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM site_content sc
      JOIN agents a ON a.brokerage_id = sc.brokerage_id
      JOIN profiles p ON p.id = a.user_id
      WHERE sc.id = site_content_history.content_id
        AND a.user_id = auth.uid()
        AND p.role IN ('super_admin', 'broker')
    )
  );

-- ============================================================================
-- 7. TRIGGER FUNCTIONS
-- ============================================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_automated_blog_settings_updated_at ON automated_blog_settings;
CREATE TRIGGER update_automated_blog_settings_updated_at
  BEFORE UPDATE ON automated_blog_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to save content history before updates
CREATE OR REPLACE FUNCTION save_content_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO site_content_history (
    content_id,
    section,
    content_key,
    content_value,
    content_type,
    changed_by
  ) VALUES (
    OLD.id,
    OLD.section,
    OLD.content_key,
    OLD.content_value,
    OLD.content_type,
    OLD.updated_by
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS save_site_content_history ON site_content;
CREATE TRIGGER save_site_content_history
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION save_content_history();

-- ============================================================================
-- 8. HELPER FUNCTIONS FOR ANALYTICS
-- ============================================================================

-- Function to get activity summary for a brokerage
CREATE OR REPLACE FUNCTION get_brokerage_activity_summary(
  p_brokerage_id uuid,
  p_start_date timestamptz DEFAULT now() - interval '30 days',
  p_end_date timestamptz DEFAULT now()
)
RETURNS TABLE (
  activity_type activity_type,
  activity_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    aal.activity_type,
    COUNT(*) as activity_count
  FROM agent_activity_log aal
  WHERE aal.brokerage_id = p_brokerage_id
    AND aal.created_at >= p_start_date
    AND aal.created_at <= p_end_date
  GROUP BY aal.activity_type
  ORDER BY activity_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get agent activity leaderboard
CREATE OR REPLACE FUNCTION get_agent_activity_leaderboard(
  p_brokerage_id uuid,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  agent_id uuid,
  agent_name text,
  total_activities bigint,
  images_created bigint,
  logins bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id as agent_id,
    CONCAT(a.first_name, ' ', a.last_name) as agent_name,
    COUNT(aal.id) as total_activities,
    COUNT(aal.id) FILTER (WHERE aal.activity_type = 'image_create') as images_created,
    COUNT(aal.id) FILTER (WHERE aal.activity_type = 'login') as logins
  FROM agents a
  LEFT JOIN agent_activity_log aal ON aal.agent_id = a.id
  WHERE a.brokerage_id = p_brokerage_id
  GROUP BY a.id, a.first_name, a.last_name
  ORDER BY total_activities DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. DEFAULT CONTENT FOR NEW BROKERAGES
-- ============================================================================

-- Function to initialize default site content for a new brokerage
CREATE OR REPLACE FUNCTION initialize_default_site_content(p_brokerage_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO site_content (section, content_key, content_value, brokerage_id) VALUES
    -- Hero Section
    ('hero', 'headline', 'Find Your Dream Home in Nashville', p_brokerage_id),
    ('hero', 'subheadline', 'Search thousands of listings in Middle Tennessee', p_brokerage_id),
    ('hero', 'cta_text', 'Search Properties', p_brokerage_id),
    ('hero', 'background_image', '/images/hero-bg.jpg', p_brokerage_id),

    -- Features Section
    ('features', 'title', 'Why Choose Us', p_brokerage_id),
    ('features', 'subtitle', 'Experience real estate with cutting-edge technology', p_brokerage_id),

    -- About Section
    ('about', 'title', 'About Our Team', p_brokerage_id),
    ('about', 'content', 'We are dedicated real estate professionals serving Middle Tennessee.', p_brokerage_id),

    -- CTA Section
    ('cta', 'headline', 'Ready to Get Started?', p_brokerage_id),
    ('cta', 'subheadline', 'Contact us today to begin your real estate journey', p_brokerage_id),
    ('cta', 'button_text', 'Contact Us', p_brokerage_id)
  ON CONFLICT (section, content_key, brokerage_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 10. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE site_content IS 'Stores editable content for home page sections';
COMMENT ON TABLE blog_posts IS 'Blog posts with support for manual and automated creation';
COMMENT ON TABLE agent_activity_log IS 'Tracks all agent actions for analytics and monitoring';
COMMENT ON TABLE image_creations IS 'Tracks all image processing requests and costs';
COMMENT ON TABLE automated_blog_settings IS 'Configuration for automated blog post generation';
COMMENT ON TABLE site_content_history IS 'Version history for content changes with rollback capability';

COMMENT ON FUNCTION get_brokerage_activity_summary IS 'Returns activity counts by type for a brokerage in a date range';
COMMENT ON FUNCTION get_agent_activity_leaderboard IS 'Returns top agents ranked by activity count';
COMMENT ON FUNCTION initialize_default_site_content IS 'Seeds default content for a new brokerage';
