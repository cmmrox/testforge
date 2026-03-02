"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DomainChip } from "@/components/domains/domain-chip";
import { PlanStatusBadge } from "@/components/plans/plan-status-badge";
import { EditPlanDialog } from "@/components/plans/edit-plan-dialog";
import { useTestPlan, usePlanItems, useApproveTestPlan } from "@/lib/hooks/useTestPlans";
import { useDomains } from "@/lib/hooks/useDomains";
import { type TestPlan } from "@/lib/api/plans";

export default function PlanDetailPage() {
  const params = useParams();
  const planId = typeof params.planId === "string" ? params.planId : "";

  const planQuery = useTestPlan(planId);
  const itemsQuery = usePlanItems(planId);
  const plan = planQuery.data;

  const domainsQuery = useDomains(plan?.projectId);
  const domain =
    plan?.domainId && domainsQuery.data?.data
      ? domainsQuery.data.data.find((d) => d.id === plan.domainId)
      : undefined;

  const approveMutation = useApproveTestPlan();
  const [showEdit, setShowEdit] = React.useState(false);

  async function handleApprove() {
    if (!plan) return;
    await approveMutation.mutateAsync({ id: plan.id, projectId: plan.projectId });
  }

  if (planQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-slate-100" />
        <div className="h-10 w-64 animate-pulse rounded bg-slate-200" />
        <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  if (planQuery.isError || !plan) {
    return (
      <div className="space-y-4">
        <Link
          href="/test-plans"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Test Plans
        </Link>
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            Failed to load plan. Please go back and try again.
          </p>
        </div>
      </div>
    );
  }

  const items = itemsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/test-plans"
        className="inline-block text-sm text-slate-500 hover:text-slate-900"
      >
        ← Test Plans
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">{plan.title}</h1>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <PlanStatusBadge status={plan.status} />
            <Badge variant="default">
              {plan.generatedBy === "agent" ? "Agent" : "Manual"}
            </Badge>
          </div>
        </div>

        {plan.description ? (
          <p className="text-sm text-slate-600">{plan.description}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          {domain ? <DomainChip domain={domain} size="sm" /> : null}
          <span className="text-xs text-slate-400">
            Created {new Date(plan.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {plan.status === "draft" && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleApprove}
            disabled={approveMutation.isPending}
          >
            {approveMutation.isPending ? "Approving…" : "Approve Plan"}
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>
          Edit
        </Button>
      </div>

      {approveMutation.isError && (
        <p className="text-sm font-medium text-red-600">
          {(approveMutation.error as { message?: string }).message ??
            "Failed to approve plan."}
        </p>
      )}

      {/* Attached Test Cases */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-slate-900">
          Attached Test Cases{" "}
          <span className="text-sm font-normal text-slate-400">
            ({itemsQuery.isLoading ? "…" : items.length})
          </span>
        </h2>

        {itemsQuery.isLoading && (
          <div className="flex flex-col gap-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded bg-slate-100"
              />
            ))}
          </div>
        )}

        {itemsQuery.isError && (
          <p className="text-sm text-red-600">Failed to load attached cases.</p>
        )}

        {!itemsQuery.isLoading && !itemsQuery.isError && items.length === 0 && (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-sm text-slate-500">
                No test cases attached to this plan yet.
              </p>
            </CardContent>
          </Card>
        )}

        {items.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Test Case ID
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Latest Version
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.testCaseId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">
                      {item.testCaseId}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {item.latestVersionId ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit dialog */}
      {showEdit && (
        <EditPlanDialog
          open={true}
          onClose={() => setShowEdit(false)}
          plan={plan as TestPlan}
        />
      )}
    </div>
  );
}
