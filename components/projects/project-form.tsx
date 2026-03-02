"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type ProjectFormValues = {
  name: string;
  description: string;
  tags: string; // comma-separated
};

type Props = {
  values: ProjectFormValues;
  onChange: (v: ProjectFormValues) => void;
  error?: string;
};

export function ProjectForm({ values, onChange, error }: Props) {
  const set = (field: keyof ProjectFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => onChange({ ...values, [field]: e.target.value });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="pf-name">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="pf-name"
          required
          value={values.name}
          onChange={set("name")}
          placeholder="My Project"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="pf-desc">
          Description
        </label>
        <Textarea
          id="pf-desc"
          value={values.description}
          onChange={set("description")}
          placeholder="Optional description"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="pf-tags">
          Tags
        </label>
        <Input
          id="pf-tags"
          value={values.tags}
          onChange={set("tags")}
          placeholder="comma-separated"
        />
      </div>

      {error ? (
        <p className="text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
