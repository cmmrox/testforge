# TestForge — User Flows (Wireframe-level)

This is a text-first description of the main screens and flows so you can validate UX before implementation.

## Navigation (global)
- Sidebar:
  - Dashboard
  - Projects
  - Environments
  - Domains (Areas)
  - Test Plans
  - Test Cases
  - Runs
  - Settings

- Top bar:
  - Project switcher
  - Environment selector / status chip
  - Primary CTA: Run

---

## Flow 1 — Create Project (Wizard)
1) Projects → **New Project**
2) Step: Project info
   - Name, description, tags
3) Step: Default environment
   - Environment name (Staging)
   - Base URL
4) Step: Login recipe (optional)
   - Login URL
   - Username locator
   - Password locator
   - Submit locator
   - Post-login assert locator
   - (Optional) TOTP enabled + TOTP secret + OTP locator + verify locator
5) Step: Domains/Areas
   - Add or import presets (Auth, Dashboard, etc.)
6) Review → Create

Outcome: Project exists with one environment and initial domains.

---

## Flow 2 — Generate Test Plan with Agent
1) Test Plans → **Generate with Agent**
2) Inputs (left panel)
   - Title
   - Domain
   - Goal / user story
   - Preconditions
   - Acceptance criteria checklist
   - Test data hints
   - Upload screenshots (optional)
3) Click **Generate**
4) Agent output (right panel)
   - Proposed test cases list (titles + short scope)
   - Risks / assumptions
5) User actions
   - Regenerate
   - Edit before save
   - Save Draft
   - Approve Plan

Outcome: Draft/Approved plan + generated test cases in draft state.

---

## Flow 3 — Convert Plan → Test Cases Library
1) Open Plan Details
2) Tab: Generated Test Cases
3) Select some/all → **Convert to Library**
4) Converted cases appear in Test Cases list

Outcome: executable, versioned test cases.

---

## Flow 4 — Edit Test Case (No-code Step Editor)
1) Test Cases → open a test case
2) Layout:
   - Left: Step list (reorder, add, delete)
   - Middle: Step editor
   - Right: Evidence preview (placeholders + last run artifacts)
3) Save → creates **new version** with change note

Outcome: updated test case version.

---

## Flow 5 — Run Plan / Run Selected Cases
1) Click **Run**
2) Choose:
   - Environment
   - What to run (Plan / Selected Cases / Suite tag)
   - Options: retries, evidence overrides
3) Confirm → run is queued
4) Runs screen shows status updates (queued → running)

Outcome: a Test Run record + worker execution.

---

## Flow 6 — Review Run Report
1) Runs → open a run
2) Summary:
   - pass/fail
   - duration
   - environment
   - who triggered
3) Timeline:
   - each test case status + duration
4) Failure detail:
   - failing step
   - error
   - screenshot/trace/video links

Outcome: decide ship/no-ship; rerun after fix.
