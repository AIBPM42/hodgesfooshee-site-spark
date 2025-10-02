-- Analytics tables for tracking user behavior and events

-- 1) Page events (page views, sessions)
CREATE TABLE IF NOT EXISTS page_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  user_role text NOT NULL CHECK (user_role IN ('public', 'agent', 'owner')),
  page text NOT NULL,
  referrer text,
  ua text,
  ip inet,
  meta jsonb NOT NULL DEFAULT '{}'
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_page_events_occurred_at ON page_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_events_session ON page_events(session_id);
CREATE INDEX IF NOT EXISTS idx_page_events_page ON page_events(page);

-- 2) Search events (search queries and results)
CREATE TABLE IF NOT EXISTS search_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  query jsonb NOT NULL,
  results_count int,
  duration_ms int
);

CREATE INDEX IF NOT EXISTS idx_search_events_occurred_at ON search_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_events_session ON search_events(session_id);

-- 3) Listing views (property detail page views)
CREATE TABLE IF NOT EXISTS listing_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  listing_key text NOT NULL,
  city text,
  price numeric
);

CREATE INDEX IF NOT EXISTS idx_listing_views_occurred_at ON listing_views(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_listing_views_listing ON listing_views(listing_key);
CREATE INDEX IF NOT EXISTS idx_listing_views_session ON listing_views(session_id);

-- RLS Policies: Public can insert (anonymous tracking), service role can read
ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for tracking
CREATE POLICY "Public can insert page events" ON page_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert search events" ON search_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert listing views" ON listing_views
  FOR INSERT WITH CHECK (true);

-- Service role can read all
CREATE POLICY "Service role can read page events" ON page_events
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Service role can read search events" ON search_events
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Service role can read listing views" ON listing_views
  FOR SELECT USING (auth.role() = 'service_role');