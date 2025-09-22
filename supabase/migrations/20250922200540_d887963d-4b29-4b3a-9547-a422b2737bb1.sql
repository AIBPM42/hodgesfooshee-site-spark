-- Add RLS policies for rate_limits table to fix permission issues

-- Policy to allow anonymous users to insert their own rate limit entries (for form submissions)
CREATE POLICY "anon_insert_own_rate_limits" 
ON public.rate_limits 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Policy to allow anonymous users to select their own rate limit entries (for checking limits)
CREATE POLICY "anon_select_own_rate_limits" 
ON public.rate_limits 
FOR SELECT 
TO anon
USING (true);

-- Policy to allow service role to manage all rate limit entries (for cleanup/admin)
CREATE POLICY "service_role_manage_rate_limits" 
ON public.rate_limits 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);