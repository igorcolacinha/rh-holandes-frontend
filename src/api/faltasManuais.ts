import { http } from "./http";

export type FaltaManualDTO = {
  id: number;
  colaboradorId: number;
  motivo?: string | null;
  tipo?: string | null;
  dataInicio: string;
  dataFim?: string | null;
  totalDias?: number | null;
  cid?: string | null;
  justificativa?: string | null;
};

export type CreateFaltaManualPayload = {
  colaboradorId: number;
  motivo?: string;
  tipo?: string;
  dataInicio: string;
  dataFim?: string;
  totalDias?: number;
  cid?: string;
  justificativa?: string;
};

export async function getFaltasManuais(colaboradorId: number) {
  const { data } = await http.get<FaltaManualDTO[]>("/api/faltas-manuais", {
    params: { colaboradorId },
  });
  return data;
}

export async function deleteFaltaManual(id: number) {
  await http.delete(`/api/faltas-manuais/${id}`);
}

export async function createFaltaManual(payload: CreateFaltaManualPayload) {
  const { data } = await http.post<FaltaManualDTO>("/api/faltas-manuais", payload);
  return data;
}
