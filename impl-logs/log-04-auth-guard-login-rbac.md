# Stage 4 Log — Auth + Route Protection + RBAC Gating

## What was done
- Added current-user query hook:
  - `lib/hooks/useCurrentUser.ts` uses `GET /auth/me` via `lib/api/auth.ts`
- Added an app-level auth guard:
  - `components/auth/auth-guard.tsx`
  - Wraps the `(app)` route group; redirects to `/login?next=...` on auth error
- Updated `(app)` layout to enforce authentication:
  - `app/(app)/layout.tsx` now wraps `AppShell` with `AuthGuard`
- Added `/login` page:
  - `app/(auth)/login/page.tsx` (server component)
  - `app/(auth)/login/login-form.tsx` (client component)
  - Uses `POST /auth/login`, then invalidates `auth/me` and redirects to `next`
- Added logout button in topbar:
  - `components/layout/topbar.tsx` calls `POST /auth/logout` then invalidates `auth/me`
- Added basic RBAC helpers:
  - `lib/rbac.ts` (`canEdit`, `canRun`) for future UI gating.

## Notes
- For the Prism mock, we treat any error from `/auth/me` as unauthenticated and redirect to login.
- Later, once a real backend exists, we can tighten this to only redirect on 401.

## Verification
- `npm run lint` passes.
- `npm run build` passes.
