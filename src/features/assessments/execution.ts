import type { AssessmentLanguage } from "./types";

export interface ExecutionRequest {
  language: AssessmentLanguage;
  source: string;
  testBundleId: string;
}

export interface ExecutionResult {
  status: "passed" | "failed" | "compile_error" | "runtime_error" | "unavailable";
  stdout: string;
  stderr: string;
  testCasesPassed: number;
  testCasesFailed: number;
}

/**
 * Untrusted code must not execute in the browser or Supabase Edge Functions.
 * Configure an approved isolated runner before replacing this implementation.
 */
export async function executeCandidateCode(_request: ExecutionRequest): Promise<ExecutionResult> {
  return {
    status: "unavailable",
    stdout: "",
    stderr: "Secure code execution is not configured.",
    testCasesPassed: 0,
    testCasesFailed: 0,
  };
}
