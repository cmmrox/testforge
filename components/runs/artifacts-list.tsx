import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { type Artifact } from "@/lib/api/artifacts";

export function ArtifactsList({ artifacts }: { artifacts: Artifact[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Artifacts</CardTitle>
      </CardHeader>
      <CardContent>
        {artifacts.length === 0 ? (
          <p className="text-sm text-slate-500">No artifacts for this run.</p>
        ) : (
          <ul className="space-y-2">
            {artifacts.map((a) => (
              <li key={a.id} className="rounded-md border border-slate-200 bg-white p-3">
                <div className="text-sm font-medium text-slate-900">{a.type}</div>
                <div className="mt-1 font-mono text-xs text-slate-600">{a.filePath}</div>
                {a.downloadUrl ? (
                  <a className="mt-2 inline-block text-sm underline" href={a.downloadUrl}>
                    Download
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
