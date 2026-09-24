import http from "k6/http";
import { check, fail, sleep } from "k6";

const baseUrl = __ENV.BASE_URL;
const anonKey = __ENV.SUPABASE_ANON_KEY;
const assessmentId = __ENV.ASSESSMENT_ID;

if (__ENV.ALLOW_LOAD_TEST !== "true") fail("Set ALLOW_LOAD_TEST=true only for an approved non-production environment.");
if (!baseUrl || !anonKey || !assessmentId) fail("BASE_URL, SUPABASE_ANON_KEY, and ASSESSMENT_ID are required.");

export const options = {
  scenarios: {
    candidates: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 100 },
        { duration: "5m", target: 250 },
        { duration: "5m", target: 500 },
        { duration: "5m", target: 1000 },
        { duration: "10m", target: 1000 },
        { duration: "2m", target: 0 },
      ],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1000", "p(99)<2000"],
    checks: ["rate>0.99"],
  },
};

function headers(token) {
  return { apikey: anonKey, Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export function setup() {
  const email = __ENV.CANDIDATE_EMAIL;
  const password = __ENV.CANDIDATE_PASSWORD;
  if (!email || !password) fail("Use a dedicated load-test candidate account.");
  const login = http.post(`${baseUrl}/auth/v1/token?grant_type=password`, JSON.stringify({ email, password }), { headers: { apikey: anonKey, "Content-Type": "application/json" } });
  check(login, { "login succeeds": (response) => response.status === 200 });
  return { token: login.json("access_token") };
}

export default function ({ token }) {
  const requestHeaders = headers(token);
  const start = http.post(`${baseUrl}/rest/v1/rpc/start_assessment_attempt`, JSON.stringify({ p_assessment_id: assessmentId }), { headers: requestHeaders });
  check(start, { "attempt starts or resumes": (response) => response.status === 200 });
  const attempt = start.json();
  const question = attempt.questions?.[0];
  if (attempt.attemptId && question?.id) {
    const save = http.post(`${baseUrl}/rest/v1/rpc/autosave_attempt_answer`, JSON.stringify({ p_attempt_id: attempt.attemptId, p_question_id: question.id, p_answer: { value: "load-test" }, p_revision: Date.now() }), { headers: requestHeaders });
    check(save, { "autosave succeeds": (response) => response.status === 200 });
    sleep(Math.random() * 2 + 1);
    const submit = http.post(`${baseUrl}/rest/v1/rpc/submit_assessment_attempt`, JSON.stringify({ p_attempt_id: attempt.attemptId, p_requested_mode: "manual" }), { headers: requestHeaders });
    check(submit, { "submission is idempotent": (response) => response.status === 200 });
  }
  sleep(1);
}
