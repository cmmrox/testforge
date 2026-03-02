import { apiFetch } from "@/lib/api/apiFetch";

export type Environment = {
  id: string;
  projectId: string;
  name: string;
  baseUrl: string;
  loginRecipe?: Record<string, unknown>;
  createdAt: string;
};

export type EnvironmentListResponse = {
  data: Environment[];
};

export async function listEnvironments(projectId: string) {
  return apiFetch<EnvironmentListResponse>(`/projects/${projectId}/environments`);
}
