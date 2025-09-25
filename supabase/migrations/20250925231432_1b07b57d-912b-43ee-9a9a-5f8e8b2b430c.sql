-- Drop and recreate mls_listings with new schema
DROP TABLE IF EXISTS mls_listings CASCADE;

-- Create standardized mls_listings table with RESO field names
CREATE TABLE mls_listings (
  id bigserial primary key,
  listing_key text unique not null,
  listing_id text,
  list_price numeric,
  city text,
  standard_status text,
  bedrooms_total integer,
  bathrooms_total_integer integer,
  living_area numeric,
  modification_timestamp timestamptz,
  rf_modification_timestamp timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create optimized indexes
CREATE INDEX idx_mls_rfmod ON mls_listings (rf_modification_timestamp desc);
CREATE INDEX idx_mls_city ON mls_listings (city);

-- Drop and recreate ingest_state with key-value structure
DROP TABLE IF EXISTS ingest_state CASCADE;

CREATE TABLE ingest_state (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

-- Enable RLS
ALTER TABLE mls_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingest_state ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "mls_public_read" ON mls_listings FOR SELECT USING (true);
CREATE POLICY "ingest_state_public_read" ON ingest_state FOR SELECT USING (true);

-- Service role write policies for mls_listings
CREATE POLICY "mls_write_by_service" ON mls_listings
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "mls_update_by_service" ON mls_listings
  FOR UPDATE USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Service role full access for ingest_state
CREATE POLICY "ingest_state_write_by_service" ON ingest_state
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');