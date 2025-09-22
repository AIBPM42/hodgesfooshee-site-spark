-- Fix audit_logs security vulnerabilities
-- 1. Revoke all public access to the audit_logs table
REVOKE ALL ON public.audit_logs FROM anon, authenticated, public;

-- 2. Drop the existing permissive policy and replace with restrictive policies
DROP POLICY IF EXISTS admins_can_view_audit_logs ON public.audit_logs;

-- 3. Create comprehensive restrictive policies
-- Only admins can SELECT audit logs
CREATE POLICY "admin_only_select_audit_logs" 
ON public.audit_logs 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only the system (service role) can INSERT audit logs
CREATE POLICY "system_only_insert_audit_logs" 
ON public.audit_logs 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Prevent UPDATE and DELETE operations entirely for security
CREATE POLICY "no_updates_allowed" 
ON public.audit_logs 
FOR UPDATE 
TO authenticated, anon, service_role
USING (false);

CREATE POLICY "no_deletes_allowed" 
ON public.audit_logs 
FOR DELETE 
TO authenticated, anon, service_role
USING (false);

-- 4. Grant only necessary privileges back
-- Grant INSERT to service_role only (for system logging)
GRANT INSERT ON public.audit_logs TO service_role;

-- Grant SELECT to authenticated users (will be filtered by RLS policy)
GRANT SELECT ON public.audit_logs TO authenticated;

-- 5. Ensure the has_role function has proper security
-- Update the function to be more secure
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  ) AND _user_id IS NOT NULL AND _user_id = auth.uid();
$$;