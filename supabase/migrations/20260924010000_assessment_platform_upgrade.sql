-- Test Crafter assessment platform foundation.
-- Candidate code execution is intentionally not implemented in PostgreSQL or Edge Functions.

CREATE TYPE public.assessment_language AS ENUM ('java', 'javascript');
CREATE TYPE public.assessment_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.assessment_question_type AS ENUM ('multiple_choice', 'text', 'code');
CREATE TYPE public.attempt_status AS ENUM ('in_progress', 'submitted', 'expired');
CREATE TYPE public.submission_mode AS ENUM ('manual', 'automatic');

CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 200),
  description TEXT,
  language public.assessment_language NOT NULL,
  status public.assessment_status NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  duration_minutes SMALLINT NOT NULL DEFAULT 30 CHECK (duration_minutes = 30),
  pass_percentage NUMERIC(5,2) NOT NULL DEFAULT 60 CHECK (pass_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position > 0),
  type public.assessment_question_type NOT NULL,
  prompt TEXT NOT NULL CHECK (length(trim(prompt)) > 0),
  options JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(options) = 'array'),
  public_config JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(public_config) = 'object'),
  private_config JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(private_config) = 'object'),
  points NUMERIC(8,2) NOT NULL DEFAULT 1 CHECK (points >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (assessment_id, position)
);

CREATE TABLE public.assessment_invitations (
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (assessment_id, candidate_id)
);

CREATE TABLE public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE RESTRICT,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  language public.assessment_language NOT NULL,
  status public.attempt_status NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ,
  submission_mode public.submission_mode,
  questions_attempted INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  incorrect_answers INTEGER NOT NULL DEFAULT 0,
  test_cases_passed INTEGER NOT NULL DEFAULT 0,
  test_cases_failed INTEGER NOT NULL DEFAULT 0,
  execution_failure BOOLEAN NOT NULL DEFAULT false,
  total_score NUMERIC(10,2) NOT NULL DEFAULT 0,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (expires_at = started_at + interval '30 minutes'),
  CHECK ((status = 'in_progress' AND submitted_at IS NULL AND submission_mode IS NULL)
      OR (status <> 'in_progress' AND submitted_at IS NOT NULL AND submission_mode IS NOT NULL)),
  UNIQUE (assessment_id, candidate_id)
);

CREATE TABLE public.attempt_answers (
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE RESTRICT,
  answer JSONB NOT NULL DEFAULT '{}'::jsonb,
  revision BIGINT NOT NULL DEFAULT 1 CHECK (revision > 0),
  is_correct BOOLEAN,
  awarded_points NUMERIC(8,2),
  compilation_error TEXT,
  runtime_error TEXT,
  test_cases_passed INTEGER NOT NULL DEFAULT 0,
  test_cases_failed INTEGER NOT NULL DEFAULT 0,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (attempt_id, question_id)
);

