# TestForge — Frontend Implementation Plan (Repo Root Next.js + Tailwind)

**Project:** TestForge

**Scope:** Implement the **web UI (frontend-first)** using **Next.js (App Router) + TypeScript + Tailwind** in the **repo root**.

**Contract-first:** The UI is built to the existing OpenAPI contract at `openapi/testforge.v1.yaml` and developed against the existing Prism mock server in `mock-server/`.

**Runtime direction:** This repo will ultimately be a **Next.js monolith** (UI + internal API via Route Handlers), but this plan focuses on building the UI first. During UI-first development, the browser will call the mock server directly via `NEXT_PUBLIC_API_BASE_URL`.

---

## Assumptions / defaults (can be changed)

- **Mock API base URL (dev):** `http://localhost:8081`
- **Cookie auth:** UI uses `credentials: "include"` (mock server auto-injects cookie when absent).
- **Component strategy:** Tailwind + lightweight internal components. (Optionally add shadcn/ui later.)
- **State/data:** React Query (TanStack Query) recommended for CRUD lists and invalidation.
- **Artifacts UI:** screenshots inline preview; videos/traces/reports as download links initially.

---

## High-level stages

### Stage 1 — Scaffold Next.js + Tailwind at repo root
**Outcome:** Running Next.js app (App Router) with Tailwind, lint/format, env vars.

**Tasks**
- Create Next.js app at repo root with:
  - TypeScript
  - App Router
  - Tailwind
  - ESLint
