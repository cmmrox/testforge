# TestForge — Architecture Diagram (v1)

This document contains the **system architecture** for TestForge v1 (UI-first).

## 1) High-level component diagram

```mermaid
graph LR
  U["User (Browser)"] -->|HTTPS| WEB["Next.js App\n(UI + API Route Handlers)"]

  WEB -->|SQL| PG[(PostgreSQL)]
  WEB -->|enqueue jobs| REDIS[(Redis)]

  subgraph Q[Queues (BullMQ)]
    Q1[ui-runs]
    Q2[artifact-postprocess (optional)]
  end

  REDIS --- Q

  subgraph W[Workers]
    WUI["UI Runner Worker\n(Node.js + Playwright)"]
  end

  Q1 --> WUI
  WUI -->|status updates + metadata| PG
  WUI -->|write artifacts| FS[(Local FS Artifacts\n/home/ec2-user/testforge-artifacts)]

  WEB -->|read artifacts metadata| PG
  WEB -->|serve/download artifacts| FS
```

## 2) Sequence: “Run Test Plan”

```mermaid
sequenceDiagram
  autonumber
  participant User as QA/User
  participant Web as Next.js Web/API
  participant DB as PostgreSQL
  participant R as Redis/BullMQ
  participant Worker as UI Worker (Playwright)
  participant FS as Local Artifacts FS

  User->>Web: Click "Run" (plan/cases + env)
  Web->>DB: Create TestRun (status=queued)
  Web->>R: Enqueue job ui-runs(runId)
  Web-->>User: UI shows queued state

  Worker->>R: Dequeue ui-runs(runId)
  Worker->>DB: Mark run running; create run items
  Worker->>Worker: Launch browser (Playwright)
  Worker->>Worker: Execute login recipe (if enabled)
  Worker->>Worker: Execute steps for each test case

  alt on step / test failure
    Worker->>FS: Write screenshot/trace/video per policy
    Worker->>DB: Save artifact metadata + failure summary
  else pass
    Worker->>DB: Save timings + pass status
  end

  Worker->>DB: Mark run finished (passed/failed)
  User->>Web: Open run report
  Web->>DB: Load run summary + artifacts list
  Web->>FS: Serve artifact files for download/view
```

## 3) Key runtime concerns
- **Concurrency control:** configured in worker + BullMQ; start low (1–2 browsers per VM).
- **Flakiness controls:** retries, trace-on-failure, selector linting.
- **Security:** secrets encrypted at rest; never return to UI after save.
