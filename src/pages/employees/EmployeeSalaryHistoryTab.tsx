import { useMemo } from "react";
import { useSalaryHistory } from "../../hooks/useHistoricoSalarial";
import type { SalaryHistoryDTO } from "../../api/historicoSalarial.api";

function formatDateBR(iso?: string) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function formatBRL(value?: number) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Props = {
  colaboradorId: number;
};

export function EmployeeSalaryHistoryTab({ colaboradorId }: Props) {
  const { data, isLoading, isError } = useSalaryHistory(colaboradorId);

  const items = useMemo(() => {
    const arr = (data ?? []).slice();
    // mais recente primeiro
    arr.sort((a, b) => (a.dataInicio < b.dataInicio ? 1 : -1));
    return arr;
  }, [data]);

  if (isLoading) return <div style={{ padding: 16 }}>Carregando histórico salarial...</div>;
  if (isError) return <div style={{ padding: 16 }}>Erro ao carregar histórico salarial.</div>;

  return (
    <div className="empd-card">
      <h2 className="empd-cardTitle">Histórico de Alterações Salariais</h2>

      {items.length === 0 ? (
        <div style={{ paddingTop: 8 }}>Nenhum histórico salarial encontrado.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="empd-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Salário Anterior</th>
                <th>Novo Salário</th>
                <th>Percentual</th>
                <th>Motivo</th>
                <th>Centro de Custo</th>
              </tr>
            </thead>

            <tbody>
              {items.map((row: SalaryHistoryDTO, idx: number) => (
                <tr key={`${row.dataInicio}-${idx}`}>
                  <td>{formatDateBR(row.dataInicio)}</td>
                  <td className="empd-muted">-</td>
                  <td style={{ fontWeight: 700 }}>{formatBRL(row.valorSalario)}</td>
                  <td className="empd-muted">-</td>
                  <td>{row.motivoNome || "-"}</td>
                  <td>{row.nomeCentroCusto || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
