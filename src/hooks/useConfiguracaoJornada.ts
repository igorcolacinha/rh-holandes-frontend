import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listarCamposPersonalizadosJornada,
  obterCampoPersonalizadoJornadaSelecionado,
  salvarCampoPersonalizadoJornadaSelecionado,
} from "../api/configuracoes";

import {
  buscarJornadaVisao,
  salvarJornadaMapeamento,
  type JornadaMapeamentoDto,
} from "../api/jornada";

export function useCamposPersonalizadosJornada() {
  return useQuery({
    queryKey: ["config", "jornada", "custom-fields", "opcoes"],
    queryFn: listarCamposPersonalizadosJornada,
    staleTime: 60_000,
  });
}

export function useCampoPersonalizadoJornadaSelecionado() {
  return useQuery({
    queryKey: ["config", "jornada", "custom-fields", "selecionado"],
    queryFn: obterCampoPersonalizadoJornadaSelecionado,
    staleTime: 5_000,
  });
}

export function useSalvarCampoPersonalizadoJornada() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (customFieldId: string) =>
      salvarCampoPersonalizadoJornadaSelecionado(customFieldId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["config", "jornada", "custom-fields", "selecionado"] });
      qc.invalidateQueries({ queryKey: ["config", "jornada", "custom-fields", "opcoes"] });
      qc.invalidateQueries({ queryKey: ["config", "jornada", "visao"] });
    },
  });
}

export function useJornadaVisao(enabled: boolean) {
  return useQuery({
    queryKey: ["config", "jornada", "visao"],
    queryFn: buscarJornadaVisao,
    enabled,
    staleTime: 10_000,
  });
}

export function useSalvarMapeamentoJornada() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: JornadaMapeamentoDto) => salvarJornadaMapeamento(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["config", "jornada", "visao"] });
    },
  });
}
