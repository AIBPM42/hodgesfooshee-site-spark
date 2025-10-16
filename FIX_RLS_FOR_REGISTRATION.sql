-- =====================================================
-- Fix RLS to Allow Registration
-- =====================================================

-- Add policy to allow users to insert their own profile during registration
CREATE POLICY "Users can insert own profile during registration"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Verify policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'profiles';
