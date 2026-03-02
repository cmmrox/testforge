import { useQuery } from "@tanstack/react-query";

import { me, type User } from "@/lib/api/auth";

export function useCurrentUser() {
  return useQuery<User, unknown>({
    queryKey: ["auth", "me"],
    queryFn: me,
    staleTime: 30_000,
  });
}
