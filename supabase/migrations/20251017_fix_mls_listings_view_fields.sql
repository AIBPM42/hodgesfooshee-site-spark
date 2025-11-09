-- Fix mls_listings_view to map actual RESO fields instead of NULL placeholders
DROP VIEW IF EXISTS mls_listings_view;

CREATE VIEW mls_listings_view AS
SELECT
  listing_key::text as mls_id,
  listing_key::text as listing_key,
  id,
  list_price::integer as price,
  bedrooms_total::integer as beds,
  bathrooms_total_integer::numeric as baths,
  living_area::integer as sqft,
  standard_status::text as status,
  city,
  county_or_parish::text as county,
  state_or_province::text as state,
  postal_code::text as zip,
  unparsed_address::text as address,
  -- Convert Media JSONB array to photos JSONB
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'url', media_item->>'MediaURL',
        'order', media_item->>'Order'
      )
    )
    FROM jsonb_array_elements(COALESCE(media, '[]'::jsonb)) as media_item
  ) as photos,
  modification_timestamp as updated_at,
  created_at
FROM mls_listings;

-- Add helpful comment
COMMENT ON VIEW mls_listings_view IS 'Backward-compatible view mapping RESO fields to legacy schema with actual data (not NULL placeholders)';
