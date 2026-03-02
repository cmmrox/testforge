"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useSelectedProject } from "@/lib/context/project-context";

export default function SettingsPage() {
  const me = useCurrentUser();
  const { selectedProject } = useSelectedProject();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {me.isLoading ? (
            <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
          ) : me.data ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{me.data.email}</Badge>
              <Badge variant="warning">{me.data.role}</Badge>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Not signed in.</p>
          )}

          <div className="text-sm text-slate-600">
            Selected project: <span className="font-medium">{selectedProject?.name ?? "—"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Developer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <div>
            Swagger UI: {" "}
            <a className="underline" href="http://52.66.199.160:8081/docs" target="_blank" rel="noreferrer">
              http://52.66.199.160:8081/docs
            </a>
          </div>
          <div>
            OpenAPI YAML: {" "}
            <a className="underline" href="http://52.66.199.160:8081/openapi.yaml" target="_blank" rel="noreferrer">
              http://52.66.199.160:8081/openapi.yaml
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
