import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { type TestRunItem } from "@/lib/api/runs";

function itemVariant(status: TestRunItem["status"]) {
  switch (status) {
    case "passed":
      return "success" as const;
    case "failed":
      return "danger" as const;
    case "running":
    case "queued":
      return "warning" as const;
    case "skipped":
      return "default" as const;
  }
}

export function RunItemsTable({ items }: { items: TestRunItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Items</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No run items.</p>
        ) : (
          <div className="space-y-2">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-start justify-between gap-4 rounded-md border border-slate-200 bg-white p-3"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-900">
                    Version: <span className="font-mono text-xs">{it.testCaseVersionId}</span>
                  </div>
                  {it.failureSummary ? (
                    <div className="text-sm text-red-700">{it.failureSummary}</div>
                  ) : null}
                  {it.durationMs != null ? (
                    <div className="text-xs text-slate-400">{it.durationMs}ms</div>
                  ) : null}
                </div>

                <Badge variant={itemVariant(it.status)}>{it.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
