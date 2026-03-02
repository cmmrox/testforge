"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type ProjectDetail } from "@/lib/api/projects";

type Props = {
  project: ProjectDetail;
  onEdit: () => void;
  onArchive: () => void;
  onClick: () => void;
};

function lastRunBadge(lastRun?: ProjectDetail["lastRun"]) {
  if (!lastRun) {
    return <Badge variant="default">No runs</Badge>;
  }
  switch (lastRun.status) {
    case "passed":
      return <Badge variant="success">Passed</Badge>;
    case "failed":
      return <Badge variant="danger">Failed</Badge>;
    case "running":
    case "queued":
      return <Badge variant="warning">{lastRun.status}</Badge>;
    default:
      return <Badge variant="default">{lastRun.status}</Badge>;
  }
}

export function ProjectCard({ project, onEdit, onArchive, onClick }: Props) {
  return (
    <Card className="flex flex-col gap-0">
      <CardContent className="flex flex-col gap-3 p-4">
        {/* Name */}
        <div>
          <button
            type="button"
            onClick={onClick}
            className="text-left text-base font-semibold text-slate-900 hover:text-slate-600 focus-visible:outline-none focus-visible:underline"
          >
            {project.name}
          </button>

          {project.description ? (
            <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
              {project.description}
            </p>
          ) : null}
        </div>

        {/* Tags */}
        {project.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <Badge key={tag} className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Stats row */}
        <div className="text-xs text-slate-500">
          {project.environmentCount ?? 0} envs ·{" "}
          {project.testPlanCount ?? 0} plans ·{" "}
          {project.testCaseCount ?? 0} cases
        </div>

        {/* Last run */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Last run:</span>
          {lastRunBadge(project.lastRun)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {project.archived ? (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              Archived
            </span>
          ) : (
            <>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
