import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Stage 2 shell is in place. Next: wire pages to the mock API.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">—</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">—</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fail rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">—</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
