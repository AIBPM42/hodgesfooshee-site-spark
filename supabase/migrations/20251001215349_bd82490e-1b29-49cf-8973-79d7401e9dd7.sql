-- Create site_settings table (single row for homepage control)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  published boolean DEFAULT true,
  hero_mode text CHECK (hero_mode IN ('image', 'video', 'off')) DEFAULT 'image',
  headline text,
  subheadline text,
  default_city text,
  price_min numeric,
  price_max numeric,
  show_new_this_week boolean DEFAULT true,
  show_open_houses boolean DEFAULT true,
  show_explore_cities boolean DEFAULT true,
  show_hot_ai boolean DEFAULT true,
  cta_primary_text text,
  cta_secondary_text text,
  benefit_bullets jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Create insights_posts table (blog/market insights)
CREATE TABLE IF NOT EXISTS public.insights_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  teaser text,
  tags text[] DEFAULT '{}',
  hero_image text,
  content_md text,
  pinned boolean DEFAULT false,
  publish_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create analytics_events table (user behavior tracking)
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id bigserial PRIMARY KEY,
  ts timestamptz DEFAULT now(),
  event text NOT NULL,
  uid text,
  path text,
  meta jsonb,
  referrer text,
  ua text
);

-- Create ai_hot_properties table (AI-scouted property leads)
CREATE TABLE IF NOT EXISTS public.ai_hot_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text NOT NULL,
  city text,
  county text,
  price_low numeric,
  price_high numeric,
  beds integer,
  baths numeric,
  sqft integer,
  score numeric CHECK (score >= 0 AND score <= 1),
  summary text,
  lead_name text,
  lead_email text,
  lead_phone text,
  source text DEFAULT 'manus',
  verified boolean DEFAULT false,
  hidden boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on analytics_events for efficient querying
CREATE INDEX IF NOT EXISTS idx_analytics_events_ts ON public.analytics_events(ts DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON public.analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_events_uid ON public.analytics_events(uid);

-- Create index on insights_posts for efficient querying
CREATE INDEX IF NOT EXISTS idx_insights_posts_slug ON public.insights_posts(slug);
CREATE INDEX IF NOT EXISTS idx_insights_posts_publish_at ON public.insights_posts(publish_at DESC);

-- Create index on ai_hot_properties for efficient querying
CREATE INDEX IF NOT EXISTS idx_ai_hot_properties_city ON public.ai_hot_properties(city);
CREATE INDEX IF NOT EXISTS idx_ai_hot_properties_score ON public.ai_hot_properties(score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_hot_properties_hidden ON public.ai_hot_properties(hidden);

-- Enable RLS but keep policies permissive during build (no auth yet)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_hot_properties ENABLE ROW LEVEL SECURITY;

-- Permissive policies for build phase (tighten later with auth)
CREATE POLICY "Public can read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Service role can update site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'service_role'::text);

CREATE POLICY "Public can read published insights" ON public.insights_posts FOR SELECT USING (publish_at <= now());
CREATE POLICY "Service role can manage insights" ON public.insights_posts FOR ALL USING (auth.role() = 'service_role'::text);

CREATE POLICY "Service role can read analytics" ON public.analytics_events FOR SELECT USING (auth.role() = 'service_role'::text);
CREATE POLICY "Anyone can insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read non-hidden hot properties" ON public.ai_hot_properties FOR SELECT USING (hidden = false OR auth.role() = 'service_role'::text);
CREATE POLICY "Service role can manage hot properties" ON public.ai_hot_properties FOR ALL USING (auth.role() = 'service_role'::text);

-- Seed initial site_settings row
INSERT INTO public.site_settings (
  hero_mode, headline, subheadline, default_city, 
  price_min, price_max, 
  show_new_this_week, show_open_houses, show_explore_cities, show_hot_ai,
  cta_primary_text, cta_secondary_text, benefit_bullets
) VALUES (
  'image',
  'Your Source for Nashville Real Estate Excellence',
  'Discover exceptional properties across Middle Tennessee with Nashville''s most trusted real estate experts.',
  'Nashville',
  250000, 950000,
  true, true, true, true,
  'Get Instant Access', 'Schedule Private Consultation',
  '["Off-market opportunities","Neighborhood-level insight","Private showings"]'::jsonb
) ON CONFLICT DO NOTHING;