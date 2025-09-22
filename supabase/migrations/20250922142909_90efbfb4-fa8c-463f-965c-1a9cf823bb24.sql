-- Implement role-based access control for leads table security
-- This fixes the issue where any authenticated user can access sensitive customer data

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'agent', 'viewer');

-- Create user_roles table to manage who can access leads
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
  )
$$;

-- Drop the current policy that allows any authenticated user
DROP POLICY IF EXISTS "authenticated_users_can_view_leads" ON public.leads;

-- Create new secure policy that only allows admin and agent roles
CREATE POLICY "authorized_staff_can_view_leads" ON public.leads
FOR SELECT 
USING (public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'agent'::app_role]));

-- Policy to allow users to manage their own role assignments (admins only)
CREATE POLICY "admins_can_manage_user_roles" ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy to allow users to view their own roles
CREATE POLICY "users_can_view_own_roles" ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

-- The anon_insert policy on leads remains unchanged to allow lead form submissions