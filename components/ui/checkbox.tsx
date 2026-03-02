import * as React from "react";

import { cn } from "@/lib/utils";

type CheckboxProps = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  id?: string;
  className?: string;
};

export function Checkbox({ checked, onChange, label, id, className }: CheckboxProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400 focus:ring-offset-0 cursor-pointer"
      />
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm text-slate-700 cursor-pointer select-none"
        >
          {label}
        </label>
      ) : null}
    </div>
  );
}
