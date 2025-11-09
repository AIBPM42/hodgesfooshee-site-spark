-- Add Realtyna MLS integration fields to agent_profiles table
-- Run this FIRST before creating new test users

-- Add MLS integration columns
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS mls_member_key TEXT UNIQUE;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS last_mls_sync TIMESTAMPTZ;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS mls_member_id TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS office_key TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS office_name TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS license_number TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS designations TEXT;

-- Create index for fast MLS lookups
CREATE INDEX IF NOT EXISTS idx_agent_profiles_mls_key ON agent_profiles(mls_member_key);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_office_key ON agent_profiles(office_key);

-- Add comments for documentation
COMMENT ON COLUMN agent_profiles.mls_member_key IS 'RESO Member.MemberKey - unique identifier from MLS system';
COMMENT ON COLUMN agent_profiles.mls_member_id IS 'RESO Member.MemberMlsId - agent MLS ID number';
COMMENT ON COLUMN agent_profiles.office_key IS 'RESO Office.OfficeKey - links to MLS office';
COMMENT ON COLUMN agent_profiles.last_mls_sync IS 'Timestamp of last sync with Realtyna API';
