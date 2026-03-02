# Stage 2 Log — UI Foundation (Shell + Navigation + Primitives)

## What was done
- Added a basic **app shell** (responsive sidebar + topbar) and wired it via a route-group layout:
  - `app/(app)/layout.tsx` wraps all app pages with `AppShell`
  - `components/layout/app-shell.tsx` (mobile overlay + desktop sidebar)
  - `components/layout/sidebar-nav.tsx` (active link highlighting)
  - `components/layout/topbar.tsx` (placeholder project/env chips + disabled Run button)
- Implemented minimal reusable UI primitives:
  - `components/ui/button.tsx`
  - `components/ui/card.tsx`
  - `components/ui/badge.tsx`
  - `components/ui/input.tsx`
- Added `lib/utils.ts` with `cn()` helper using `clsx` + `tailwind-merge`.
- Created placeholder pages for navigation targets:
  - `/dashboard`, `/projects`, `/environments`, `/domains`, `/test-plans`, `/test-cases`, `/runs`, `/settings`
- Updated `/` to redirect to `/dashboard`.

## Verification
- `npm run lint` passes.
- `npm run build` passes.

## Notes / follow-ups
- Project/environment selectors in the topbar are placeholders; will be wired once Stage 3/5 starts fetching real data.
- Next stage: Stage 3 API client layer + basic data fetching patterns.
