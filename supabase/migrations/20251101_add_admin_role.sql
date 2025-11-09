-- Migration: Add 'admin' role and helper function
-- This simplifies the role structure: admin = super_admin + broker

-- Step 1: Add 'admin' to the user_role enum type
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';

-- Step 2: Create a helper function to check if user has admin privileges
-- This function returns TRUE for 'admin', 'super_admin', and 'broker' roles
CREATE OR REPLACE FUNCTION public.is_admin(user_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN user_role IN ('admin', 'super_admin', 'broker');
END;
$$;

-- Step 3: Create a helper function to get current user's role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN v_role;
END;
$$;

-- Step 4: Create a helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN public.is_admin(public.current_user_role());
END;
$$;

COMMENT ON FUNCTION public.is_admin IS 'Returns true if the given role has admin privileges (admin, super_admin, or broker)';
COMMENT ON FUNCTION public.current_user_role IS 'Returns the role of the currently authenticated user';
COMMENT ON FUNCTION public.current_user_is_admin IS 'Returns true if the currently authenticated user has admin privileges';
