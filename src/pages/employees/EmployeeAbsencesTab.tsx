import { useMemo } from "react";
import { useFaltasAfastamentos } from "../../hooks/useFaltasAfastamentos";
import type { FaltaAfastamentoDTO } from "../../api/absencesApi";

function formatDateBR(iso?: string) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

type Props = {
  colaboradorId: number;
};

export function EmployeeAbsencesTab({ colaboradorId }: Props) {
  const { data, isLoading, isError } = useFaltasAfastamentos(colaboradorId);

  const items = useMemo(() => {
    const arr = (data ?? []).slice();
    // mais recente primeiro (por dataInicio)
    arr.sort((a, b) => (a.dataInicio < b.dataInicio ? 1 : -1));
    return arr;
  }, [data]);

  if (isLoading) return <div style={{ padding: 16 }}>Carregando faltas e afastamentos...</div>;
  if (isError) return <div style={{ padding: 16 }}>Erro ao carregar faltas e afastamentos.</div>;

  return (
    <div className="empd-card">
      <h2 className="empd-cardTitle">Histórico de Faltas e Afastamentos</h2>

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
              </tr>
            </thead>

            <tbody>
              {items.map((row: FaltaAfastamentoDTO, idx: number) => (
                <tr key={`${row.dataInicio}-${idx}`}>
                  <td>{row.motivo || "-"}</td>
                  <td>{formatDateBR(row.dataInicio)}</td>
                  <td>{formatDateBR(row.dataFim)}</td>
                  <td style={{ fontWeight: 700 }}>{row.totalDias ?? "-"}</td>
                  <td>{row.justificativa || "-"}</td>
                  <td>{row.cid || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
