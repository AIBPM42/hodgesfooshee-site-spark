-- Add missing token_type column to realtyna_tokens table
ALTER TABLE public.realtyna_tokens 
ADD COLUMN IF NOT EXISTS token_type TEXT DEFAULT 'Bearer';