import axios from "axios";

export type BeneficioDTO = {
  nomeBeneficio: string;
  valorEmpresa: number; // BigDecimal -> number (se vier string, converte abaixo)
  tipoBeneficio: string;
  operadora: string;
};

const BASE_URL = "http://localhost:8080";
const ENDPOINT = "/api/beneficios";

export async function getBeneficios(colaboradorId: number): Promise<BeneficioDTO[]> {
  const { data } = await axios.get<BeneficioDTO[]>(`${BASE_URL}${ENDPOINT}`, {
    params: { colaboradorId },
  });

  // se o back mandar BigDecimal como string, converte aqui
  return (data ?? []).map((x) => ({
    ...x,
    valorEmpresa:
      typeof (x as any).valorEmpresa === "string"
        ? Number((x as any).valorEmpresa)
        : x.valorEmpresa,
  }));
}
