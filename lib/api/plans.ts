import { apiFetch } from "@/lib/api/apiFetch";

export type TestPlan = {
  id: string;
  projectId: string;
  domainId?: string | null;
  title: string;
  description?: string;
  status: "draft" | "approved" | "archived";
  generatedBy: "agent" | "manual";
  createdAt: string;
};

export type TestPlanListResponse = {
  data: TestPlan[];
  nextCursor?: string;
};

export async function listTestPlans(projectId: string) {
  return apiFetch<TestPlanListResponse>(`/projects/${projectId}/test-plans`);
}
