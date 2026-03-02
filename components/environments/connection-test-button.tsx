"use client";

import { useTestConnection } from "@/lib/hooks/useEnvironments";

type Props = {
  environmentId: string;
};

export function ConnectionTestButton({ environmentId }: Props) {
  const mutation = useTestConnection();

  function handleClick() {
    mutation.mutate(environmentId);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={mutation.isPending}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {mutation.isPending ? (
          <>
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            Testing…
          </>
        ) : (
          "Test Connection"
        )}
      </button>

      {mutation.isSuccess && mutation.data && (
        <span
          className={
            mutation.data.reachable
              ? "text-xs font-medium text-emerald-700"
              : "text-xs font-medium text-red-700"
          }
        >
          {mutation.data.reachable
            ? `✅ Reachable — ${mutation.data.latencyMs ?? "?"}ms (HTTP ${mutation.data.statusCode ?? "?"})`
            : `❌ Unreachable — ${mutation.data.error ?? "Unknown error"}`}
        </span>
      )}

      {mutation.isError && (
        <span className="text-xs font-medium text-red-700">
          ❌ Error — {(mutation.error as { message?: string }).message ?? "Request failed"}
        </span>
      )}
    </div>
  );
}
