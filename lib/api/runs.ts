import { apiFetch } from "@/lib/api/apiFetch";

export type EvidenceMode = "always" | "onFail" | "never";

export type EvidencePolicy = {
  screenshots?: EvidenceMode;
  video?: EvidenceMode;
  trace?: EvidenceMode;
};

export type TestRun = {
  id: string;
  projectId: string;
  environmentId?: string | null;
  triggeredBy?: string;
  status: "queued" | "running" | "passed" | "failed" | "canceled";
  startedAt?: string | null;
  finishedAt?: string | null;
  durationMs?: number | null;
  summary?: Record<string, unknown>;
  createdAt: string;
};

export type TestRunItem = {
  id: string;
  testCaseVersionId: string;
  status: "queued" | "running" | "passed" | "failed" | "skipped";
  startedAt?: string | null;
  finishedAt?: string | null;
  durationMs?: number | null;
  failureSummary?: string;
  failureDetails?: Record<string, unknown>;
};

export type TestRunDetail = TestRun & {
  items?: TestRunItem[];
  artifacts?: unknown[];
};

export type TestRunListResponse = {
  data: TestRun[];
  nextCursor?: string;
};

export type TestRunItemListResponse = {
  data: TestRunItem[];
};

export type TestRunCreateRequest = {
  environmentId: string;
  planId?: string;
  testCaseVersionIds?: string[];
  retries?: number;
  evidenceOverride?: EvidencePolicy;
};

export async function listRuns(
  projectId: string,
  filters?: { status?: string; environmentId?: string }
) {
  const qs = new URLSearchParams();
  if (filters?.status) qs.set("status", filters.status);
  if (filters?.environmentId) qs.set("environmentId", filters.environmentId);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";

  return apiFetch<TestRunListResponse>(`/projects/${projectId}/runs${suffix}`);
}

export async function createRun(projectId: string, body: TestRunCreateRequest) {
  return apiFetch<TestRun>(`/projects/${projectId}/runs`, { method: "POST", body });
}

export async function getRun(id: string) {
  return apiFetch<TestRunDetail>(`/runs/${id}`);
}

export async function listRunItems(id: string) {
  return apiFetch<TestRunItemListResponse>(`/runs/${id}/items`);
}

export async function listRunArtifacts(id: string) {
  return apiFetch<{ data: import("@/lib/api/artifacts").Artifact[] }>(`/runs/${id}/artifacts`);
}
