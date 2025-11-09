-- ULTIMATE COUNTY INTELLIGENCE SYSTEM
-- Add 5 intelligence tables + extend counties table
-- Preserves existing data and structure

-- ============================================
-- 1. EXTEND COUNTIES TABLE (preserve existing)
-- ============================================

-- Add new columns to existing counties table
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS hero_tagline TEXT;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- Quick Stats (individual columns for agent dashboard)
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS median_price INTEGER;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS days_on_market INTEGER;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS population INTEGER;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS median_income INTEGER;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS school_rating DECIMAL(3,1);
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS commute_minutes INTEGER;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS walkability_score INTEGER;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS crime_rating TEXT;

-- Content Sections (from Perplexity narrative)
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS market_overview TEXT;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS living_here TEXT;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS schools_education TEXT;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS commute_location TEXT;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS investment_outlook TEXT;

-- FAQ (top 10 questions for display)
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS faq_questions JSONB DEFAULT '[]'::jsonb;

-- Meta for SEO
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- SEO Score
ALTER TABLE public.counties ADD COLUMN IF NOT EXISTS seo_score DECIMAL(5,2);

-- ============================================
-- 2. SEO INTELLIGENCE TABLE (store ALL tool data)
-- ============================================

CREATE TABLE IF NOT EXISTS public.seo_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  county_id BIGINT REFERENCES public.counties(id) ON DELETE CASCADE,

  -- Metrics from tool
  relevance_score DECIMAL(5,2),
  entity_density DECIMAL(5,4),
  average_word_count INTEGER,
  average_images INTEGER,

  -- Complete raw data (JSONB storage)
  full_data JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Tracking
  last_updated TIMESTAMPTZ DEFAULT now(),
  source TEXT DEFAULT 'SEO Tool',

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(county_id)
);

CREATE INDEX IF NOT EXISTS idx_seo_intelligence_county ON public.seo_intelligence(county_id);
CREATE INDEX IF NOT EXISTS idx_seo_intelligence_data ON public.seo_intelligence USING gin(full_data);

-- Enable RLS
ALTER TABLE public.seo_intelligence ENABLE ROW LEVEL SECURITY;

-- Public read for SEO data
CREATE POLICY "seo_intelligence_public_select"
  ON public.seo_intelligence
  FOR SELECT
  USING (true);

-- Service role full access
CREATE POLICY "seo_intelligence_service_role_all"
  ON public.seo_intelligence
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 3. SEMANTIC KEYWORDS TABLE (trackable)
-- ============================================

CREATE TABLE IF NOT EXISTS public.semantic_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  county_id BIGINT REFERENCES public.counties(id) ON DELETE CASCADE,

  keyword TEXT NOT NULL,
  category TEXT, -- 'highly_related' or 'core'
  priority TEXT, -- 'critical', 'high', 'medium', 'low'

  -- Usage tracking
  used_in_content BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  first_used_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_semantic_keywords_county ON public.semantic_keywords(county_id);
CREATE INDEX IF NOT EXISTS idx_semantic_keywords_priority ON public.semantic_keywords(priority);
CREATE INDEX IF NOT EXISTS idx_semantic_keywords_used ON public.semantic_keywords(used_in_content);
CREATE INDEX IF NOT EXISTS idx_semantic_keywords_keyword ON public.semantic_keywords(keyword);

-- Enable RLS
ALTER TABLE public.semantic_keywords ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "semantic_keywords_public_select"
  ON public.semantic_keywords
  FOR SELECT
  USING (true);

-- Service role full access
CREATE POLICY "semantic_keywords_service_role_all"
  ON public.semantic_keywords
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 4. COMPETITOR GAPS TABLE (track coverage)
-- ============================================

CREATE TABLE IF NOT EXISTS public.competitor_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  county_id BIGINT REFERENCES public.counties(id) ON DELETE CASCADE,

  topic TEXT NOT NULL,
  gap_level TEXT, -- 'critical', 'major', 'minor'
  description TEXT,

  -- Status tracking
  covered BOOLEAN DEFAULT false,
  covered_at TIMESTAMPTZ,
  covered_in TEXT, -- 'market_overview', 'living_here', 'schools_education', 'commute_location', 'investment_outlook'

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gaps_county ON public.competitor_gaps(county_id);
CREATE INDEX IF NOT EXISTS idx_gaps_covered ON public.competitor_gaps(covered);
CREATE INDEX IF NOT EXISTS idx_gaps_topic ON public.competitor_gaps(topic);

-- Enable RLS
ALTER TABLE public.competitor_gaps ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "competitor_gaps_public_select"
  ON public.competitor_gaps
  FOR SELECT
  USING (true);

-- Service role full access
CREATE POLICY "competitor_gaps_service_role_all"
  ON public.competitor_gaps
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 5. PAA QUESTIONS TABLE (all questions)
-- ============================================

CREATE TABLE IF NOT EXISTS public.paa_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  county_id BIGINT REFERENCES public.counties(id) ON DELETE CASCADE,

  question TEXT NOT NULL,
  answer TEXT NOT NULL,

  -- Display control
  displayed_in_faq BOOLEAN DEFAULT false,
  display_order INTEGER,

  -- Performance tracking
  views_count INTEGER DEFAULT 0,
  expansions_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_paa_county ON public.paa_questions(county_id);
CREATE INDEX IF NOT EXISTS idx_paa_displayed ON public.paa_questions(displayed_in_faq);
CREATE INDEX IF NOT EXISTS idx_paa_order ON public.paa_questions(display_order);

