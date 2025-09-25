-- Fix RLS on ingest_state table by enabling RLS
ALTER TABLE public.ingest_state ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to manage ingest state
CREATE POLICY "Service role can manage ingest state" 
ON public.ingest_state 
FOR ALL 
USING (true) 
WITH CHECK (true);