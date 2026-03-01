# TestForge — Architecture Diagram (v1)

This document contains the **system architecture** for TestForge v1 (UI-first).

## 1) High-level component diagram

```mermaid
graph LR
  U["User Browser"] -->|HTTPS| WEB["Next.js App - UI and API Route Handlers"]

  WEB -->|SQL| PG[(PostgreSQL)]
  WEB -->|enqueue jobs| REDIS[(Redis)]

  subgraph Queues
    Q1[ui-runs]
    Q2[artifact-postprocess]
  end

  REDIS --- Q1
  REDIS --- Q2

  subgraph Workers
    WUI["UI Runner Worker - Node.js and Playwright"]
  end

  Q1 --> WUI
  WUI -->|status updates and metadata| PG
  WUI -->|write artifacts| FS[(Local FS Artifacts)]

  WEB -->|read artifact metadata| PG
  WEB -->|serve artifacts| FS
```

## 2) Sequence: "Run Test Plan"

```mermaid
sequenceDiagram
  autonumber
  participant User as QA User
  participant Web as Next.js Web API
  participant DB as PostgreSQL
  participant R as Redis BullMQ
  participant Worker as UI Worker Playwright
  participant FS as Local Artifacts FS

  User->>Web: Click Run with plan and env selected
  Web->>DB: Create TestRun with status queued
  Web->>R: Enqueue job ui-runs with runId
  Web-->>User: UI shows queued state

  Worker->>R: Dequeue ui-runs job
  Worker->>DB: Mark run as running and create run items
  Worker->>Worker: Launch Playwright browser
  Worker->>Worker: Execute login recipe if enabled
  Worker->>Worker: Execute steps for each test case

  alt on step or test failure
    Worker->>FS: Write screenshot trace video per policy
    Worker->>DB: Save artifact metadata and failure summary
  else pass
    Worker->>DB: Save timings and pass status
  end

  Worker->>DB: Mark run finished passed or failed
  User->>Web: Open run report
  Web->>DB: Load run summary and artifacts list
  Web->>FS: Serve artifact files for download
```

## 3) Key runtime concerns
- **Concurrency control:** configured in worker + BullMQ; start low (1–2 browsers per VM).
- **Flakiness controls:** retries, trace-on-failure, selector linting.
- **Security:** secrets encrypted at rest; never return to UI after save.
