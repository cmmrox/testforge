"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onMenuClick} className="md:hidden">
          Menu
        </Button>
        <div className="text-sm font-semibold text-slate-900">TestForge</div>
      </div>

      <div className="flex items-center gap-2">
        <Badge>Project: —</Badge>
        <Badge>Env: —</Badge>
        <Button size="sm" variant="secondary" disabled>
          Run
        </Button>
      </div>
    </header>
  );
}
