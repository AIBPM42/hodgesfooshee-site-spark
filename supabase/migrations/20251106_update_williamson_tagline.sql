-- Update Williamson County tagline to match Davidson County style
UPDATE counties
SET hero_tagline = 'Williamson County Market Intelligence'
WHERE slug = 'williamson-county';
