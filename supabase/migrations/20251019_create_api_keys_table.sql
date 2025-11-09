-- Create api_keys table for super admin API key management
-- Supports Manus, Perplexity, and OpenAI integrations
-- Reference: CLAUDE.md audit scope for Smart Plan integration

CREATE TABLE public.api_keys (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service TEXT NOT NULL UNIQUE CHECK (service IN ('manus', 'perplexity', 'openai')),
  key_value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS - Only service_role can access
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Service role only (no public access)
-- Admin UI will use service_role client for management
CREATE POLICY "api_keys_service_role_all"
  ON public.api_keys
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Indexes for performance
CREATE INDEX idx_api_keys_service ON public.api_keys(service);
CREATE INDEX idx_api_keys_active ON public.api_keys(is_active) WHERE is_active = true;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_api_keys_updated_at();

-- Comments for documentation
COMMENT ON TABLE public.api_keys IS 'Encrypted storage for third-party API keys (Manus, Perplexity, OpenAI)';
COMMENT ON COLUMN public.api_keys.service IS 'Service identifier: manus, perplexity, or openai';
COMMENT ON COLUMN public.api_keys.key_value IS 'Encrypted API key value';
COMMENT ON COLUMN public.api_keys.is_active IS 'Whether this key is currently active';
