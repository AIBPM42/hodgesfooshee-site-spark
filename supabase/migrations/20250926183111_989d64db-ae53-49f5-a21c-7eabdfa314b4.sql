-- Drop and recreate the view without SECURITY DEFINER to fix security warning
DROP VIEW IF EXISTS mls_listings_view;

CREATE VIEW mls_listings_view AS
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