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

export type DomainCreateRequest = {
  name: string;
  color: string;
};

export type DomainUpdateRequest = {
  name?: string;
  color?: string;
};

export async function listDomains(projectId: string) {
  return apiFetch<DomainListResponse>(`/projects/${projectId}/domains`);
}

export async function createDomain(projectId: string, body: DomainCreateRequest) {
  return apiFetch<Domain>(`/projects/${projectId}/domains`, {
    method: "POST",
    body,
  });
}

export async function updateDomain(id: string, body: DomainUpdateRequest) {
  return apiFetch<Domain>(`/domains/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteDomain(id: string) {
  return apiFetch<void>(`/domains/${id}`, { method: "DELETE" });
}
