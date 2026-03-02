"use client";

import { Input } from "@/components/ui/input";
import { ColorSwatchPicker } from "@/components/ui/color-swatch-picker";

export type DomainFormValues = {
  name: string;
  color: string;
};

export const defaultDomainFormValues: DomainFormValues = {
  name: "",
  color: "#3b82f6",
};

type DomainFormProps = {
  values: DomainFormValues;
  onChange: (v: DomainFormValues) => void;
  error?: string;
};

export function DomainForm({ values, onChange, error }: DomainFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="df-name">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="df-name"
          required
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          placeholder="e.g. Authentication"
        />
      </div>

      <ColorSwatchPicker
        value={values.color}
        onChange={(color) => onChange({ ...values, color })}
      />

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
