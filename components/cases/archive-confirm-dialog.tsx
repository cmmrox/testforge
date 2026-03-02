"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useArchiveTestCase } from "@/lib/hooks/useTestCases";
import { type TestCase } from "@/lib/api/cases";

type Props = {
  open: boolean;
  onClose: () => void;
  testCase: TestCase;
};

export function ArchiveCaseConfirmDialog({ open, onClose, testCase }: Props) {
  const mutation = useArchiveTestCase();

  async function handleArchive() {
    await mutation.mutateAsync({
      id: testCase.id,
      projectId: testCase.projectId,
    });
    onClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={onClose} title="Archive Test Case" maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-700">
          Archive{" "}
          <span className="font-semibold">&ldquo;{testCase.title}&rdquo;</span>?
          Active test plans referencing this case will be unaffected but future
          runs will skip it.
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