CREATE TABLE public.assessment_audit_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  attempt_id UUID REFERENCES public.assessment_attempts(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  correlation_id UUID NOT NULL DEFAULT gen_random_uuid(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX assessments_owner_status_idx ON public.assessments(owner_id, status, created_at DESC);
CREATE INDEX assessments_language_status_idx ON public.assessments(language, status, scheduled_at);
CREATE INDEX assessment_questions_assessment_idx ON public.assessment_questions(assessment_id, position);
CREATE INDEX assessment_invitations_candidate_idx ON public.assessment_invitations(candidate_id, invited_at DESC);
CREATE INDEX assessment_attempts_assessment_status_idx ON public.assessment_attempts(assessment_id, status, submitted_at DESC);
CREATE INDEX assessment_attempts_candidate_status_idx ON public.assessment_attempts(candidate_id, status, started_at DESC);
CREATE INDEX assessment_attempts_language_expiry_idx ON public.assessment_attempts(language, expires_at) WHERE status = 'in_progress';
CREATE INDEX assessment_attempts_submission_idx ON public.assessment_attempts(assessment_id, percentage DESC, submitted_at DESC);
CREATE INDEX attempt_answers_question_idx ON public.attempt_answers(question_id, is_correct);
CREATE INDEX assessment_audit_lookup_idx ON public.assessment_audit_log(assessment_id, attempt_id, created_at DESC);

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessment_attempts_updated_at
  BEFORE UPDATE ON public.assessment_attempts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_audit_log ENABLE ROW LEVEL SECURITY;

-- Retire the legacy anonymous data access introduced by the prototype.
DROP POLICY IF EXISTS "Allow anonymous test session creation" ON public.test_sessions;
DROP POLICY IF EXISTS "Allow anonymous test session viewing" ON public.test_sessions;
DROP POLICY IF EXISTS "Allow anonymous test session updates" ON public.test_sessions;
DROP POLICY IF EXISTS "Allow anonymous test result creation" ON public.test_results;
DROP POLICY IF EXISTS "Allow anonymous test result viewing" ON public.test_results;
DROP POLICY IF EXISTS "Anyone can view test sessions" ON public.test_sessions;
DROP POLICY IF EXISTS "Anyone can create test sessions" ON public.test_sessions;
DROP POLICY IF EXISTS "Anyone can update test sessions" ON public.test_sessions;
DROP POLICY IF EXISTS "Anyone can view test results" ON public.test_results;
DROP POLICY IF EXISTS "Anyone can create test results" ON public.test_results;

-- Self-service sign-up can only create candidate accounts. Trainer roles must be provisioned by an administrator.
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;

CREATE OR REPLACE FUNCTION public.assign_candidate_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS assign_candidate_role_on_signup ON auth.users;
CREATE TRIGGER assign_candidate_role_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_candidate_role();

INSERT INTO public.user_roles(user_id, role)
SELECT u.id, 'student'::public.app_role FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id)
ON CONFLICT (user_id, role) DO NOTHING;

CREATE POLICY "Trainers manage owned assessments" ON public.assessments
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() AND public.has_role(auth.uid(), 'trainer'))
  WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(), 'trainer'));

CREATE POLICY "Trainers manage owned questions" ON public.assessment_questions
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.assessments a
    WHERE a.id = assessment_id AND a.owner_id = auth.uid() AND public.has_role(auth.uid(), 'trainer')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.assessments a
    WHERE a.id = assessment_id AND a.owner_id = auth.uid() AND public.has_role(auth.uid(), 'trainer')
  ));

CREATE POLICY "Trainers manage invitations" ON public.assessment_invitations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.assessments a WHERE a.id = assessment_id AND a.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.assessments a WHERE a.id = assessment_id AND a.owner_id = auth.uid()));

CREATE POLICY "Candidates view own invitations" ON public.assessment_invitations
  FOR SELECT TO authenticated USING (candidate_id = auth.uid());

CREATE POLICY "Candidates view own attempts" ON public.assessment_attempts
  FOR SELECT TO authenticated USING (candidate_id = auth.uid());

CREATE POLICY "Trainers view owned assessment attempts" ON public.assessment_attempts
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.assessments a
    WHERE a.id = assessment_id AND a.owner_id = auth.uid() AND public.has_role(auth.uid(), 'trainer')
  ));

CREATE POLICY "Candidates view own answers" ON public.attempt_answers
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.assessment_attempts aa WHERE aa.id = attempt_id AND aa.candidate_id = auth.uid()
  ));

CREATE POLICY "Trainers view owned assessment answers" ON public.attempt_answers
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.assessment_attempts aa
    JOIN public.assessments a ON a.id = aa.assessment_id
    WHERE aa.id = attempt_id AND a.owner_id = auth.uid() AND public.has_role(auth.uid(), 'trainer')
  ));

CREATE POLICY "Trainers view owned audit events" ON public.assessment_audit_log
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.assessments a
    WHERE a.id = assessment_id AND a.owner_id = auth.uid() AND public.has_role(auth.uid(), 'trainer')
  ));

