"use client";

import * as React from "react";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { EvidencePolicyForm } from "@/components/cases/evidence-policy-form";
import { useEnvironments } from "@/lib/hooks/useEnvironments";
import { useTestPlans } from "@/lib/hooks/useTestPlans";
import { useCreateRun } from "@/lib/hooks/useRuns";
import { type ApiError } from "@/lib/api/apiFetch";
import { type EvidencePolicy, type TestRunCreateRequest } from "@/lib/api/runs";

const DEFAULT_EVIDENCE: EvidencePolicy = {
  screenshots: "onFail",
  video: "onFail",
  trace: "onFail",
};

export function TriggerRunDialog({
  open,
  onClose,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  projectId: string;
}) {
  const envQuery = useEnvironments(projectId);
  const plansQuery = useTestPlans(projectId);
  const create = useCreateRun();

  const [environmentId, setEnvironmentId] = React.useState<string>("");
  const [planId, setPlanId] = React.useState<string>("");
  const [versionIds, setVersionIds] = React.useState<string>("");
  const [retries, setRetries] = React.useState<number>(0);
  const [evidence, setEvidence] = React.useState<EvidencePolicy>(DEFAULT_EVIDENCE);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    if (!open) return;
    setError("");
    setPlanId("");
    setVersionIds("");
    setRetries(0);
    setEvidence(DEFAULT_EVIDENCE);

    const firstEnv = envQuery.data?.data?.[0];
    setEnvironmentId(firstEnv?.id ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit() {
    setError("");
    if (!environmentId) {
      setError("Please select an environment.");
      return;
    }

    const testCaseVersionIds = versionIds
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const body: TestRunCreateRequest = {
      environmentId,
      planId: planId || undefined,
      testCaseVersionIds: testCaseVersionIds.length ? testCaseVersionIds : undefined,
      retries,
      evidenceOverride: evidence,
    };

    try {
      await create.mutateAsync({ projectId, body });
      onClose();
    } catch (e) {
      const msg = (e as ApiError | undefined)?.message ?? "Failed to trigger run";
      setError(msg);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Trigger Run" maxWidth="max-w-2xl">
      <div className="space-y-4">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Environment</label>
          <Select value={environmentId} onChange={(e) => setEnvironmentId(e.target.value)}>
            <option value="">Select…</option>
            {(envQuery.data?.data ?? []).map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Plan (optional)</label>
            <Select value={planId} onChange={(e) => setPlanId(e.target.value)}>
              <option value="">None</option>
              {(plansQuery.data?.data ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Retries</label>
            <Select value={String(retries)} onChange={(e) => setRetries(Number(e.target.value))}>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Test case version IDs (optional)
          </label>
          <p className="text-xs text-slate-500">
            One per line. If provided, the run will target these versions (in addition to planId
            if selected).
          </p>
          <textarea
            className="min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            value={versionIds}
            onChange={(e) => setVersionIds(e.target.value)}
            placeholder="a1b2c3d4-...\n..."
          />
        </div>

        <EvidencePolicyForm value={evidence} onChange={setEvidence} />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={create.isPending}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={create.isPending}>
            {create.isPending ? "Triggering…" : "Trigger Run"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
