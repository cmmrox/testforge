"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useCreateDomain } from "@/lib/hooks/useDomains";
import {
  DomainForm,
  defaultDomainFormValues,
  type DomainFormValues,
} from "./domain-form";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
};

export function CreateDomainDialog({ open, onClose, projectId }: Props) {
  const [values, setValues] = React.useState<DomainFormValues>(
    defaultDomainFormValues
  );
  const mutation = useCreateDomain();

  function handleClose() {
    setValues(defaultDomainFormValues);
    mutation.reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) return;

    await mutation.mutateAsync({
      projectId,
      body: { name: values.name.trim(), color: values.color },
    });

    handleClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={handleClose} title="New Domain">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <DomainForm values={values} onChange={setValues} error={error} />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={mutation.isPending || !values.name.trim()}
          >
            {mutation.isPending ? "Creating…" : "Create Domain"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
