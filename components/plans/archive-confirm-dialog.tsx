"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useArchiveTestPlan } from "@/lib/hooks/useTestPlans";
import { type TestPlan } from "@/lib/api/plans";

type Props = {
  open: boolean;
  onClose: () => void;
  plan: TestPlan;
};

export function ArchivePlanConfirmDialog({ open, onClose, plan }: Props) {
  const mutation = useArchiveTestPlan();

  async function handleArchive() {
    await mutation.mutateAsync({ id: plan.id, projectId: plan.projectId });
    onClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={onClose} title="Archive Plan" maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-700">
          Archive plan{" "}
          <span className="font-semibold">&ldquo;{plan.title}&rdquo;</span>? It
          will no longer appear in active plan lists.
        </p>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleArchive}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Archiving…" : "Archive"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
