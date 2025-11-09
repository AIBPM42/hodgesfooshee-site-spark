-- Create saved_searches table for user search preferences
-- Part of Smart Plan integration requirements (CLAUDE.md:15)

CREATE TABLE public.saved_searches (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_name TEXT NOT NULL,

  -- Search criteria (JSON for flexibility)
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Common search fields (for indexing/performance)
  city TEXT,
  min_price INTEGER,
  max_price INTEGER,
  beds INTEGER,
  baths NUMERIC,
  property_type TEXT,

  -- Notification preferences
  email_alerts BOOLEAN DEFAULT false,
  alert_frequency TEXT CHECK (alert_frequency IN ('instant', 'daily', 'weekly')) DEFAULT 'daily',

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own saved searches
CREATE POLICY "saved_searches_user_select"
  ON public.saved_searches
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "saved_searches_user_insert"
  ON public.saved_searches
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_searches_user_update"
  ON public.saved_searches
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "saved_searches_user_delete"
  ON public.saved_searches
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_saved_searches_user_id ON public.saved_searches(user_id);
CREATE INDEX idx_saved_searches_active ON public.saved_searches(is_active) WHERE is_active = true;
CREATE INDEX idx_saved_searches_city ON public.saved_searches(city);
CREATE INDEX idx_saved_searches_criteria ON public.saved_searches USING gin(criteria);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_saved_searches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_saved_searches_updated_at
  BEFORE UPDATE ON public.saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_searches_updated_at();

-- Comments for documentation
COMMENT ON TABLE public.saved_searches IS 'User-saved property search criteria for Smart Plan alerts';
COMMENT ON COLUMN public.saved_searches.criteria IS 'Flexible JSONB storage for all search parameters';
COMMENT ON COLUMN public.saved_searches.alert_frequency IS 'How often to send matching property alerts';
