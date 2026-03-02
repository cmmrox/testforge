"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CaseCard } from "@/components/cases/case-card";
import { CreateCaseDialog } from "@/components/cases/create-case-dialog";
import { EditCaseDialog } from "@/components/cases/edit-case-dialog";
import { ArchiveCaseConfirmDialog } from "@/components/cases/archive-confirm-dialog";
import { useSelectedProject } from "@/lib/context/project-context";
import { useDomains } from "@/lib/hooks/useDomains";
import { useTestCases } from "@/lib/hooks/useTestCases";
import { type TestCase } from "@/lib/api/cases";

export default function TestCasesPage() {
  const { selectedProject } = useSelectedProject();
  const router = useRouter();

  const [searchInput, setSearchInput] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [domainFilter, setDomainFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("active");

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const domainsQuery = useDomains(selectedProject?.id);
  const domains = domainsQuery.data?.data ?? [];

  const casesQuery = useTestCases(selectedProject?.id, {
    domainId: domainFilter || undefined,
    status: statusFilter || undefined,
    q: debouncedQ || undefined,
  });
  const cases = casesQuery.data?.data ?? [];

  const [showCreate, setShowCreate] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<TestCase | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<TestCase | null>(
    null
  );

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-slate-500">Select a project to view test cases.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          {selectedProject.name} / Test Cases
        </h1>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreate(true)}
        >
          + New Case
        </Button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search cases…"
          className="max-w-xs"
        />

        <Select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="w-44"
        >
          <option value="">All domains</option>
          {domains.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>

        <div className="flex items-center rounded-md border border-slate-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1.5 text-sm transition-colors ${
              statusFilter === "active"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("")}
            className={`px-3 py-1.5 text-sm transition-colors ${
              statusFilter === ""
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {casesQuery.isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {casesQuery.isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            Failed to load test cases. Please try again.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!casesQuery.isLoading && !casesQuery.isError && cases.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 py-16">
          <p className="text-slate-500">No test cases found.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCreate(true)}
          >
            Create your first case
          </Button>
        </div>
      )}

      {/* Cases grid */}
      {!casesQuery.isLoading && cases.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((tc) => (
            <CaseCard
              key={tc.id}
              testCase={tc}
              onEdit={() => setEditTarget(tc)}
              onArchive={() => setArchiveTarget(tc)}
              onClick={() => router.push(`/test-cases/${tc.id}`)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      {showCreate && (
        <CreateCaseDialog
          open={true}
          onClose={() => setShowCreate(false)}
          projectId={selectedProject.id}
        />
      )}

      {editTarget && (
        <EditCaseDialog
          open={true}
          onClose={() => setEditTarget(null)}
          testCase={editTarget}
        />
      )}

      {archiveTarget && (
        <ArchiveCaseConfirmDialog
          open={true}
          onClose={() => setArchiveTarget(null)}
          testCase={archiveTarget}
        />
      )}
    </div>
  );
}
