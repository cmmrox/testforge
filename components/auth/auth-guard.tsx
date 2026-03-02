"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const meQuery = useCurrentUser();

  React.useEffect(() => {
    if (meQuery.isError) {
      // For Prism mock: auth failures come back as 401.
      // We treat any error as unauthenticated for now.
      const next = encodeURIComponent(pathname ?? "/dashboard");
      router.replace(`/login?next=${next}`);
    }
  }, [meQuery.isError, pathname, router]);

  if (meQuery.isLoading) {
    return (
      <div className="min-h-dvh bg-slate-50">
        <div className="mx-auto max-w-md px-4 py-10 text-sm text-slate-600">Loading session…</div>
      </div>
    );
  }

  if (meQuery.isError) {
    return (
      <div className="min-h-dvh bg-slate-50">
        <div className="mx-auto max-w-md px-4 py-10 text-sm text-slate-600">
          Redirecting to login…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
