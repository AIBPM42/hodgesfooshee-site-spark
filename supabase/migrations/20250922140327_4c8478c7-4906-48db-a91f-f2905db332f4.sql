-- Fix security vulnerability: Remove public read access to leads table
-- and implement proper authentication-based access control

-- Drop the existing public read policy that allows anyone to view customer data
DROP POLICY IF EXISTS "anon_select" ON public.leads;

-- Create a new policy that only allows authenticated users to view leads
-- This ensures only logged-in users (presumably admin/staff) can access customer data
CREATE POLICY "authenticated_users_can_view_leads" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (true);

-- Keep the anonymous insert policy so contact forms continue to work
-- The existing "anon_insert" policy is fine and should remain unchanged