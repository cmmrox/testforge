import { Badge } from "@/components/ui/badge";

type Props = {
  status: "active" | "archived";
};

export function CaseStatusBadge({ status }: Props) {
  if (status === "active") {
    return <Badge variant="success">Active</Badge>;
  }
  return <Badge variant="default">Archived</Badge>;
}
