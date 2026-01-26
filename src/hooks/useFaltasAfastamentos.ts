import { useQuery } from "@tanstack/react-query";
import { getFaltasAfastamentos } from "../api/absencesApi";

export function useFaltasAfastamentos(colaboradorId?: number) {
  return useQuery({
    queryKey: ["faltas-afastamentos", colaboradorId],
    queryFn: () => getFaltasAfastamentos(colaboradorId as number),
    enabled: !!colaboradorId,
    staleTime: 60_000,
  });
}
