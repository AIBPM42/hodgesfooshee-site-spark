-- Clean up featured_listings table and fix the relationship
-- First, remove any rows with NULL listing_id
DELETE FROM featured_listings WHERE listing_id IS NULL;

-- Drop the table and recreate it with correct structure
DROP TABLE IF EXISTS featured_listings;

-- Recreate with proper bigint reference to mls_listings.id
CREATE TABLE featured_listings (
  listing_id bigint NOT NULL REFERENCES mls_listings(id) ON DELETE CASCADE,
  tag text,
  rank integer DEFAULT 999,
  PRIMARY KEY (listing_id)
);

-- Enable RLS
ALTER TABLE featured_listings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "anon_read_featured" ON featured_listings FOR SELECT USING (true);