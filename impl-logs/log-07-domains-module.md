# Stage 7 — Domains/Areas Module

## Summary

Implemented the full Domains/Areas module for TestForge: API layer, React Query hooks, UI primitives, CRUD dialogs, the domains page, and integration into the project detail page.

## Files Created / Modified

### API Layer
- **`lib/api/domains.ts`** — Extended with `DomainCreateRequest`, `DomainUpdateRequest` types and `createDomain`, `updateDomain`, `deleteDomain` functions. Kept existing `listDomains`, `Domain`, and `DomainListResponse` exports.

### React Query Hooks
- **`lib/hooks/useDomains.ts`** — New file with `useDomains`, `useCreateDomain`, `useUpdateDomain`, `useDeleteDomain` hooks following the same pattern as `useEnvironments`.

### UI Primitives
- **`components/ui/color-swatch-picker.tsx`** — New `ColorSwatchPicker` component with 12 preset color swatches (24×24 rounded-full buttons with ring on selection) and an editable hex text input. Validates hex input before updating selection.

### Domain Components
- **`components/domains/domain-form.tsx`** — Shared form with Name (Input) and Color (ColorSwatchPicker) fields. Exports `DomainFormValues`, `defaultDomainFormValues`, and `DomainForm`.
- **`components/domains/create-domain-dialog.tsx`** — Dialog wrapping `DomainForm`, calls `useCreateDomain`, clears form and closes on success, shows API error inline.
- **`components/domains/edit-domain-dialog.tsx`** — Dialog prefilled from `Domain`, calls `useUpdateDomain`, closes on success.
- **`components/domains/delete-confirm-dialog.tsx`** — Confirmation dialog with `DeleteDomainConfirmDialog`, warns that test cases will become uncategorised, calls `useDeleteDomain`.
- **`components/domains/domain-chip.tsx`** — `DomainChip` (pill with color dot + name, sizes `sm`/`md`) and `DomainDot` (12px circle, compact contexts). Uses `style` only for dynamic color values.

### Pages
- **`app/(app)/domains/page.tsx`** — Fully rewritten. Shows "select project" prompt if none selected; otherwise: header with project name, New Domain button, table of domains (dot | name | created date | Edit | Delete), loading skeleton, error state, empty state, and all three dialogs wired up.
- **`app/(app)/projects/[projectId]/page.tsx`** — Added Domains section below Environments: loads `useDomains(projectId)`, renders `DomainChip` pills in a flex-wrap row, includes "Manage domains →" link and loading/empty states.

## Design Decisions

- Domain rows in a `<table>` for clean column alignment (vs cards), matching the clean list style requested.
- `DomainDot` used in the table for the color indicator (compact).
- `style` prop used exclusively for dynamic hex color values (`backgroundColor`); all other styling is Tailwind.
- Delete button uses `variant="danger"` (red) for clear destructive intent.
- Follows existing environment module patterns throughout (mutation reset, error extraction, form clear on close).

## Quality
- `npm run lint` — ✅ No errors
- `npm run build` — ✅ Clean build (13 pages)
