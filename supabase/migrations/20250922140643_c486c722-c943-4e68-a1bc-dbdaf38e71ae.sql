-- Fix Security Definer issue on search_listings function
-- This function only reads public data and doesn't need elevated privileges
-- Remove SECURITY DEFINER to follow principle of least privilege

CREATE OR REPLACE FUNCTION public.search_listings(
    search_query text DEFAULT ''::text, 
    filter_city text DEFAULT ''::text, 
    min_price integer DEFAULT 0, 
    max_price integer DEFAULT 999999999, 
    min_beds integer DEFAULT 0, 
    max_beds integer DEFAULT 99, 
    min_baths numeric DEFAULT 0, 
    max_baths numeric DEFAULT 99, 
    sort_by text DEFAULT 'price_desc'::text, 
    page_limit integer DEFAULT 20, 
    page_offset integer DEFAULT 0
)
RETURNS TABLE(
    id uuid, 
    mls_id text, 
    price integer, 
    beds integer, 
    baths numeric, 
    sqft integer, 
    property_type text, 
    address text, 
    city text, 
    county text, 
    state text, 
    zip text, 
    thumb text, 
    photos jsonb, 
    total_count bigint
)
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from SECURITY DEFINER to SECURITY INVOKER
STABLE
SET search_path = public
AS $function$
DECLARE
  total_results BIGINT;
BEGIN
  -- Get total count for pagination
  SELECT COUNT(*) INTO total_results
  FROM mls_listings ml
  WHERE ml.status = 'Active'
    AND (filter_city = '' OR ml.city ILIKE '%' || filter_city || '%')
    AND ml.price >= min_price 
    AND ml.price <= max_price
    AND ml.beds >= min_beds 
    AND ml.beds <= max_beds
    AND ml.baths >= min_baths 
    AND ml.baths <= max_baths
    AND (search_query = '' OR ml.sv @@ plainto_tsquery('english', search_query));

  -- Return paginated results
  RETURN QUERY
  SELECT 
    ml.id,
    ml.mls_id,
    ml.price,
    ml.beds,
    ml.baths,
    ml.sqft,
    ml.property_type,
    ml.address,
    ml.city,
    ml.county,
    ml.state,
    ml.zip,
    (ml.photos->>0) as thumb,
    ml.photos,
    total_results
  FROM mls_listings ml
  WHERE ml.status = 'Active'
    AND (filter_city = '' OR ml.city ILIKE '%' || filter_city || '%')
    AND ml.price >= min_price 
    AND ml.price <= max_price
    AND ml.beds >= min_beds 
    AND ml.beds <= max_beds
    AND ml.baths >= min_baths 
    AND ml.baths <= max_baths
    AND (search_query = '' OR ml.sv @@ plainto_tsquery('english', search_query))
  ORDER BY 
    CASE WHEN sort_by = 'price_asc' THEN ml.price END ASC,
    CASE WHEN sort_by = 'price_desc' THEN ml.price END DESC,
    CASE WHEN sort_by = 'newest' THEN ml.source_updated_at END DESC,
    CASE WHEN sort_by = 'beds_desc' THEN ml.beds END DESC,
    ml.updated_at DESC
  LIMIT page_limit OFFSET page_offset;
END$function$;