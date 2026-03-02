import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { ProjectProvider } from "@/lib/context/project-context";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <ProjectProvider>
        <AppShell>{children}</AppShell>
      </ProjectProvider>
    </AuthGuard>
  );
}
