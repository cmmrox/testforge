import { Badge } from "@/components/ui/badge";

export function RunStatusBadge({
  status,
}: {
  status: "queued" | "running" | "passed" | "failed" | "canceled";
}) {
  switch (status) {
    case "passed":
      return <Badge variant="success">Passed</Badge>;
    case "failed":
      return <Badge variant="danger">Failed</Badge>;
    case "running":
      return <Badge variant="warning">Running</Badge>;
    case "queued":
      return <Badge variant="warning">Queued</Badge>;
    case "canceled":
      return <Badge>Cancelled</Badge>;
  }
}
