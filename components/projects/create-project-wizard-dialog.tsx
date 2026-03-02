"use client";

import * as React from "react";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EnvironmentForm, defaultEnvironmentFormValues, formValuesToCreateRequest, type EnvironmentFormValues } from "@/components/environments/environment-form";
import { ColorSwatchPicker } from "@/components/ui/color-swatch-picker";
import { ProjectForm, type ProjectFormValues } from "@/components/projects/project-form";
import { useCreateProject } from "@/lib/hooks/useProjects";
import { overlayLoad, overlaySave } from "@/lib/overlay/overlayStore";
import { useSelectedProject } from "@/lib/context/project-context";
import { useSelectedEnvironment } from "@/lib/context/environment-context";
import { type ProjectDetail } from "@/lib/api/projects";
import { type Domain } from "@/lib/api/domains";
import { type Environment } from "@/lib/api/environments";

type WizardStep = "project" | "environment" | "domains" | "review";

type DomainDraft = { name: string; color: string };

const PRESET_DOMAINS: DomainDraft[] = [
  { name: "Authentication", color: "#3b82f6" },
  { name: "Dashboard", color: "#6366f1" },
  { name: "Sales", color: "#22c55e" },
  { name: "Inventory", color: "#f97316" },
  { name: "Accounting", color: "#a855f7" },
];

function newUuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // Fallback (not perfect, but fine for demo overlay)
  return `demo-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function parseTags(tagsCsv: string) {
  return tagsCsv
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function CreateProjectWizardDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const createProjectMutation = useCreateProject();
  const { setSelectedProject } = useSelectedProject();
  const { setSelectedEnvironment } = useSelectedEnvironment();

  const [step, setStep] = React.useState<WizardStep>("project");
  const [error, setError] = React.useState<string>("");

  const [projectValues, setProjectValues] = React.useState<ProjectFormValues>({
    name: "",
    description: "",
    tags: "",
  });

  const [envValues, setEnvValues] = React.useState<EnvironmentFormValues>({
    ...defaultEnvironmentFormValues,
    name: "Staging",
  });

  const [presetEnabled, setPresetEnabled] = React.useState<Record<string, boolean>>({});
  const [customDomains, setCustomDomains] = React.useState<DomainDraft[]>([]);
  const [customName, setCustomName] = React.useState("");
  const [customColor, setCustomColor] = React.useState("#14b8a6");

  React.useEffect(() => {
    if (!open) return;
    setStep("project");
    setError("");
    setProjectValues({ name: "", description: "", tags: "" });
    setEnvValues({ ...defaultEnvironmentFormValues, name: "Staging" });
    setPresetEnabled({});
    setCustomDomains([]);
    setCustomName("");
    setCustomColor("#14b8a6");
  }, [open]);

  function selectedDomains(): DomainDraft[] {
    const presets = PRESET_DOMAINS.filter((d) => presetEnabled[d.name]);
    return [...presets, ...customDomains];
  }

  function canNext(): boolean {
    if (step === "project") return projectValues.name.trim().length > 0;
    if (step === "environment") return envValues.name.trim().length > 0 && envValues.baseUrl.trim().length > 0;
    return true;
  }

  async function handleCreate() {
    setError("");

    const name = projectValues.name.trim();
    if (!name) {
      setError("Project name is required.");
      return;
    }
    if (!envValues.baseUrl.trim()) {
      setError("Default environment base URL is required.");
      return;
    }

    const tags = parseTags(projectValues.tags);
    const domains = selectedDomains();

    // 1) Call API (best-effort). Prism may not persist, but it validates the shape.
    try {
      await createProjectMutation.mutateAsync({
        name,
        description: projectValues.description.trim() || undefined,
        tags: tags.length ? tags : undefined,
        defaultEnvironment: formValuesToCreateRequest(envValues),
        domains: domains.map((d) => ({ name: d.name, color: d.color })),
      });
    } catch (e) {
      // We still proceed with overlay to keep the UX flowing.
      const msg = typeof e === "object" && e && "message" in e ? String((e as { message?: string }).message) : "Failed";
      setError(`API mock rejected the request: ${msg}`);
      return;
    }

    // 2) Overlay persistence
    const now = new Date().toISOString();
    const projectId = newUuid();

    const project: ProjectDetail = {
      id: projectId,
      name,
      description: projectValues.description.trim() || undefined,
      tags,
      archived: false,
      createdAt: now,
      environmentCount: 1,
      testPlanCount: 0,
      testCaseCount: 0,
      lastRun: undefined,
    };

    const envId = newUuid();
    const envReq = formValuesToCreateRequest(envValues);
    const environment: Environment = {
      id: envId,
      projectId,
      name: envReq.name,
      baseUrl: envReq.baseUrl,
      loginRecipe: envReq.loginRecipe as unknown as Record<string, unknown> | undefined,
      createdAt: now,
    };

    const domainEntities: Domain[] = domains.map((d) => ({
      id: newUuid(),
      projectId,
      name: d.name,
      color: d.color,
      createdAt: now,
    }));

    const db = overlayLoad();
    overlaySave({
      ...db,
      projects: [project, ...db.projects],
      environments: [environment, ...db.environments],
      domains: [...domainEntities, ...db.domains],
    });

    setSelectedProject(project);
    setSelectedEnvironment(environment);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="New Project" maxWidth="max-w-2xl">
      <div className="space-y-4">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {/* Step indicator */}
        <div className="flex flex-wrap gap-2 text-xs">
          {(
            [
              { k: "project", label: "1) Project" },
              { k: "environment", label: "2) Default Environment" },
              { k: "domains", label: "3) Domains" },
              { k: "review", label: "4) Review" },
            ] as const
          ).map((s) => (
            <span
              key={s.k}
              className={
                step === s.k
                  ? "rounded-full bg-slate-900 px-3 py-1 text-white"
                  : "rounded-full bg-slate-100 px-3 py-1 text-slate-600"
              }
            >
              {s.label}
            </span>
          ))}
        </div>

        {/* Step content */}
        {step === "project" ? (
          <ProjectForm values={projectValues} onChange={setProjectValues} />
        ) : step === "environment" ? (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Create a default environment (typically Staging). You can add more later.
            </p>
            <EnvironmentForm values={envValues} onChange={setEnvValues} />
          </div>
        ) : step === "domains" ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-700">Presets</div>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                {PRESET_DOMAINS.map((d) => (
                  <label
                    key={d.name}
                    className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: d.color }}
                      />
                      {d.name}
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(presetEnabled[d.name])}
                      onChange={(e) =>
                        setPresetEnabled((m) => ({ ...m, [d.name]: e.target.checked }))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700">Add custom domain</div>
              <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_auto]">
                <Input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Payments"
                />
                <ColorSwatchPicker value={customColor} onChange={setCustomColor} />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    const n = customName.trim();
                    if (!n) return;
                    setCustomDomains((arr) => [...arr, { name: n, color: customColor }]);
                    setCustomName("");
                  }}
                >
                  Add
                </Button>
              </div>

              {customDomains.length ? (
                <div className="mt-3 space-y-2">
                  {customDomains.map((d, idx) => (
                    <div
                      key={`${d.name}-${idx}`}
                      className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full border border-slate-300"
                          style={{ backgroundColor: d.color }}
                        />
                        {d.name}
                      </span>
                      <button
                        type="button"
                        className="text-sm text-slate-500 hover:text-red-600"
                        onClick={() =>
                          setCustomDomains((arr) => arr.filter((_, i) => i !== idx))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-700">
                <div className="font-medium">{projectValues.name || "—"}</div>
                {projectValues.description ? (
                  <div className="mt-1 text-slate-600">{projectValues.description}</div>
                ) : null}
                {parseTags(projectValues.tags).length ? (
                  <div className="mt-2 text-xs text-slate-500">
                    Tags: {parseTags(projectValues.tags).join(", ")}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Environment</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-700">
                <div className="font-medium">{envValues.name || "—"}</div>
                <div className="mt-1 font-mono text-xs text-slate-600">{envValues.baseUrl || "—"}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Domains</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-700">
                {selectedDomains().length ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {selectedDomains().map((d) => (
                      <li key={d.name}>{d.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">No domains selected (you can add later).</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (step === "project") {
                onClose();
              } else if (step === "environment") {
                setStep("project");
              } else if (step === "domains") {
                setStep("environment");
              } else {
                setStep("domains");
              }
            }}
          >
            {step === "project" ? "Cancel" : "Back"}
          </Button>

          {step !== "review" ? (
            <Button
              type="button"
              onClick={() => {
                if (!canNext()) return;
                if (step === "project") setStep("environment");
                else if (step === "environment") setStep("domains");
                else setStep("review");
              }}
              disabled={!canNext()}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleCreate}
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? "Creating…" : "Create Project"}
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
