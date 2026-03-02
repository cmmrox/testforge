import { apiFetch } from "@/lib/api/apiFetch";

export type Domain = {
  id: string;
  projectId: string;
  name: string;
  color: string;
  createdAt: string;
};

export type DomainListResponse = {
  data: Domain[];
};

export async function listDomains(projectId: string) {
  return apiFetch<DomainListResponse>(`/projects/${projectId}/domains`);
}
