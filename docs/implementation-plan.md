# Assessment platform implementation plan

## Existing constraints

The repository is a React/Vite SPA backed by Supabase. The prototype used local names as identity, anonymous database policies, browser-side JavaScript execution, hard-coded student statistics, and UI-only custom tests. No automated tests, CI, or infrastructure definition existed.

## Change map

- Modify authentication bootstrap, route guards, student/trainer pages, assessment creator, Edge Function security, build metadata, environment handling, and documentation.
- Create a typed assessment feature module, candidate assessment screen, trainer list/report, timer tests, health function, load scenario, execution-service contract, and database migration.
- Add PostgreSQL enums, assessments, questions, invitations, attempts, answers, audit events, indexes, RLS, and security-definer RPCs.
- Remove the development-only platform tagger and its branding. Add Vitest for pure domain tests.
- Replace local-only custom-test saving with backend persistence and a fixed duration.
- Replace browser code execution with a disabled secure-runner interface.

## Assumptions

- One candidate gets one attempt per assessment in this iteration.
- Public sign-up creates candidates only; administrators provision trainers.
- Published assessments without invitations are available to all authenticated candidates; once invitations exist, only invited candidates may start.
- Multiple-choice questions are automatically scored. Text and code questions require a later rubric or isolated runner and receive no automatic points.
- The deployment uses Supabase-managed pooling and an external gateway/CDN capable of rate limiting and secure headers.

## Risks

- Historical migration versions require coordination in existing environments.
- A secure code runner and production rate limiter are external deployment dependencies.
- Concurrency capacity remains unverified until the k6 scenario runs in a production-like non-production environment.
- Existing users without roles are backfilled as candidates; trainer roles must be explicitly reviewed and provisioned.
