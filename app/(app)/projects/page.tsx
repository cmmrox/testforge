"use client";

import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listProjects } from "@/lib/api/projects";

export default function ProjectsPage() {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: () => listProjects({ limit: 20 }),
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
        <p className="mt-1 text-sm text-slate-600">Loaded from the mock API.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project list</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className="text-sm text-slate-600">Loading…</div>
          ) : query.isError ? (
            <div className="space-y-2">
              <div className="text-sm font-medium text-red-700">Failed to load projects</div>
              <pre className="overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">
                {JSON.stringify(query.error, null, 2)}
              </pre>
            </div>
          ) : (
            <ul className="space-y-2">
              {(query.data?.data ?? []).map((p) => (
                <li key={p.id} className="rounded-md border border-slate-200 bg-white p-3">
                  <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                  {p.description ? (
                    <div className="mt-1 text-sm text-slate-600">{p.description}</div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
