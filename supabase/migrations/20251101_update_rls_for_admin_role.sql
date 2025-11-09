-- Migration: Update RLS policies to use is_admin() helper
-- This ensures 'admin', 'super_admin', and 'broker' all have same permissions

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

-- Drop old admin policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

-- Create new admin policies using is_admin()
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.current_user_is_admin());

CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (public.current_user_is_admin());

CREATE POLICY "Admins can insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (public.current_user_is_admin());

-- ============================================================================
-- LEADS TABLE
-- ============================================================================

-- Drop old broker policies
DROP POLICY IF EXISTS "Broker sees all leads" ON public.leads;
DROP POLICY IF EXISTS "Broker can manage all leads" ON public.leads;

-- Create new admin policies
CREATE POLICY "Admins see all leads"
ON public.leads FOR SELECT
USING (public.current_user_is_admin());

CREATE POLICY "Admins can manage all leads"
ON public.leads FOR ALL
USING (public.current_user_is_admin());

-- ============================================================================
-- BLOG_POSTS TABLE
-- ============================================================================

-- Drop old admin policies
DROP POLICY IF EXISTS "Only broker/admin can manage blog posts" ON public.blog_posts;

-- Create new admin policy
CREATE POLICY "Only admins can manage blog posts"
ON public.blog_posts FOR ALL
USING (public.current_user_is_admin());

-- ============================================================================
-- SITE_CONTENT TABLE
-- ============================================================================

-- Drop old admin policies
DROP POLICY IF EXISTS "Only broker/admin can manage site content" ON public.site_content;

-- Create new admin policy
CREATE POLICY "Only admins can manage site content"
ON public.site_content FOR ALL
USING (public.current_user_is_admin());

-- ============================================================================
-- TRANSACTIONS TABLE
-- ============================================================================

-- Drop old admin policies
DROP POLICY IF EXISTS "Only broker/admin can manage transactions" ON public.transactions;

-- Create new admin policy
CREATE POLICY "Only admins can manage transactions"
ON public.transactions FOR ALL
USING (public.current_user_is_admin());

-- ============================================================================
-- AGENT_APPLICATIONS TABLE
-- ============================================================================

-- Drop old broker policies
DROP POLICY IF EXISTS "Broker can view all applications" ON public.agent_applications;
DROP POLICY IF EXISTS "Broker can manage applications" ON public.agent_applications;

-- Create new admin policies
CREATE POLICY "Admins can view all applications"
ON public.agent_applications FOR SELECT
USING (public.current_user_is_admin());

CREATE POLICY "Admins can manage applications"
ON public.agent_applications FOR ALL
USING (public.current_user_is_admin());

-- ============================================================================
-- OPEN_HOUSES TABLE
-- ============================================================================

-- Update existing policy to use is_admin for viewing all
DROP POLICY IF EXISTS "Admins can view all open houses" ON public.open_houses;

CREATE POLICY "Admins can view all open houses"
ON public.open_houses FOR SELECT
USING (public.current_user_is_admin());

COMMENT ON POLICY "Admins can view all profiles" ON public.profiles
IS 'Allows users with admin privileges (admin, super_admin, broker) to view all profiles';
