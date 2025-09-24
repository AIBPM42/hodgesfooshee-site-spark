-- Add service role only policy for realtyna_tokens
CREATE POLICY "Service role can manage realtyna tokens" 
ON realtyna_tokens 
FOR ALL 
USING (true) 
WITH CHECK (true);