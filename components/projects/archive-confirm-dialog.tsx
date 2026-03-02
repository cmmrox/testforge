"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { type ProjectDetail } from "@/lib/api/projects";
import { useArchiveProject } from "@/lib/hooks/useProjects";

type Props = {
  open: boolean;
  onClose: () => void;
  project: ProjectDetail;
};

export function ArchiveConfirmDialog({ open, onClose, project }: Props) {
  const mutation = useArchiveProject();

  async function handleArchive() {
    await mutation.mutateAsync(project.id);
    onClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={onClose} title="Archive Project" maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-700">
          Archive project{" "}
          <span className="font-semibold">&ldquo;{project.name}&rdquo;</span>? This
          cannot be undone.
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
