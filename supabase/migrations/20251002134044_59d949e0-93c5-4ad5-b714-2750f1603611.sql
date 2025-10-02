-- Create services_content table for CMS-editable Services page
CREATE TABLE IF NOT EXISTS public.services_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title text NOT NULL DEFAULT 'Our Services',
  hero_subtitle text,
  sections jsonb DEFAULT '[]'::jsonb,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services_content ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public can read services content"
ON public.services_content
FOR SELECT
TO public
USING (true);

-- Only admins can update
CREATE POLICY "Admins can update services content"
ON public.services_content
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert
CREATE POLICY "Admins can insert services content"
ON public.services_content
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Insert default content
INSERT INTO public.services_content (hero_title, hero_subtitle, sections, seo_title, seo_description)
VALUES (
  'Our Services',
  'Comprehensive real estate services tailored to your needs',
  '[
    {"title": "Buyer Services", "copy": "Expert guidance through every step of the home buying process", "icon": "Home"},
    {"title": "Seller Services", "copy": "Strategic marketing to sell your property for top dollar", "icon": "TrendingUp"},
    {"title": "Market Analysis", "copy": "In-depth market insights to make informed decisions", "icon": "BarChart"}
  ]'::jsonb,
  'Real Estate Services | Hodges & Fooshee',
  'Professional real estate services including buying, selling, and market analysis in Nashville and surrounding areas.'
)
ON CONFLICT DO NOTHING;