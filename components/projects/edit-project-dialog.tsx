"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { type ProjectDetail } from "@/lib/api/projects";
import { useUpdateProject } from "@/lib/hooks/useProjects";
import { ProjectForm, type ProjectFormValues } from "./project-form";

type Props = {
  open: boolean;
  onClose: () => void;
  project: ProjectDetail;
};

function toFormValues(project: ProjectDetail): ProjectFormValues {
  return {
    name: project.name,
    description: project.description ?? "",
    tags: project.tags.join(", "),
  };
}

export function EditProjectDialog({ open, onClose, project }: Props) {
  const [values, setValues] = React.useState<ProjectFormValues>(() =>
    toFormValues(project)
  );
  const mutation = useUpdateProject();

  // Reset form when project changes
  React.useEffect(() => {
    setValues(toFormValues(project));
  }, [project]);

  function handleClose() {
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
      id: project.id,
      body: {
        name: values.name.trim(),
        description: values.description.trim() || undefined,
        tags,
      },
    });

    handleClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={handleClose} title="Edit Project">
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
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
