"use client";

import * as React from "react";

import { type ProjectDetail } from "@/lib/api/projects";
import { useProjects } from "@/lib/hooks/useProjects";

const LS_KEY = "tf_selected_project_id";

type ProjectContextValue = {
  selectedProject: ProjectDetail | null;
  setSelectedProject: (p: ProjectDetail | null) => void;
};

const ProjectContext = React.createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [selectedProject, setSelectedProjectState] = React.useState<ProjectDetail | null>(null);
  const [restored, setRestored] = React.useState(false);
  const projectsQuery = useProjects();

  // Restore from localStorage once the projects list is available
  React.useEffect(() => {
    if (restored) return;
    if (!projectsQuery.data) return;

    const storedId =
      typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;

    if (storedId) {
      const found = projectsQuery.data.data.find((p) => p.id === storedId) ?? null;
      setSelectedProjectState(found);
    }
    setRestored(true);
  }, [projectsQuery.data, restored]);

  const setSelectedProject = React.useCallback((p: ProjectDetail | null) => {
    setSelectedProjectState(p);
    if (typeof window !== "undefined") {
      if (p) {
        localStorage.setItem(LS_KEY, p.id);
      } else {
        localStorage.removeItem(LS_KEY);
      }
    }
  }, []);

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useSelectedProject() {
  const ctx = React.useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useSelectedProject must be used within a ProjectProvider");
  }
  return ctx;
}
