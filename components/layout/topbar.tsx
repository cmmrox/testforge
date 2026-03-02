"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/lib/api/auth";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useProjects } from "@/lib/hooks/useProjects";
import { useSelectedProject } from "@/lib/context/project-context";

function ProjectSwitcher() {
  const { selectedProject, setSelectedProject } = useSelectedProject();
  const projectsQuery = useProjects();

  const activeProjects = (projectsQuery.data?.data ?? []).filter((p) => !p.archived);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (!val) {
      setSelectedProject(null);
      return;
    }
    const found = activeProjects.find((p) => p.id === val) ?? null;
    setSelectedProject(found);
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-slate-500">Project:</span>
      <select
        value={selectedProject?.id ?? ""}
        onChange={handleChange}
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        aria-label="Select project"
      >
        <option value="">Select project…</option>
        {activeProjects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const qc = useQueryClient();
  const meQuery = useCurrentUser();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      // Set a local flag so our proxy won't auto-inject a mock session.
      document.cookie = "tf_logged_out=1; path=/";

      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
      router.replace("/login");
    },
  });

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onMenuClick} className="md:hidden">
          Menu
        </Button>
        <div className="text-sm font-semibold text-slate-900">TestForge</div>
      </div>

      <div className="flex items-center gap-2">
        <ProjectSwitcher />
        <Badge>Env: —</Badge>
        <Badge>
          {meQuery.data ? `${meQuery.data.email} (${meQuery.data.role})` : "User: —"}
        </Badge>
        <Button size="sm" variant="secondary" disabled>
          Run
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
