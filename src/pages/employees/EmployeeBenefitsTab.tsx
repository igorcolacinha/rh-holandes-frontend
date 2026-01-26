import { useMemo } from "react";
import { useBeneficios } from "../../hooks/useBeneficios";
import type { BeneficioDTO } from "../../api/benefitsApi";

function formatBRL(value?: number) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Props = {
  colaboradorId: number;
};

export function EmployeeBenefitsTab({ colaboradorId }: Props) {
  const { data, isLoading, isError } = useBeneficios(colaboradorId);

  const items = useMemo(() => (data ?? []).slice(), [data]);

  if (isLoading) return <div style={{ padding: 16 }}>Carregando benefícios...</div>;
  if (isError) return <div style={{ padding: 16 }}>Erro ao carregar benefícios.</div>;

  return (
    <div className="empd-card">
      <h2 className="empd-cardTitle">Benefícios</h2>

      {items.length === 0 ? (
        <div style={{ paddingTop: 8 }}>Nenhum benefício encontrado.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="empd-table">
            <thead>
              <tr>
                <th>Benefício</th>
                <th>Valor</th>
                <th>Operadora</th>
                <th>Tipo Benefício</th>
              </tr>
            </thead>

            <tbody>
              {items.map((row: BeneficioDTO, idx: number) => (
                <tr key={`${row.nomeBeneficio}-${idx}`}>
                  <td style={{ fontWeight: 700 }}>{row.nomeBeneficio || "-"}</td>
                  <td>{formatBRL(row.valorEmpresa)}</td>
                  <td>{row.operadora || "-"}</td>
                  <td>{row.tipoBeneficio || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
