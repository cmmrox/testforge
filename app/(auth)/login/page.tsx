import { Suspense } from "react";

import { LoginForm } from "@/app/(auth)/login/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <div className="text-sm font-semibold text-slate-900">TestForge</div>
          <div className="mt-1 text-sm text-slate-600">Sign in to continue.</div>
        </div>

        <Suspense fallback={<div className="text-sm text-slate-600">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
