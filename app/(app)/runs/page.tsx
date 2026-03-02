import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RunsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Runs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Run history</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Placeholder. Run trigger + report will be implemented in Stage 10.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
