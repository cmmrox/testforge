"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAuditLogs } from "@/lib/hooks/useAudit";

export default function AuditPage() {
  const [entityType, setEntityType] = React.useState<string>("");
  const [entityId, setEntityId] = React.useState<string>("");

  const query = useAuditLogs({
    entityType: entityType || undefined,
    entityId: entityId || undefined,
    limit: 20,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-600">Track key actions across the system.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Entity Type</label>
          <Select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
            <option value="">All</option>
            <option value="project">project</option>
            <option value="environment">environment</option>
            <option value="domain">domain</option>
            <option value="testPlan">testPlan</option>
            <option value="testCase">testCase</option>
            <option value="run">run</option>
          </Select>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Entity ID</label>
          <Input
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            placeholder="uuid (optional)"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              Failed to load audit logs.
            </div>
          ) : (query.data?.data ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">No audit entries found.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-3">At</th>
                    <th className="py-2 pr-3">Action</th>
                    <th className="py-2 pr-3">Entity</th>
                    <th className="py-2 pr-3">Entity ID</th>
                    <th className="py-2 pr-3">Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {(query.data?.data ?? []).map((e) => (
                    <tr key={e.id} className="border-b border-slate-100">
                      <td className="py-2 pr-3 text-xs text-slate-500">
                        {new Date(e.at).toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 font-medium text-slate-900">{e.action}</td>
                      <td className="py-2 pr-3 text-slate-700">{e.entityType}</td>
                      <td className="py-2 pr-3 font-mono text-xs text-slate-600">{e.entityId ?? "—"}</td>
                      <td className="py-2 pr-3 font-mono text-xs text-slate-600">
                        {e.actorUserId ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
