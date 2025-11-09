# 🗄️ Database Migration Instructions

Apply these 3 migrations in Supabase SQL Editor **in order**.

---

## How to Apply Migrations

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: **hodges-demo** (or your project name)
3. Click **SQL Editor** in the left sidebar
4. Click **+ New query**
5. Copy and paste each SQL block below
6. Click **Run** (or press Cmd+Enter)
7. Verify success message appears

---

## Migration 1: API Keys Table

**Purpose**: Stores Perplexity and OpenAI API keys securely

**File**: `supabase/migrations/20251019_create_api_keys_table.sql`

```sql
-- Create api_keys table for secure API key storage
CREATE TABLE IF NOT EXISTS public.api_keys (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service TEXT NOT NULL UNIQUE CHECK (service IN ('manus', 'perplexity', 'openai')),
  key_value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Only service_role can access (admin operations only)
CREATE POLICY "api_keys_service_role_all"
  ON public.api_keys
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_api_keys_updated_at();

-- Add comment
COMMENT ON TABLE public.api_keys IS 'Secure storage for third-party API keys (Perplexity, OpenAI, etc.)';
```

**Expected Result**: `Success. No rows returned`

---

## Migration 2: Counties Table

**Purpose**: Creates county pages with market data and AI narratives

**File**: `supabase/migrations/20251020_create_counties_table.sql`

```sql
-- Create counties table for premium market intelligence pages
CREATE TABLE IF NOT EXISTS public.counties (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_counties_slug ON public.counties(slug) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_counties_active ON public.counties(is_active);

-- Enable RLS
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;

-- Public read access for active counties
CREATE POLICY "counties_public_read"
  ON public.counties
  FOR SELECT
  USING (is_active = true);

-- Service role full access for admin operations
CREATE POLICY "counties_service_role_all"
  ON public.counties
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_counties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER counties_updated_at
  BEFORE UPDATE ON public.counties
  FOR EACH ROW
  EXECUTE FUNCTION update_counties_updated_at();

-- Add comment
COMMENT ON TABLE public.counties IS 'Premium county market intelligence pages with AI-generated narratives';
```

**Expected Result**: `Success. No rows returned`

---

## Migration 2B: Seed County Data

**Purpose**: Adds initial data for 3 counties (Davidson, Williamson, Rutherford)

**Run this immediately after Migration 2**:

```sql
-- Seed data for 3 Middle Tennessee counties
INSERT INTO public.counties (name, slug, kpis, inventory, trend, narrative, is_active) VALUES
(
  'Davidson County',
  'davidson',
  '{"population_growth":"+4.2%","median_price":"$425,000","days_on_market":"18","price_trend":"+8.1%"}'::jsonb,
  '{"price_tiers":[{"range":"$0-300k","count":245},{"range":"$300k-500k","count":412},{"range":"$500k-750k","count":289},{"range":"$750k-1M","count":156},{"range":"$1M+","count":98}],"property_types":[{"type":"Single Family","percentage":62},{"type":"Condo","percentage":24},{"type":"Townhouse","percentage":10},{"type":"Multi-Family","percentage":4}]}'::jsonb,
  '{"months":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"median_prices":[398000,405000,412000,418000,425000,428000,432000,429000,426000,423000,421000,425000]}'::jsonb,
  'Davidson County, home to Nashville, continues to show strong market dynamics with steady appreciation and healthy inventory levels. The median home price of $425,000 reflects an 8.1% year-over-year increase, driven by robust job growth and continued migration to the Nashville metro area. Days on market averaging 18 days indicate a seller-friendly environment, though not as competitive as peak pandemic levels. The $300k-$500k price tier remains the most active segment, representing strong demand for move-in ready properties in established neighborhoods. Urban core properties, particularly in East Nashville, Germantown, and The Nations, continue to command premium pricing.',
  true
),
(
  'Williamson County',
  'williamson',
  '{"population_growth":"+3.8%","median_price":"$650,000","days_on_market":"22","price_trend":"+6.3%"}'::jsonb,
  '{"price_tiers":[{"range":"$0-300k","count":45},{"range":"$300k-500k","count":189},{"range":"$500k-750k","count":324},{"range":"$750k-1M","count":256},{"range":"$1M+","count":412}],"property_types":[{"type":"Single Family","percentage":78},{"type":"Townhouse","percentage":12},{"type":"Condo","percentage":7},{"type":"Multi-Family","percentage":3}]}'::jsonb,
  '{"months":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"median_prices":[612000,618000,625000,632000,640000,648000,655000,658000,654000,650000,647000,650000]}'::jsonb,
  'Williamson County remains one of Tennessee''s most desirable real estate markets, anchored by highly-rated schools and proximity to Nashville''s employment centers. The $650,000 median price reflects the area''s premium positioning, with Franklin and Brentwood driving much of the activity. Single-family homes dominate the market at 78% of transactions, with new construction in Spring Hill and Nolensville expanding inventory options. The luxury segment ($1M+) shows particular strength, with 412 properties in this tier reflecting sustained demand from relocating executives and remote workers. Properties in top school zones continue to see multiple offers despite the higher price point.',
  true
),
(
  'Rutherford County',
  'rutherford',
  '{"population_growth":"+5.1%","median_price":"$385,000","days_on_market":"25","price_trend":"+7.2%"}'::jsonb,
  '{"price_tiers":[{"range":"$0-300k","count":412},{"range":"$300k-500k","count":523},{"range":"$500k-750k","count":178},{"range":"$750k-1M","count":67},{"range":"$1M+","count":34}],"property_types":[{"type":"Single Family","percentage":71},{"type":"Townhouse","percentage":15},{"type":"Condo","percentage":9},{"type":"Multi-Family","percentage":5}]}'::jsonb,
  '{"months":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"median_prices":[358000,362000,368000,372000,378000,382000,387000,389000,388000,385000,383000,385000]}'::jsonb,
  'Rutherford County, centered around Murfreesboro, offers compelling value in the Nashville metro area with a median price of $385,000. The county''s 5.1% population growth—the highest in the region—is fueled by affordability relative to Davidson and Williamson counties, combined with quality amenities and shorter commutes to Nashville. The $300k-$500k segment accounts for the majority of transactions, with first-time buyers and young families driving demand. New construction communities continue to expand, particularly in southeast Murfreesboro and Smyrna. Middle Tennessee State University''s presence adds rental market stability, while Amazon''s nearby fulfillment center and healthcare sector growth support sustained appreciation.',
  true
);
```

