import { useEffect, useState } from "react";
import "../../styles/configuracoes.css";
import {
  useCamposPersonalizadosJornada,
  useCampoPersonalizadoJornadaSelecionado,
  useSalvarCampoPersonalizadoJornada,
  useJornadaVisao,
  useSalvarMapeamentoJornada,
} from "../../hooks/useConfiguracaoJornada";

import type { JornadaMapeamentoDto, JornadaVisaoItemDto } from "../../api/jornada";

type TabKey = "vtvr" | "geral" | "notificacoes";

const DIAS = [
  { n: 1, label: "Seg" },
  { n: 2, label: "Ter" },
  { n: 3, label: "Qua" },
  { n: 4, label: "Qui" },
  { n: 5, label: "Sex" },
  { n: 6, label: "Sáb" },
  { n: 7, label: "Dom" },
];

function formatarDias(dias: number[] | null | undefined) {
  const map = new Map(DIAS.map((d) => [d.n, d.label]));
  return (dias ?? []).map((n) => map.get(n) ?? String(n)).join(", ");
}

function minutosParaHHMM(total: number | null | undefined) {
  const v = total ?? 0;
  const h = Math.floor(v / 60);
  const m = v % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function ConfiguracoesPage() {
  const [tab, setTab] = useState<TabKey>("vtvr");

  // Campo personalizado (Jornada)
  const camposQuery = useCamposPersonalizadosJornada();
  const selecionadoQuery = useCampoPersonalizadoJornadaSelecionado();
  const salvarCampoMutation = useSalvarCampoPersonalizadoJornada();

  const [customFieldIdSelecionado, setCustomFieldIdSelecionado] = useState("");

  useEffect(() => {
    const id = selecionadoQuery.data?.customFieldId ?? "";
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomFieldIdSelecionado((prev) => (prev ? prev : id));
  }, [selecionadoQuery.data?.customFieldId]);

  function onSalvarCampoPersonalizado() {
    if (!customFieldIdSelecionado) {
      alert("Selecione um campo personalizado.");
      return;
    }

    salvarCampoMutation.mutate(customFieldIdSelecionado, {
      onSuccess: () => alert("Campo personalizado salvo!"),
      onError: () => alert("Erro ao salvar campo personalizado."),
    });
  }

  // Visão (só carrega quando existe um campo configurado)
  const temCampoConfigurado = !!(selecionadoQuery.data?.customFieldId ?? "");
  const visaoQuery = useJornadaVisao(temCampoConfigurado);
  const salvarJornadaMutation = useSalvarMapeamentoJornada();

  // Modal de edição
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<JornadaVisaoItemDto | null>(null);

  function abrirEdicao(j: JornadaVisaoItemDto) {
    // Garantir defaults para não dar undefined nos inputs
    setEditando({
      ...j,
      descricao: j.descricao ?? "",
      diasSemana: j.diasSemana ?? [],
      minutosPorDia: j.minutosPorDia ?? 0,
      ativo: j.ativo ?? false,
    });
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditando(null);
  }

  function toggleDia(n: number) {
    if (!editando) return;
    const atual = new Set(editando.diasSemana ?? []);
    if (atual.has(n)) atual.delete(n);
    else atual.add(n);

    setEditando({
      ...editando,
      diasSemana: Array.from(atual).sort((a, b) => a - b),
    });
  }

  function salvarEdicao() {
    if (!editando) return;

    if (editando.codigo == null) {
      alert("Código é obrigatório.");
      return;
    }

    const payload: JornadaMapeamentoDto = {
      codigo: editando.codigo,
      descricao: (editando.descricao ?? "").trim(),
      diasSemana: editando.diasSemana ?? [],
      minutosPorDia: editando.minutosPorDia ?? 0,
      ativo: !!editando.ativo,
    };

    if (!payload.descricao) {
      alert("Descrição é obrigatória.");
      return;
    }
    if (!payload.diasSemana.length) {
      alert("Selecione ao menos 1 dia da semana.");
      return;
    }

    salvarJornadaMutation.mutate(payload, {
      onSuccess: () => {
        alert("Jornada salva!");
        fecharModal();
      },
      onError: () => alert("Erro ao salvar jornada."),
    });
  }

  return (
    <div className="cfg-page">
      {/* Header */}
      <div className="cfg-header">
        <div className="cfg-header-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M19.4 15a7.9 7.9 0 0 0 .1-1l2-1.5-2-3.5-2.4.6a8 8 0 0 0-1.7-1L15 6l-4-.5L9.6 7.6a8 8 0 0 0-1.7 1L5.5 8 3.5 11.5l2 1.5a7.9 7.9 0 0 0 .1 1l-2 1.5 2 3.5 2.4-.6a8 8 0 0 0 1.7 1L9 18l4 .5 1.4-2.1a8 8 0 0 0 1.7-1l2.4.6 2-3.5-2-1.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <h1 className="cfg-title">Configurações</h1>
          <div className="cfg-subtitle">Gerencie as configurações do sistema</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="cfg-tabs">
        <button
          className={`cfg-tab ${tab === "vtvr" ? "active" : ""}`}
          onClick={() => setTab("vtvr")}
          type="button"
        >
          Processamento VT/VR
        </button>
        <button
          className={`cfg-tab ${tab === "geral" ? "active" : ""}`}
          onClick={() => setTab("geral")}
          type="button"
        >
          Geral
        </button>
        <button
          className={`cfg-tab ${tab === "notificacoes" ? "active" : ""}`}
          onClick={() => setTab("notificacoes")}
          type="button"
        >
          Notificações
        </button>
      </div>

      <section className="cfg-card">
        {tab === "vtvr" && (
          <>
            <h2 className="cfg-card-title">Processamento VT/VR</h2>

            {/* Campo Personalizado Jornada */}
            <div className="cfg-field">
              <label className="cfg-label">Campo Personalizado Jornada</label>

              <select
                className="cfg-select"
                value={customFieldIdSelecionado}
                onChange={(e) => setCustomFieldIdSelecionado(e.target.value)}
                disabled={camposQuery.isLoading}
              >
                <option value="">
                  {camposQuery.isLoading ? "Carregando..." : "Selecionar campo"}
                </option>

                {(camposQuery.data ?? []).map((item) => (
                  <option key={item.customFieldId} value={item.customFieldId}>
                    {item.nome}
                  </option>
                ))}
              </select>

              <div className="cfg-help">
                Selecione qual campo personalizado do Convenia representa a jornada do colaborador.
              </div>
            </div>

            <div className="cfg-actions" style={{ justifyContent: "flex-start" }}>
              <button
                className="cfg-btn cfg-btn-primary"
                type="button"
                onClick={onSalvarCampoPersonalizado}
                disabled={salvarCampoMutation.isPending}
              >
                {salvarCampoMutation.isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>

            <div className="cfg-divider" />

            {/* Jornadas Encontradas */}
            <h3 className="cfg-card-title" style={{ fontSize: 16, marginTop: 6 }}>
              Jornadas encontradas
            </h3>

            {!temCampoConfigurado && (
              <div className="cfg-help">
                Configure o campo personalizado de jornada para carregar as jornadas encontradas.
              </div>
            )}

            {temCampoConfigurado && visaoQuery.isLoading && (
              <div className="cfg-help">Carregando jornadas...</div>
            )}

            {temCampoConfigurado && visaoQuery.isError && (
              <div className="cfg-help">Erro ao carregar jornadas encontradas.</div>
            )}

            {temCampoConfigurado &&
              !visaoQuery.isLoading &&
              (visaoQuery.data?.jornadas ?? []).length === 0 && (
                <div className="cfg-help">
                  Nenhuma jornada encontrada para o campo configurado.
                </div>
              )}

            <div className="cfg-list">
              {(visaoQuery.data?.jornadas ?? []).map((j) => (
                <div key={j.codigo ?? Math.random()} className="cfg-row">
                  <div className="cfg-row-main">
                    <div className="cfg-row-title">
                      {j.descricao ?? "(Sem descrição)"}{" "}
                      {j.configurado ? (
                        <span className="cfg-badge">Configurado</span>
                      ) : (
                        <span className="cfg-badge cfg-badge-muted">
                          Não configurado
                        </span>
                      )}{" "}
                      {j.ativo ? (
                        <span className="cfg-badge">Ativo</span>
                      ) : (
                        <span className="cfg-badge cfg-badge-muted">Inativo</span>
                      )}
                    </div>
                    <div className="cfg-row-sub">
                      Dias: {formatarDias(j.diasSemana)} • Min/dia:{" "}
                      {j.minutosPorDia ?? 0} ({minutosParaHHMM(j.minutosPorDia)})
                    </div>
                  </div>

                  <button
                    className="cfg-btn cfg-btn-ghost"
                    type="button"
                    onClick={() => abrirEdicao(j)}
                  >
                    Configurar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "geral" && (
          <>
            <h2 className="cfg-card-title">Geral</h2>
            <div className="cfg-help">Em construção.</div>
          </>
        )}

        {tab === "notificacoes" && (
          <>
            <h2 className="cfg-card-title">Notificações</h2>
            <div className="cfg-help">Em construção.</div>
          </>
        )}
      </section>

      {/* MODAL */}
      {modalAberto && editando && (
        <div className="cfg-modal-overlay" role="dialog" aria-modal="true">
          <div className="cfg-modal">
            <div className="cfg-modal-header">
              <div>
                <div className="cfg-modal-title">Configurar jornada</div>
                <div className="cfg-help">Código: {editando.codigo ?? "-"}</div>
              </div>
              <button className="cfg-btn cfg-btn-ghost" type="button" onClick={fecharModal}>
                Fechar
              </button>
            </div>

            <div className="cfg-grid-2">
              <div className="cfg-field">
                <label className="cfg-label">Código da jornada</label>
                <input
                  className="cfg-input"
                  type="number"
                  min={0}
                  value={editando.codigo ?? 0}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      codigo: Number(e.target.value),
                    })
                  }
                />
                <div className="cfg-help">
                  Código utilizado para identificar a jornada no mapeamento.
                </div>
              </div>
            </div>

            <div className="cfg-field">
              <label className="cfg-label">Descrição</label>
              <input
                className="cfg-input"
                value={editando.descricao ?? ""}
                onChange={(e) => setEditando({ ...editando, descricao: e.target.value })}
              />
            </div>

            <div className="cfg-grid-2">
              <div className="cfg-field">
                <label className="cfg-label">Minutos por dia</label>
                <input
                  className="cfg-input"
                  type="number"
                  min={0}
                  value={editando.minutosPorDia ?? 0}
                  onChange={(e) =>
                    setEditando({ ...editando, minutosPorDia: Number(e.target.value) })
                  }
                />
                <div className="cfg-help">Ex.: 480 = 08:00</div>
              </div>

              <div className="cfg-field">
                <label className="cfg-label">Ativo</label>
                <select
                  className="cfg-select"
                  value={editando.ativo ? "true" : "false"}
                  onChange={(e) => setEditando({ ...editando, ativo: e.target.value === "true" })}
                >
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>
            </div>

            <div className="cfg-field">
              <label className="cfg-label">Dias da semana</label>
              <div className="cfg-weekdays">
                {DIAS.map((d) => (
                  <label key={d.n} className="cfg-day">
                    <input
                      type="checkbox"
                      checked={(editando.diasSemana ?? []).includes(d.n)}
                      onChange={() => toggleDia(d.n)}
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>
              <div className="cfg-help">
                1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb, 7=Dom
              </div>
            </div>

            <div className="cfg-actions">
              <button className="cfg-btn cfg-btn-ghost" type="button" onClick={fecharModal}>
                Cancelar
              </button>
              <button
                className="cfg-btn cfg-btn-primary"
                type="button"
                onClick={salvarEdicao}
                disabled={salvarJornadaMutation.isPending}
              >
                {salvarJornadaMutation.isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
