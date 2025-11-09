-- Migration 1: API Keys Table
-- Copy and paste this entire block into Supabase SQL Editor

CREATE TABLE public.api_keys (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service TEXT NOT NULL UNIQUE CHECK (service IN ('manus', 'perplexity', 'openai')),
  key_value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "api_keys_service_role_all"
  ON public.api_keys
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE INDEX idx_api_keys_service ON public.api_keys(service);
CREATE INDEX idx_api_keys_active ON public.api_keys(is_active) WHERE is_active = true;

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
