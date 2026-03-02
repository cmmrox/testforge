import type { UserRole } from "@/lib/api/auth";

export function canEdit(role: UserRole | undefined) {
  return role === "admin" || role === "editor";
}

export function canRun(role: UserRole | undefined) {
  return role === "admin" || role === "editor" || role === "runner";
}
