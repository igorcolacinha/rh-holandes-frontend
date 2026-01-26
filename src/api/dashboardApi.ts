import axios from "axios";

export type FaltasDashboardDto = {
  totalMesAtual: number;
  diferencaMesAnterior: number;
};

export async function getFaltasDashboard(): Promise<FaltasDashboardDto> {
  const { data } = await axios.get<FaltasDashboardDto>(
    "http://localhost:8080/api/dashboard/faltas"
  );
  return data;
}
