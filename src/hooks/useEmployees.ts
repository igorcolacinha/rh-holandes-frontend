import { useQuery } from "@tanstack/react-query";
import { getEmployees, type GetEmployeesParams } from "../api/employees";

export function useEmployees(params: GetEmployeesParams) {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => getEmployees(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev, // mantém a tabela ao trocar página
  });
}
