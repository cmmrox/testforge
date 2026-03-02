"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useCreateProject } from "@/lib/hooks/useProjects";
import { ProjectForm, type ProjectFormValues } from "./project-form";

const EMPTY: ProjectFormValues = { name: "", description: "", tags: "" };

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CreateProjectDialog({ open, onClose }: Props) {
  const [values, setValues] = React.useState<ProjectFormValues>(EMPTY);
  const mutation = useCreateProject();

  function handleClose() {
    setValues(EMPTY);
    mutation.reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) return;

    const tags = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await mutation.mutateAsync({
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });

    handleClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={handleClose} title="New Project">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ProjectForm values={values} onChange={setValues} error={error} />
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
            {mutation.isPending ? "Creating…" : "Create Project"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
