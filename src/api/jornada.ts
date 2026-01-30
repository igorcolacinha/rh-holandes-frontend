import { http } from "./http";

/**
 * Tipos vindos do backend
 */
export type JornadaVisaoItemDto = {
  codigo: number | null;
  descricao: string | null;
  diasSemana: number[];
  minutosPorDia: number | null;
  ativo: boolean | null;
  configurado: boolean;
};

export type JornadaVisaoDto = {
  customFieldIdSelecionado: string;
  jornadas: JornadaVisaoItemDto[];
};

export type JornadaMapeamentoDto = {
  codigo: number;
  descricao: string;
  diasSemana: number[];
  minutosPorDia: number;
  ativo: boolean;
};

/**
 * GET /api/config/jornada/visao
 * Retorna a visão completa da tela
 */
export async function buscarJornadaVisao() {
  const { data } = await http.get<JornadaVisaoDto>(
    "/api/config/jornada/visao"
  );
  return data;
}

/**
 * POST /api/config/jornada/mapeamento/salvar
 * Salva (cria ou atualiza) o mapeamento de jornada
 */
export async function salvarJornadaMapeamento(
  payload: JornadaMapeamentoDto
) {
  const { data } = await http.post(
    "/api/config/jornada/mapeamento/salvar",
    payload
  );
  return data;
}
