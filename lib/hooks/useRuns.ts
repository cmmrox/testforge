import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createRun,
  getRun,
  listRunArtifacts,
  listRunItems,
  listRuns,
  type TestRun,
  type TestRunCreateRequest,
  type TestRunListResponse,
} from "@/lib/api/runs";

export function useRuns(
  projectId: string | undefined,
  filters?: { status?: string; environmentId?: string }
) {
  return useQuery<TestRunListResponse>({
    queryKey: ["runs", projectId, filters],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const api = await listRuns(projectId!, filters);
      const { overlayLoad, filterByProjectId, mergeById } = await import(
        "@/lib/overlay/overlayStore"
      );
      const overlay = overlayLoad();
      const overlayRuns = filterByProjectId(overlay.runs, projectId!);
      return { ...api, data: mergeById<TestRun>(api.data, overlayRuns) };
    },
  });
}

export function useRun(id: string | undefined) {
  return useQuery({
    queryKey: ["runs", "detail", id],
    enabled: Boolean(id),
    queryFn: () => getRun(id!),
  });
}

export function useRunItems(runId: string | undefined) {
  return useQuery({
    queryKey: ["runs", "items", runId],
    enabled: Boolean(runId),
    queryFn: () => listRunItems(runId!),
  });
}

export function useRunArtifacts(runId: string | undefined) {
  return useQuery({
    queryKey: ["runs", "artifacts", runId],
    enabled: Boolean(runId),
    queryFn: () => listRunArtifacts(runId!),
  });
}

export function useCreateRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, body }: { projectId: string; body: TestRunCreateRequest }) =>
      createRun(projectId, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["runs", vars.projectId] });
    },
  });
}
