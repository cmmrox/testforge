import { apiFetch } from "@/lib/api/apiFetch";

export type UserRole = "admin" | "editor" | "runner" | "viewer";

export type User = {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type AuthSession = {
  user?: User;
  expiresAt?: string;
};

export async function login(body: { email: string; password: string }) {
  return apiFetch<AuthSession>("/auth/login", { method: "POST", body });
}

export async function logout() {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

export async function me() {
  return apiFetch<User>("/auth/me");
}
