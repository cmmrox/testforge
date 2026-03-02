"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useCreateEnvironment } from "@/lib/hooks/useEnvironments";
import {
  EnvironmentForm,
  defaultEnvironmentFormValues,
  formValuesToCreateRequest,
  type EnvironmentFormValues,
} from "./environment-form";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
};

export function CreateEnvironmentDialog({ open, onClose, projectId }: Props) {
  const [values, setValues] = React.useState<EnvironmentFormValues>(
    defaultEnvironmentFormValues
  );
  const mutation = useCreateEnvironment();

  function handleClose() {
    setValues(defaultEnvironmentFormValues);
    mutation.reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim() || !values.baseUrl.trim()) return;

    await mutation.mutateAsync({
      projectId,
      body: formValuesToCreateRequest(values),
    });

    handleClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={handleClose} title="New Environment" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <EnvironmentForm values={values} onChange={setValues} error={error} />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={
              mutation.isPending || !values.name.trim() || !values.baseUrl.trim()
            }
          >
            {mutation.isPending ? "Creating…" : "Create Environment"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
