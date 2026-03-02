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

export type ProjectCreateRequest = {
  name: string;
  description?: string;
  tags?: string[];
  // Wizard support (OpenAPI allows these)
  defaultEnvironment?: unknown;
  domains?: Array<{ name: string; color: string }>;
};

export type ProjectUpdateRequest = {
  name?: string;
  description?: string;
  tags?: string[];
  archived?: boolean;
};

export async function listProjects(params?: { cursor?: string; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.cursor) qs.set("cursor", params.cursor);
  if (params?.limit) qs.set("limit", String(params.limit));

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<ProjectListResponse>(`/projects${suffix}`);
}

export async function getProject(id: string): Promise<ProjectDetail> {
  return apiFetch<ProjectDetail>(`/projects/${id}`);
}

export async function createProject(body: ProjectCreateRequest): Promise<Project> {
  return apiFetch<Project>("/projects", { method: "POST", body });
}

export async function updateProject(id: string, body: ProjectUpdateRequest): Promise<Project> {
  return apiFetch<Project>(`/projects/${id}`, { method: "PATCH", body });
}

export async function archiveProject(id: string): Promise<void> {
  return apiFetch<void>(`/projects/${id}`, { method: "DELETE" });
}
