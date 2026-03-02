"use client";

import * as React from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-dvh bg-slate-50">
      <Topbar onMenuClick={() => setMobileOpen((v) => !v)} />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[240px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden border-r border-slate-200 bg-white md:block">
          <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Navigation
          </div>
          <SidebarNav />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-30 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <aside
              className={cn(
                "absolute left-0 top-0 h-full w-72 border-r border-slate-200 bg-white shadow-xl"
              )}
            >
              <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Navigation
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        ) : null}

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