CREATE OR REPLACE FUNCTION public.create_assessment(
  p_name TEXT,
  p_description TEXT,
  p_language TEXT,
  p_scheduled_at TIMESTAMPTZ,
  p_pass_percentage NUMERIC,
  p_questions JSONB
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_assessment_id UUID;
  v_language public.assessment_language;
  v_question JSONB;
  v_position BIGINT;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'trainer') THEN
    RAISE EXCEPTION 'trainer authorization required' USING ERRCODE = '42501';
  END IF;
  IF trim(coalesce(p_name, '')) = '' THEN RAISE EXCEPTION 'assessment name is required'; END IF;
  IF jsonb_typeof(p_questions) <> 'array' OR jsonb_array_length(p_questions) = 0 THEN
    RAISE EXCEPTION 'at least one question is required';
  END IF;
  v_language := p_language::public.assessment_language;

  INSERT INTO public.assessments(owner_id, name, description, language, scheduled_at, pass_percentage)
  VALUES (auth.uid(), trim(p_name), nullif(trim(p_description), ''), v_language, p_scheduled_at, coalesce(p_pass_percentage, 60))
  RETURNING id INTO v_assessment_id;

  FOR v_question, v_position IN
    SELECT value, ordinality FROM jsonb_array_elements(p_questions) WITH ORDINALITY
  LOOP
    INSERT INTO public.assessment_questions(
      assessment_id, position, type, prompt, options, public_config, private_config, points
    ) VALUES (
      v_assessment_id,
      v_position,
      (v_question->>'type')::public.assessment_question_type,
      trim(v_question->>'prompt'),
      coalesce(v_question->'options', '[]'::jsonb),
      coalesce(v_question->'publicConfig', '{}'::jsonb),
      coalesce(v_question->'privateConfig', '{}'::jsonb),
      coalesce((v_question->>'points')::numeric, 1)
    );
  END LOOP;

  INSERT INTO public.assessment_audit_log(actor_id, assessment_id, action)
  VALUES (auth.uid(), v_assessment_id, 'assessment.created');
  RETURN v_assessment_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.publish_assessment(p_assessment_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.assessments
  SET status = 'published'
  WHERE id = p_assessment_id AND owner_id = auth.uid() AND public.has_role(auth.uid(), 'trainer')
    AND EXISTS (SELECT 1 FROM public.assessment_questions q WHERE q.assessment_id = p_assessment_id);
  IF NOT FOUND THEN RAISE EXCEPTION 'assessment not found or cannot be published' USING ERRCODE = '42501'; END IF;
  INSERT INTO public.assessment_audit_log(actor_id, assessment_id, action)
  VALUES (auth.uid(), p_assessment_id, 'assessment.published');
END;
$$;

CREATE OR REPLACE FUNCTION public.list_available_assessments()
RETURNS TABLE(
  id UUID, name TEXT, description TEXT, language public.assessment_language,
  status public.assessment_status, scheduled_at TIMESTAMPTZ, duration_minutes SMALLINT,
  pass_percentage NUMERIC, created_at TIMESTAMPTZ
) LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT a.id, a.name, a.description, a.language, a.status, a.scheduled_at,
         a.duration_minutes, a.pass_percentage, a.created_at
  FROM public.assessments a
  WHERE auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'student')
    AND a.status = 'published'
    AND (a.scheduled_at IS NULL OR a.scheduled_at <= now())
    AND (NOT EXISTS (SELECT 1 FROM public.assessment_invitations i WHERE i.assessment_id = a.id)
         OR EXISTS (SELECT 1 FROM public.assessment_invitations i WHERE i.assessment_id = a.id AND i.candidate_id = auth.uid()))
  ORDER BY coalesce(a.scheduled_at, a.created_at) DESC;
$$;

