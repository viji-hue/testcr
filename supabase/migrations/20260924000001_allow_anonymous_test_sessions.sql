-- Allow anonymous users (unauthenticated) to create and use test sessions
-- This is needed for the student portal where users enter their name without signing in

-- Drop the overly restrictive policies
DROP POLICY IF EXISTS "Students can create their own sessions" ON public.test_sessions;
DROP POLICY IF EXISTS "Students can view their own sessions" ON public.test_sessions;
DROP POLICY IF EXISTS "Trainers can view all sessions" ON public.test_sessions;
DROP POLICY IF EXISTS "Students can update their own sessions" ON public.test_sessions;

DROP POLICY IF EXISTS "Students can create results for their sessions" ON public.test_results;
DROP POLICY IF EXISTS "Students can view their own results" ON public.test_results;
DROP POLICY IF EXISTS "Trainers can view all results" ON public.test_results;

-- Add new policies that allow both authenticated and anonymous access
CREATE POLICY "Allow anonymous test session creation" 
ON public.test_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow anonymous test session viewing" 
ON public.test_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Allow anonymous test session updates" 
ON public.test_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow anonymous test result creation" 
ON public.test_results 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow anonymous test result viewing" 
ON public.test_results 
FOR SELECT 
USING (true);
