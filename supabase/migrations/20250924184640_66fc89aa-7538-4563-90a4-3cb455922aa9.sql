-- Create OAuth2 tokens table for Realtyna Smart plan integration
CREATE TABLE public.oauth_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'realtyna',
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type TEXT DEFAULT 'bearer',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Enable RLS
ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy for service role only (no user access)
CREATE POLICY "Service role can manage tokens" 
ON public.oauth_tokens 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create API usage tracking table
CREATE TABLE public.api_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'realtyna',
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'GET',
  status_code INTEGER,
  response_time_ms INTEGER,
  request_size INTEGER DEFAULT 0,
  response_size INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for usage logs
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for service role only
CREATE POLICY "Service role can manage usage logs" 
ON public.api_usage_logs 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update updated_at automatically
CREATE TRIGGER update_oauth_tokens_updated_at
BEFORE UPDATE ON public.oauth_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_oauth_tokens_provider ON public.oauth_tokens(provider);
CREATE INDEX idx_oauth_tokens_expires_at ON public.oauth_tokens(expires_at);
CREATE INDEX idx_api_usage_logs_provider ON public.api_usage_logs(provider);
CREATE INDEX idx_api_usage_logs_created_at ON public.api_usage_logs(created_at);