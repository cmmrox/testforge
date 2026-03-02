import { useQuery } from "@tanstack/react-query";

import { listAuditLogs, type AuditLogListResponse } from "@/lib/api/audit";

export function useAuditLogs(filters?: {
  entityType?: string;
  entityId?: string;
  cursor?: string;
  limit?: number;
}) {
  return useQuery<AuditLogListResponse>({
    queryKey: ["audit", "logs", filters],
    queryFn: () => listAuditLogs(filters),
  });
}
