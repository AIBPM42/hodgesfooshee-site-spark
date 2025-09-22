-- Fix Security Definer View issue by ensuring proper view ownership
-- The public_listings view should not have elevated privileges since it only reads public data

-- Drop and recreate the view with explicit ownership
DROP VIEW IF EXISTS public.public_listings;

-- Create the view with current user context (not superuser)
CREATE VIEW public.public_listings 
WITH (security_invoker=true) AS 
SELECT 
    id,
    mls_id,
    status,
    price,
    beds,
    baths,
    sqft,
    property_type,
    address,
    city,
    county,
    state,
    zip,
    (photos ->> 0) AS thumb,
    photos,
    source_updated_at
FROM mls_listings 
WHERE status = 'Active';

-- Grant appropriate access to the view
GRANT SELECT ON public.public_listings TO anon, authenticated;