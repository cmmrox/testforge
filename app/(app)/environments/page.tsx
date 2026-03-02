import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EnvironmentsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Environments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Environment list</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Placeholder. Will be wired to environments endpoints in Stage 6.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
