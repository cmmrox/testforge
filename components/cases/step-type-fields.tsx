"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { type TestStep } from "@/lib/api/cases";

type Props = {
  step: TestStep;
  onChange: (step: TestStep) => void;
  readOnly?: boolean;
};

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

export function StepTypeFields({ step, onChange, readOnly }: Props) {
  const update = (patch: Partial<TestStep>) =>
    onChange({ ...step, ...patch });

  const locatorField = (
    <FieldRow label="Locator">
      <Input
        value={step.locator ?? ""}
        onChange={(e) => update({ locator: e.target.value })}
        placeholder="CSS selector or ARIA role"
        disabled={readOnly}
      />
    </FieldRow>
  );

  const locatorHintField = (
    <FieldRow label="Locator Hint">
      <Input
        value={step.locatorHint ?? ""}
        onChange={(e) => update({ locatorHint: e.target.value })}
        placeholder="Human-readable description of element"
        disabled={readOnly}
      />
    </FieldRow>
  );

  switch (step.type) {
    case "navigate":
      return (
        <div className="flex flex-col gap-3">
          <FieldRow label="URL">
            <Input
              value={step.url ?? ""}
              onChange={(e) => update({ url: e.target.value })}
              placeholder="${BASE_URL}/path"
              disabled={readOnly}
            />
          </FieldRow>
        </div>
      );

    case "fill":
      return (
        <div className="flex flex-col gap-3">
          {locatorField}
          <FieldRow label="Value">
            <Input
              value={step.value ?? ""}
              onChange={(e) => update({ value: e.target.value })}
              placeholder="${ENV_USERNAME}"
              disabled={readOnly}
            />
          </FieldRow>
          <Checkbox
            checked={step.mask ?? false}
            onChange={(v) => update({ mask: v })}
            label="Mask value (password)"
          />
        </div>
      );

    case "click":
      return (
        <div className="flex flex-col gap-3">
          {locatorField}
          {locatorHintField}
        </div>
      );

    case "select":
      return (
        <div className="flex flex-col gap-3">
          {locatorField}
          <FieldRow label="Value">
            <Input
              value={step.value ?? ""}
              onChange={(e) => update({ value: e.target.value })}
              placeholder="Option value to select"
              disabled={readOnly}
            />
          </FieldRow>
        </div>
      );

    case "assertVisible":
      return (
        <div className="flex flex-col gap-3">
          {locatorField}
          {locatorHintField}
        </div>
      );

    case "assertText":
      return (
        <div className="flex flex-col gap-3">
          {locatorField}
          <FieldRow label="Expected text">
            <Input
              value={step.assertion ?? ""}
              onChange={(e) => update({ assertion: e.target.value })}
              placeholder="Text that should be present"
              disabled={readOnly}
            />
          </FieldRow>
        </div>
      );

    case "waitFor":
      return (
        <div className="flex flex-col gap-3">
          {locatorField}
          <FieldRow label="Timeout ms">
            <Input
              value={step.value ?? ""}
              onChange={(e) => update({ value: e.target.value })}
              placeholder="5000"
              type="number"
              disabled={readOnly}
            />
          </FieldRow>
        </div>
      );

    default:
      return null;
  }
}
