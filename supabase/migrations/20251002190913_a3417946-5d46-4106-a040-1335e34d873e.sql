-- County aggregated statistics (updated daily)
CREATE TABLE county_stats (
  county_slug TEXT PRIMARY KEY,
  county_name TEXT NOT NULL,
  state TEXT DEFAULT 'TN',
  
  -- KPIs
  median_price NUMERIC,
  price_change_yoy NUMERIC,
  days_on_market INTEGER,
  new_listings_7d INTEGER,
  price_cuts_7d INTEGER,
  inventory_active INTEGER,
  months_of_supply NUMERIC,
  avg_ppsf NUMERIC,
  
  -- Metadata
  hero_image_url TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price band inventory by county
CREATE TABLE county_price_bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_slug TEXT REFERENCES county_stats(county_slug),
  band TEXT NOT NULL,
  active_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- City-level stats within counties
CREATE TABLE city_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_slug TEXT REFERENCES county_stats(county_slug),
  city TEXT NOT NULL,
  avg_ppsf NUMERIC,
  active_listings INTEGER,
  median_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trends data (weekly/daily time series)
CREATE TABLE county_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_slug TEXT REFERENCES county_stats(county_slug),
  trend_type TEXT NOT NULL,
  period TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-generated insights (cached for 7 days)
CREATE TABLE ai_county_insights (
  county_slug TEXT PRIMARY KEY REFERENCES county_stats(county_slug),
  
  -- AI content
  summary TEXT,
  buyer_tips JSONB,
  seller_playbook JSONB,
  agent_takeaways JSONB,
  faq JSONB,
  citations JSONB,
  disclaimers JSONB,
  
  -- Hot insights
  hot_cities_wow JSONB,
  biggest_price_cuts JSONB,
  affordability JSONB,
  rent_vs_buy JSONB,
  migration_flow JSONB,
  
  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  provider_meta JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_county_price_bands_slug ON county_price_bands(county_slug);
CREATE INDEX idx_city_stats_slug ON city_stats(county_slug);
CREATE INDEX idx_county_trends_slug_type ON county_trends(county_slug, trend_type);
CREATE INDEX idx_ai_insights_expires ON ai_county_insights(expires_at);

-- Enable RLS
ALTER TABLE county_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE county_price_bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE county_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_county_insights ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read county_stats" ON county_stats FOR SELECT USING (true);
CREATE POLICY "Public read price_bands" ON county_price_bands FOR SELECT USING (true);
CREATE POLICY "Public read city_stats" ON city_stats FOR SELECT USING (true);
CREATE POLICY "Public read trends" ON county_trends FOR SELECT USING (true);
CREATE POLICY "Public read insights" ON ai_county_insights FOR SELECT USING (true);

-- Service role write policies
CREATE POLICY "Service role manage county_stats" ON county_stats FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role manage price_bands" ON county_price_bands FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role manage city_stats" ON city_stats FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role manage trends" ON county_trends FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role manage insights" ON ai_county_insights FOR ALL USING (auth.role() = 'service_role');

-- Seed Davidson County
INSERT INTO county_stats (county_slug, county_name, state, hero_image_url) 
VALUES ('davidson-county', 'Davidson County', 'TN', 'https://images.unsplash.com/photo-1565026527164-d4f5a3b6b6b9?q=80&w=1600&fit=crop');