-- Enable RLS
ALTER TABLE public.paa_questions ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "paa_questions_public_select"
  ON public.paa_questions
  FOR SELECT
  USING (true);

-- Service role full access
CREATE POLICY "paa_questions_service_role_all"
  ON public.paa_questions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 6. CONTENT ANALYTICS TABLE (performance)
-- ============================================

CREATE TABLE IF NOT EXISTS public.content_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  county_id BIGINT REFERENCES public.counties(id) ON DELETE CASCADE,

  -- SEO Metrics
  semantic_coverage_percent DECIMAL(5,2), -- % of keywords used
  competitor_gaps_filled INTEGER,
  competitor_gaps_total INTEGER,
  paa_coverage_count INTEGER, -- How many PAA questions answered

  -- Quality Scores
  content_completeness_score DECIMAL(5,2),
  seo_optimization_score DECIMAL(5,2),
  user_value_score DECIMAL(5,2),
  overall_score DECIMAL(5,2),

  -- Performance (update weekly)
  page_views INTEGER DEFAULT 0,
  avg_time_on_page INTEGER, -- seconds
  bounce_rate DECIMAL(5,2),
  conversion_rate DECIMAL(5,2),

  -- Rankings
  google_rank INTEGER,
  featured_snippet BOOLEAN DEFAULT false,

  -- Timestamp
  recorded_at TIMESTAMPTZ DEFAULT now(),

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_county ON public.content_analytics(county_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.content_analytics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_analytics_score ON public.content_analytics(overall_score);

-- Enable RLS
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;

-- Public read for analytics
CREATE POLICY "content_analytics_public_select"
  ON public.content_analytics
  FOR SELECT
  USING (true);

-- Service role full access
CREATE POLICY "content_analytics_service_role_all"
  ON public.content_analytics
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 7. UPDATE EXISTING COUNTY DATA
-- ============================================

-- Update Davidson County
UPDATE public.counties
SET
  slug = 'davidson-county',
  hero_tagline = 'The Heart of Music City - Where Culture Meets Opportunity',
  median_price = 425000,
  days_on_market = 30,
  population = 700250,
  median_income = 65000,
  school_rating = 7.5,
  commute_minutes = 0,
  walkability_score = 65,
  crime_rating = 'Average',
  meta_title = 'Davidson County, TN Real Estate Guide | Nashville Market Intelligence',
  meta_description = 'Complete Davidson County real estate guide: live market data, top neighborhoods, school ratings, and expert insights for buyers, sellers, and agents.'
WHERE name = 'Davidson County';

-- Update Williamson County
UPDATE public.counties
SET
  slug = 'williamson-county',
  hero_tagline = 'Luxury Living & Top Schools Near Nashville',
  median_price = 650000,
  days_on_market = 25,
  population = 251700,
  median_income = 101300,
  school_rating = 9.2,
  commute_minutes = 25,
  walkability_score = 55,
  crime_rating = 'Low',
  meta_title = 'Williamson County, TN Real Estate | Franklin & Brentwood Luxury Homes',
  meta_description = 'Explore Williamson County: top-rated schools, luxury homes in Franklin & Brentwood, exclusive neighborhoods, and Nashville proximity.'
WHERE name = 'Williamson County';

-- Update Rutherford County
UPDATE public.counties
SET
  slug = 'rutherford-county',
  hero_tagline = 'Affordable Growth & Family-Friendly Communities',
  median_price = 375000,
  days_on_market = 35,
  population = 358000,
  median_income = 72000,
  school_rating = 7.8,
  commute_minutes = 35,
  walkability_score = 50,
  crime_rating = 'Average',
  meta_title = 'Rutherford County, TN Real Estate | Affordable Murfreesboro Homes',
  meta_description = 'Discover affordable Rutherford County: Murfreesboro, Smyrna, La Vergne homes with excellent value, growing communities, and Nashville access.'
WHERE name = 'Rutherford County';

-- ============================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.seo_intelligence IS 'Complete SEO tool data for each county - preserves all intelligence for querying';
COMMENT ON TABLE public.semantic_keywords IS 'Trackable semantic keywords with usage metrics - shows which keywords are used in content';
COMMENT ON TABLE public.competitor_gaps IS 'Competitor gap tracking - shows what topics competitors miss and whether we cover them';
COMMENT ON TABLE public.paa_questions IS 'People Also Ask questions - all questions with display flags for FAQ section';
COMMENT ON TABLE public.content_analytics IS 'Performance analytics and SEO scoring - tracks how well content performs';

COMMENT ON COLUMN public.counties.hero_tagline IS 'Tagline displayed in hero section';
COMMENT ON COLUMN public.counties.market_overview IS 'Market analysis section from Perplexity narrative';
COMMENT ON COLUMN public.counties.living_here IS 'Lifestyle and neighborhoods section from Perplexity narrative';
COMMENT ON COLUMN public.counties.schools_education IS 'Schools and education section from Perplexity narrative';
COMMENT ON COLUMN public.counties.commute_location IS 'Commute and location section from Perplexity narrative';
COMMENT ON COLUMN public.counties.investment_outlook IS 'Investment outlook section from Perplexity narrative';
COMMENT ON COLUMN public.counties.faq_questions IS 'Top 10 FAQ questions displayed on page';
COMMENT ON COLUMN public.counties.seo_score IS 'Overall SEO score (0-100) calculated from analytics';
