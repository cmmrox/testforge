# Stage 12 Log — Quality (tests, a11y, docs)

## What was done

- Added Vitest + Testing Library for basic unit/component testing.
- Added initial unit test for `cn()` helper.
- Added `typecheck` script (`tsc --noEmit`).
- Added Next.js `allowedDevOrigins` to remove dev cross-origin warning when using VM public IP.
- Updated README docker instructions to match the current mock server port mapping (8081 → 8081).
- Added `A11Y.md` checklist and documented known gaps.

## Commands

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
