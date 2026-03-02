import { apiFetch } from "@/lib/api/apiFetch";

export type TestRun = {
  id: string;
  projectId: string;
  environmentId?: string | null;
  status: "queued" | "running" | "passed" | "failed" | "canceled";
  startedAt?: string | null;
  finishedAt?: string | null;
  durationMs?: number | null;
  createdAt: string;
};

export type TestRunListResponse = {
  data: TestRun[];
  nextCursor?: string;
};

export async function listRuns(projectId: string) {
  return apiFetch<TestRunListResponse>(`/projects/${projectId}/runs`);
}
