import { useQuery } from "@tanstack/react-query";
import { getBeneficios } from "../api/benefitsApi";

export function useBeneficios(colaboradorId?: number) {
  return useQuery({
    queryKey: ["beneficios", colaboradorId],
    queryFn: () => getBeneficios(colaboradorId as number),
    enabled: !!colaboradorId,
    staleTime: 60_000,
  });
}
