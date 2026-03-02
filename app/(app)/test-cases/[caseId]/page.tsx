"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CaseStatusBadge } from "@/components/cases/case-status-badge";
import { StepEditor } from "@/components/cases/step-editor";
import { VersionHistory } from "@/components/cases/version-history";
import { EditCaseDialog } from "@/components/cases/edit-case-dialog";
import { DomainChip } from "@/components/domains/domain-chip";
import { useTestCase, useCaseVersions, useCreateCaseVersion } from "@/lib/hooks/useTestCases";
import { useDomains } from "@/lib/hooks/useDomains";
import { type TestCaseVersionSpec, type TestCaseVersion, type TestCase } from "@/lib/api/cases";

const DEFAULT_SPEC: TestCaseVersionSpec = {
  kind: "ui",
  preconditions: [],
  steps: [],
  evidence: { screenshots: "onFail", video: "onFail", trace: "onFail" },
};

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = typeof params.caseId === "string" ? params.caseId : "";

  const caseQuery = useTestCase(caseId);
  const versionsQuery = useCaseVersions(caseId);
  const testCase = caseQuery.data;

  const domainsQuery = useDomains(testCase?.projectId);
  const domain =
    testCase?.domainId && domainsQuery.data?.data
      ? domainsQuery.data.data.find((d) => d.id === testCase.domainId)
      : undefined;

  // Local editor state — initialized from latestVersion, can be overridden by version history selection
  const [editorSpec, setEditorSpec] = React.useState<TestCaseVersionSpec>(DEFAULT_SPEC);
  const [viewingVersionId, setViewingVersionId] = React.useState<string | undefined>(undefined);
  const [changeNote, setChangeNote] = React.useState("");
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);

  const createVersionMutation = useCreateCaseVersion();

  // Once data loads, initialize editor with latest version
  React.useEffect(() => {
    const latest = testCase?.latestVersion;
    if (latest?.spec) {
      setEditorSpec(latest.spec);
      setViewingVersionId(latest.id);
    }
  }, [testCase?.latestVersion]);

  function handleSelectVersion(v: TestCaseVersion) {
    setEditorSpec(v.spec);
    setViewingVersionId(v.id);
  }

  async function handleSaveVersion() {
    if (!caseId) return;
    setSaveSuccess(false);
    await createVersionMutation.mutateAsync({
      caseId,
      body: {
        spec: editorSpec,
        changeNote: changeNote.trim() || undefined,
      },
    });
    setChangeNote("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  }

  // ── Loading ─────────────────────────────────────────────────────────────

  if (caseQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="h-64 w-full animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  if (caseQuery.isError || !testCase) {
    return (
      <div className="space-y-4">
        <Link
          href="/test-cases"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Test Cases
        </Link>
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            Failed to load test case. Please go back and try again.
          </p>
        </div>
      </div>
    );
  }

  const versions = versionsQuery.data?.data ?? [];
  const tags = testCase.tags ?? [];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/test-cases"
        className="inline-block text-sm text-slate-500 hover:text-slate-900"
      >
        ← Test Cases
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">
            {testCase.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <CaseStatusBadge status={testCase.status} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEdit(true)}
            className="ml-auto"
          >
            Edit Details
          </Button>
        </div>

        {testCase.objective ? (
          <p className="text-sm text-slate-600">{testCase.objective}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {domain ? <DomainChip domain={domain} size="sm" /> : null}
          {tags.map((tag) => (
            <Badge key={tag} variant="default" className="text-xs">
              {tag}
            </Badge>
          ))}
          <span className="text-xs text-slate-400">
            Created {new Date(testCase.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* ── Main panel ── */}
        <div className="flex flex-col gap-6">
          {/* Step editor */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <StepEditor
              spec={editorSpec}
              onChange={setEditorSpec}
              readOnly={testCase.status === "archived"}
            />
          </div>

          {/* Save as new version */}
          {testCase.status !== "archived" && (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-slate-700">
                  Save as New Version
                </h3>
                <p className="text-xs text-slate-400">
                  Saving creates a new immutable version. Previous versions are
                  preserved.
                </p>

                {saveSuccess && (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <p className="text-sm font-medium text-emerald-700">
                      ✓ Version saved successfully.
                    </p>
                  </div>
                )}

                {createVersionMutation.isError && (
                  <p className="text-sm font-medium text-red-600">
                    {(
                      createVersionMutation.error as { message?: string }
                    ).message ?? "Failed to save version."}
                  </p>
                )}

                <Input
                  value={changeNote}
                  onChange={(e) => setChangeNote(e.target.value)}
                  placeholder="Describe what changed…"
                />

                <div>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleSaveVersion}
                    disabled={createVersionMutation.isPending}
                  >
                    {createVersionMutation.isPending
                      ? "Saving…"
                      : "Save Version"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right panel: Version history ── */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-slate-700">
            Version History
          </h2>
          {versionsQuery.isLoading ? (
            <div className="flex flex-col gap-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : (
            <VersionHistory
              versions={versions}
              currentVersionId={viewingVersionId}
              onSelect={handleSelectVersion}
            />
          )}
        </div>
      </div>

      {/* Edit dialog */}
      {showEdit && (
        <EditCaseDialog
          open={true}
          onClose={() => setShowEdit(false)}
          testCase={testCase as TestCase}
        />
      )}
    </div>
  );
}
