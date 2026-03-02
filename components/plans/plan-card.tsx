"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DomainChip } from "@/components/domains/domain-chip";
import { PlanStatusBadge } from "@/components/plans/plan-status-badge";
import { useDomains } from "@/lib/hooks/useDomains";
import { type TestPlan } from "@/lib/api/plans";

type Props = {
  plan: TestPlan;
  onEdit: () => void;
  onArchive: () => void;
  onClick: () => void;
};

export function PlanCard({ plan, onEdit, onArchive, onClick }: Props) {
  const domainsQuery = useDomains(plan.projectId);
  const domain =
    plan.domainId && domainsQuery.data?.data
      ? domainsQuery.data.data.find((d) => d.id === plan.domainId)
      : undefined;

  return (
    <Card className="flex flex-col gap-0">
      <CardContent className="flex flex-col gap-3 p-4">
        {/* Title */}
        <div>
          <button
            type="button"
            onClick={onClick}
            className="text-left text-base font-semibold text-slate-900 hover:text-slate-600 focus-visible:outline-none focus-visible:underline"
          >
            {plan.title}
          </button>
          {plan.description ? (
            <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
              {plan.description}
            </p>
          ) : null}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          {domain ? <DomainChip domain={domain} size="sm" /> : null}
          <PlanStatusBadge status={plan.status} />
          <Badge variant="default" className="text-xs">
            {plan.generatedBy === "agent" ? "Agent" : "Manual"}
          </Badge>
        </div>

        {/* Created date */}
        <p className="text-xs text-slate-400">
          Created {new Date(plan.createdAt).toLocaleDateString()}
        </p>

        {/* Actions */}
        {plan.status !== "archived" && (
          <div className="flex items-center gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              Edit
            </Button>
            {plan.status !== "approved" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onArchive}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Archive
              </Button>
            )}
            {plan.status === "approved" && (
              <span className="text-xs text-slate-400">🔒 Approved</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
