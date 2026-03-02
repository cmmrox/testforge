import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
      <Card>
        <CardHeader>
          <CardTitle>Project list</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Placeholder. Will be wired to <code>GET /projects</code> in Stage 5.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
