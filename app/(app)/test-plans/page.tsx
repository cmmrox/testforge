import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPlansPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Test Plans</h1>
      <Card>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Placeholder. Generation UI will be implemented in Stage 8.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
