import { useQuery } from "@tanstack/react-query";
import { getSalaryHistory } from "../api/historicoSalarial.api";

export function useSalaryHistory(colaboradorId?: number) {
  return useQuery({
    queryKey: ["salary-history", colaboradorId],
    queryFn: () => getSalaryHistory(colaboradorId as number),
    enabled: !!colaboradorId,
    staleTime: 60_000,
  });
}
