"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDomains } from "@/lib/hooks/useDomains";
import { useCreateTestPlan } from "@/lib/hooks/useTestPlans";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
};

type FormValues = {
  title: string;
  description: string;
  domainId: string;
};

const EMPTY: FormValues = { title: "", description: "", domainId: "" };

export function CreatePlanDialog({ open, onClose, projectId }: Props) {
  const [values, setValues] = React.useState<FormValues>(EMPTY);
  const mutation = useCreateTestPlan();
  const domainsQuery = useDomains(projectId);
  const domains = domainsQuery.data?.data ?? [];

  function handleClose() {
    setValues(EMPTY);
    mutation.reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.title.trim()) return;

    await mutation.mutateAsync({
      projectId,
      body: {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        domainId: values.domainId || undefined,
        generatedBy: "manual",
      },
    });

    handleClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={handleClose} title="New Test Plan">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={values.title}
            onChange={(e) =>
              setValues((v) => ({ ...v, title: e.target.value }))
            }
            placeholder="e.g. Login & Authentication"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Description
          </label>
          <Textarea
            value={values.description}
            onChange={(e) =>
              setValues((v) => ({ ...v, description: e.target.value }))
            }
            placeholder="Briefly describe the scope of this plan…"
            rows={3}
          />
        </div>

        {/* Domain */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Domain</label>
          <Select
            value={values.domainId}
            onChange={(e) =>
              setValues((v) => ({ ...v, domainId: e.target.value }))
            }
          >
            <option value="">— No domain —</option>
            {domains.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={mutation.isPending || !values.title.trim()}
          >
            {mutation.isPending ? "Creating…" : "Create Plan"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
