"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDomains } from "@/lib/hooks/useDomains";
import { useUpdateTestPlan } from "@/lib/hooks/useTestPlans";
import { type TestPlan } from "@/lib/api/plans";

type Props = {
  open: boolean;
  onClose: () => void;
  plan: TestPlan;
};

type FormValues = {
  title: string;
  description: string;
  domainId: string;
};

export function EditPlanDialog({ open, onClose, plan }: Props) {
  const [values, setValues] = React.useState<FormValues>({
    title: plan.title,
    description: plan.description ?? "",
    domainId: plan.domainId ?? "",
  });

  const mutation = useUpdateTestPlan();
  const domainsQuery = useDomains(plan.projectId);
  const domains = domainsQuery.data?.data ?? [];

  // Sync when plan prop changes
  React.useEffect(() => {
    setValues({
      title: plan.title,
      description: plan.description ?? "",
      domainId: plan.domainId ?? "",
    });
  }, [plan.id, plan.title, plan.description, plan.domainId]);

  function handleClose() {
    mutation.reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.title.trim()) return;

    await mutation.mutateAsync({
      id: plan.id,
      projectId: plan.projectId,
      body: {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        domainId: values.domainId || undefined,
      },
    });

    handleClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={handleClose} title="Edit Test Plan">
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
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
