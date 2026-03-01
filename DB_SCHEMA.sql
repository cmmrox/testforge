-- TestForge v1 (UI-first) — Draft PostgreSQL schema
-- Note: This is a *draft* to communicate structure. Names/constraints can be refined during implementation.

CREATE TABLE users (
  id              UUID PRIMARY KEY,
  email           TEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  role            TEXT NOT NULL CHECK (role IN ('admin','editor','runner','viewer')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id          UUID PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  archived    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE domains (
  id          UUID PRIMARY KEY,
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  color       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, name)
);

-- Encrypted secrets blob; value format decided by app (AES-GCM envelope)
CREATE TABLE secrets (
  id          UUID PRIMARY KEY,
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  enc_blob    BYTEA NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, name)
);

CREATE TABLE environments (
  id            UUID PRIMARY KEY,
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  base_url      TEXT NOT NULL,

  -- references to secrets entries (optional)
  username_secret_id UUID REFERENCES secrets(id),
  password_secret_id UUID REFERENCES secrets(id),
  totp_secret_id     UUID REFERENCES secrets(id),

  -- login recipe (locators)
  login_url                TEXT,
  locator_username         TEXT,
  locator_password         TEXT,
  locator_submit           TEXT,
  locator_post_login_assert TEXT,
  totp_enabled             BOOLEAN NOT NULL DEFAULT FALSE,
  locator_totp             TEXT,
  locator_totp_submit      TEXT,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, name)
);

CREATE TABLE test_plans (
  id          UUID PRIMARY KEY,
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  domain_id   UUID REFERENCES domains(id),
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL CHECK (status IN ('draft','approved','archived')),
  generated_by TEXT NOT NULL CHECK (generated_by IN ('agent','manual')),
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE test_cases (
  id          UUID PRIMARY KEY,
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  domain_id   UUID REFERENCES domains(id),
  title       TEXT NOT NULL,
  objective   TEXT,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  status      TEXT NOT NULL CHECK (status IN ('active','archived')),
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE test_case_versions (
  id           UUID PRIMARY KEY,
  test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
  version_no   INT NOT NULL,
  spec_json    JSONB NOT NULL,
  change_note  TEXT,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(test_case_id, version_no)
);

-- link plans to cases (optional)
CREATE TABLE test_plan_items (
  plan_id      UUID NOT NULL REFERENCES test_plans(id) ON DELETE CASCADE,
  test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
  PRIMARY KEY (plan_id, test_case_id)
);

CREATE TABLE test_runs (
  id             UUID PRIMARY KEY,
  project_id     UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  environment_id UUID REFERENCES environments(id),
  triggered_by   UUID REFERENCES users(id),
  status         TEXT NOT NULL CHECK (status IN ('queued','running','passed','failed','canceled')),
  started_at     TIMESTAMPTZ,
  finished_at    TIMESTAMPTZ,
  duration_ms    BIGINT,
  summary        JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE test_run_items (
  id                    UUID PRIMARY KEY,
  run_id                UUID NOT NULL REFERENCES test_runs(id) ON DELETE CASCADE,
  test_case_version_id  UUID NOT NULL REFERENCES test_case_versions(id),
  status                TEXT NOT NULL CHECK (status IN ('queued','running','passed','failed','skipped')),
  started_at            TIMESTAMPTZ,
  finished_at           TIMESTAMPTZ,
  duration_ms           BIGINT,
  failure_summary       TEXT,
  failure_details       JSONB
);

CREATE TABLE artifacts (
  id            UUID PRIMARY KEY,
  run_id        UUID NOT NULL REFERENCES test_runs(id) ON DELETE CASCADE,
  run_item_id   UUID REFERENCES test_run_items(id) ON DELETE SET NULL,
  type          TEXT NOT NULL CHECK (type IN ('screenshot','video','trace','report','log','other')),
  file_path     TEXT NOT NULL,
  mime_type     TEXT,
  size_bytes    BIGINT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
  id            UUID PRIMARY KEY,
  actor_user_id UUID REFERENCES users(id),
  action        TEXT NOT NULL,
  entity_type   TEXT NOT NULL,
  entity_id     UUID,
  at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  details_json  JSONB
);

-- Helpful indexes
CREATE INDEX idx_domains_project ON domains(project_id);
CREATE INDEX idx_env_project ON environments(project_id);
CREATE INDEX idx_cases_project ON test_cases(project_id);
CREATE INDEX idx_runs_project ON test_runs(project_id);
CREATE INDEX idx_run_items_run ON test_run_items(run_id);
CREATE INDEX idx_artifacts_run ON artifacts(run_id);
