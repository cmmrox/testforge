import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  listTestCases,
  getTestCase,
  createTestCase,
  updateTestCase,
  archiveTestCase,
  listCaseVersions,
  createCaseVersion,
  type TestCaseCreateRequest,
  type TestCaseUpdateRequest,
  type TestCaseVersionCreateRequest,
} from "@/lib/api/cases";

export function useTestCases(
  projectId: string | undefined,
  filters?: { domainId?: string; status?: string; q?: string }
) {
  return useQuery({
    queryKey: ["test-cases", projectId, filters],
    queryFn: () => listTestCases(projectId!, filters),
    enabled: !!projectId,
  });
}

export function useTestCase(id: string | undefined) {
  return useQuery({
    queryKey: ["test-cases", "detail", id],
    queryFn: () => getTestCase(id!),
    enabled: !!id,
  });
}

export function useCaseVersions(caseId: string | undefined) {
  return useQuery({
    queryKey: ["test-cases", "versions", caseId],
    queryFn: () => listCaseVersions(caseId!),
    enabled: !!caseId,
  });
}

export function useCreateTestCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      body,
    }: {
      projectId: string;
      body: TestCaseCreateRequest;
    }) => createTestCase(projectId, body),
    onSuccess: (_data, { projectId }) => {
      qc.invalidateQueries({ queryKey: ["test-cases", projectId] });
    },
  });
}

export function useUpdateTestCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      projectId: string;
      body: TestCaseUpdateRequest;
    }) => updateTestCase(id, body),
    onSuccess: (_data, { projectId, id }) => {
      qc.invalidateQueries({ queryKey: ["test-cases", projectId] });
      qc.invalidateQueries({ queryKey: ["test-cases", "detail", id] });
    },
  });
}

export function useArchiveTestCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; projectId: string }) =>
      archiveTestCase(id),
    onSuccess: (_data, { projectId }) => {
      qc.invalidateQueries({ queryKey: ["test-cases", projectId] });
    },
  });
}

export function useCreateCaseVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseId,
      body,
    }: {
      caseId: string;
      body: TestCaseVersionCreateRequest;
    }) => createCaseVersion(caseId, body),
    onSuccess: (_data, { caseId }) => {
      qc.invalidateQueries({ queryKey: ["test-cases", "versions", caseId] });
      qc.invalidateQueries({ queryKey: ["test-cases", "detail", caseId] });
    },
  });
}
