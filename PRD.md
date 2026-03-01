# TestForge — Product Requirements Document (PRD)

**Product:** TestForge

**PRD version:** 1.0 (Full PRD)

**Status:** Draft

**Owner:** Charith Migunthenna

**Prepared by:** CMMBOT

**Last updated:** 2026-02-27

---

## 1) Executive summary

TestForge is a **QA automation platform** for **Web UI testing** (v1) that enables teams to create, maintain, execute, and report on automated tests **without writing code**.

It combines:
- a modern SaaS-style UI for test management (Projects → Environments → Plans → Cases → Runs)
- an **agent-assisted authoring workflow** (prompt → draft plan/cases → human edits)
- a robust execution system using **Playwright workers** driven by **BullMQ + Redis**
- evidence-first reporting (screenshots/video/trace) saved to local filesystem

**v1 focus:** Web UI automation only.

**v1.1 roadmap:** Web API testing (HTTP step runner) added after v1 stabilizes.

---

## 2) Goals, non-goals, and success metrics

### 2.1 Goals (v1)
1) **General product** for testing any web application (Odoo included, but not Odoo-specific).
2) **No-code test creation and editing** via a structured step editor.
3) **Agent-assisted test generation** from feature description + acceptance criteria.
4) **Reliable execution** via queue/worker architecture with retries.
5) **Evidence & reporting** that satisfies real QA needs:
   - pass/fail
   - time taken
   - step-level evidence and clear failure details
6) **Regression readiness:** versioned test cases and run history.

### 2.2 Non-goals (v1)
- Full “visual AI” that deduces selectors solely from screenshots.
- Load/performance testing suite.
- Native mobile testing.
- Multi-tenant SaaS billing.

### 2.3 Success metrics
- Time to automate a new feature flow: **< 30 minutes** from prompt to first green run.
- Flaky test rate after stabilization: **< 5%** of runs requiring re-run.
- Execution UX: **< 2 minutes** to locate failure reason and relevant evidence.
- Coverage growth: steady increase in test cases/run count over time.

---

## 3) Personas & primary use cases

### 3.1 Personas
- **QA (non-coder):** Writes acceptance criteria and edits steps; runs suites; checks evidence.
- **Tech lead/architect:** Reviews coverage and stability; enforces processes.
- **Developer:** Uses traces/screenshots to debug failures quickly.

### 3.2 Primary use cases
1) Create a Project and Staging Environment.
2) Prompt the agent with feature flow → generate Test Plan + suggested Test Cases.
3) QA refines steps in no-code editor.
4) Run a plan on Staging.
5) Inspect report and evidence; mark failures; rerun.
6) Keep tests for regression; run after new releases.

---

## 4) Product scope by release

### 4.1 v1 (Web UI testing)
- Multi-project management
- Environments + web login recipe support
- Domains/Areas grouping
- Agent-assisted plan/case generation (schema-driven)
- No-code test case editor
- Runs + artifacts + reporting
- Local login (email/password)

### 4.2 v1.1 (Web API testing — out of scope for v1)
- API test case types and runner
- HTTP assertions, variable chaining
- Unified report for UI + API

---

## 5) Technical architecture (approved)

### 5.1 Stack (confirmed)
- **Monolith:** Next.js (App Router) + TypeScript
  - UI + internal API via Next.js Route Handlers
- **Queue:** BullMQ + Redis
- **Database:** PostgreSQL
- **Execution workers:** Node.js workers
  - UI Worker: Playwright
- **Artifacts:** Local filesystem
  - Base path (confirmed): `/home/ec2-user/testforge-artifacts`
- **Auth:** Local login (email/password)

### 5.2 Logical components
1) **Web App (Next.js)**
   - pages + UI state
   - API endpoints
   - RBAC and audit logging
2) **Control Plane (API)**
   - CRUD: projects, envs, domains, plans, cases
   - run orchestration endpoints
   - artifact metadata
3) **Execution Plane (Workers)**
   - BullMQ consumers
   - Playwright execution and artifact writing

### 5.3 Deployment (v1)
- Docker Compose recommended:
  - `web` (Next.js)
  - `db` (Postgres)
  - `redis`
  - `worker-ui` (Playwright runner)
  - artifacts volume mapped to `/home/ec2-user/testforge-artifacts`

---

