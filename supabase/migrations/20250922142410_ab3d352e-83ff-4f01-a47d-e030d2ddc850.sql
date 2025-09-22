-- Fix leads table security vulnerability
-- The current SELECT policy allows public access with "true" expression
-- This needs to be restricted to authenticated users only

-- Drop the existing vulnerable policy
DROP POLICY IF EXISTS "authenticated_users_can_view_leads" ON public.leads;

-- Create a secure policy that only allows authenticated users to view leads
CREATE POLICY "authenticated_users_can_view_leads" ON public.leads
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- The anon_insert policy remains unchanged to allow lead form submissions