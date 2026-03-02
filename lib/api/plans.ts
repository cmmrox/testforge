import { apiFetch } from "@/lib/api/apiFetch";

export type TestPlan = {
  id: string;
  projectId: string;
  domainId?: string | null;
  title: string;
  description?: string;
  status: "draft" | "approved" | "archived";
  generatedBy: "agent" | "manual";
  createdBy?: string;
  createdAt: string;
};

export type TestCaseDraft = {
  title: string;
  objective?: string;
  spec?: object;
};

export type TestPlanDetail = TestPlan & {
  recommendedCases?: TestCaseDraft[];
  risks?: string[];
};

export type TestPlanListResponse = {
  data: TestPlan[];
  nextCursor?: string;
};

export type TestPlanCreateRequest = {
  title: string;
  description?: string;
  domainId?: string;
  generatedBy?: "manual";
  draftCases?: object[];
};

export type TestPlanUpdateRequest = {
  title?: string;
  description?: string;
  domainId?: string;
};

export type TestPlanGenerationRequest = {
  title: string;
  domainId?: string;
  goal: string;
  preconditions?: string[];
  acceptanceCriteria?: string[];
  testDataHints?: string[];
};

export type TestPlanGenerationResponse = {
  plan: TestPlan;
  suggestedCases?: TestCaseDraft[];
  risks?: string[];
};

export type TestPlanItem = {
  planId: string;
  testCaseId: string;
  latestVersionId: string | null;
};

export type TestPlanItemList = {
  data: TestPlanItem[];
};

export async function listTestPlans(
  projectId: string,
  filters?: { domainId?: string; status?: string }
) {
  const params = new URLSearchParams();
  if (filters?.domainId) params.set("domainId", filters.domainId);
  if (filters?.status) params.set("status", filters.status);
  const qs = params.toString();
  return apiFetch<TestPlanListResponse>(
    `/projects/${projectId}/test-plans${qs ? `?${qs}` : ""}`
  );
}

export async function createTestPlan(
  projectId: string,
  body: TestPlanCreateRequest
) {
  return apiFetch<TestPlan>(`/projects/${projectId}/test-plans`, {
    method: "POST",
    body,
  });
}

export async function getTestPlan(id: string) {
  return apiFetch<TestPlanDetail>(`/test-plans/${id}`);
}

export async function updateTestPlan(id: string, body: TestPlanUpdateRequest) {
  return apiFetch<TestPlan>(`/test-plans/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function archiveTestPlan(id: string) {
  return apiFetch<void>(`/test-plans/${id}`, { method: "DELETE" });
}

export async function approveTestPlan(id: string) {
  return apiFetch<TestPlan>(`/test-plans/${id}/approve`, { method: "POST" });
}

export async function generateTestPlan(
  projectId: string,
  body: TestPlanGenerationRequest
) {
  return apiFetch<TestPlanGenerationResponse>(
    `/projects/${projectId}/test-plans/generate`,
    { method: "POST", body }
  );
}

export async function listPlanItems(planId: string) {
  return apiFetch<TestPlanItemList>(`/test-plans/${planId}/items`);
}
