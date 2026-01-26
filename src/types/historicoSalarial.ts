// src/types/historicoSalarial.ts

export type HistoricoSalarialDTO = {
  descricao: string;
  valorSalario: string; // vem como string do JSON (BigDecimal)
  motivoNome: string;
  nomeCentroCusto: string;
  dataInicio: string; // ISO yyyy-MM-dd (LocalDate)
};
