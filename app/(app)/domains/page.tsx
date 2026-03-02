import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DomainsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Domains</h1>
      <Card>
        <CardHeader>
          <CardTitle>Domains/Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Placeholder. Will be wired to domain CRUD in Stage 7.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
