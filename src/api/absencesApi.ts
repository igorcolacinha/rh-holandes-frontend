import axios from "axios";

export type FaltaAfastamentoDTO = {
  motivo: string;
  totalDias: number;
  dataInicio: string; // LocalDate -> "YYYY-MM-DD"
  dataFim: string;    // LocalDate -> "YYYY-MM-DD"
  justificativa: string;
  cid: string;
};

const BASE_URL = "http://localhost:8080";
const ENDPOINT = "/api/faltas-afastamentos";

export async function getFaltasAfastamentos(colaboradorId: number): Promise<FaltaAfastamentoDTO[]> {
  const { data } = await axios.get<FaltaAfastamentoDTO[]>(`${BASE_URL}${ENDPOINT}`, {
    params: { colaboradorId },
  });

  return data ?? [];
}
