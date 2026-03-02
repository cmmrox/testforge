"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CaseStatusBadge } from "@/components/cases/case-status-badge";
import { DomainChip } from "@/components/domains/domain-chip";
import { useDomains } from "@/lib/hooks/useDomains";
import { type TestCase } from "@/lib/api/cases";

type Props = {
  testCase: TestCase;
  onEdit: () => void;
  onArchive: () => void;
  onClick: () => void;
};

export function CaseCard({ testCase, onEdit, onArchive, onClick }: Props) {
  const domainsQuery = useDomains(testCase.projectId);
  const domain =
    testCase.domainId && domainsQuery.data?.data
      ? domainsQuery.data.data.find((d) => d.id === testCase.domainId)
      : undefined;

  const stepCount =
    testCase.latestVersion?.spec?.steps?.length ?? 0;

  const tags = testCase.tags ?? [];

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
            {testCase.title}
          </button>
          {testCase.objective ? (
            <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
              {testCase.objective}
            </p>
          ) : null}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="default" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          {domain ? <DomainChip domain={domain} size="sm" /> : null}
          <CaseStatusBadge status={testCase.status} />
          {testCase.latestVersion && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              v{testCase.latestVersion.versionNo}
            </span>
          )}
          {stepCount > 0 && (
            <span className="text-xs text-slate-400">
              {stepCount} {stepCount === 1 ? "step" : "steps"}
            </span>
          )}
        </div>

        {/* Created date */}
        <p className="text-xs text-slate-400">
          Created {new Date(testCase.createdAt).toLocaleDateString()}
        </p>

        {/* Actions */}
        {testCase.status !== "archived" && (
          <div className="flex items-center gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onArchive}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Archive
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
