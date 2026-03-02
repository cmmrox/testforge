"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useUpdateDomain } from "@/lib/hooks/useDomains";
import type { Domain } from "@/lib/api/domains";
import { DomainForm, type DomainFormValues } from "./domain-form";

type Props = {
  open: boolean;
  onClose: () => void;
  domain: Domain;
};

export function EditDomainDialog({ open, onClose, domain }: Props) {
  const [values, setValues] = React.useState<DomainFormValues>({
    name: domain.name,
    color: domain.color,
  });
  const mutation = useUpdateDomain();

  // Reset form when domain changes
  React.useEffect(() => {
    setValues({ name: domain.name, color: domain.color });
  }, [domain]);

  function handleClose() {
    mutation.reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) return;

    await mutation.mutateAsync({
      id: domain.id,
      projectId: domain.projectId,
      body: { name: values.name.trim(), color: values.color },
    });

    handleClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={handleClose} title="Edit Domain">
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
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
