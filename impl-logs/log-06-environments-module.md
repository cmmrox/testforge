# Stage 6 — Environments Module

## Summary

Implemented the full Environments module for TestForge, covering API layer, React Query hooks, UI primitives, reusable components, and page integration.

## Files Created / Modified

### API Layer
- **`lib/api/environments.ts`** — Extended with full type definitions (`LoginRecipe`, `LoginRecipeInput`, `Environment`, `ConnectionTestResponse`, `EnvironmentCreateRequest`, `EnvironmentUpdateRequest`) and all CRUD + test-connection API functions. Kept existing `listEnvironments`.

### Hooks
- **`lib/hooks/useEnvironments.ts`** — React Query v5 hooks: `useEnvironments`, `useEnvironment`, `useCreateEnvironment`, `useUpdateEnvironment`, `useDeleteEnvironment`, `useTestConnection`. All mutations invalidate relevant query keys on success.

### UI Primitives
- **`components/ui/select.tsx`** — Styled `<select>` with `forwardRef`, matching `Input` styling (border, rounded-md, px-3 py-2, text-sm, bg-white, focus ring).

### Environment Components
- **`components/environments/environment-form.tsx`** — Two-section form (Basic + collapsible Login Recipe). Exports `EnvironmentFormValues`, `defaultEnvironmentFormValues`, `formValuesToCreateRequest`. Login Recipe section toggles with a ▾/▴ button. TOTP fields conditionally rendered. Only includes `loginRecipe` in request if at least one recipe field is non-empty.
- **`components/environments/create-environment-dialog.tsx`** — Dialog wrapping `EnvironmentForm` + `useCreateEnvironment`. Clears form and closes on success. Shows API errors inline.
- **`components/environments/edit-environment-dialog.tsx`** — Prefills form from existing environment data. Uses `useUpdateEnvironment`. Closes on success.
- **`components/environments/delete-confirm-dialog.tsx`** — Confirmation dialog with environment name. Uses `useDeleteEnvironment`.
- **`components/environments/connection-test-button.tsx`** — Button calling `useTestConnection`. Shows spinner while pending, ✅/❌ result inline.
- **`components/environments/environment-card.tsx`** — Card showing name, base URL (monospace), Login Recipe badge, TOTP badge, created date, and action row (ConnectionTestButton + Edit + Delete).

### Pages Updated
- **`app/(app)/environments/page.tsx`** — Full rewrite as `"use client"`. Shows prompt card when no project selected, otherwise renders header + EnvironmentCard list with loading skeleton, error state, empty state, and wired dialogs.
- **`app/(app)/projects/[projectId]/page.tsx`** — Added Environments section below stats cards showing first 3 environments with inline cards and "View all environments →" link.
- **`components/layout/topbar.tsx`** — Added `useEnvironments` to pull first environment of selected project; displays `Env: {name}` badge (or `Env: —` if none).

## Design Decisions
- Collapsible login recipe section defaults to collapsed to keep the form clean for simple environments.
- Credentials (username/password/totpSecret) are form-only fields sent as `LoginRecipeInput`; no secret refs wired in mock mode.
- `formValuesToCreateRequest` only attaches `loginRecipe` if at least one recipe field is non-empty, avoiding sending empty objects to the API.
- `useTestConnection` uses a plain mutation with no cache invalidation — results are ephemeral UI state.

## Build & Lint
- `npm run lint` — ✅ no errors
- `npm run build` — ✅ clean build (13 pages, no TypeScript errors)
