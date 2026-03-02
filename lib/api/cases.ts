import { apiFetch } from "@/lib/api/apiFetch";

// ── Types ──────────────────────────────────────────────────────────────────

export type TestStep = {
  type:
    | "navigate"
    | "fill"
    | "click"
    | "select"
    | "assertVisible"
    | "assertText"
    | "waitFor";
  locator?: string;
  value?: string;
  mask?: boolean;
  assertion?: string;
  locatorHint?: string;
  url?: string;
};

export type EvidencePolicy = {
  screenshots?: "always" | "onFail" | "never";
  video?: "always" | "onFail" | "never";
  trace?: "always" | "onFail" | "never";
};

export type TestCaseVersionSpec = {
  kind: "ui";
  title?: string;
  preconditions?: string[];
  steps: TestStep[];
  evidence?: EvidencePolicy;
};

export type TestCaseVersion = {
  id: string;
  testCaseId: string;
  versionNo: number;
  spec: TestCaseVersionSpec;
  changeNote?: string;
  createdBy?: string;
  createdAt: string;
};

export type TestCase = {
  id: string;
  projectId: string;
  domainId?: string | null;
  title: string;
  objective?: string;
  tags?: string[];
  status: "active" | "archived";
  latestVersion?: TestCaseVersion;
  createdAt: string;
};

export type TestCaseDetail = TestCase & { versions?: TestCaseVersion[] };

export type TestCaseListResponse = {
  data: TestCase[];
  nextCursor?: string | null;
};

export type TestCaseVersionListResponse = {
  data: TestCaseVersion[];
};

export type TestCaseCreateRequest = {
  title: string;
  objective?: string;
  domainId?: string;
  tags?: string[];
  spec?: TestCaseVersionSpec;
};

export type TestCaseUpdateRequest = {
  title?: string;
  objective?: string;
  domainId?: string;
  tags?: string[];
  status?: "active" | "archived";
};

export type TestCaseVersionCreateRequest = {
  changeNote?: string;
  spec: TestCaseVersionSpec;
};

// ── API functions ──────────────────────────────────────────────────────────

export async function listTestCases(
  projectId: string,
  filters?: { domainId?: string; status?: string; q?: string }
) {
  const params = new URLSearchParams();
  if (filters?.domainId) params.set("domainId", filters.domainId);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.q) params.set("q", filters.q);
  const qs = params.toString();
  return apiFetch<TestCaseListResponse>(
    `/projects/${projectId}/test-cases${qs ? `?${qs}` : ""}`
  );
}

export async function getTestCase(id: string) {
  return apiFetch<TestCaseDetail>(`/test-cases/${id}`);
}

export async function createTestCase(
  projectId: string,
  body: TestCaseCreateRequest
) {
  return apiFetch<TestCase>(`/projects/${projectId}/test-cases`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateTestCase(id: string, body: TestCaseUpdateRequest) {
  return apiFetch<TestCase>(`/test-cases/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function archiveTestCase(id: string): Promise<void> {
  await apiFetch<void>(`/test-cases/${id}`, { method: "DELETE" });
}

export async function listCaseVersions(caseId: string) {
  return apiFetch<TestCaseVersionListResponse>(`/test-cases/${caseId}/versions`);
}

export async function createCaseVersion(
  caseId: string,
  body: TestCaseVersionCreateRequest
) {
  return apiFetch<TestCaseVersion>(`/test-cases/${caseId}/versions`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getCaseVersion(versionId: string) {
  return apiFetch<TestCaseVersion>(`/test-case-versions/${versionId}`);
}
