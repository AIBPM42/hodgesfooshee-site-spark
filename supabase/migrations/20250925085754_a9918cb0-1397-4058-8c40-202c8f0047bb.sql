-- Add last_error column to ingest_state table for tracking sync errors
ALTER TABLE public.ingest_state 
ADD COLUMN IF NOT EXISTS last_error TEXT;