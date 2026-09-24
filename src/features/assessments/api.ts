import { supabase } from "@/integrations/supabase/client";
import type {
  AssessmentLanguage,
  AssessmentQuestionType,
  AssessmentReport,
  AssessmentSummary,
  StartedAttempt,
  SubmissionMode,
} from "./types";
import { isAssessmentLanguage } from "./types";

// Generated database types are refreshed after applying the migration.
const db = supabase as any;

export interface AssessmentQuestionInput {
  type: AssessmentQuestionType;
  prompt: string;
  options?: string[];
  publicConfig?: Record<string, unknown>;
  privateConfig?: Record<string, unknown>;
}

export interface CreateAssessmentInput {
  name: string;
  description?: string;
  language: AssessmentLanguage;
  scheduledAt?: string | null;
  passPercentage?: number;
  questions: AssessmentQuestionInput[];
}

function assertLanguage(language: unknown): asserts language is AssessmentLanguage {
  if (!isAssessmentLanguage(language)) throw new Error("Unsupported assessment language");
}

export async function listTrainerAssessments(): Promise<AssessmentSummary[]> {
  const { data, error } = await db
    .from("assessments")
    .select("id,name,description,language,status,scheduled_at,duration_minutes,pass_percentage,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listAvailableAssessments(): Promise<AssessmentSummary[]> {
  const { data, error } = await db.rpc("list_available_assessments");
  if (error) throw error;
  return data ?? [];
}

export async function createAssessment(input: CreateAssessmentInput): Promise<string> {
  assertLanguage(input.language);
  if (!input.name.trim()) throw new Error("Assessment name is required");
  if (!input.questions.length) throw new Error("At least one question is required");

  const { data, error } = await db.rpc("create_assessment", {
    p_name: input.name.trim(),
    p_description: input.description?.trim() || null,
    p_language: input.language,
    p_scheduled_at: input.scheduledAt ?? null,
    p_pass_percentage: input.passPercentage ?? 60,
    p_questions: input.questions,
  });
  if (error) throw error;
  return data as string;
}

export async function publishAssessment(assessmentId: string): Promise<void> {
  const { error } = await db.rpc("publish_assessment", { p_assessment_id: assessmentId });
  if (error) throw error;
}

export async function startAttempt(assessmentId: string): Promise<StartedAttempt> {
  const { data, error } = await db.rpc("start_assessment_attempt", { p_assessment_id: assessmentId });
  if (error) throw error;
  return data as StartedAttempt;
}

export async function autosaveAnswer(
  attemptId: string,
  questionId: string,
  answer: unknown,
  revision: number,
): Promise<{ accepted: boolean; savedAt?: string; status: string }> {
  const { data, error } = await db.rpc("autosave_attempt_answer", {
    p_attempt_id: attemptId,
    p_question_id: questionId,
    p_answer: answer,
    p_revision: revision,
  });
  if (error) throw error;
  return data;
}

export async function submitAttempt(
  attemptId: string,
  mode: SubmissionMode = "manual",
): Promise<Record<string, unknown>> {
  const { data, error } = await db.rpc("submit_assessment_attempt", {
    p_attempt_id: attemptId,
    p_requested_mode: mode,
  });
  if (error) throw error;
  return data;
}

export async function getAssessmentReport(
  assessmentId: string,
  options: { language?: AssessmentLanguage; status?: string; search?: string; sort?: "score" | "submitted_at"; page?: number; pageSize?: number } = {},
): Promise<AssessmentReport> {
  if (options.language) assertLanguage(options.language);
  const { data, error } = await db.rpc("get_assessment_report", {
    p_assessment_id: assessmentId,
    p_language: options.language ?? null,
    p_status: options.status ?? null,
    p_search: options.search?.trim() || null,
    p_sort: options.sort ?? "score",
    p_page: options.page ?? 1,
    p_page_size: Math.min(options.pageSize ?? 25, 100),
  });
  if (error) throw error;
  return data as AssessmentReport;
}

export async function recordReportExport(assessmentId: string, format: "csv"): Promise<void> {
  const { error } = await db.rpc("record_report_export", { p_assessment_id: assessmentId, p_format: format });
  if (error) throw error;
}
