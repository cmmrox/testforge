"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DomainChip } from "@/components/domains/domain-chip";
import { PlanStatusBadge } from "@/components/plans/plan-status-badge";
import { RunStatusBadge } from "@/components/runs/run-status-badge";
import { useSelectedProject } from "@/lib/context/project-context";
import { useProject } from "@/lib/hooks/useProjects";
import { useDomains } from "@/lib/hooks/useDomains";
import { useTestPlans } from "@/lib/hooks/useTestPlans";
import { useTestCases } from "@/lib/hooks/useTestCases";
import { useRuns } from "@/lib/hooks/useRuns";

function StatCard({ label, value }: { label: string; value: string }) {
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

export default function DashboardPage() {
  const { selectedProject } = useSelectedProject();

  const projectQuery = useProject(selectedProject?.id ?? "");
  const domainsQuery = useDomains(selectedProject?.id);
  const plansQuery = useTestPlans(selectedProject?.id);
  const casesQuery = useTestCases(selectedProject?.id, { status: "active" });
  const runsQuery = useRuns(selectedProject?.id);

  if (!selectedProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">Select a project from the topbar to view dashboard stats.</p>
        </CardContent>
      </Card>
    );
  }

  const project = projectQuery.data;
  const lastRun = project?.lastRun;

  const totalRuns = runsQuery.data?.data?.length ?? 0;
  const failedRuns = (runsQuery.data?.data ?? []).filter((r) => r.status === "failed").length;
  const failRate = totalRuns > 0 ? Math.round((failedRuns / totalRuns) * 100) : 0;

  // Lightweight domain coverage approximation (until we have domain mapping from run items -> cases)
  const domains = domainsQuery.data?.data ?? [];
  const domainRows = domains.map((d) => ({
    domain: d,
    passRate: totalRuns === 0 ? 0 : 100 - failRate,
    lastStatus: lastRun?.status ?? "—",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{selectedProject.name} / Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">High-level project health and coverage.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Environments" value={String(project?.environmentCount ?? "—")} />
        <StatCard
          label="Test Plans"
          value={String(project?.testPlanCount ?? (plansQuery.data?.data?.length ?? "—"))}
        />
        <StatCard
          label="Test Cases"
          value={String(project?.testCaseCount ?? (casesQuery.data?.data?.length ?? "—"))}
        />
        <StatCard label="Fail rate" value={totalRuns ? `${failRate}%` : "—"} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last Run</CardTitle>
        </CardHeader>
        <CardContent>
          {lastRun ? (
            <div className="flex items-center gap-3">
              <RunStatusBadge
                status={
                  (lastRun.status as
                    | "queued"
                    | "running"
                    | "passed"
                    | "failed"
                    | "canceled")
                }
              />
              {lastRun.finishedAt ? (
                <span className="text-sm text-slate-500">Finished {new Date(lastRun.finishedAt).toLocaleString()}</span>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No runs yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domain Coverage (approx.)</CardTitle>
        </CardHeader>
        <CardContent>
          {domainsQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          ) : domainRows.length === 0 ? (
            <p className="text-sm text-slate-500">No domains yet. Add some under Domains.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-3">Domain</th>
                    <th className="py-2 pr-3">Pass rate</th>
                    <th className="py-2 pr-3">Last status</th>
                  </tr>
                </thead>
                <tbody>
                  {domainRows.map((r) => (
                    <tr key={r.domain.id} className="border-b border-slate-100">
                      <td className="py-2 pr-3">
                        <DomainChip domain={r.domain} size="sm" />
                      </td>
                      <td className="py-2 pr-3">
                        <Badge variant={r.passRate >= 90 ? "success" : r.passRate >= 70 ? "warning" : "danger"}>
                          {r.passRate}%
                        </Badge>
                      </td>
                      <td className="py-2 pr-3">
                        {typeof r.lastStatus === "string" && r.lastStatus !== "—" ? (
                          <RunStatusBadge
                            status={
                              (r.lastStatus as
                                | "queued"
                                | "running"
                                | "passed"
                                | "failed"
                                | "canceled")
                            }
                          />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">
            Note: Domain pass rate is an approximation until we map run items → test cases → domains.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plans snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          {plansQuery.isLoading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(plansQuery.data?.data ?? []).slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <div className="text-sm font-medium text-slate-900">{p.title}</div>
                  <PlanStatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
