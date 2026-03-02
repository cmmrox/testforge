import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { ProjectProvider } from "@/lib/context/project-context";
import { EnvironmentProvider } from "@/lib/context/environment-context";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <ProjectProvider>
        <EnvironmentProvider>
          <AppShell>{children}</AppShell>
        </EnvironmentProvider>
      </ProjectProvider>
    </AuthGuard>
  );
}
