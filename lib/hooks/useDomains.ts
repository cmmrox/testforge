import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  listDomains,
  createDomain,
  updateDomain,
  deleteDomain,
  type DomainCreateRequest,
  type DomainUpdateRequest,
} from "@/lib/api/domains";

export function useDomains(projectId: string | undefined) {
  return useQuery({
    queryKey: ["domains", projectId],
    queryFn: () => listDomains(projectId!),
    enabled: !!projectId,
  });
}

export function useCreateDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, body }: { projectId: string; body: DomainCreateRequest }) =>
      createDomain(projectId, body),
    onSuccess: (_data, { projectId }) => {
      qc.invalidateQueries({ queryKey: ["domains", projectId] });
    },
  });
}

export function useUpdateDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; projectId: string; body: DomainUpdateRequest }) =>
      updateDomain(id, body),
    onSuccess: (_data, { projectId }) => {
      qc.invalidateQueries({ queryKey: ["domains", projectId] });
    },
  });
}

export function useDeleteDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; projectId: string }) => deleteDomain(id),
    onSuccess: (_data, { projectId }) => {
      qc.invalidateQueries({ queryKey: ["domains", projectId] });
    },
  });
}
