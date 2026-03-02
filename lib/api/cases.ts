import { apiFetch } from "@/lib/api/apiFetch";

export type TestCase = {
  id: string;
  projectId: string;
  domainId?: string | null;
  title: string;
  objective?: string;
  tags?: string[];
  status: "active" | "archived";
  createdAt: string;
};

export type TestCaseListResponse = {
  data: TestCase[];
  nextCursor?: string;
};

export async function listTestCases(projectId: string) {
  return apiFetch<TestCaseListResponse>(`/projects/${projectId}/test-cases`);
}
