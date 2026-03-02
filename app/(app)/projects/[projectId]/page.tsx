"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { useProject } from "@/lib/hooks/useProjects";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}

function lastRunVariant(status: string) {
  switch (status) {
    case "passed":
      return "success" as const;
    case "failed":
      return "danger" as const;
    case "running":
    case "queued":
      return "warning" as const;
    default:
      return "default" as const;
  }
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const query = useProject(projectId);
  const [showEdit, setShowEdit] = React.useState(false);

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">Failed to load project</p>
        <Link href="/projects" className="mt-2 text-sm text-slate-600 underline hover:text-slate-900">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const project = query.data;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        ← Projects
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">{project.name}</h1>
            {project.archived ? (
              <Badge>Archived</Badge>
            ) : null}
          </div>
          {project.description ? (
            <p className="text-sm text-slate-600">{project.description}</p>
          ) : null}
          {project.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1 pt-1">
              {project.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}
          <p className="text-xs text-slate-400">
            Created {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>

        {!project.archived ? (
          <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>
            Edit Project
          </Button>
        ) : null}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Environments" value={project.environmentCount ?? 0} />
        <StatCard label="Test Plans" value={project.testPlanCount ?? 0} />
        <StatCard label="Test Cases" value={project.testCaseCount ?? 0} />
      </div>

      {/* Last run */}
      <Card>
        <CardHeader>
          <CardTitle>Last Run</CardTitle>
        </CardHeader>
        <CardContent>
          {project.lastRun ? (
            <div className="flex items-center gap-3">
              <Badge variant={lastRunVariant(project.lastRun.status)}>
                {project.lastRun.status}
              </Badge>
              {project.lastRun.finishedAt ? (
                <span className="text-sm text-slate-500">
                  Finished {new Date(project.lastRun.finishedAt).toLocaleString()}
                </span>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No runs yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      {showEdit ? (
        <EditProjectDialog
          open={showEdit}
          onClose={() => setShowEdit(false)}
          project={project}
        />
      ) : null}
    </div>
  );
}
