-- Migration 2: Counties Table (SIMPLIFIED VERSION)
-- Copy and paste this entire block into Supabase SQL Editor

CREATE TABLE public.counties (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  kpis JSONB NOT NULL DEFAULT '{}'::jsonb,
  inventory JSONB NOT NULL DEFAULT '{}'::jsonb,
  trend JSONB NOT NULL DEFAULT '{}'::jsonb,
  narrative TEXT,
  narrative_updated_at TIMESTAMPTZ,
  auto_refresh BOOLEAN DEFAULT false,
  refresh_frequency TEXT CHECK (refresh_frequency IN ('manual', 'weekly', 'monthly')) DEFAULT 'manual',
  last_refresh_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "counties_public_select"
  ON public.counties
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "counties_service_role_all"
  ON public.counties
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE INDEX idx_counties_slug ON public.counties(slug);
CREATE INDEX idx_counties_active ON public.counties(is_active) WHERE is_active = true;

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

-- Seed 3 counties with placeholder data (Davidson example shown)
INSERT INTO public.counties (name, slug, kpis, inventory, trend, narrative, is_active) VALUES
('Davidson County', 'davidson',
  '{"population_growth":"+4.2%","median_price":"$425,000","days_on_market":"18","price_trend":"+8.1%"}'::jsonb,
  '{"price_tiers":[{"range":"$0-300k","count":245},{"range":"$300-500k","count":428},{"range":"$500-750k","count":312},{"range":"$750k-1M","count":156},{"range":"$1M+","count":89}],"property_types":[{"type":"Single Family","percentage":62},{"type":"Condo","percentage":18},{"type":"Townhome","percentage":15},{"type":"Multi-Family","percentage":5}]}'::jsonb,
  '{"months":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"median_prices":[398000,405000,412000,418000,422000,425000,428000,431000,429000,427000,425000,425000]}'::jsonb,
  'Davidson County market analysis placeholder. Click Refresh in admin to generate AI narrative.',
  true
),
('Williamson County', 'williamson',
  '{"population_growth":"+3.8%","median_price":"$650,000","days_on_market":"22","price_trend":"+6.3%"}'::jsonb,
  '{"price_tiers":[{"range":"<$600k","count":45},{"range":"$600-900k","count":276},{"range":">$900k","count":198}],"property_types":[{"type":"Single Family","percentage":78},{"type":"Townhome","percentage":15},{"type":"Condo","percentage":7}]}'::jsonb,
  '{"months":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"median_prices":[615000,622000,630000,638000,645000,650000,655000,658000,656000,653000,650000,650000]}'::jsonb,
  'Williamson County market analysis placeholder. Click Refresh in admin to generate AI narrative.',
  true
),
('Rutherford County', 'rutherford',
  '{"population_growth":"+5.1%","median_price":"$385,000","days_on_market":"25","price_trend":"+7.2%"}'::jsonb,
  '{"price_tiers":[{"range":"<$300k","count":312},{"range":"$300-450k","count":445},{"range":">$450k","count":246}],"property_types":[{"type":"Single Family","percentage":71},{"type":"Townhome","percentage":14},{"type":"Condo","percentage":12},{"type":"Multi-Family","percentage":3}]}'::jsonb,
  '{"months":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"median_prices":[362000,368000,372000,376000,380000,385000,388000,390000,389000,387000,385000,385000]}'::jsonb,
  'Rutherford County market analysis placeholder. Click Refresh in admin to generate AI narrative.',
  true
);
