import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  listTestPlans,
  getTestPlan,
  createTestPlan,
  updateTestPlan,
  archiveTestPlan,
  approveTestPlan,
  generateTestPlan,
  listPlanItems,
  type TestPlanCreateRequest,
  type TestPlanUpdateRequest,
  type TestPlanGenerationRequest,
} from "@/lib/api/plans";

export function useTestPlans(
  projectId: string | undefined,
  filters?: { domainId?: string; status?: string }
) {
  return useQuery({
    queryKey: ["test-plans", projectId, filters],
    queryFn: () => listTestPlans(projectId!, filters),
    enabled: !!projectId,
  });
}

export function useTestPlan(id: string | undefined) {
  return useQuery({
    queryKey: ["test-plans", "detail", id],
    queryFn: () => getTestPlan(id!),
    enabled: !!id,
  });
}

export function usePlanItems(planId: string | undefined) {
  return useQuery({
    queryKey: ["test-plans", "items", planId],
    queryFn: () => listPlanItems(planId!),
    enabled: !!planId,
  });
}

export function useCreateTestPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      body,
    }: {
      projectId: string;
      body: TestPlanCreateRequest;
    }) => createTestPlan(projectId, body),
    onSuccess: (_data, { projectId }) => {
      qc.invalidateQueries({ queryKey: ["test-plans", projectId] });
    },
  });
}

export function useUpdateTestPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      projectId: string;
      body: TestPlanUpdateRequest;
    }) => updateTestPlan(id, body),
    onSuccess: (_data, { projectId, id }) => {
      qc.invalidateQueries({ queryKey: ["test-plans", projectId] });
      qc.invalidateQueries({ queryKey: ["test-plans", "detail", id] });
    },
  });
}

export function useArchiveTestPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; projectId: string }) =>
      archiveTestPlan(id),
    onSuccess: (_data, { projectId }) => {
      qc.invalidateQueries({ queryKey: ["test-plans", projectId] });
    },
  });
}

export function useApproveTestPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; projectId: string }) =>
      approveTestPlan(id),
    onSuccess: (_data, { projectId, id }) => {
      qc.invalidateQueries({ queryKey: ["test-plans", projectId] });
      qc.invalidateQueries({ queryKey: ["test-plans", "detail", id] });
    },
  });
}

export function useGenerateTestPlan() {
  return useMutation({
    mutationFn: ({
      projectId,
      body,
    }: {
      projectId: string;
      body: TestPlanGenerationRequest;
    }) => generateTestPlan(projectId, body),
  });
}
