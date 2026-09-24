BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assessment_language') THEN
    RAISE EXCEPTION 'assessment_language enum is missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid WHERE t.typname = 'assessment_language' AND e.enumlabel = 'java') THEN
    RAISE EXCEPTION 'java language is missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid WHERE t.typname = 'assessment_language' AND e.enumlabel = 'javascript') THEN
    RAISE EXCEPTION 'javascript language is missing';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.assessments'::regclass
      AND pg_get_constraintdef(oid) ILIKE '%duration_minutes = 30%'
  ) THEN
    RAISE EXCEPTION 'fixed assessment duration constraint is missing';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.assessment_attempts'::regclass
      AND pg_get_constraintdef(oid) ILIKE '%30 minutes%'
  ) THEN
    RAISE EXCEPTION 'authoritative expiry constraint is missing';
  END IF;
  IF has_function_privilege('anon', 'public.start_assessment_attempt(uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'anonymous users can start attempts';
  END IF;
  IF has_function_privilege('anon', 'public.get_assessment_report(uuid,public.assessment_language,public.attempt_status,text,text,integer,integer)', 'EXECUTE') THEN
    RAISE EXCEPTION 'anonymous users can access trainer reports';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'assessment_attempts_assessment_status_idx') THEN
    RAISE EXCEPTION 'attempt report index is missing';
  END IF;
END;
$$;

ROLLBACK;
