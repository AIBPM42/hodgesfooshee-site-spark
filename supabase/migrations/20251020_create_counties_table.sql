-- Create counties table for County Pages feature
-- Stores market data, KPIs, and AI-generated narratives

CREATE TABLE public.counties (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,

  -- KPI data (JSONB for flexibility)
  kpis JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Inventory data for charts
  inventory JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Trend data for charts
  trend JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- AI-generated narrative
  narrative TEXT,
  narrative_updated_at TIMESTAMPTZ,

  -- Refresh schedule settings
  auto_refresh BOOLEAN DEFAULT false,
  refresh_frequency TEXT CHECK (refresh_frequency IN ('manual', 'weekly', 'monthly')) DEFAULT 'manual',
  last_refresh_at TIMESTAMPTZ,

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access, service role for updates
CREATE POLICY "counties_public_select"
  ON public.counties
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "counties_service_role_all"
  ON public.counties
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Indexes for performance
CREATE INDEX idx_counties_slug ON public.counties(slug);
CREATE INDEX idx_counties_active ON public.counties(is_active) WHERE is_active = true;
CREATE INDEX idx_counties_kpis ON public.counties USING gin(kpis);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_counties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_counties_updated_at
  BEFORE UPDATE ON public.counties
  FOR EACH ROW
  EXECUTE FUNCTION update_counties_updated_at();

-- Seed data for 3 Tennessee counties
INSERT INTO public.counties (name, slug, kpis, inventory, trend, narrative, is_active) VALUES

-- Davidson County (Nashville)
('Davidson County', 'davidson',
  '{
    "population_growth": "+4.2%",
    "median_price": "$425,000",
    "days_on_market": "18",
    "price_trend": "+8.1%"
  }'::jsonb,
  '{
    "price_tiers": [
      {"range": "$0-300k", "count": 245},
      {"range": "$300-500k", "count": 428},
      {"range": "$500-750k", "count": 312},
      {"range": "$750k-1M", "count": 156},
      {"range": "$1M+", "count": 89}
    ],
    "property_types": [
      {"type": "Single Family", "percentage": 62},
      {"type": "Condo", "percentage": 18},
      {"type": "Townhome", "percentage": 15},
      {"type": "Multi-Family", "percentage": 5}
    ]
  }'::jsonb,
  '{
    "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "median_prices": [398000, 405000, 412000, 418000, 422000, 425000, 428000, 431000, 429000, 427000, 425000, 425000]
  }'::jsonb,
  'Davidson County continues to be Nashville''s economic powerhouse, showing strong market fundamentals with 4.2% population growth and an 8.1% increase in median home prices. The housing market remains competitive with properties selling in an average of 18 days, reflecting high demand from both relocating professionals and local buyers. The area''s strong job market, anchored by healthcare, music, and technology sectors, continues to drive sustained real estate appreciation.

Buyer trends show increasing interest in established neighborhoods near downtown and walkable communities with urban amenities. The $425,000 median price point represents solid value compared to other major metropolitan areas, though inventory remains tight in the most desirable neighborhoods. First-time buyers are finding opportunities in emerging areas like Antioch and Donelson.

School quality remains a top priority for families, with the metro area offering diverse options including highly-rated public schools in suburban pockets and numerous private institutions. The continued investment in infrastructure and the city''s cultural appeal position Davidson County for sustained long-term growth, making it an attractive market for both homeowners and investors.',
  true
),

