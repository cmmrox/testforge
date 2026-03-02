"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSelectedProject } from "@/lib/context/project-context";
import { useTestPlans } from "@/lib/hooks/useTestPlans";
import { type TestPlan } from "@/lib/api/plans";
import { PlanCard } from "@/components/plans/plan-card";
import { CreatePlanDialog } from "@/components/plans/create-plan-dialog";
import { EditPlanDialog } from "@/components/plans/edit-plan-dialog";
import { ArchivePlanConfirmDialog } from "@/components/plans/archive-confirm-dialog";
import { GeneratePlanDialog } from "@/components/plans/generate-plan-dialog";

type FilterTab = "all" | "draft" | "approved";

export default function TestPlansPage() {
  const router = useRouter();
  const { selectedProject } = useSelectedProject();
  const plansQuery = useTestPlans(selectedProject?.id);

  const [tab, setTab] = React.useState<FilterTab>("all");
  const [showCreate, setShowCreate] = React.useState(false);
  const [showGenerate, setShowGenerate] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<TestPlan | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<TestPlan | null>(
    null
  );

  if (!selectedProject) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Test Plans</h1>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-slate-600">
              Select a project to manage its test plans.
            </p>
            <Link
              href="/projects"
              className="mt-3 inline-block text-sm text-slate-700 underline hover:text-slate-900"
            >
              Browse Projects →
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allPlans = plansQuery.data?.data ?? [];

  const filteredPlans = allPlans.filter((p) => {
    if (tab === "all") return true;
    return p.status === tab;
  });

  const tabs: { label: string; value: FilterTab }[] = [
    { label: "All", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Approved", value: "approved" },
  ];

  function emptyMessage() {
    if (tab === "draft") {
      return "No draft plans. Use 'Generate with Agent' to create your first plan.";
    }
    if (tab === "approved") {
      return "No approved plans yet.";
    }
    return "No test plans yet. Create one manually or use the Agent.";
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          {selectedProject.name} / Test Plans
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCreate(true)}
          >
            New Plan
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowGenerate(true)}
          >
            Generate with Agent ✨
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={[
              "px-3 py-2 text-sm font-medium transition-colors",
              tab === t.value
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {plansQuery.isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {plansQuery.isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            Failed to load test plans. Please try again.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!plansQuery.isLoading &&
        !plansQuery.isError &&
        filteredPlans.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm text-slate-600">{emptyMessage()}</p>
            </CardContent>
          </Card>
        )}

      {/* Plan grid */}
      {filteredPlans.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onClick={() => router.push(`/test-plans/${plan.id}`)}
              onEdit={() => setEditTarget(plan)}
              onArchive={() => setArchiveTarget(plan)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreatePlanDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        projectId={selectedProject.id}
      />

      <GeneratePlanDialog
        open={showGenerate}
        onClose={() => setShowGenerate(false)}
        projectId={selectedProject.id}
      />

      {editTarget && (
        <EditPlanDialog
          open={true}
          onClose={() => setEditTarget(null)}
          plan={editTarget}
        />
      )}

      {archiveTarget && (
        <ArchivePlanConfirmDialog
          open={true}
          onClose={() => setArchiveTarget(null)}
          plan={archiveTarget}
        />
      )}
    </div>
  );
}
