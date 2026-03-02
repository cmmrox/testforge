"use client";

import { cn } from "@/lib/utils";
import type { Domain } from "@/lib/api/domains";

type DomainChipProps = {
  domain: Domain;
  size?: "sm" | "md";
};

export function DomainChip({ domain, size = "md" }: DomainChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white font-medium text-slate-700",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      )}
    >
      <span
        className={cn(
          "shrink-0 rounded-full",
          size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"
        )}
        style={{ backgroundColor: domain.color }}
      />
      {domain.name}
    </span>
  );
}

type DomainDotProps = {
  domain: Domain;
};

export function DomainDot({ domain }: DomainDotProps) {
  return (
    <span
      className="inline-block h-3 w-3 shrink-0 rounded-full"
      style={{ backgroundColor: domain.color }}
      title={domain.name}
    />
  );
}
