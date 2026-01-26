import { useQuery } from "@tanstack/react-query";
import { getAnotacoes } from "../api/notesApi";

export function useAnotacoes(colaboradorId?: number) {
  return useQuery({
    queryKey: ["anotacoes", colaboradorId],
    queryFn: () => getAnotacoes(colaboradorId as number),
    enabled: !!colaboradorId,
    staleTime: 60_000,
  });
}
