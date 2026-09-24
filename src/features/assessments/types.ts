export const ASSESSMENT_LANGUAGES = ["java", "javascript"] as const;

export type AssessmentLanguage = (typeof ASSESSMENT_LANGUAGES)[number];
export type AssessmentStatus = "draft" | "published" | "archived";
export type AttemptStatus = "in_progress" | "submitted" | "expired";
export type SubmissionMode = "manual" | "automatic";
export type AssessmentQuestionType = "multiple_choice" | "text" | "code";

export interface AssessmentSummary {
  id: string;
  name: string;
  description: string | null;
  language: AssessmentLanguage;
  status: AssessmentStatus;
  scheduled_at: string | null;
  duration_minutes: 30;
  pass_percentage: number;
  created_at: string;
}

export interface CandidateQuestion {
  id: string;
  position: number;
  type: AssessmentQuestionType;
  prompt: string;
  options: string[];
  publicConfig: Record<string, unknown>;
}

export interface StartedAttempt {
  attemptId: string;
  assessmentId: string;
  assessmentName: string;
  language: AssessmentLanguage;
  durationMinutes: 30;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  status: AttemptStatus;
  serverNow: string;
  questions: CandidateQuestion[];
}

export interface CandidateReportRow {
  candidateId: string;
  candidateName: string | null;
  language: AssessmentLanguage;
  startedAt: string;
  submittedAt: string | null;
  timeUsedSeconds: number;
  submissionMode: SubmissionMode | null;
  questionsAttempted: number;
  questionsNotAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  testCasesPassed: number;
  testCasesFailed: number;
  executionFailure: boolean;
  totalScore: number;
  percentage: number;
  result: "pass" | "fail";
  status: AttemptStatus;
}

export interface AssessmentReport {
  summary: Record<string, string | number | null>;
  questionSuccessRates: Array<{
    questionId: string;
    position: number;
    successRate: number;
  }>;
  candidates: CandidateReportRow[];
  totalCandidates: number;
}

export function isAssessmentLanguage(value: unknown): value is AssessmentLanguage {
  return typeof value === "string" && ASSESSMENT_LANGUAGES.includes(value as AssessmentLanguage);
}
