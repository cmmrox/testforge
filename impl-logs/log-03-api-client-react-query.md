# Stage 3 Log — API Client Layer (Mock-first) + React Query

## What was done
- Added a clean API fetch wrapper:
  - `lib/api/apiFetch.ts`
  - Uses `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8081`)
  - Sends JSON and normalizes errors into `{ status, message, details }`
  - Uses `credentials: "include"` to support cookie-based session auth
- Added `lib/env.ts` for public base URL resolution.
- Added API modules (initial typed wrappers):
  - `lib/api/auth.ts`
  - `lib/api/projects.ts`
  - `lib/api/environments.ts`
  - `lib/api/domains.ts`
  - `lib/api/plans.ts`
  - `lib/api/cases.ts`
  - `lib/api/runs.ts`
  - `lib/api/artifacts.ts`
  - `lib/api/audit.ts`
- Added TanStack React Query:
  - `app/providers.tsx` wraps app in `QueryClientProvider`
  - `app/layout.tsx` uses `Providers`
- Verified one endpoint end-to-end in UI:
  - `/projects` now loads data via `GET /projects` using React Query.

## Verification
- `npm run lint` passes.
- `npm run build` passes.

## Notes / follow-ups
- Next step: Stage 4 (auth + route protection) or proceed to Stage 5 (projects CRUD) once auth is in place.
- The API types are lightweight and can be replaced with OpenAPI-generated types later if desired.
