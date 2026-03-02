"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/lib/api/auth";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const qc = useQueryClient();
  const meQuery = useCurrentUser();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
      // AuthGuard will redirect.
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
        <Badge>Project: —</Badge>
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
