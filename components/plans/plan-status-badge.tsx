import { Badge } from "@/components/ui/badge";

type Props = {
  status: "draft" | "approved" | "archived";
};

export function PlanStatusBadge({ status }: Props) {
  if (status === "approved") {
    return <Badge variant="success">Approved</Badge>;
  }
  if (status === "draft") {
    return <Badge variant="warning">Draft</Badge>;
  }
  return <Badge variant="default">Archived</Badge>;
}
