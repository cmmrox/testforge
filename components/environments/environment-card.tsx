"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Environment } from "@/lib/api/environments";
import { ConnectionTestButton } from "./connection-test-button";

type Props = {
  environment: Environment;
  onEdit: () => void;
  onDelete: () => void;
};

export function EnvironmentCard({ environment, onEdit, onDelete }: Props) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        {/* Name row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-semibold text-slate-900">{environment.name}</span>
            <code className="block truncate text-xs text-slate-600 font-mono">
              {environment.baseUrl}
            </code>
          </div>

          {/* Badges */}
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            {environment.loginRecipe ? (
              <>
                <Badge variant="success">Login Recipe ✓</Badge>
                {environment.loginRecipe.totpEnabled && (
                  <Badge variant="warning">TOTP</Badge>
                )}
              </>
            ) : (
              <Badge>No Login Recipe</Badge>
            )}
          </div>
        </div>

        {/* Created date */}
        <p className="text-xs text-slate-400">
          Created {new Date(environment.createdAt).toLocaleDateString()}
        </p>

        {/* Actions row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <ConnectionTestButton environmentId={environment.id} />
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