CREATE OR REPLACE FUNCTION public.start_assessment_attempt(p_assessment_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_assessment public.assessments%ROWTYPE;
  v_attempt public.assessment_attempts%ROWTYPE;
  v_now TIMESTAMPTZ := clock_timestamp();
  v_questions JSONB;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'student') THEN
    RAISE EXCEPTION 'candidate authorization required' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_assessment FROM public.assessments
  WHERE id = p_assessment_id AND status = 'published'
    AND (scheduled_at IS NULL OR scheduled_at <= v_now);
  IF NOT FOUND THEN RAISE EXCEPTION 'assessment is not available'; END IF;
  IF EXISTS (SELECT 1 FROM public.assessment_invitations WHERE assessment_id = p_assessment_id)
     AND NOT EXISTS (SELECT 1 FROM public.assessment_invitations WHERE assessment_id = p_assessment_id AND candidate_id = auth.uid()) THEN
    RAISE EXCEPTION 'candidate is not invited' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.assessment_attempts(assessment_id, candidate_id, language, started_at, expires_at)
  VALUES (v_assessment.id, auth.uid(), v_assessment.language, v_now, v_now + interval '30 minutes')
  ON CONFLICT (assessment_id, candidate_id) DO UPDATE SET candidate_id = EXCLUDED.candidate_id
  RETURNING * INTO v_attempt;

  IF v_attempt.status = 'in_progress' AND v_now >= v_attempt.expires_at THEN
    UPDATE public.assessment_attempts SET status = 'expired', submitted_at = v_attempt.expires_at,
      submission_mode = 'automatic' WHERE id = v_attempt.id RETURNING * INTO v_attempt;
  END IF;

  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id, 'position', q.position, 'type', q.type, 'prompt', q.prompt,
    'options', q.options, 'publicConfig', q.public_config
  ) ORDER BY q.position), '[]'::jsonb) INTO v_questions
  FROM public.assessment_questions q WHERE q.assessment_id = v_assessment.id;

  INSERT INTO public.assessment_audit_log(actor_id, assessment_id, attempt_id, action)
  VALUES (auth.uid(), v_assessment.id, v_attempt.id, 'attempt.started');

  RETURN jsonb_build_object(
    'attemptId', v_attempt.id, 'assessmentId', v_assessment.id, 'assessmentName', v_assessment.name,
    'language', v_attempt.language, 'durationMinutes', 30, 'startedAt', v_attempt.started_at,
    'expiresAt', v_attempt.expires_at, 'submittedAt', v_attempt.submitted_at,
    'status', v_attempt.status, 'serverNow', v_now, 'questions', v_questions
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.autosave_attempt_answer(
  p_attempt_id UUID, p_question_id UUID, p_answer JSONB, p_revision BIGINT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_attempt public.assessment_attempts%ROWTYPE;
  v_saved_at TIMESTAMPTZ;
  v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
  SELECT * INTO v_attempt FROM public.assessment_attempts
  WHERE id = p_attempt_id AND candidate_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'attempt not found' USING ERRCODE = '42501'; END IF;
  IF v_attempt.status <> 'in_progress' OR v_now >= v_attempt.expires_at THEN
    IF v_attempt.status = 'in_progress' THEN
      UPDATE public.assessment_attempts SET status = 'expired', submitted_at = expires_at,
        submission_mode = 'automatic' WHERE id = v_attempt.id;
      INSERT INTO public.assessment_audit_log(actor_id, assessment_id, attempt_id, action)
      VALUES (auth.uid(), v_attempt.assessment_id, v_attempt.id, 'attempt.auto_submitted');
    END IF;
    RETURN jsonb_build_object('accepted', false, 'status', 'expired', 'serverNow', v_now);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.assessment_questions q
                 WHERE q.id = p_question_id AND q.assessment_id = v_attempt.assessment_id) THEN
    RAISE EXCEPTION 'question does not belong to this assessment';
  END IF;

  INSERT INTO public.attempt_answers(attempt_id, question_id, answer, revision, saved_at)
  VALUES (p_attempt_id, p_question_id, coalesce(p_answer, '{}'::jsonb), p_revision, v_now)
  ON CONFLICT (attempt_id, question_id) DO UPDATE
    SET answer = EXCLUDED.answer, revision = EXCLUDED.revision, saved_at = EXCLUDED.saved_at
    WHERE EXCLUDED.revision > public.attempt_answers.revision
  RETURNING saved_at INTO v_saved_at;

  IF v_saved_at IS NULL THEN
    SELECT saved_at INTO v_saved_at FROM public.attempt_answers
    WHERE attempt_id = p_attempt_id AND question_id = p_question_id;
  END IF;
  RETURN jsonb_build_object('accepted', true, 'savedAt', v_saved_at, 'status', 'in_progress', 'serverNow', v_now);
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_assessment_attempt(
  p_attempt_id UUID, p_requested_mode public.submission_mode DEFAULT 'manual'
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_attempt public.assessment_attempts%ROWTYPE;
  v_now TIMESTAMPTZ := clock_timestamp();
  v_mode public.submission_mode;
  v_status public.attempt_status;
  v_total_points NUMERIC;
  v_awarded NUMERIC;
  v_question_count INTEGER;
  v_attempted INTEGER;
  v_correct INTEGER;
BEGIN
  SELECT * INTO v_attempt FROM public.assessment_attempts
  WHERE id = p_attempt_id AND candidate_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'attempt not found' USING ERRCODE = '42501'; END IF;
  IF v_attempt.status <> 'in_progress' THEN
    RETURN jsonb_build_object('attemptId', v_attempt.id, 'status', v_attempt.status,
      'submittedAt', v_attempt.submitted_at, 'submissionMode', v_attempt.submission_mode,
      'percentage', v_attempt.percentage);
  END IF;

  v_mode := CASE WHEN v_now >= v_attempt.expires_at THEN 'automatic' ELSE p_requested_mode END;
  v_status := CASE WHEN v_mode = 'automatic' THEN 'expired' ELSE 'submitted' END;

  UPDATE public.attempt_answers aa SET
    is_correct = CASE WHEN q.type = 'multiple_choice'
      THEN aa.answer->>'value' = q.private_config->>'correctAnswer' ELSE NULL END,
    awarded_points = CASE WHEN q.type = 'multiple_choice' AND aa.answer->>'value' = q.private_config->>'correctAnswer'
      THEN q.points ELSE 0 END
  FROM public.assessment_questions q
  WHERE aa.attempt_id = v_attempt.id AND q.id = aa.question_id;

  SELECT coalesce(sum(points), 0), count(*) INTO v_total_points, v_question_count
  FROM public.assessment_questions WHERE assessment_id = v_attempt.assessment_id;
  SELECT count(*), count(*) FILTER (WHERE is_correct), coalesce(sum(awarded_points), 0)
  INTO v_attempted, v_correct, v_awarded
  FROM public.attempt_answers WHERE attempt_id = v_attempt.id;

  UPDATE public.assessment_attempts SET
    status = v_status,
    submitted_at = least(v_now, expires_at),
    submission_mode = v_mode,
    questions_attempted = v_attempted,
    correct_answers = v_correct,
    incorrect_answers = greatest(v_attempted - v_correct, 0),
    total_score = v_awarded,
    percentage = CASE WHEN v_total_points > 0 THEN round(v_awarded * 100 / v_total_points, 2) ELSE 0 END
  WHERE id = v_attempt.id RETURNING * INTO v_attempt;

  INSERT INTO public.assessment_audit_log(actor_id, assessment_id, attempt_id, action, metadata)
  VALUES (auth.uid(), v_attempt.assessment_id, v_attempt.id,
    CASE WHEN v_mode = 'automatic' THEN 'attempt.auto_submitted' ELSE 'attempt.submitted' END,
    jsonb_build_object('percentage', v_attempt.percentage));

  RETURN jsonb_build_object('attemptId', v_attempt.id, 'status', v_attempt.status,
    'submittedAt', v_attempt.submitted_at, 'submissionMode', v_attempt.submission_mode,
    'percentage', v_attempt.percentage, 'questionsAttempted', v_attempt.questions_attempted);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_assessment_report(
  p_assessment_id UUID,
  p_language public.assessment_language DEFAULT NULL,
  p_status public.attempt_status DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_sort TEXT DEFAULT 'score',
  p_page INTEGER DEFAULT 1,
  p_page_size INTEGER DEFAULT 25
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.assessments a
    WHERE a.id = p_assessment_id AND a.owner_id = auth.uid() AND public.has_role(auth.uid(), 'trainer')) THEN
    RAISE EXCEPTION 'trainer authorization required' USING ERRCODE = '42501';
  END IF;
  IF p_page < 1 OR p_page_size NOT BETWEEN 1 AND 100 OR p_sort NOT IN ('score', 'submitted_at') THEN RAISE EXCEPTION 'invalid report options'; END IF;

  WITH assessment AS (
    SELECT * FROM public.assessments WHERE id = p_assessment_id
  ), filtered AS (
    SELECT aa.*, coalesce(u.raw_user_meta_data->>'name', u.email) AS candidate_name,
      greatest(0, extract(epoch FROM (coalesce(aa.submitted_at, least(clock_timestamp(), aa.expires_at)) - aa.started_at)))::integer AS time_used
    FROM public.assessment_attempts aa JOIN auth.users u ON u.id = aa.candidate_id
    WHERE aa.assessment_id = p_assessment_id
      AND (p_language IS NULL OR aa.language = p_language)
      AND (p_status IS NULL OR aa.status = p_status)
      AND (p_search IS NULL OR coalesce(u.raw_user_meta_data->>'name', u.email, '') ILIKE '%' || p_search || '%'
           OR aa.candidate_id::text ILIKE '%' || p_search || '%')
  ), candidate_rows AS (
    SELECT jsonb_agg(jsonb_build_object(
      'candidateId', f.candidate_id, 'candidateName', f.candidate_name, 'language', f.language,
      'startedAt', f.started_at, 'submittedAt', f.submitted_at, 'timeUsedSeconds', f.time_used,
      'submissionMode', f.submission_mode, 'questionsAttempted', f.questions_attempted,
      'questionsNotAttempted', greatest((SELECT count(*) FROM public.assessment_questions q WHERE q.assessment_id = f.assessment_id) - f.questions_attempted, 0),
      'correctAnswers', f.correct_answers, 'incorrectAnswers', f.incorrect_answers,
      'testCasesPassed', f.test_cases_passed, 'testCasesFailed', f.test_cases_failed,
      'executionFailure', f.execution_failure, 'totalScore', f.total_score, 'percentage', f.percentage,
      'result', CASE WHEN f.percentage >= (SELECT pass_percentage FROM assessment) THEN 'pass' ELSE 'fail' END,
      'status', f.status
    ) ORDER BY f.percentage DESC, f.submitted_at DESC) AS rows
    FROM (SELECT * FROM filtered ORDER BY
            CASE WHEN p_sort = 'submitted_at' THEN submitted_at END DESC NULLS LAST,
            CASE WHEN p_sort = 'score' THEN percentage END DESC NULLS LAST,
            submitted_at DESC NULLS LAST
          LIMIT p_page_size OFFSET (p_page - 1) * p_page_size) f
  ), question_rates AS (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'questionId', q.id, 'position', q.position,
      'successRate', CASE WHEN count(ans.*) > 0 THEN round(count(*) FILTER (WHERE ans.is_correct) * 100.0 / count(ans.*), 2) ELSE 0 END
    ) ORDER BY q.position), '[]'::jsonb) AS rows
    FROM public.assessment_questions q LEFT JOIN public.attempt_answers ans ON ans.question_id = q.id
    WHERE q.assessment_id = p_assessment_id GROUP BY q.assessment_id
  )
  SELECT jsonb_build_object(
    'summary', jsonb_build_object(
      'assessmentName', a.name, 'language', a.language, 'scheduledDate', a.scheduled_at,
      'durationMinutes', 30,
      'numberInvited', (SELECT count(*) FROM public.assessment_invitations i WHERE i.assessment_id = a.id),
      'numberStarted', count(f.*),
      'numberSubmitted', count(*) FILTER (WHERE f.status = 'submitted'),
      'numberAutoSubmitted', count(*) FILTER (WHERE f.submission_mode = 'automatic'),
      'numberNotStarted', greatest((SELECT count(*) FROM public.assessment_invitations i WHERE i.assessment_id = a.id) - count(f.*), 0),
      'numberCompleted', count(*) FILTER (WHERE f.status <> 'in_progress'),
      'numberIncomplete', count(*) FILTER (WHERE f.status = 'in_progress'),
      'averageScore', coalesce(round(avg(f.percentage), 2), 0),
      'highestScore', coalesce(max(f.percentage), 0), 'lowestScore', coalesce(min(f.percentage), 0),
      'passCount', count(*) FILTER (WHERE f.percentage >= a.pass_percentage),
      'failCount', count(*) FILTER (WHERE f.status <> 'in_progress' AND f.percentage < a.pass_percentage),
      'passPercentage', CASE WHEN count(*) FILTER (WHERE f.status <> 'in_progress') > 0
        THEN round(count(*) FILTER (WHERE f.status <> 'in_progress' AND f.percentage >= a.pass_percentage) * 100.0 /
          count(*) FILTER (WHERE f.status <> 'in_progress'), 2) ELSE 0 END
    ),
    'questionSuccessRates', coalesce((SELECT rows FROM question_rates), '[]'::jsonb),
    'candidates', coalesce((SELECT rows FROM candidate_rows), '[]'::jsonb),
    'totalCandidates', (SELECT count(*) FROM filtered)
  ) INTO v_result
  FROM assessment a LEFT JOIN filtered f ON true GROUP BY a.id, a.name, a.language, a.scheduled_at, a.pass_percentage;

  INSERT INTO public.assessment_audit_log(actor_id, assessment_id, action, metadata)
  VALUES (auth.uid(), p_assessment_id, 'report.viewed', jsonb_build_object('page', p_page, 'pageSize', p_page_size));
  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_report_export(p_assessment_id UUID, p_format TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF p_format <> 'csv' OR NOT EXISTS (SELECT 1 FROM public.assessments a
    WHERE a.id = p_assessment_id AND a.owner_id = auth.uid() AND public.has_role(auth.uid(), 'trainer')) THEN
    RAISE EXCEPTION 'trainer authorization required' USING ERRCODE = '42501';
  END IF;
  INSERT INTO public.assessment_audit_log(actor_id, assessment_id, action, metadata)
  VALUES (auth.uid(), p_assessment_id, 'report.exported', jsonb_build_object('format', p_format));
END;
$$;

REVOKE ALL ON FUNCTION public.create_assessment(TEXT,TEXT,TEXT,TIMESTAMPTZ,NUMERIC,JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.publish_assessment(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.list_available_assessments() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.start_assessment_attempt(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.autosave_attempt_answer(UUID,UUID,JSONB,BIGINT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.submit_assessment_attempt(UUID,public.submission_mode) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_assessment_report(UUID,public.assessment_language,public.attempt_status,TEXT,TEXT,INTEGER,INTEGER) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.record_report_export(UUID,TEXT) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.create_assessment(TEXT,TEXT,TEXT,TIMESTAMPTZ,NUMERIC,JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_assessment(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_available_assessments() TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_assessment_attempt(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.autosave_attempt_answer(UUID,UUID,JSONB,BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_assessment_attempt(UUID,public.submission_mode) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_assessment_report(UUID,public.assessment_language,public.attempt_status,TEXT,TEXT,INTEGER,INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_report_export(UUID,TEXT) TO authenticated;
