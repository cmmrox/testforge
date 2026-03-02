# Stage 5 — Projects Module

**Date:** 2026-03-02  
**Status:** ✅ Complete  
**Build:** ✅ Passes  
**Lint:** ✅ 0 errors  

---

## Summary

Implemented the full Projects module for TestForge, including API layer extensions, React Query hooks, context for project selection, UI primitives, reusable project components, full projects list page, project detail page, and topbar project switcher.

---

## Files Created / Modified

### API Layer
- **`lib/api/projects.ts`** — Extended with `ProjectCreateRequest`, `ProjectUpdateRequest` types and `getProject`, `createProject`, `updateProject`, `archiveProject` functions. Existing `listProjects` untouched.

### Hooks
- **`lib/hooks/useProjects.ts`** — New file with 5 React Query v5 hooks: `useProjects`, `useProject`, `useCreateProject`, `useUpdateProject`, `useArchiveProject`. All mutations properly invalidate relevant query keys on success.

### Context
- **`lib/context/project-context.tsx`** — New client context with `ProjectProvider` and `useSelectedProject` hook. Restores selection from `localStorage` key `tf_selected_project_id` when projects list loads. Persists changes to localStorage.

### UI Primitives
- **`components/ui/dialog.tsx`** — Pure Tailwind modal. Fixed overlay, white panel, ESC-to-close, click-outside-to-close, `×` button.
- **`components/ui/textarea.tsx`** — Styled textarea with `forwardRef`, matching Input styling.

### Project Components
- **`components/projects/project-card.tsx`** — Card with name (clickable), description (truncated), tags, stats row (envs/plans/cases), last-run status badge, Edit/Archive actions (hidden if archived, shows "Archived" chip instead).
- **`components/projects/project-form.tsx`** — Shared form with Name, Description, Textarea fields. Tags stored as comma-separated string.
- **`components/projects/create-project-dialog.tsx`** — Dialog wrapping ProjectForm. Clears and closes on success. Shows loading state.
- **`components/projects/edit-project-dialog.tsx`** — Dialog wrapping ProjectForm, prefilled from project data. Closes on success.
- **`components/projects/archive-confirm-dialog.tsx`** — Confirmation dialog with Cancel + Archive (danger) buttons.

### Pages
- **`app/(app)/projects/page.tsx`** — Full list page: header with "New Project" button, Active/All toggle filter, 3-col responsive grid of ProjectCards, skeleton loading, error state, empty state with CTA. Wires up all three dialogs.
- **`app/(app)/projects/[projectId]/page.tsx`** — Detail page: name/description/tags/date, 3 stat cards (Environments, Test Plans, Test Cases), Last Run section, Edit Project button.

### Layout Updates
- **`components/layout/topbar.tsx`** — Replaced `<Badge>Project: —</Badge>` with `ProjectSwitcher` component: a `<select>` listing all non-archived projects, using `useSelectedProject` + `useProjects`. On change, calls `setSelectedProject`.
- **`app/(app)/layout.tsx`** — Wrapped `<AppShell>` with `<ProjectProvider>`.

---

## Implementation Notes

- All client components have `"use client"` directive at top.
- `@/` path aliases used throughout.
- No inline styles; Tailwind classes only.
- TypeScript strict (no `any`).
- The `AppLayout` is a server component; `ProjectProvider` is client, so it must be nested inside `AuthGuard` (which renders children on client side).
- Dialog ESC key handler cleaned up via `useEffect` return.
- Project context restores from localStorage only after the projects list loads to avoid race conditions with stale IDs.
