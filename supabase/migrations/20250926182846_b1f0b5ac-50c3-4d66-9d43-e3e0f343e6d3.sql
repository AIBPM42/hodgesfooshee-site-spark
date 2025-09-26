-- Create a stable view to map mls_listings columns to expected frontend fields
CREATE OR REPLACE VIEW mls_listings_view AS
SELECT
  listing_key::text as mls_id,           -- Map listing_key to mls_id for legacy compatibility
  listing_key::text as listing_key,      -- Keep original
  id,
  list_price::integer as price,          -- Map list_price to price
  bedrooms_total::integer as beds,       -- Map bedrooms_total to beds  
  bathrooms_total_integer::numeric as baths, -- Map bathrooms_total_integer to baths
  living_area::integer as sqft,          -- Map living_area to sqft
  standard_status::text as status,       -- Map standard_status to status
  city,
  NULL::text as county,                  -- Placeholder for missing county field
  NULL::text as state,                   -- Placeholder for missing state field
  NULL::text as zip,                     -- Placeholder for missing zip field
  NULL::text as address,                 -- Placeholder for missing address field
  NULL::jsonb as photos,                 -- Placeholder for missing photos field
  modification_timestamp as updated_at,
  created_at
FROM mls_listings;

-- Add performance indexes for commonly searched fields
CREATE INDEX IF NOT EXISTS idx_mls_city ON mls_listings(city);
CREATE INDEX IF NOT EXISTS idx_mls_price ON mls_listings(list_price);
CREATE INDEX IF NOT EXISTS idx_mls_beds ON mls_listings(bedrooms_total);
CREATE INDEX IF NOT EXISTS idx_mls_baths ON mls_listings(bathrooms_total_integer);
CREATE UNIQUE INDEX IF NOT EXISTS ux_mls_listingkey ON mls_listings(listing_key);