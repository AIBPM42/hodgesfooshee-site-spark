-- =====================================================
-- Add MLS Member ID to Agent Profiles
-- This links agents to their Realtyna MLS profile
-- =====================================================

-- Add mls_member_id column to agent_profiles
ALTER TABLE public.agent_profiles
ADD COLUMN IF NOT EXISTS mls_member_id TEXT UNIQUE;

-- Add index for fast lookups
CREATE INDEX IF NOT EXISTS idx_agent_profiles_mls_member_id
ON public.agent_profiles(mls_member_id);

-- Verify it was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'agent_profiles'
AND column_name = 'mls_member_id';
