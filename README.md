# Test Crafter

Test Crafter is a role-based technical assessment platform for Java and JavaScript. Trainers create and publish assessments, candidates complete a server-timed 30-minute attempt, answers autosave, and trainers view objective paginated reports.

## Architecture

- React 18, TypeScript, Vite, Tailwind CSS, and shadcn/ui provide the web client.
- Supabase Auth supplies candidate and trainer identity.
- PostgreSQL functions form the trusted API boundary for assessment creation, attempt timing, autosave, submission, scoring, and reports.
- Row-level security protects trainer and candidate data.
- Supabase Edge Functions provide AI-assisted question transformation and text evaluation.
- Coding answers are stored but are **not executed** until an approved isolated execution service is configured.

The application is stateless outside PostgreSQL and Supabase Auth. This permits horizontal web-client and Edge Function scaling, but the concurrency target must be validated in the intended deployment environment.

## Local setup

Requirements: Node.js 20+, npm, Supabase CLI, and optionally k6.

```bash
cp .env.example .env
npm ci
supabase start
supabase db reset
npm run dev
```

Configure these browser-safe values in `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Configure server-only secrets with `supabase secrets set`, never in `VITE_` variables:

- `OPENAI_API_KEY`
- `ALLOWED_ORIGIN`

## Authentication and roles

Public sign-up always creates a `student` role. Trainer accounts must be provisioned by an administrator by adding a `trainer` role in `public.user_roles`. Routes and database functions independently enforce roles; route protection is not treated as an authorization boundary.

## Assessment workflow

1. A trainer creates a draft and selects exactly one language: Java or JavaScript.
2. The backend validates and stores the language and fixed 30-minute duration.
3. The trainer publishes the assessment.
4. An authorized candidate starts or resumes one attempt.
5. PostgreSQL records `started_at` and `expires_at`; refreshes reuse the same attempt.
6. Answers autosave with monotonically increasing revisions and bounded client retries.
7. Late saves are rejected. Submission is idempotent and records manual or automatic mode. A PostgreSQL cron job reconciles expired attempts every minute, including when the browser is disconnected.
8. Trainers access a protected summary and candidate-level report with search, filters, server pagination, sorting, and CSV export.

Candidate responses never include private grading configuration or correct answers.

## Timer behavior

The browser displays a countdown synchronized to `serverNow`, but the database is authoritative. Attempts always expire 30 minutes after `started_at`. Warnings appear at 10, 5, and 1 minute. Refreshing, reopening the browser, changing the local clock, or repeating API calls does not extend the deadline.

## Coding questions

The repository includes an `ExecutionRequest`/`ExecutionResult` boundary. The default implementation returns `unavailable`; it deliberately does not use `eval`, `new Function`, PostgreSQL, or an Edge Function to run candidate code.

An approved runner must isolate each execution with:

- immutable container or microVM;
- no host filesystem or cloud metadata access;
- no outbound network by default;
- language allowlists for Java and JavaScript;
- CPU, memory, wall-time, process, and output limits;
- signed one-time test-bundle identifiers;
- compilation/runtime/test results returned without private test content.

See [docs/execution-service.md](docs/execution-service.md).

## Database migrations

```bash
supabase db reset                 # local destructive reset only
supabase migration up             # apply pending migrations
supabase db lint
```

The platform migration adds assessments, questions, invitations, attempts, answers, audit events, indexes, RLS policies, and RPC functions. Historical duplicate migrations and a historical data-deletion migration were removed so a fresh local database can be reproduced. Coordinate migration-history repair before applying this branch to an environment that has already recorded those versions.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
supabase test db
```

Tests cover language validation and server-clock countdown behavior. Database authorization, expiry, and idempotency should also be exercised against a disposable local Supabase instance before deployment.

## Load testing

The k6 scenario models authentication, start/resume, autosave, and submission, gradually ramping toward 1,000 virtual users. It refuses to run unless explicitly enabled.

```bash
ALLOW_LOAD_TEST=true \
BASE_URL=http://127.0.0.1:54321 \
SUPABASE_ANON_KEY=local-key \
CANDIDATE_EMAIL=load-test@example.test \
CANDIDATE_PASSWORD=replace-me \
ASSESSMENT_ID=00000000-0000-0000-0000-000000000000 \
k6 run load/k6-assessment.js
```

Use disposable accounts and a non-production project. The target is not considered achieved until measured results meet the script thresholds and database/compute metrics remain healthy. A single shared account is only a smoke test; a representative test requires a prepared pool of candidate identities or a purpose-built load-test authentication setup.

## Trainer report

The report includes invitation/start/completion counts, manual and automatic submissions, score aggregates, pass/fail counts, question success rates, and candidate-level timing, answer counts, execution outcomes, scores, and statuses. CSV cells are escaped to mitigate spreadsheet formula injection. Report views and exports are audited.

## Deployment and scaling

- Deploy the static client behind HTTPS with immutable asset caching and security headers.
- Use Supabase connection pooling for any external server workloads.
- Keep assessment services stateless; PostgreSQL owns timing and idempotency.
- Monitor API latency, error rates, active attempts, expired attempts, autosave failures, submission rates, database latency, locks, connection usage, and Edge Function/AI cost.
- Apply rate limiting at the API gateway for sign-in, start, autosave, submission, and AI functions.
- Test reports with production-scale row counts and retain server-side pagination.

## Known limitations

- A secure code-execution service is not configured, so coding answers are stored but not executed or scored.
- The k6 script is provided but no 1,000-user result is claimed in this repository.
- Existing prototype test-session tables remain for migration compatibility, but the upgraded UI uses the new assessment RPCs.
- Trainer provisioning is an administrative database operation; an admin console is not included.
- AI output still requires human review for high-stakes scoring decisions.

## Security notes

Do not expose service-role keys, AI keys, correct answers, or private test bundles to the client. Keep RLS enabled, require JWTs for non-health Edge Functions, restrict CORS, rotate compromised credentials, review audit events, and apply a defined data-retention policy.
