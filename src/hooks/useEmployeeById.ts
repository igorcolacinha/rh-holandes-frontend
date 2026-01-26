import { useQuery } from "@tanstack/react-query";
import { getEmployeeById } from "../api/employees";

export function useEmployeeById(id?: string) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id as string),
    enabled: !!id,
    staleTime: 60_000,
  });
}