-- Williamson County (Franklin/Brentwood)
('Williamson County', 'williamson',
  '{
    "population_growth": "+3.8%",
    "median_price": "$650,000",
    "days_on_market": "22",
    "price_trend": "+6.3%"
  }'::jsonb,
  '{
    "price_tiers": [
      {"range": "$0-300k", "count": 45},
      {"range": "$300-500k", "count": 189},
      {"range": "$500-750k", "count": 276},
      {"range": "$750k-1M", "count": 198},
      {"range": "$1M+", "count": 234}
    ],
    "property_types": [
      {"type": "Single Family", "percentage": 78},
      {"type": "Condo", "percentage": 8},
      {"type": "Townhome", "percentage": 10},
      {"type": "Multi-Family", "percentage": 4}
    ]
  }'::jsonb,
  '{
    "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "median_prices": [615000, 622000, 630000, 638000, 645000, 650000, 655000, 658000, 656000, 653000, 650000, 650000]
  }'::jsonb,
  'Williamson County stands out as one of Tennessee''s most affluent and desirable markets, with a median home price of $650,000 reflecting its premium positioning. The area''s reputation for exceptional schools, safe communities, and high quality of life continues to attract affluent families and professionals. With 3.8% population growth and 6.3% price appreciation, the market demonstrates steady, sustainable growth rather than speculative volatility.

Cities like Franklin and Brentwood offer a compelling blend of historic charm and modern amenities, with walkable downtowns, excellent dining, and strong community engagement. Buyers in this market prioritize school districts above all else, with Williamson County Schools consistently ranking among the state''s best. The 22-day average market time indicates healthy demand without the frenzy seen in previous years.

The county''s strong economic fundamentals, including low unemployment and high household incomes, provide a stable foundation for continued real estate appreciation. New construction in areas like Nolensville and Spring Hill offers opportunities at various price points, while established neighborhoods in Franklin and Brentwood command premium pricing. The market appeals to both move-up buyers seeking excellent schools and empty-nesters downsizing to luxury communities.',
  true
),

-- Rutherford County (Murfreesboro)
('Rutherford County', 'rutherford',
  '{
    "population_growth": "+5.1%",
    "median_price": "$385,000",
    "days_on_market": "25",
    "price_trend": "+7.2%"
  }'::jsonb,
  '{
    "price_tiers": [
      {"range": "$0-300k", "count": 312},
      {"range": "$300-500k", "count": 445},
      {"range": "$500-750k", "count": 178},
      {"range": "$750k-1M", "count": 45},
      {"range": "$1M+", "count": 23}
    ],
    "property_types": [
      {"type": "Single Family", "percentage": 71},
      {"type": "Condo", "percentage": 12},
      {"type": "Townhome", "percentage": 14},
      {"type": "Multi-Family", "percentage": 3}
    ]
  }'::jsonb,
  '{
    "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "median_prices": [362000, 368000, 372000, 376000, 380000, 385000, 388000, 390000, 389000, 387000, 385000, 385000]
  }'::jsonb,
  'Rutherford County is experiencing explosive growth as Nashville''s most affordable suburban alternative, with the fastest population growth rate at 5.1% and strong price appreciation of 7.2%. The $385,000 median home price offers compelling value compared to Davidson and Williamson counties, attracting first-time buyers, young families, and investors seeking cash flow opportunities.

Murfreesboro, the county seat and home to Middle Tennessee State University, provides a diverse economy and youthful energy. The city''s strategic location along I-24 offers convenient access to Nashville while maintaining a lower cost of living. New residential developments are sprouting throughout the county, with builders focusing on affordable single-family homes and townhomes that appeal to millennial buyers.

The market shows healthy fundamentals with a 25-day average listing time, indicating strong demand without overheating. School quality varies across the county, with newer developments often featuring highly-rated elementary schools that attract families. The area''s continued infrastructure investment, including road improvements and commercial development, positions Rutherford County as a long-term growth market. Investors find opportunities in both traditional rentals near MTSU and single-family homes in appreciating neighborhoods.',
  true
);

-- Comments for documentation
COMMENT ON TABLE public.counties IS 'County market data with KPIs, inventory, trends, and AI narratives for County Pages feature';
COMMENT ON COLUMN public.counties.kpis IS 'Key performance indicators: population_growth, median_price, days_on_market, price_trend';
COMMENT ON COLUMN public.counties.inventory IS 'Chart data: price_tiers array and property_types array';
COMMENT ON COLUMN public.counties.trend IS 'Chart data: months array and median_prices array for 12-month trend';
COMMENT ON COLUMN public.counties.narrative IS 'Perplexity AI-generated 3-paragraph market summary';
