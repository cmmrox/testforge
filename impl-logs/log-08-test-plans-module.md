# Stage 8 — Test Plans Module (incl. Agent Generation UI)

**Date:** 2026-03-02  
**Status:** ✅ Done  
**Build:** Passed (lint clean, zero TypeScript errors)

---

## Files Created / Modified

### API Layer
- **`lib/api/plans.ts`** — Extended with full types (`TestPlanDetail`, `TestCaseDraft`, `TestPlanCreateRequest`, `TestPlanUpdateRequest`, `TestPlanGenerationRequest`, `TestPlanGenerationResponse`, `TestPlanItem`, `TestPlanItemList`) and API functions: `getTestPlan`, `createTestPlan`, `updateTestPlan`, `archiveTestPlan`, `approveTestPlan`, `generateTestPlan`, `listPlanItems`. Existing `listTestPlans` enhanced with optional `filters` param.

### Hooks
- **`lib/hooks/useTestPlans.ts`** — 8 React Query v5 hooks: `useTestPlans`, `useTestPlan`, `usePlanItems`, `useCreateTestPlan`, `useUpdateTestPlan`, `useArchiveTestPlan`, `useApproveTestPlan`, `useGenerateTestPlan`. Cache invalidation wired for all mutating hooks.

### UI Components (`components/plans/`)
- **`plan-status-badge.tsx`** — Status badge with amber (draft), green (approved), slate (archived) variants using existing `Badge` primitive.
- **`plan-card.tsx`** — Grid card with clickable title, truncated description, domain chip (resolved from `useDomains`), status badge, agent/manual pill, created date, edit/archive actions with conditional rendering based on status.
- **`create-plan-dialog.tsx`** — Create dialog with title, description, domain select fields. Uses `useCreateTestPlan()`, clears on success.
- **`edit-plan-dialog.tsx`** — Pre-filled edit dialog synced to plan prop. Uses `useUpdateTestPlan()`.
- **`archive-confirm-dialog.tsx`** — Confirmation dialog before archiving. Uses `useArchiveTestPlan()`.
- **`generate-plan-dialog.tsx`** — Two-phase agent generation UI:
  - Phase 1: Input form (title, domain, goal textarea, dynamic preconditions/acceptance-criteria/test-data-hints lists with add/remove)
  - Phase 2: Result display (suggested cases cards, risks bullets) with Approve/Discard/Regenerate actions. Uses `useGenerateTestPlan`, `useApproveTestPlan`, `useArchiveTestPlan`.

### Pages
- **`app/(app)/test-plans/page.tsx`** — Rewrote from placeholder to full client page with project guard, header, "New Plan" + "Generate with Agent ✨" buttons, filter tabs (All/Draft/Approved), plan grid, skeleton/error/empty states, all dialogs wired.
- **`app/(app)/test-plans/[planId]/page.tsx`** — New plan detail page: back link, title+badges, description, domain chip, created date, Approve button (draft only), Edit button, attached test cases table.

### OpenAPI (`openapi/testforge.v1.yaml`)
Added `examples` blocks to:
- `GET /projects/{projectId}/test-plans` — 3 test plans (Login, Sales Order, Inventory)
- `GET /test-plans/{testPlanId}` — Login plan detail with recommendedCases/risks
- `POST /test-plans/{testPlanId}/approve` — Approved plan response
- `GET /test-plans/{testPlanId}/items` — 2 test case items
- `POST /projects/{projectId}/test-plans/generate` — Generated plan with suggested cases + risks

---

## Key Design Decisions

1. **`useDomains` in `PlanCard`** — Domain chip resolved client-side by looking up `plan.domainId` in domain list. Avoids additional API calls per card since domains are already cached from the domains query.

2. **Two-phase generate dialog** — Phase state controlled by `result` being `null` (Phase 1) or a `TestPlanGenerationResponse` (Phase 2). "← Regenerate" resets result without closing dialog.

3. **Dynamic lists** — Extracted `DynamicListInput` component inside `generate-plan-dialog.tsx` for reusable add/remove pattern across preconditions, acceptance criteria, and test data hints.

4. **Archive = DELETE** — The `archiveTestPlan` function calls `DELETE /test-plans/{id}` per the API spec. Cache invalidated on `["test-plans", projectId]`.

5. **Filter tabs** — Client-side filtering of the already-fetched plan list (no per-tab API calls). Tabs: All, Draft, Approved. "Archived" not shown as a tab per design spec.

---

## Verification

- `npm run lint` → ✅ Clean
- `npm run build` → ✅ 13 routes compiled, TypeScript passed
- Docker mock: ✅ `testforge-mock` rebuilt and running on `:8081`
- Mock endpoint test: `GET /projects/.../test-plans` returns correct example data
