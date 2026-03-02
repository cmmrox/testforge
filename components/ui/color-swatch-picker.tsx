"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#64748b",
  "#0f172a",
  "#ffffff",
];

type Props = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorSwatchPicker({ value, onChange }: Props) {
  const [inputVal, setInputVal] = React.useState(value);

  React.useEffect(() => {
    setInputVal(value);
  }, [value]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setInputVal(v);
    // Accept if it looks like a valid hex color (#rgb or #rrggbb)
    if (/^#[0-9A-Fa-f]{3}$/.test(v) || /^#[0-9A-Fa-f]{6}$/.test(v)) {
      onChange(v);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Color</label>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => {
          const isSelected = value.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => {
                onChange(color);
                setInputVal(color);
              }}
              className={cn(
                "h-6 w-6 rounded-full border border-slate-200 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
                isSelected && "ring-2 ring-slate-700 ring-offset-1"
              )}
              style={{ backgroundColor: color }}
              aria-label={color}
              title={color}
            />
          );
        })}
      </div>
      <input
        type="text"
        value={inputVal}
        onChange={handleInputChange}
        maxLength={7}
        placeholder="#3b82f6"
        className="h-8 w-32 rounded-md border border-slate-200 bg-white px-2 text-xs font-mono shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      />
    </div>
  );
}