## 6) Data model (conceptual)

### 6.1 Core entities
- **User**: id, email, passwordHash, role, createdAt
- **Project**: id, name, description, tags, createdAt
- **Environment**: id, projectId, name, baseUrl, loginRecipeId, secretsRef, createdAt
- **Domain/Area**: id, projectId, name, color
- **TestPlan**: id, projectId, title, description, domainId, status(draft/approved), generatedBy(agent/manual), createdBy, createdAt
- **TestCase**: id, projectId, domainId, title, objective, status(active/archived), tags
- **TestCaseVersion**: id, testCaseId, versionNo, specJson (DSL), createdBy, createdAt, changeNote
- **TestRun**: id, projectId, environmentId, triggeredBy, status(queued/running/passed/failed), startedAt, finishedAt, durationMs
- **TestRunItem**: id, runId, testCaseVersionId, status, startedAt, finishedAt, durationMs, failureSummary
- **Artifact**: id, runId, runItemId(nullable), type(screenshot/video/trace/report/log), filePath, mimeType, sizeBytes
- **AuditLog**: id, actorUserId, action, entityType, entityId, at, detailsJson

### 6.2 Secrets model
- **No plaintext secrets** stored.
- Environment secrets are stored encrypted (AES-GCM) or referenced by a secret store later.

---

## 7) Test specification (UI DSL)

### 7.1 Principles
- Human-editable
- Strict schema validation
- Deterministic execution mapping to Playwright

### 7.2 TestCaseVersion spec (example shape)
```json
{
  "kind": "ui",
  "title": "Create lead and send quotation",
  "preconditions": ["User has access to Sales module"],
  "steps": [
    {"type": "navigate", "url": "${BASE_URL}/web/login"},
    {"type": "fill", "locator": "input[name=login]", "value": "${ENV_USERNAME}"},
    {"type": "fill", "locator": "input[name=password]", "value": "${ENV_PASSWORD}", "mask": true},
    {"type": "click", "locator": "button[type=submit]"},
    {"type": "assertVisible", "locator": "text=Sales"}
  ],
  "evidence": {"screenshots": "onFail", "video": "onFail", "trace": "onFail"}
}
```

### 7.3 Locator strategy requirements
- Prefer accessibility/semantic selectors where possible:
  - role/name, label text, placeholder, stable data-test ids
- Allow CSS/XPath fallback but warn in UI
- Provide “locator hint” field to store human intent

---

## 8) Functional requirements (v1)

### 8.1 Authentication & RBAC
**FR-A1** Local login
- Users can sign in with email/password.

**FR-A2** Roles
- Roles: **Admin, Editor, Runner, Viewer**
- Permissions:
  - Admin: everything
  - Editor: CRUD tests/config, run tests
  - Runner: run tests, view reports
  - Viewer: view only

**Acceptance criteria**
- Unauthenticated users cannot access app pages.
- Role-based restrictions enforced for create/edit/delete actions.

---

### 8.2 Projects
**FR-P1** Project CRUD
- Create, list, view, edit, archive projects.

**FR-P2** Project selector
- Top bar project switcher.

**Acceptance criteria**
- Project list shows counts: environments, test plans, test cases, last run status.

---

### 8.3 Environments
**FR-E1** Environment CRUD
- Add/edit/delete environments per project.

**FR-E2** Connection test (UI-level simulation in v1; real check in v1.0+)
- “Test connection” verifies base URL reachable and returns latency.

**FR-E3** Login recipe configuration
- Environment includes a “Login Recipe”:
  - login URL
  - username field locator
  - password field locator
  - submit locator
  - post-login assertion locator (e.g., visible selector)

**FR-E4** Optional TOTP (Google Authenticator)
- If enabled:
  - store encrypted TOTP secret
  - OTP field locator
  - verification submit locator

**Acceptance criteria**
- Environment secrets are stored encrypted; UI displays masked values only.

---

### 8.4 Domains/Areas
**FR-D1** CRUD domains
- Manage domains with name + color.

**FR-D2** Coverage views
- Show pass rate per domain on dashboard.

---

### 8.5 Test Plan generation (Agent-assisted)
**FR-G1** Create Plan (prompt inputs)
- Inputs:
  - title
  - domain
  - goal/user story
  - preconditions
  - acceptance criteria checklist
  - test data hints
  - optional screenshots upload (stored as artifacts attached to draft plan)

