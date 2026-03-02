"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSelectedProject } from "@/lib/context/project-context";
import { useEnvironments } from "@/lib/hooks/useEnvironments";
import type { Environment } from "@/lib/api/environments";
import { EnvironmentCard } from "@/components/environments/environment-card";
import { CreateEnvironmentDialog } from "@/components/environments/create-environment-dialog";
import { EditEnvironmentDialog } from "@/components/environments/edit-environment-dialog";
import { DeleteConfirmDialog } from "@/components/environments/delete-confirm-dialog";

export default function EnvironmentsPage() {
  const { selectedProject } = useSelectedProject();
  const envQuery = useEnvironments(selectedProject?.id);

  const [showCreate, setShowCreate] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Environment | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Environment | null>(null);

  if (!selectedProject) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Environments</h1>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-slate-600">
              Select a project from the topbar to manage its environments.
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

  const environments = envQuery.data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          {selectedProject.name} / Environments
        </h1>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          Add Environment
        </Button>
      </div>

      {/* Loading skeleton */}
      {envQuery.isLoading && (
        <div className="flex flex-col gap-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-28 w-full animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {envQuery.isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            Failed to load environments. Please try again.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!envQuery.isLoading && !envQuery.isError && environments.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-slate-600">
              No environments yet. Add the first one.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Environment list */}
      {environments.length > 0 && (
        <div className="flex flex-col gap-3">
          {environments.map((env) => (
            <EnvironmentCard
              key={env.id}
              environment={env}
              onEdit={() => setEditTarget(env)}
              onDelete={() => setDeleteTarget(env)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateEnvironmentDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        projectId={selectedProject.id}
      />

      {editTarget && (
        <EditEnvironmentDialog
          open={true}
          onClose={() => setEditTarget(null)}
          environment={editTarget}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          open={true}
          onClose={() => setDeleteTarget(null)}
          environment={deleteTarget}
        />
      )}
    </div>
  );
}
