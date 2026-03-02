"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RunStatusBadge } from "@/components/runs/run-status-badge";
import { RunItemsTable } from "@/components/runs/run-items-table";
import { ArtifactsList } from "@/components/runs/artifacts-list";
import { useRun, useRunArtifacts, useRunItems } from "@/lib/hooks/useRuns";

export default function RunDetailPage() {
  const params = useParams();
  const runId = params.runId as string;

  const runQuery = useRun(runId);
  const itemsQuery = useRunItems(runId);
  const artifactsQuery = useRunArtifacts(runId);

  if (runQuery.isLoading) {
    return <div className="h-24 w-full animate-pulse rounded-lg bg-slate-100" />;
  }

  if (runQuery.isError || !runQuery.data) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">Failed to load run</p>
        <Link href="/runs" className="mt-2 text-sm underline">
          ← Back to Runs
        </Link>
      </div>
    );
  }

  const run = runQuery.data;

  return (
    <div className="space-y-6">
      <Link href="/runs" className="inline-flex text-sm text-slate-500 hover:text-slate-900">
        ← Runs
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">Run {run.id}</h1>
            <RunStatusBadge status={run.status} />
          </div>
          <div className="text-sm text-slate-600">
            Environment: <span className="font-mono text-xs">{run.environmentId ?? "—"}</span>
          </div>
          <div className="text-xs text-slate-400">Created {new Date(run.createdAt).toLocaleString()}</div>
        </div>

        {run.status === "failed" ? <Badge variant="danger">Needs attention</Badge> : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-slate-700">
            Status: <RunStatusBadge status={run.status} />
          </div>
          {run.durationMs != null ? (
            <div className="text-sm text-slate-700">Duration: {run.durationMs}ms</div>
          ) : null}
          {run.finishedAt ? (
            <div className="text-sm text-slate-700">Finished: {new Date(run.finishedAt).toLocaleString()}</div>
          ) : null}
        </CardContent>
      </Card>

      {itemsQuery.data ? <RunItemsTable items={itemsQuery.data.data} /> : null}
      {artifactsQuery.data ? <ArtifactsList artifacts={artifactsQuery.data.data} /> : null}
    </div>
  );
}
