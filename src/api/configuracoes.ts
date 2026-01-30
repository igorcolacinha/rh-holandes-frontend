import { http } from "./http";

export type CampoPersonalizadoJornadaOptionDto = {
  customFieldId: string;
  nome: string;
};

export type CampoPersonalizadoJornadaSelecionadoDto = {
  customFieldId: string | null;
};

export async function listarCamposPersonalizadosJornada() {
  const { data } = await http.get<CampoPersonalizadoJornadaOptionDto[]>(
    "/api/config/jornada/custom-fields/opcoes"
  );
  return data ?? [];
}

export async function obterCampoPersonalizadoJornadaSelecionado() {
  const { data } = await http.get<CampoPersonalizadoJornadaSelecionadoDto>(
    "/api/config/jornada/custom-fields/selecionado"
  );
  return data;
}

export async function salvarCampoPersonalizadoJornadaSelecionado(customFieldId: string) {
  const { data } = await http.put("/api/config/jornada/custom-fields/selecionado", {
    customFieldId,
  });
  return data;
}

/** =========================
 *  NOVO: Jornadas encontradas
 *  ========================= */

export type JornadaEncontradaDto = {
  codigo: number;
  descricao: string;
  diasSemana: number[];
  minutosPorDia: number;
  ativo: boolean;
};

// LISTA (somente leitura)
export async function listarJornadasEncontradas() {
  const { data } = await http.get<JornadaEncontradaDto[]>(
    "/api/config/jornada/valores-encontrados"
  );
  return data ?? [];
}

// GRAVA (mapeamento/configuração)
export async function salvarMapeamentoJornada(payload: JornadaEncontradaDto) {
  const { data } = await http.post("/api/config/jornada/mapeamento", payload);
  return data;
}
