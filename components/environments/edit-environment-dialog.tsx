"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useUpdateEnvironment } from "@/lib/hooks/useEnvironments";
import type { Environment } from "@/lib/api/environments";
import {
  EnvironmentForm,
  formValuesToCreateRequest,
  type EnvironmentFormValues,
} from "./environment-form";

type Props = {
  open: boolean;
  onClose: () => void;
  environment: Environment;
};

function envToFormValues(env: Environment): EnvironmentFormValues {
  const recipe = env.loginRecipe;
  return {
    name: env.name,
    baseUrl: env.baseUrl,
    loginUrl: recipe?.loginUrl ?? "",
    locatorUsername: recipe?.locatorUsername ?? "",
    locatorPassword: recipe?.locatorPassword ?? "",
    locatorSubmit: recipe?.locatorSubmit ?? "",
    locatorPostLoginAssert: recipe?.locatorPostLoginAssert ?? "",
    username: "",
    password: "",
    totpEnabled: recipe?.totpEnabled ?? false,
    locatorTotp: recipe?.locatorTotp ?? "",
    locatorTotpSubmit: recipe?.locatorTotpSubmit ?? "",
    totpSecret: "",
  };
}

export function EditEnvironmentDialog({ open, onClose, environment }: Props) {
  const [values, setValues] = React.useState<EnvironmentFormValues>(() =>
    envToFormValues(environment)
  );
  const mutation = useUpdateEnvironment();

  // Reset when environment changes
  React.useEffect(() => {
    setValues(envToFormValues(environment));
  }, [environment]);

  function handleClose() {
    mutation.reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim() || !values.baseUrl.trim()) return;

    await mutation.mutateAsync({
      id: environment.id,
      projectId: environment.projectId,
      body: formValuesToCreateRequest(values),
    });

    handleClose();
  }

  const error =
    mutation.isError && mutation.error
      ? (mutation.error as { message?: string }).message ?? "Something went wrong"
      : undefined;

  return (
    <Dialog open={open} onClose={handleClose} title="Edit Environment" maxWidth="max-w-2xl">
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
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
