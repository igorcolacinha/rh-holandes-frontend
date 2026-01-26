import axios from "axios";

export type SalaryHistoryDTO = {
  descricao: string;
  valorSalario: number;       // BigDecimal -> number (se vier string, ajustamos já já)
  motivoNome: string;
  nomeCentroCusto: string;
  dataInicio: string;         // LocalDate -> "YYYY-MM-DD"
};

const BASE_URL = "http://localhost:8080";
const ENDPOINT = "/api/historicos-salariais";

export async function getSalaryHistory(colaboradorId: number): Promise<SalaryHistoryDTO[]> {
  const { data } = await axios.get<SalaryHistoryDTO[]>(`${BASE_URL}${ENDPOINT}`, {
    params: { colaboradorId },
  });

  // Se o back mandar valorSalario como string, converte aqui com segurança:
  return (data ?? []).map((x) => ({
    ...x,
    valorSalario: typeof (x as any).valorSalario === "string" ? Number((x as any).valorSalario) : x.valorSalario,
  }));
}
