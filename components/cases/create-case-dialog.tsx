"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDomains } from "@/lib/hooks/useDomains";
import { useCreateTestCase } from "@/lib/hooks/useTestCases";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
};

type FormValues = {
  title: string;
  objective: string;
  domainId: string;
  tags: string;
};

const EMPTY: FormValues = {
  title: "",
  objective: "",
  domainId: "",
  tags: "",
};

export function CreateCaseDialog({ open, onClose, projectId }: Props) {
  const [values, setValues] = React.useState<FormValues>(EMPTY);
  const mutation = useCreateTestCase();
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

    const tags = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await mutation.mutateAsync({
      projectId,
      body: {
        title: values.title.trim(),
        objective: values.objective.trim() || undefined,
        domainId: values.domainId || undefined,
        tags: tags.length ? tags : undefined,
      },
    });

    handleClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={handleClose} title="New Test Case">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={values.title}
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
            placeholder="e.g. Admin login with valid credentials"
            required
          />
        </div>

        {/* Objective */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Objective</label>
          <Textarea
            value={values.objective}
            onChange={(e) =>
              setValues((v) => ({ ...v, objective: e.target.value }))
            }
            placeholder="Briefly describe what this test verifies…"
            rows={2}
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

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Tags{" "}
            <span className="text-xs font-normal text-slate-400">
              (comma-separated)
            </span>
          </label>
          <Input
            value={values.tags}
            onChange={(e) => setValues((v) => ({ ...v, tags: e.target.value }))}
            placeholder="smoke, auth, regression"
          />
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
            {mutation.isPending ? "Creating…" : "Create Case"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
