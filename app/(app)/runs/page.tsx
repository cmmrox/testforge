"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { RunCard } from "@/components/runs/run-card";
import { TriggerRunDialog } from "@/components/runs/trigger-run-dialog";
import { useSelectedProject } from "@/lib/context/project-context";
import { useRuns } from "@/lib/hooks/useRuns";
import { useEnvironments } from "@/lib/hooks/useEnvironments";

export default function RunsPage() {
  const router = useRouter();
  const { selectedProject } = useSelectedProject();

  const [showTrigger, setShowTrigger] = React.useState(false);
  const [status, setStatus] = React.useState<string>("");
  const [environmentId, setEnvironmentId] = React.useState<string>("");

  const envQuery = useEnvironments(selectedProject?.id);
  const runsQuery = useRuns(selectedProject?.id, {
    status: status || undefined,
    environmentId: environmentId || undefined,
  });

  React.useEffect(() => {
    if (!selectedProject) return;
    const first = envQuery.data?.data?.[0];
    if (first && !environmentId) setEnvironmentId(first.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, envQuery.data]);

  if (!selectedProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Select a project from the topbar to view and trigger runs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {selectedProject.name} / Runs
          </h1>
          <p className="mt-1 text-sm text-slate-600">Queue history and run reports.</p>
        </div>
        <Button onClick={() => setShowTrigger(true)}>Trigger Run</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="queued">Queued</option>
            <option value="running">Running</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="canceled">Canceled</option>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Environment</label>
          <Select value={environmentId} onChange={(e) => setEnvironmentId(e.target.value)}>
            <option value="">All</option>
            {(envQuery.data?.data ?? []).map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {runsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : runsQuery.isError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Failed to load runs.
        </div>
      ) : (runsQuery.data?.data ?? []).length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No runs yet. Click <span className="font-medium">Trigger Run</span> to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {(runsQuery.data?.data ?? []).map((r) => (
            <RunCard key={r.id} run={r} onClick={() => router.push(`/runs/${r.id}`)} />
          ))}
        </div>
      )}

      <TriggerRunDialog
        open={showTrigger}
        onClose={() => setShowTrigger(false)}
        projectId={selectedProject.id}
      />
    </div>
  );
}
