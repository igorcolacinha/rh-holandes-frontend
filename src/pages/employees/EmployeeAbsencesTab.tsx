import { useMemo, useState } from "react";
import { useFaltasAfastamentos } from "../../hooks/useFaltasAfastamentos";
import { useCreateFaltaManual, useDeleteFaltaManual, useFaltasManuais } from "../../hooks/useFaltasManuais";
import type { FaltaAfastamentoDTO } from "../../api/absencesApi";

function formatDateBR(iso?: string | null) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

type Props = {
  colaboradorId: number;
};

type Origem = "Convenia" | "Manual";

type AbsenceRow = {
  id: string;
  motivo?: string | null;
  tipo?: string | null;
  dataInicio?: string | null;
  dataFim?: string | null;
  totalDias?: number | null;
  justificativa?: string | null;
  cid?: string | null;

  origem: Origem;
  manualId?: number;
};

export function EmployeeAbsencesTab({ colaboradorId }: Props) {
  const convenia = useFaltasAfastamentos(colaboradorId);
  const manuais = useFaltasManuais(colaboradorId);

  const delManual = useDeleteFaltaManual(colaboradorId);
  const createManual = useCreateFaltaManual(colaboradorId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    tipo: "FALTA",
    motivo: "",
    dataInicio: "",
    dataFim: "",
    totalDias: "",
    cid: "",
    justificativa: "",
  });

  const isLoading = convenia.isLoading || manuais.isLoading;
  const isError = convenia.isError || manuais.isError;

  const items = useMemo<AbsenceRow[]>(() => {
    const conveniaRows: AbsenceRow[] = (convenia.data ?? []).map((r: FaltaAfastamentoDTO, idx) => ({
      id: `conv-${r.dataInicio ?? "na"}-${r.dataFim ?? "na"}-${idx}`,
      motivo: r.motivo ?? null,
      tipo: (r as any).tipo ?? null,
      dataInicio: r.dataInicio ?? null,
      dataFim: r.dataFim ?? null,
      totalDias: r.totalDias ?? null,
      justificativa: r.justificativa ?? null,
      cid: r.cid ?? null,
      origem: "Convenia",
    }));

    const manualRows: AbsenceRow[] = (manuais.data ?? []).map((r) => ({
      id: `man-${r.id}`,
      motivo: r.motivo ?? null,
      tipo: r.tipo ?? null,
      dataInicio: r.dataInicio ?? null,
      dataFim: r.dataFim ?? null,
      totalDias: r.totalDias ?? null,
      justificativa: r.justificativa ?? null,
      cid: r.cid ?? null,
      origem: "Manual",
      manualId: r.id,
    }));

    const merged = [...conveniaRows, ...manualRows];

    merged.sort((a, b) => {
      const da = a.dataInicio ?? "";
      const db = b.dataInicio ?? "";
      return da < db ? 1 : -1;
    });

    return merged;
  }, [convenia.data, manuais.data]);

  if (isLoading) return <div style={{ padding: 16 }}>Carregando faltas e afastamentos...</div>;
  if (isError) return <div style={{ padding: 16 }}>Erro ao carregar faltas e afastamentos.</div>;

  async function handleDeleteManual(manualId: number) {
    const ok = window.confirm("Tem certeza que deseja remover esta falta manual?");
    if (!ok) return;

    try {
      await delManual.mutateAsync(manualId);
    } catch {
      alert("Erro ao remover falta manual.");
    }
  }

  function openModal() {
    setForm({
      tipo: "FALTA",
      motivo: "",
      dataInicio: "",
      dataFim: "",
      totalDias: "",
      cid: "",
      justificativa: "",
    });
    setIsModalOpen(true);
  }

  async function handleSubmit() {
    if (!form.dataInicio) {
      alert("Informe a data de início.");
      return;
    }

    try {
      await createManual.mutateAsync({
        colaboradorId,
        tipo: form.tipo,
        motivo: form.motivo || undefined,
        dataInicio: form.dataInicio,
        dataFim: form.dataFim || undefined,
        totalDias: form.totalDias ? Number(form.totalDias) : undefined,
        cid: form.cid || undefined,
        justificativa: form.justificativa || undefined,
      });

      setIsModalOpen(false);
    } catch {
      alert("Erro ao salvar falta manual. Verifique os campos.");
    }
  }

  return (
    <div className="empd-card">
      {/* ✅ Cabeçalho correto */}
      <div className="empd-cardHeader">
        <h2 className="empd-cardTitle" style={{ margin: 0 }}>
          Histórico de Faltas e Afastamentos
        </h2>

        <button className="empd-btnPrimary" onClick={openModal}>
          + Incluir falta manual
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ paddingTop: 8 }}>Nenhum registro encontrado.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="empd-table">
            <thead>
              <tr>
                <th>Motivo</th>
                <th>Data Início</th>
                <th>Data Fim</th>
                <th>Dias</th>
                <th>Justificativa</th>
                <th>CID</th>
                <th>Origem</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {items.map((row) => {
                const canDelete = row.origem === "Manual" && typeof row.manualId === "number";

                return (
                  <tr key={row.id}>
                    <td>{row.motivo || "-"}</td>
                    <td>{formatDateBR(row.dataInicio)}</td>
                    <td>{formatDateBR(row.dataFim)}</td>
                    <td style={{ fontWeight: 700 }}>{row.totalDias ?? "-"}</td>
                    <td>{row.justificativa || "-"}</td>
                    <td>{row.cid || "-"}</td>

                    <td>
                      <span className={`empd-pill ${row.origem === "Manual" ? "empd-pill--manual" : "empd-pill--convenia"}`}>
                        {row.origem}
                      </span>
                    </td>

                    <td>
                      <button
                        className="empd-btnDangerLink"
                        disabled={!canDelete || delManual.isPending}
                        onClick={() => row.manualId && handleDeleteManual(row.manualId)}
                        title={canDelete ? "Remover falta manual" : "Somente registros manuais podem ser removidos"}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {delManual.isError ? (
            <div style={{ paddingTop: 8, color: "crimson" }}>Falha ao remover falta manual.</div>
          ) : null}
        </div>
      )}

      {/* ✅ Modal com classes novas */}
      {isModalOpen ? (
        <div className="empd-modalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="empd-modalCard" onClick={(e) => e.stopPropagation()}>
            <h3 className="empd-modalTitle">Incluir falta manual</h3>

            <div className="empd-modalGrid">
              <label>
                Tipo
                <select value={form.tipo} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}>
                  <option value="FALTA">Falta</option>
                  <option value="AFASTAMENTO">Afastamento</option>
                  <option value="FERIAS">Férias</option>
                  <option value="ATESTADO">Atestado</option>
                </select>
              </label>

              <label>
                Motivo
                <input value={form.motivo} onChange={(e) => setForm((p) => ({ ...p, motivo: e.target.value }))} />
              </label>

              <label>
                Data início *
                <input
                  type="date"
                  value={form.dataInicio}
                  onChange={(e) => setForm((p) => ({ ...p, dataInicio: e.target.value }))}
                />
              </label>

              <label>
                Data fim
                <input
                  type="date"
                  value={form.dataFim}
                  onChange={(e) => setForm((p) => ({ ...p, dataFim: e.target.value }))}
                />
              </label>

              <label>
                Total dias
                <input
                  type="number"
                  min={0}
                  value={form.totalDias}
                  onChange={(e) => setForm((p) => ({ ...p, totalDias: e.target.value }))}
                />
              </label>

              <label>
                CID
                <input value={form.cid} onChange={(e) => setForm((p) => ({ ...p, cid: e.target.value }))} />
              </label>

              <label className="empd-modalGridFull">
                Justificativa
                <textarea
                  rows={3}
                  value={form.justificativa}
                  onChange={(e) => setForm((p) => ({ ...p, justificativa: e.target.value }))}
                />
              </label>
            </div>

            <div className="empd-modalActions">
              <button className="empd-btnSecondary" onClick={() => setIsModalOpen(false)} disabled={createManual.isPending}>
                Cancelar
              </button>

              <button className="empd-btnPrimary" onClick={handleSubmit} disabled={createManual.isPending}>
                {createManual.isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
