"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useDomains } from "@/lib/hooks/useDomains";
import {
  useGenerateTestPlan,
  useApproveTestPlan,
  useArchiveTestPlan,
} from "@/lib/hooks/useTestPlans";
import { type TestPlanGenerationResponse } from "@/lib/api/plans";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
};

type DynamicList = string[];

function DynamicListInput({
  items,
  onChange,
  addLabel,
  placeholder,
}: {
  items: DynamicList;
  onChange: (items: DynamicList) => void;
  addLabel: string;
  placeholder?: string;
}) {
  function updateItem(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }
  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function addItem() {
    onChange([...items, ""]);
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Remove item"
          >
            ×
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addItem}
        className="self-start text-slate-600"
      >
        + {addLabel}
      </Button>
    </div>
  );
}

type FormValues = {
  title: string;
  domainId: string;
  goal: string;
  preconditions: string[];
  acceptanceCriteria: string[];
  testDataHints: string[];
};

const EMPTY: FormValues = {
  title: "",
  domainId: "",
  goal: "",
  preconditions: [],
  acceptanceCriteria: [],
  testDataHints: [],
};

export function GeneratePlanDialog({ open, onClose, projectId }: Props) {
  const [values, setValues] = React.useState<FormValues>(EMPTY);
  const [result, setResult] =
    React.useState<TestPlanGenerationResponse | null>(null);

  const domainsQuery = useDomains(projectId);
  const domains = domainsQuery.data?.data ?? [];

  const generateMutation = useGenerateTestPlan();
  const approveMutation = useApproveTestPlan();
  const archiveMutation = useArchiveTestPlan();
  const qc = useQueryClient();

  function handleClose() {
    setValues(EMPTY);
    setResult(null);
    generateMutation.reset();
    approveMutation.reset();
    archiveMutation.reset();
    onClose();
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!values.title.trim() || !values.goal.trim()) return;

    const res = await generateMutation.mutateAsync({
      projectId,
      body: {
        title: values.title.trim(),
        domainId: values.domainId || undefined,
        goal: values.goal.trim(),
        preconditions: values.preconditions.filter(Boolean),
        acceptanceCriteria: values.acceptanceCriteria.filter(Boolean),
        testDataHints: values.testDataHints.filter(Boolean),
      },
    });

    setResult(res);
  }

  async function handleApprove() {
    if (!result) return;
    await approveMutation.mutateAsync({
      id: result.plan.id,
      projectId,
    });
    qc.invalidateQueries({ queryKey: ["test-plans", projectId] });
    handleClose();
  }

  async function handleDiscard() {
    if (!result) return;
    await archiveMutation.mutateAsync({
      id: result.plan.id,
      projectId,
    });
    handleClose();
  }

  const generateError =
    generateMutation.isError && generateMutation.error
      ? (generateMutation.error as { message?: string }).message ??
        "Something went wrong"
      : undefined;

  const approveError =
    approveMutation.isError && approveMutation.error
      ? (approveMutation.error as { message?: string }).message ??
        "Something went wrong"
      : undefined;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Generate Plan with Agent ✨"
      maxWidth="max-w-2xl"
    >
      {/* Phase 2 — Result view */}
      {result ? (
        <div className="flex flex-col gap-5">
          {/* Success header */}
          <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-4 py-3">
            <span className="text-lg">✓</span>
            <span className="font-semibold text-emerald-800">
              Plan Generated
            </span>
          </div>

          {/* Plan info */}
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {result.plan.title}
            </h3>
            {result.plan.description ? (
              <p className="mt-1 text-sm text-slate-500">
                {result.plan.description}
              </p>
            ) : null}
          </div>

          {/* Suggested test cases */}
          {result.suggestedCases && result.suggestedCases.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-slate-700">
                Suggested Test Cases ({result.suggestedCases.length})
              </h4>
              <div className="flex flex-col gap-2">
                {result.suggestedCases.map((tc, i) => (
                  <Card key={i} className="border border-slate-200">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium text-slate-900">
                        {tc.title}
                      </p>
                      {tc.objective ? (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {tc.objective}
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {/* Risks */}
          {result.risks && result.risks.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-slate-700">
                Risks / Assumptions
              </h4>
              <ul className="list-disc pl-5 text-sm text-slate-600">
                {result.risks.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {approveError ? (
            <p className="text-sm font-medium text-red-600">{approveError}</p>
          ) : null}

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => {
                setResult(null);
                generateMutation.reset();
              }}
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              ← Regenerate
            </button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDiscard}
                disabled={
                  archiveMutation.isPending || approveMutation.isPending
                }
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                {archiveMutation.isPending ? "Discarding…" : "Discard"}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleApprove}
                disabled={
                  approveMutation.isPending || archiveMutation.isPending
                }
              >
                {approveMutation.isPending ? "Approving…" : "Approve Plan"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Phase 1 — Input form */
        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Plan Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={values.title}
              onChange={(e) =>
                setValues((v) => ({ ...v, title: e.target.value }))
              }
              placeholder="e.g. Checkout Flow — Happy Path"
              required
            />
          </div>

          {/* Domain */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Domain <span className="text-slate-400">(optional)</span>
            </label>
            <Select
              value={values.domainId}
              onChange={(e) =>
                setValues((v) => ({ ...v, domainId: e.target.value }))
              }
            >
              <option value="">— No domain —</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Goal */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Goal / User Story <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={values.goal}
              onChange={(e) =>
                setValues((v) => ({ ...v, goal: e.target.value }))
              }
              placeholder="Describe the feature or user flow you want to test…"
              rows={3}
              required
            />
          </div>

          {/* Preconditions */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Preconditions
            </label>
            <DynamicListInput
              items={values.preconditions}
              onChange={(items) =>
                setValues((v) => ({ ...v, preconditions: items }))
              }
              addLabel="Add precondition"
              placeholder="e.g. User is logged in"
            />
          </div>

          {/* Acceptance Criteria */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Acceptance Criteria
            </label>
            <DynamicListInput
              items={values.acceptanceCriteria}
              onChange={(items) =>
                setValues((v) => ({ ...v, acceptanceCriteria: items }))
              }
              addLabel="Add criterion"
              placeholder="e.g. User sees confirmation email"
            />
          </div>

          {/* Test Data Hints */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Test Data Hints
            </label>
            <DynamicListInput
              items={values.testDataHints}
              onChange={(items) =>
                setValues((v) => ({ ...v, testDataHints: items }))
              }
              addLabel="Add hint"
              placeholder="e.g. Use test user: qa@example.com"
            />
          </div>

          {generateError ? (
            <p className="text-sm font-medium text-red-600">{generateError}</p>
          ) : null}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={generateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={
                generateMutation.isPending ||
                !values.title.trim() ||
                !values.goal.trim()
              }
            >
              {generateMutation.isPending ? "Generating…" : "Generate Plan ✨"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
