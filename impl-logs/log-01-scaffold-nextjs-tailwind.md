# Stage 1 Log — Scaffold Next.js + Tailwind (Repo Root)

## What was done
- Added a Next.js (App Router) + TypeScript + Tailwind project at the **repo root**.
- Preserved existing documentation and folders (`openapi/`, `mock-server/`, etc.).
- Added `impl-plans/plan-01-frontend-nextjs-tailwind.md` (approved plan) and `PROGRESS.md` tracking.
- Added `.env.example` for UI-first development pointing at the Prism mock server.
- Updated `.gitignore` to allow committing `.env.example` while ignoring other `.env*` files.
- Updated root `README.md` with:
  - how to run the Prism mock server (Docker + Node options)
  - how to run the UI
  - pointers to project docs
- Adjusted `eslint.config.mjs` to ignore non-Next repo folders (`mock-server/**`, `openapi/**`, etc.) so `npm run lint` is clean.

## Verification
- `npm run lint` passes.
- `npm run build` passes.

## Notes / follow-ups
- Next step is Stage 2: implement the app shell (sidebar/topbar) and reusable UI primitives.
- Mock server currently has its own `node_modules/` committed in this repo; later we should remove it and rely on installs/lockfile (separately tracked).
