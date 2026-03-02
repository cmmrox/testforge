"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSelectedProject } from "@/lib/context/project-context";
import { useDomains } from "@/lib/hooks/useDomains";
import type { Domain } from "@/lib/api/domains";
import { DomainDot } from "@/components/domains/domain-chip";
import { CreateDomainDialog } from "@/components/domains/create-domain-dialog";
import { EditDomainDialog } from "@/components/domains/edit-domain-dialog";
import { DeleteDomainConfirmDialog } from "@/components/domains/delete-confirm-dialog";

export default function DomainsPage() {
  const { selectedProject } = useSelectedProject();
  const domainsQuery = useDomains(selectedProject?.id);

  const [showCreate, setShowCreate] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Domain | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Domain | null>(null);

  if (!selectedProject) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Domains</h1>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-slate-600">
              Select a project to manage its domains.
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

  const domains = domainsQuery.data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          {selectedProject.name} / Domains
        </h1>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          New Domain
        </Button>
      </div>

      {/* Loading skeleton */}
      {domainsQuery.isLoading && (
        <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-3 w-3 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
              <div className="ml-auto h-4 w-24 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {domainsQuery.isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            Failed to load domains. Please try again.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!domainsQuery.isLoading && !domainsQuery.isError && domains.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-slate-600">
              No domains yet. Domains help you organise test plans and cases by
              feature area.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Domain list */}
      {domains.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Domain
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created
                </th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {domains.map((domain) => (
                <tr key={domain.id} className="group hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <DomainDot domain={domain} />
                      <span className="font-medium text-slate-900">
                        {domain.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(domain.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditTarget(domain)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteTarget(domain)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialogs */}
      <CreateDomainDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        projectId={selectedProject.id}
      />

      {editTarget && (
        <EditDomainDialog
          open={true}
          onClose={() => setEditTarget(null)}
          domain={editTarget}
        />
      )}

      {deleteTarget && (
        <DeleteDomainConfirmDialog
          open={true}
          onClose={() => setDeleteTarget(null)}
          domain={deleteTarget}
        />
      )}
    </div>
  );
}
