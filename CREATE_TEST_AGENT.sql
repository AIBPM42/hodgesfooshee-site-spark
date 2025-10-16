-- =====================================================
-- Create Test Agent for Approval Testing
-- =====================================================

-- First, you need to register a test agent account at /register
-- Then run this to find and verify the agent:

SELECT id, email, first_name, last_name, role, status
FROM public.profiles
WHERE role = 'agent'
ORDER BY created_at DESC;

-- If you want to manually create a test pending agent (for testing):
-- Replace the UUID and email with a real auth user
/*
INSERT INTO public.profiles (id, email, role, status, first_name, last_name, phone)
VALUES (
  'REPLACE-WITH-REAL-UUID',
  'testagent@example.com',
  'agent',
  'pending',
  'Test',
  'Agent',
  '555-0123'
);
*/
