import { apiFetch } from "@/lib/api/apiFetch";

export type AuditLogEntry = {
  id: string;
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  at: string;
  details?: Record<string, unknown>;
};

export type AuditLogListResponse = {
  data: AuditLogEntry[];
  nextCursor?: string;
};

export async function listAuditLogs(params?: {
  entityType?: string;
  entityId?: string;
  cursor?: string;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.entityType) qs.set("entityType", params.entityType);
  if (params?.entityId) qs.set("entityId", params.entityId);
  if (params?.cursor) qs.set("cursor", params.cursor);
  if (params?.limit) qs.set("limit", String(params.limit));

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AuditLogListResponse>(`/audit/logs${suffix}`);
}
