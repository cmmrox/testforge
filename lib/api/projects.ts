import { apiFetch } from "@/lib/api/apiFetch";

export type Project = {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  archived: boolean;
  createdAt: string;
};

export type ProjectDetail = Project & {
  environmentCount?: number;
  testPlanCount?: number;
  testCaseCount?: number;
  lastRun?: { id: string; status: string; finishedAt?: string };
};

export type ProjectListResponse = {
  data: ProjectDetail[];
  nextCursor?: string;
};

export async function listProjects(params?: { cursor?: string; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.cursor) qs.set("cursor", params.cursor);
  if (params?.limit) qs.set("limit", String(params.limit));

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<ProjectListResponse>(`/projects${suffix}`);
}
