import { useMemo } from "react";
import { useAnotacoes } from "../../hooks/useAnotacoes";
import type { AnotacaoDTO } from "../../api/notesApi";

function formatDateBR(iso?: string) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

type Props = {
  colaboradorId: number;
};

export function EmployeeNotesTab({ colaboradorId }: Props) {
  const { data, isLoading, isError } = useAnotacoes(colaboradorId);

  const items = useMemo(() => {
    const arr = (data ?? []).slice();
    // mais recente primeiro
    arr.sort((a, b) => (a.dataAnotacao < b.dataAnotacao ? 1 : -1));
    return arr;
  }, [data]);

  if (isLoading) return <div style={{ padding: 16 }}>Carregando anotações...</div>;
  if (isError) return <div style={{ padding: 16 }}>Erro ao carregar anotações.</div>;

  return (
    <div className="empd-card">
      <h2 className="empd-cardTitle">Anotações e Observações</h2>

      {items.length === 0 ? (
        <div style={{ paddingTop: 8 }}>Nenhuma anotação encontrada.</div>
      ) : (
        <div className="empd-notesList">
          {items.map((n: AnotacaoDTO, idx: number) => (
            <div className="empd-noteItem" key={`${n.dataAnotacao}-${idx}`}>
              <div className="empd-noteTitle">{n.titulo || "-"}</div>
              <div className="empd-noteMeta">{formatDateBR(n.dataAnotacao)}</div>
              <div className="empd-noteContent">{n.conteudo || "-"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