**FR-G2** Generate Plan output
- Output:
  - recommended set of test cases
  - each test case includes steps draft
  - risks/assumptions

**FR-G3** Human approval gate
- Plan remains draft until approved.

**Acceptance criteria**
- Generated output must validate against schema.
- User can regenerate and compare drafts.

---

### 8.6 Test Case library + versioning
**FR-T1** Library
- Search, filter by tags/domain/status.

**FR-T2** Versioning
- Saving changes creates a new version with a change note.

**FR-T3** Step editor
- Step list + step editor fields:
  - type
  - locator
  - value
  - expected result
  - evidence policy

**Acceptance criteria**
- Users can run a specific version or “latest version”.

---

### 8.7 Runs & reporting
**FR-R1** Trigger run
- Run a plan or selected test cases.
- Choose environment.
- Options: retries, evidence policy overrides.

**FR-R2** Queue + execution status
- queued → running → passed/failed
- show progress (run items)

**FR-R3** Evidence & artifacts
- Store artifacts under:
  - `/home/ec2-user/testforge-artifacts/<projectId>/<runId>/...`

**FR-R4** Report view
- Summary: pass/fail counts, duration
- Timeline per test
- Failure view:
  - failing step
  - error summary
  - screenshot/trace links

**FR-R5** Export
- Export report (HTML initially; PDF later)

**Acceptance criteria**
- For any failure, there is at least one clear evidence link (screenshot and/or trace) and a human-readable failure summary.

---

## 9) Non-functional requirements

### 9.1 Reliability
- Runs must survive web app restart (queue-backed)
- Worker retries supported

### 9.2 Performance
- UI pages should load < 2s on typical datasets (hundreds of cases)

### 9.3 Security
- Passwords hashed (bcrypt/argon2)
- Secrets encrypted at rest (AES-GCM)
- No secrets returned to clients after creation

### 9.4 Auditability
- Log edits to envs/tests and run triggers

---

## 10) API surface (internal)

### 10.1 Example endpoints
- Auth
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
- Projects
  - `GET /api/projects`
  - `POST /api/projects`
  - `GET /api/projects/:id`
- Environments
  - `POST /api/projects/:id/environments`
  - `POST /api/environments/:id/test-connection`
- Plans
  - `POST /api/test-plans/generate`
  - `POST /api/test-plans/:id/approve`
- Cases
  - `POST /api/test-cases/:id/versions`
- Runs
  - `POST /api/runs` (enqueue)
  - `GET /api/runs/:id`
  - `GET /api/runs/:id/artifacts`

---

## 11) Worker execution requirements (UI)

### 11.1 Worker responsibilities
- Consume jobs from BullMQ
- Resolve environment config + secrets
- Perform login recipe (if required)
- Execute test case steps
- Capture artifacts per evidence policy
- Write artifact files + store metadata in DB

### 11.2 Playwright run output
- on failure: capture screenshot + trace
- logs: console + network errors summary

---

## 12) Milestones & delivery plan

### Milestone 1 — Persisted platform foundation
- Next.js UI + API
- Postgres persistence
- Local login + RBAC
- CRUD for projects/envs/domains/plans/cases

### Milestone 2 — Run orchestration
- Redis + BullMQ integrated
- UI run creation + status updates

### Milestone 3 — UI runner
- Playwright worker
- artifacts written to filesystem
- report UI shows evidence

### Milestone 4 — Agent-assisted generation (schema-driven)
- generate plan/cases into DSL
- approval + conversion

### Milestone 5 — Stabilization
- flakiness controls
- improved selectors + linting

---

## 13) Risks & mitigations
- **Flaky UI tests** → enforce locator strategy, retries, traces, test data isolation.
- **Secrets leakage** → strict masking + encryption, never return secrets.
- **Worker resource limits** → concurrency caps; separate worker if needed.

---

## 14) Out of scope roadmap (v1.1)
- API runner worker
- API DSL steps & assertions
- unified UI+API reports

---

## 15) Confirmed decisions
- **Auth:** Local login (email/password)
- **Artifacts base path:** `/home/ec2-user/testforge-artifacts`
- **Scheduling:** Manual runs only in v1
- **Scope:** UI-first v1; API testing in v1.1
