"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "@/lib/api/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";

  const qc = useQueryClient();
  const [email, setEmail] = React.useState("admin@testforge.local");
  const [password, setPassword] = React.useState("password");

  const mutation = useMutation({
    mutationFn: () => {
      // Ensure proxy can inject the mock session for the login call.
      // (Prism enforces cookie auth globally in the current OpenAPI.)
      document.cookie = "tf_logged_out=; Max-Age=0; path=/";
      return login({ email, password });
    },
    onSuccess: async () => {
      // Clear mock logout flag (if any)
      document.cookie = "tf_logged_out=; Max-Age=0; path=/";

      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
      router.replace(next);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {mutation.isError ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              Login failed. Check credentials or mock server.
            </div>
          ) : null}

          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing in…" : "Sign in"}
          </Button>

          <div className="text-xs text-slate-500">
            Note: In mock mode, any credentials may work depending on Prism config.
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
