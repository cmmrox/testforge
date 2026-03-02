"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ArchiveConfirmDialog } from "@/components/projects/archive-confirm-dialog";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { type ProjectDetail } from "@/lib/api/projects";
import { useProjects } from "@/lib/hooks/useProjects";

function ProjectsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-lg bg-slate-100"
        />
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const query = useProjects();

  const [showCreate, setShowCreate] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ProjectDetail | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<ProjectDetail | null>(null);

  const allProjects = query.data?.data ?? [];
  const filtered = showAll
    ? allProjects
    : allProjects.filter((p) => !p.archived);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          + New Project
        </Button>
      </div>

      {/* Filter toggle */}
      <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 p-1 w-fit">
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
            !showAll
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
            showAll
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All
        </button>
      </div>

      {/* Content */}
      {query.isLoading ? (
        <ProjectsSkeleton />
      ) : query.isError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">Failed to load projects</p>
          <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs text-red-800">
            {JSON.stringify(query.error, null, 2)}
          </pre>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-600">
            {showAll
              ? "No projects yet."
              : "No active projects."}
          </p>
          {!showAll && (
            <p className="mt-1 text-sm text-slate-500">
              Create your first project or{" "}
              <button
                type="button"
                className="underline hover:text-slate-900"
                onClick={() => setShowAll(true)}
              >
                view all
              </button>
              .
            </p>
          )}
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => setShowCreate(true)}
          >
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => router.push(`/projects/${project.id}`)}
              onEdit={() => setEditTarget(project)}
              onArchive={() => setArchiveTarget(project)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateProjectDialog open={showCreate} onClose={() => setShowCreate(false)} />

      {editTarget ? (
        <EditProjectDialog
          open={true}
          onClose={() => setEditTarget(null)}
          project={editTarget}
        />
      ) : null}

      {archiveTarget ? (
        <ArchiveConfirmDialog
          open={true}
          onClose={() => setArchiveTarget(null)}
          project={archiveTarget}
        />
      ) : null}
    </div>
  );
}
