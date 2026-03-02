import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  listEnvironments,
  getEnvironment,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
  testConnection,
  type EnvironmentCreateRequest,
  type EnvironmentUpdateRequest,
  type ConnectionTestResponse,
} from "@/lib/api/environments";

export function useEnvironments(projectId: string | undefined) {
  return useQuery({
    queryKey: ["environments", projectId],
    queryFn: async () => {
      const api = await listEnvironments(projectId!);
      const { overlayLoad, filterByProjectId, mergeById } = await import(
        "@/lib/overlay/overlayStore"
      );
      const overlay = overlayLoad();
      const overlayEnvs = filterByProjectId(overlay.environments, projectId!);
      return { ...api, data: mergeById(api.data, overlayEnvs) };
    },
    enabled: !!projectId,
  });
}

export function useEnvironment(id: string | undefined) {
  return useQuery({
    queryKey: ["environments", "detail", id],
    queryFn: () => getEnvironment(id!),
    enabled: !!id,
  });
}

export function useCreateEnvironment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, body }: { projectId: string; body: EnvironmentCreateRequest }) =>
      createEnvironment(projectId, body),
    onSuccess: (_data, { projectId }) => {
      qc.invalidateQueries({ queryKey: ["environments", projectId] });
    },
  });
}

export function useUpdateEnvironment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; projectId: string; body: EnvironmentUpdateRequest }) =>
      updateEnvironment(id, body),
    onSuccess: (_data, { id, projectId }) => {
      qc.invalidateQueries({ queryKey: ["environments", projectId] });
      qc.invalidateQueries({ queryKey: ["environments", "detail", id] });
    },
  });
}

export function useDeleteEnvironment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; projectId: string }) => deleteEnvironment(id),
    onSuccess: (_data, { projectId }) => {
      qc.invalidateQueries({ queryKey: ["environments", projectId] });
    },
  });
}

export function useTestConnection() {
  return useMutation<ConnectionTestResponse, Error, string>({
    mutationFn: (id: string) => testConnection(id),
  });
}
