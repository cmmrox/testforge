# TestForge — Technical Stack (Approved)

This document captures the **approved architecture/stack** for TestForge.

## 1) Monolith app
- **Next.js (App Router) + TypeScript**
- UI + internal API via **Next.js Route Handlers**

## 2) Execution / automation
- **UI automation:** Playwright (worker process)
- **API testing:** HTTP runner (worker process)

## 3) Orchestration
- **BullMQ + Redis** for:
  - job queue
  - retries
  - concurrency control

## 4) Persistence
- **PostgreSQL**

## 5) Artifact storage (v1)
- **Local filesystem** on the VM
- Base path: `/home/ec2-user/testforge-artifacts`
  - screenshots
  - video
  - trace
  - html/json reports

## 6) Security (baseline)
- encrypt secrets at rest (AES-GCM)
- role-based access control (Admin/Editor/Runner/Viewer)
- audit log of changes and runs

## 7) Deployment (v1)
- Docker Compose recommended for:
  - nextjs app
  - postgres
  - redis
  - workers
