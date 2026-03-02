import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  archiveProject,
  createProject,
  getProject,
  listProjects,
  updateProject,
  type ProjectCreateRequest,
  type ProjectUpdateRequest,
} from "@/lib/api/projects";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const api = await listProjects({ limit: 20 });
      const { overlayLoad, mergeById } = await import("@/lib/overlay/overlayStore");
      const overlay = overlayLoad();
      return {
        ...api,
        data: mergeById(api.data, overlay.projects),
      };
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProject(id),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProjectCreateRequest) => createProject(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ProjectUpdateRequest }) =>
      updateProject(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["projects", id] });
    },
  });
}

export function useArchiveProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveProject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
