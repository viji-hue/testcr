# Secure execution service contract

Candidate code cannot be safely executed in the browser, a general application process, PostgreSQL, or a standard Edge Function. The frontend currently calls a disabled interface that returns `unavailable`.

An implementation should accept an authenticated request containing the immutable assessment language, candidate source, and a signed test-bundle identifier. It should place work on a bounded queue and run each submission in a fresh, unprivileged container or microVM.

Required controls:

- Java and JavaScript images pinned by digest.
- Read-only root filesystem and isolated temporary workspace.
- No host mounts, privilege escalation, container socket, cloud metadata, or secrets.
- Outbound network denied by default.
- CPU, memory, PID, wall-time, file-size, and output-size limits.
- Test bundles fetched through a one-time internal credential and never returned to candidates.
- Source and result retention governed by policy.
- Correlation IDs, structured logs, metrics, and audit events.
- Queue backpressure and per-candidate/assessment rate limits.

The result must distinguish compilation errors, runtime errors, timeouts, infrastructure failures, passed/failed tests, and truncated output. Only observable results—not private test source—may be returned to the candidate.
