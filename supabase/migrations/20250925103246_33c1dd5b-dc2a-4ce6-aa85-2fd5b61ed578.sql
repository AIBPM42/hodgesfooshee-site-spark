-- Ensure the realtyna_tokens table has proper RLS policy for service role access
-- Drop existing policy if it exists and recreate it properly
DROP POLICY IF EXISTS "Service role can manage realtyna tokens" ON public.realtyna_tokens;

-- Create a comprehensive policy that allows service role access
CREATE POLICY "Service role can manage realtyna tokens" 
ON public.realtyna_tokens 
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Also ensure anon role can read tokens if needed by the frontend
CREATE POLICY "Anon can read realtyna tokens" 
ON public.realtyna_tokens 
FOR SELECT
TO anon
USING (true);