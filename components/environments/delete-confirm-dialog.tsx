"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useDeleteEnvironment } from "@/lib/hooks/useEnvironments";
import type { Environment } from "@/lib/api/environments";

type Props = {
  open: boolean;
  onClose: () => void;
  environment: Environment;
};

export function DeleteConfirmDialog({ open, onClose, environment }: Props) {
  const mutation = useDeleteEnvironment();

  function handleClose() {
    mutation.reset();
    onClose();
  }

  async function handleDelete() {
    await mutation.mutateAsync({
      id: environment.id,
      projectId: environment.projectId,
    });
    handleClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={handleClose} title="Delete Environment">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-700">
          Delete environment{" "}
          <span className="font-semibold">&ldquo;{environment.name}&rdquo;</span>? This
          will remove it permanently.
        </p>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
