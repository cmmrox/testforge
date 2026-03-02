# TestForge

UI-first implementation for the TestForge QA automation platform.

## Prerequisites
- Node.js + npm
- (Recommended) Docker for running the mock server container

## Environment
Copy `.env.example` → `.env.local` and adjust as needed:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_API_BASE_URL`:
  - leave empty to use the built-in **same-origin proxy** (recommended when opening the UI via VM public IP)
  - or set it to call an API directly from the browser
- `MOCK_API_BASE_URL` is the server-side proxy target (defaults to `http://127.0.0.1:8081`).

## Run the mock API + Swagger UI (OpenAPI → Prism)

### Option A: Docker (recommended)
From the OpenClaw workspace root (so the build context is correct):

```bash
cd /home/ec2-user/.openclaw/workspace
docker build -f Projects/testforge/mock-server/Dockerfile -t testforge-mock:latest Projects/testforge
docker run --rm -p 8081:8080 testforge-mock:latest
```

- Swagger UI: http://localhost:8081/docs
- Mock API: http://localhost:8081/

### Option B: Node

```bash
cd mock-server
SPEC_PATH=../openapi/testforge.v1.yaml PORT=8080 PRISM_PORT=4010 node server.js
```

Swagger UI: http://localhost:8080/docs

## Run the UI

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Key docs
- Product requirements: `PRD.md`
- User flows: `USER_FLOWS.md`
- Architecture: `ARCHITECTURE.md`
- OpenAPI contract: `openapi/testforge.v1.yaml`
- Frontend plan: `impl-plans/plan-01-frontend-nextjs-tailwind.md`
