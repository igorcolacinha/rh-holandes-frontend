import axios from "axios";

export type AnotacaoDTO = {
  titulo: string;
  conteudo: string;
  dataAnotacao: string; // LocalDate -> "YYYY-MM-DD"
};

const BASE_URL = "http://localhost:8080";
const ENDPOINT = "/api/anotacoes";

export async function getAnotacoes(colaboradorId: number): Promise<AnotacaoDTO[]> {
  const { data } = await axios.get<AnotacaoDTO[]>(`${BASE_URL}${ENDPOINT}`, {
    params: { colaboradorId },
  });

  return data ?? [];
}
