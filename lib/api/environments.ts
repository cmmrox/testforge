import { apiFetch } from "@/lib/api/apiFetch";

export type LoginRecipe = {
  loginUrl?: string;
  locatorUsername?: string;
  locatorPassword?: string;
  locatorSubmit?: string;
  locatorPostLoginAssert?: string;
  totpEnabled?: boolean;
  locatorTotp?: string;
  locatorTotpSubmit?: string;
  secretRefs?: {
    usernameSecretId?: string;
    passwordSecretId?: string;
    totpSecretId?: string;
  };
};

export type LoginRecipeInput = LoginRecipe & {
  username?: string;
  password?: string;
  totpSecret?: string;
};

export type Environment = {
  id: string;
  projectId: string;
  name: string;
  baseUrl: string;
  loginRecipe?: LoginRecipe;
  createdAt: string;
};

export type EnvironmentListResponse = {
  data: Environment[];
};

export type ConnectionTestResponse = {
  reachable: boolean;
  latencyMs?: number;
  statusCode?: number;
  error?: string;
};

export type EnvironmentCreateRequest = {
  name: string;
  baseUrl: string;
  loginRecipe?: LoginRecipeInput;
};

export type EnvironmentUpdateRequest = EnvironmentCreateRequest;

export async function listEnvironments(projectId: string) {
  return apiFetch<EnvironmentListResponse>(`/projects/${projectId}/environments`);
}

export async function getEnvironment(id: string) {
  return apiFetch<Environment>(`/environments/${id}`);
}

export async function createEnvironment(projectId: string, body: EnvironmentCreateRequest) {
  return apiFetch<Environment>(`/projects/${projectId}/environments`, {
    method: "POST",
    body,
  });
}

export async function updateEnvironment(id: string, body: EnvironmentUpdateRequest) {
  return apiFetch<Environment>(`/environments/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteEnvironment(id: string) {
  return apiFetch<void>(`/environments/${id}`, { method: "DELETE" });
}

export async function testConnection(id: string) {
  return apiFetch<ConnectionTestResponse>(`/environments/${id}/test-connection`, {
    method: "POST",
  });
}
