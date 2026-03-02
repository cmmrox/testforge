"use client";

import * as React from "react";

import { type Environment } from "@/lib/api/environments";
import { useEnvironments } from "@/lib/hooks/useEnvironments";
import { useSelectedProject } from "@/lib/context/project-context";

const keyForProject = (projectId: string) => `tf_selected_env_id:${projectId}`;

type EnvironmentContextValue = {
  selectedEnvironment: Environment | null;
  setSelectedEnvironment: (e: Environment | null) => void;
};

const EnvironmentContext = React.createContext<EnvironmentContextValue | null>(null);

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
  const { selectedProject } = useSelectedProject();
  const projectId = selectedProject?.id;
  const envsQuery = useEnvironments(projectId);

  const [selectedEnvironment, setSelectedEnvironmentState] = React.useState<Environment | null>(null);
  const [restored, setRestored] = React.useState(false);

  // Reset when project changes
  React.useEffect(() => {
    setSelectedEnvironmentState(null);
    setRestored(false);
  }, [projectId]);

  // Restore from localStorage once envs are available
  React.useEffect(() => {
    if (!projectId) return;
    if (restored) return;
    if (!envsQuery.data) return;

    const storedId = typeof window !== "undefined" ? localStorage.getItem(keyForProject(projectId)) : null;
    const envs = envsQuery.data.data;

    const found = storedId ? envs.find((e) => e.id === storedId) ?? null : null;
    setSelectedEnvironmentState(found ?? envs[0] ?? null);
    setRestored(true);
  }, [envsQuery.data, projectId, restored]);

  const setSelectedEnvironment = React.useCallback(
    (e: Environment | null) => {
      setSelectedEnvironmentState(e);
      if (!projectId || typeof window === "undefined") return;
      if (e) localStorage.setItem(keyForProject(projectId), e.id);
      else localStorage.removeItem(keyForProject(projectId));
    },
    [projectId]
  );

  return (
    <EnvironmentContext.Provider value={{ selectedEnvironment, setSelectedEnvironment }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useSelectedEnvironment() {
  const ctx = React.useContext(EnvironmentContext);
  if (!ctx) throw new Error("useSelectedEnvironment must be used within an EnvironmentProvider");
  return ctx;
}
