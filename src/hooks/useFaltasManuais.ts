import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFaltaManual, deleteFaltaManual, getFaltasManuais, type CreateFaltaManualPayload } from "../api/faltasManuais";

export function useFaltasManuais(colaboradorId: number) {
  return useQuery({
    queryKey: ["faltasManuais", colaboradorId],
    queryFn: () => getFaltasManuais(colaboradorId),
    enabled: Number.isFinite(colaboradorId) && colaboradorId > 0,
    staleTime: 30_000,
  });
}

export function useDeleteFaltaManual(colaboradorId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFaltaManual(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faltasManuais", colaboradorId] });
    },
  });
}

export function useCreateFaltaManual(colaboradorId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFaltaManualPayload) => createFaltaManual(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faltasManuais", colaboradorId] });
    },
  });
}
