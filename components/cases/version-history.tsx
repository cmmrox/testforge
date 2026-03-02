"use client";

import { cn } from "@/lib/utils";
import { type TestCaseVersion } from "@/lib/api/cases";

type Props = {
  versions: TestCaseVersion[];
  currentVersionId?: string;
  onSelect: (v: TestCaseVersion) => void;
};

export function VersionHistory({ versions, currentVersionId, onSelect }: Props) {
  const sorted = [...versions].sort((a, b) => b.versionNo - a.versionNo);

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">No versions yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {sorted.map((v) => {
        const isCurrent = v.id === currentVersionId;
        return (
          <div
            key={v.id}
            className={cn(
              "flex flex-col gap-1 rounded-lg border px-3 py-2.5 transition-colors",
              isCurrent
                ? "border-slate-400 bg-slate-50"
                : "border-slate-200 bg-white hover:bg-slate-50"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-800">
                v{v.versionNo}
                {isCurrent && (
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    (current)
                  </span>
                )}
              </span>
              {!isCurrent && (
                <button
                  type="button"
                  onClick={() => onSelect(v)}
                  className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded"
                >
                  View
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {new Date(v.createdAt).toLocaleString()}
            </p>
            {v.changeNote && (
              <p className="text-xs text-slate-500 line-clamp-2">
                {v.changeNote}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