**Expected Result**: `Success. 3 rows affected` (or similar success message showing 3 rows inserted)

---

## Migration 3: Insider Listings Table

**Purpose**: Stores Manus exclusive listings (synced via n8n workflow)

**File**: `supabase/migrations/20251020_create_insider_listings_table.sql`

```sql
-- Create insider_listings table for Manus data synced via n8n
CREATE TABLE IF NOT EXISTS public.insider_listings (
  id TEXT PRIMARY KEY,
  tag TEXT NOT NULL CHECK (tag IN ('EXCLUSIVE', 'COMING SOON', 'OFF-MARKET')),
  title TEXT NOT NULL,
  subtitle TEXT,
  stat_left_label TEXT NOT NULL,
  stat_left_value TEXT NOT NULL,
  stat_right_label TEXT NOT NULL,
  stat_right_value TEXT NOT NULL,
  image TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for active listings query
CREATE INDEX IF NOT EXISTS idx_insider_listings_active_sort
  ON public.insider_listings(is_active, sort_order)
  WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.insider_listings ENABLE ROW LEVEL SECURITY;

-- Public read access (for homepage)
CREATE POLICY "insider_listings_public_read"
  ON public.insider_listings
  FOR SELECT
  USING (is_active = true);

-- Service role full access (for n8n workflow)
CREATE POLICY "insider_listings_service_role_all"
  ON public.insider_listings
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_insider_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insider_listings_updated_at
  BEFORE UPDATE ON public.insider_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_insider_listings_updated_at();

-- Add comment
COMMENT ON TABLE public.insider_listings IS 'Exclusive property listings synced from Manus via n8n workflow';
```

**Expected Result**: `Success. No rows returned`

---

## ✅ Verification

After running all 3 migrations, verify they were applied:

```sql
-- Check that all 3 tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('api_keys', 'counties', 'insider_listings')
ORDER BY table_name;
```

**Expected Result**: 3 rows showing all three tables

---

## 🎯 Next Steps

1. ✅ Migrations applied successfully
2. Visit http://localhost:3005/ to test
3. County pages should now load: http://localhost:3005/counties/davidson
4. Check admin panels work: http://localhost:3005/admin/counties
5. Ready to demo!

---

## ⚠️ Troubleshooting

**Error: "relation already exists"**
→ Table already created. Safe to ignore or use `CREATE TABLE IF NOT EXISTS`.

**Error: "permission denied"**
→ Make sure you're logged into the correct Supabase project.

**Error: "syntax error"**
→ Make sure you copied the ENTIRE SQL block, not just part of it.

**Seed data shows "0 rows affected"**
→ Data might already be inserted. Check with:
```sql
SELECT name, slug FROM counties;
```

---

**Need help?** Check [MEETING_READY.md](MEETING_READY.md) for full setup guide.