- Add `.env.example` with:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8081`
- Add scripts: `dev`, `build`, `start`, `lint`, `format`
- Add/confirm `.gitignore` covers `.env.local`, `.next/`, etc.
- Add README section: how to run UI + mock server.

**Definition of Done**
- `npm run dev` starts successfully
- Tailwind styles render
- Env var can be read in the browser

---

### Stage 2 — UI foundation (layout + navigation + primitives)
**Outcome:** App shell is consistent across pages.

**Tasks**
- Sidebar navigation:
  - Dashboard
  - Projects
  - Environments
  - Domains
  - Test Plans
  - Test Cases
  - Runs
  - Settings
- Topbar:
  - Project switcher (UI placeholder initially)
  - Environment selector chip (UI placeholder initially)
  - Primary CTA: Run (disabled until Stage 10)
- Reusable UI primitives:
  - Button, Input, Select, Badge/Chip, Card
  - Table pattern
  - Modal/dialog pattern
  - Toast notifications
- Common UI states:
  - loading skeleton
  - empty states
  - error states

**DoD**
- All routes render inside shell
- Responsive layout works (sidebar collapses)

---

### Stage 3 — API client layer (mock-first)
**Outcome:** Consistent API calls and error handling.

**Tasks**
- `lib/apiFetch.ts` wrapper:
  - base url from `NEXT_PUBLIC_API_BASE_URL`
  - `credentials: "include"`
  - JSON request/response
  - normalized error object
- API modules:
  - `lib/api/auth.ts`
  - `lib/api/projects.ts`
  - `lib/api/environments.ts`
  - `lib/api/domains.ts`
  - `lib/api/plans.ts`
  - `lib/api/cases.ts`
  - `lib/api/runs.ts`
  - `lib/api/artifacts.ts`
  - `lib/api/audit.ts`
- Add React Query and query invalidation patterns for CRUD.

**DoD**
- At least one endpoint verified end-to-end (e.g., `GET /projects`)
- Failures show user-friendly toast + developer console details

---

### Stage 4 — Authentication + route protection + RBAC gating
**Outcome:** Login works; protected pages require session; role-based UI gating.

**OpenAPI mapping**
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

**Tasks**
- Login page + validation
- Global “current user” load (`/auth/me`)
- Redirect unauthenticated users to `/login`
- RBAC helpers and UI gating for admin/editor vs runner/viewer

**DoD**
- Login/logout works against mock server
- Protected routes enforced

---

### Stage 5 — Projects module
**OpenAPI mapping**
- `GET /projects`
- `POST /projects`
- `GET /projects/{projectId}`
- `PATCH /projects/{projectId}`
- `DELETE /projects/{projectId}` (archive)

**Tasks**
- Projects list (table + basic search)
- Create project modal/page
- Project detail page
- Edit metadata
- Archive with confirmation

**DoD**
- Full CRUD UX done with loading/empty/error states

---

### Stage 6 — Environments module
**OpenAPI mapping**
- `GET /projects/{projectId}/environments`
- `POST /projects/{projectId}/environments`
- `GET /environments/{environmentId}`
- `PATCH /environments/{environmentId}`
- `DELETE /environments/{environmentId}`
- `POST /environments/{environmentId}/test-connection`

**Tasks**
- Environments list (scoped to selected project)
- Create/edit form including login recipe locators
- “Test connection” button + results
- Delete

**DoD**
- CRUD + connection test UX complete

---

### Stage 7 — Domains/Areas module
**OpenAPI mapping**
- `GET /projects/{projectId}/domains`
- `POST /projects/{projectId}/domains`
- `PATCH /domains/{domainId}`
- `DELETE /domains/{domainId}`

**Tasks**
- Domain list with color chips
- Create/edit modal
- Delete
- Integrate domain selector into filters for plans/cases

**DoD**
- Domains CRUD complete and used in filtering

---

### Stage 8 — Test Plans (incl. agent generation UI)
**OpenAPI mapping**
- `GET /projects/{projectId}/test-plans`
- `POST /projects/{projectId}/test-plans`
- `POST /projects/{projectId}/test-plans/generate`
- `GET /test-plans/{testPlanId}`
- `PATCH /test-plans/{testPlanId}`
- `DELETE /test-plans/{testPlanId}`
- `POST /test-plans/{testPlanId}/approve`
- `GET /test-plans/{testPlanId}/items`

**Tasks**
- Plans list + filters
- Generate-with-agent page:
  - inputs: title, goal, preconditions, acceptanceCriteria, testDataHints, domainId
  - outputs: suggestedCases + risks
- Plan detail + approve
- Manual plan create (basic)

**DoD**
- Generation UI renders suggested cases and risks cleanly
- Approval updates UI state

---

### Stage 9 — Test Cases + Versioning + Step Editor (core)
**OpenAPI mapping**
- `GET /projects/{projectId}/test-cases`
- `POST /projects/{projectId}/test-cases`
- `GET /test-cases/{testCaseId}`
- `PATCH /test-cases/{testCaseId}`
- `DELETE /test-cases/{testCaseId}` (archive)
- `GET /test-cases/{testCaseId}/versions`
- `POST /test-cases/{testCaseId}/versions`
- `GET /test-case-versions/{testCaseVersionId}`

**Tasks**
- Cases list + search/filter
- Case detail + versions list
- Create new version with `changeNote`
- Step editor for step types:
  - `navigate`, `fill`, `click`, `select`, `assertVisible`, `assertText`, `waitFor`
- Evidence policy editor (screenshots/video/trace)
- Masked values supported (do not display secrets)

**DoD**
- Create/edit steps and save version reliably
- Spec remains valid per contract

---

### Stage 10 — Runs + Reporting + Artifacts
**OpenAPI mapping**
- `GET /projects/{projectId}/runs`
- `POST /projects/{projectId}/runs`
- `GET /runs/{testRunId}`
- `GET /runs/{testRunId}/items`
- `GET /runs/{testRunId}/artifacts`
- `GET /artifacts/{artifactId}`

**Tasks**
- Runs list
- Trigger run modal (environmentId required; planId or testCaseVersionIds)
- Run detail/report page:
  - summary
  - run items list w/ failure summaries
  - artifacts list + links + image preview

**DoD**
- Run can be triggered and displayed (mock-backed)

---

### Stage 11 — Dashboard + Settings + Audit logs
**Tasks**
- Dashboard summary widgets (based on projects/runs)
- Settings page (current user profile)
- Audit logs page

**DoD**
- No dead routes; baseline product completeness

---

### Stage 12 — Quality (tests, a11y, docs)
**Tasks**
- Vitest + Testing Library: key component tests (Step Editor, auth gating)
- A11y pass: focus states, keyboard navigation, dialogs
- README: full dev setup + mock server instructions

**DoD**
- `npm test` (or equivalent) runs in CI-like mode
- Docs allow a new dev to run UI + mock quickly
