import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestCasesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Test Cases</h1>
      <Card>
        <CardHeader>
          <CardTitle>Case library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Placeholder. No-code step editor will be implemented in Stage 9.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
