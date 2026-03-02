"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RunStatusBadge } from "@/components/runs/run-status-badge";
import { type TestRun } from "@/lib/api/runs";

export function RunCard({ run, onClick }: { run: TestRun; onClick: () => void }) {
  return (
    <Card className="hover:border-slate-300">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Run {run.id.slice(0, 8)}…</CardTitle>
          <RunStatusBadge status={run.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-slate-600">
          Env: <span className="font-mono text-xs">{run.environmentId ?? "—"}</span>
        </div>
        <div className="text-xs text-slate-400">
          Created {new Date(run.createdAt).toLocaleString()}
        </div>
        <div className="pt-2">
          <Button size="sm" variant="secondary" onClick={onClick}>
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
