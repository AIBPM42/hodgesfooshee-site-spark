-- =====================================================
-- DROP ALL TABLES (Clean slate for fresh migration)
-- =====================================================

-- Drop tables in reverse order (respecting foreign key dependencies)
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.agent_activity_log CASCADE;
DROP TABLE IF EXISTS public.saved_searches CASCADE;
DROP TABLE IF EXISTS public.user_favorites CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.site_content CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.open_house_rsvps CASCADE;
DROP TABLE IF EXISTS public.open_houses CASCADE;
DROP TABLE IF EXISTS public.agent_applications CASCADE;
DROP TABLE IF EXISTS public.agent_profiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
