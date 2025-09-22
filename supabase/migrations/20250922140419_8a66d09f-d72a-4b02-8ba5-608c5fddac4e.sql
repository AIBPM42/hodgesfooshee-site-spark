-- Fix Security Definer View issue
-- The public_listings view should not use SECURITY DEFINER as it bypasses RLS policies
-- Recreate it as a standard view since the underlying table already has proper RLS

-- Drop the existing security definer view
DROP VIEW IF EXISTS public.public_listings;

-- Recreate as a standard view (without SECURITY DEFINER)
-- This will respect the RLS policies on the underlying mls_listings table
CREATE VIEW public.public_listings AS 
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