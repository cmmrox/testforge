# Stage 9 — Test Cases + Versioning + Step Editor

## Summary

Implemented the full test case library module including a no-code step editor, version history, and all CRUD dialogs.

## Files Created / Modified

### API Layer
- **`lib/api/cases.ts`** — Extended with full type definitions (`TestStep`, `EvidencePolicy`, `TestCaseVersionSpec`, `TestCaseVersion`, `TestCaseDetail`, request/response types) and all API functions (`getTestCase`, `createTestCase`, `updateTestCase`, `archiveTestCase`, `listCaseVersions`, `createCaseVersion`, `getCaseVersion`).

### Hooks
- **`lib/hooks/useTestCases.ts`** — React Query v5 hooks: `useTestCases`, `useTestCase`, `useCaseVersions`, `useCreateTestCase`, `useUpdateTestCase`, `useArchiveTestCase`, `useCreateCaseVersion`.

### UI Primitives
- **`components/ui/tabs.tsx`** — Simple horizontal tab strip with active bottom-border indicator.
- **`components/ui/checkbox.tsx`** — Native checkbox with label, styled consistently with design system.

### Cases Components
- **`components/cases/case-status-badge.tsx`** — Green for active, slate for archived.
- **`components/cases/evidence-policy-form.tsx`** — Three Select components for screenshots/video/trace policy.
- **`components/cases/step-type-fields.tsx`** — Renders type-specific fields for each `TestStep` type (navigate/fill/click/select/assertVisible/assertText/waitFor).
- **`components/cases/step-editor.tsx`** — Full no-code step editor: collapsible step rows with type badges, move up/down, preconditions list, evidence policy section.
- **`components/cases/version-history.tsx`** — Version list sorted descending, highlights current version.
- **`components/cases/create-case-dialog.tsx`** — Dialog with title/objective/domain/tags fields.
- **`components/cases/edit-case-dialog.tsx`** — Same fields pre-filled from existing case.
- **`components/cases/archive-confirm-dialog.tsx`** — Confirm dialog with descriptive message about future runs.
- **`components/cases/case-card.tsx`** — Card with title, objective, tags, domain chip, status badge, version pill, step count, and actions.

### Pages
- **`app/(app)/test-cases/page.tsx`** — Full library page with search (300ms debounce), domain filter, active/all toggle, 3-column responsive grid, loading skeleton, empty state, and wired-up dialogs.
- **`app/(app)/test-cases/[caseId]/page.tsx`** — Detail + editor page with two-column layout (step editor + version history), save-as-new-version section with inline success banner, and Edit Details button.

### OpenAPI
- **`openapi/testforge.v1.yaml`** — Added realistic Odoo ERP examples to:
  - `GET /projects/{projectId}/test-cases` (2 test cases with full step specs)
  - `GET /test-cases/{testCaseId}` (admin login case detail)
  - `GET /test-cases/{testCaseId}/versions` (version history list)

## Design Decisions

- **Step editor collapsible rows**: Steps default to collapsed unless just added, reducing visual noise when reviewing long test cases.
- **Immutable versioning**: The save section clearly communicates that saving creates a new version rather than overwriting — QA engineers can safely explore without losing history.
- **Version history loading in-place**: Clicking a version in history loads its spec into the editor without navigation, enabling quick comparison.
- **No Radix/shadcn**: All components use native HTML elements + Tailwind CSS v4 classes.

## Build & Lint

- `npm run lint` — 0 errors (3 minor exhaustive-deps warnings, intentional)
- `npm run build` — ✅ Clean, all 15 routes compiled successfully
- Docker mock rebuilt and running on port 8081
