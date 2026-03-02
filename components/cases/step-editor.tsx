"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EvidencePolicyForm } from "@/components/cases/evidence-policy-form";
import { StepTypeFields } from "@/components/cases/step-type-fields";
import { cn } from "@/lib/utils";
import {
  type TestCaseVersionSpec,
  type TestStep,
  type EvidencePolicy,
} from "@/lib/api/cases";

type Props = {
  spec: TestCaseVersionSpec;
  onChange: (spec: TestCaseVersionSpec) => void;
  readOnly?: boolean;
};

const STEP_TYPES: TestStep["type"][] = [
  "navigate",
  "fill",
  "click",
  "select",
  "assertVisible",
  "assertText",
  "waitFor",
];

const STEP_TYPE_LABELS: Record<TestStep["type"], string> = {
  navigate: "Navigate",
  fill: "Fill",
  click: "Click",
  select: "Select",
  assertVisible: "Assert Visible",
  assertText: "Assert Text",
  waitFor: "Wait For",
};

const STEP_TYPE_COLORS: Record<TestStep["type"], string> = {
  navigate: "bg-blue-100 text-blue-800",
  fill: "bg-violet-100 text-violet-800",
  click: "bg-emerald-100 text-emerald-800",
  select: "bg-cyan-100 text-cyan-800",
  assertVisible: "bg-amber-100 text-amber-800",
  assertText: "bg-amber-100 text-amber-800",
  waitFor: "bg-slate-100 text-slate-700",
};

function stepPreview(step: TestStep): string {
  if (step.type === "navigate") return step.url ?? "";
  return step.locator ?? "";
}

export function StepEditor({ spec, onChange, readOnly }: Props) {
  const [expandedSteps, setExpandedSteps] = React.useState<Set<number>>(
    new Set()
  );

  // ── Preconditions ──────────────────────────────────────────────────────

  const preconditions = spec.preconditions ?? [];

  function updatePrecondition(idx: number, value: string) {
    const next = [...preconditions];
    next[idx] = value;
    onChange({ ...spec, preconditions: next });
  }

  function removePrecondition(idx: number) {
    const next = preconditions.filter((_, i) => i !== idx);
    onChange({ ...spec, preconditions: next });
  }

  function addPrecondition() {
    onChange({ ...spec, preconditions: [...preconditions, ""] });
  }

  // ── Steps ──────────────────────────────────────────────────────────────

  const steps = spec.steps ?? [];

  function updateStep(idx: number, step: TestStep) {
    const next = [...steps];
    next[idx] = step;
    onChange({ ...spec, steps: next });
  }

  function removeStep(idx: number) {
    const next = steps.filter((_, i) => i !== idx);
    // adjust expanded indices
    setExpandedSteps((prev) => {
      const updated = new Set<number>();
      prev.forEach((i) => {
        if (i < idx) updated.add(i);
        else if (i > idx) updated.add(i - 1);
      });
      return updated;
    });
    onChange({ ...spec, steps: next });
  }

  function moveStep(idx: number, direction: -1 | 1) {
    const target = idx + direction;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[idx], next[target]] = [next[target], next[idx]];
    // swap expanded state
    setExpandedSteps((prev) => {
      const updated = new Set(prev);
      const idxOpen = prev.has(idx);
      const targetOpen = prev.has(target);
      if (idxOpen) updated.add(target);
      else updated.delete(target);
      if (targetOpen) updated.add(idx);
      else updated.delete(idx);
      return updated;
    });
    onChange({ ...spec, steps: next });
  }

  function addStep() {
    const newStep: TestStep = { type: "click", locator: "" };
    const newIdx = steps.length;
    onChange({ ...spec, steps: [...steps, newStep] });
    setExpandedSteps((prev) => new Set(prev).add(newIdx));
  }

  function toggleStep(idx: number) {
    setExpandedSteps((prev) => {
      const updated = new Set(prev);
      if (updated.has(idx)) updated.delete(idx);
      else updated.add(idx);
      return updated;
    });
  }

  // ── Evidence ───────────────────────────────────────────────────────────

  const evidence: EvidencePolicy = spec.evidence ?? {};

  function updateEvidence(v: EvidencePolicy) {
    onChange({ ...spec, evidence: v });
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* ── Preconditions ── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">
            Preconditions
          </h3>
          {!readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addPrecondition}
            >
              + Add precondition
            </Button>
          )}
        </div>

        {preconditions.length === 0 && (
          <p className="text-sm text-slate-400 italic">No preconditions.</p>
        )}

        <div className="flex flex-col gap-2">
          {preconditions.map((pc, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={pc}
                onChange={(e) => updatePrecondition(i, e.target.value)}
                placeholder={`Precondition ${i + 1}`}
                disabled={readOnly}
                className="flex-1"
              />
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => removePrecondition(i)}
                  className="flex h-8 w-8 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  aria-label="Remove precondition"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">
            Steps{" "}
            <span className="font-normal text-slate-400">({steps.length})</span>
          </h3>
        </div>

        {steps.length === 0 && (
          <p className="text-sm text-slate-400 italic">
            No steps yet. Add your first step below.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {steps.map((step, i) => {
            const isExpanded = expandedSteps.has(i);
            const preview = stepPreview(step);

            return (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-white overflow-hidden"
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors select-none"
                  onClick={() => toggleStep(i)}
                >
                  {/* Step number */}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    {i + 1}
                  </span>

                  {/* Type badge */}
                  <span
                    className={cn(
                      "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium shrink-0",
                      STEP_TYPE_COLORS[step.type]
                    )}
                  >
                    {STEP_TYPE_LABELS[step.type]}
                  </span>

                  {/* Preview */}
                  <span className="flex-1 truncate text-sm text-slate-500 font-mono min-w-0">
                    {preview || (
                      <span className="text-slate-300 italic not-italic font-sans">
                        (empty)
                      </span>
                    )}
                  </span>

                  {/* Expand indicator */}
                  <span className="ml-auto text-slate-400 text-xs shrink-0">
                    {isExpanded ? "▲" : "▼"}
                  </span>

                  {/* Move & remove buttons — stop propagation */}
                  {!readOnly && (
                    <div
                      className="flex items-center gap-1 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => moveStep(i, -1)}
                        disabled={i === 0}
                        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Move step up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(i, 1)}
                        disabled={i === steps.length - 1}
                        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Move step down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStep(i)}
                        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Remove step"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded body */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-4">
                    <div className="flex flex-col gap-4">
                      {/* Type selector */}
                      {!readOnly && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-slate-600">
                            Step Type
                          </label>
                          <Select
                            value={step.type}
                            onChange={(e) =>
                              updateStep(i, {
                                type: e.target.value as TestStep["type"],
                              })
                            }
                            className="max-w-xs"
                          >
                            {STEP_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {STEP_TYPE_LABELS[t]}
                              </option>
                            ))}
                          </Select>
                        </div>
                      )}

                      {/* Type-specific fields */}
                      <StepTypeFields
                        step={step}
                        onChange={(updated) => updateStep(i, updated)}
                        readOnly={readOnly}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!readOnly && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addStep}
            className="self-start"
          >
            + Add Step
          </Button>
        )}
      </section>

      {/* ── Evidence policy ── */}
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <EvidencePolicyForm
          value={evidence}
          onChange={updateEvidence}
          readOnly={readOnly}
        />
      </section>
    </div>
  );
}
