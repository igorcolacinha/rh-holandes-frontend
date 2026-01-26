import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../api/employees";

export function useEmployeesTotal() {
  return useQuery({
    queryKey: ["employees-total"],
    queryFn: async () => {
      // pega só 1 item, mas vem totalElements do backend
      const page = await getEmployees({ page: 0, size: 1 });
      return page.totalElements;
    },
    staleTime: 60_000,
  });
}
