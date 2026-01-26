import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../../hooks/useEmployees";
import "../../styles/employees.css";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function initials(name?: string) {
  const n = (name ?? "").trim();
  if (!n) return "—";
  const parts = n.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
}

function statusLabel(status?: string) {
  if (!status) return "—";
  const s = status.toUpperCase();
  if (s === "ATIVO") return "Ativo";
  if (s === "AFASTADO") return "Afastado";
  if (s === "INATIVO") return "Inativo";
  if (s === "DESLIGADO") return "Desligado";
  return status;
}

function statusClass(status?: string) {
  const s = (status ?? "").toUpperCase();
  if (s === "ATIVO") return "badge--green";
  if (s === "AFASTADO") return "badge--red";
  if (s === "INATIVO") return "badge--gray";
  if (s === "DESLIGADO") return "badge--gray";
  return "badge--gray";
}

export function EmployeesListPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [q, setQ] = useState("");
  const qDebounced = useDebouncedValue(q, 400);

  const [status, setStatus] = useState<string>("");

  // ✅ Novo: menu de ações (por linha)
  const [openActionsId, setOpenActionsId] = useState<string | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  // reset página ao mudar busca/filtros
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(0);
  }, [qDebounced, status]);

  const params = useMemo(
    () => ({
      page,
      size,
      q: qDebounced.trim() ? qDebounced.trim() : undefined,
      status: status || undefined,
    }),
    [page, size, qDebounced, status]
  );

  const { data, isLoading, isFetching } = useEmployees(params);
  const rows = data?.content ?? [];

  // ✅ Novo: fecha o menu ao clicar fora
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!actionsRef.current) return;
      if (!actionsRef.current.contains(e.target as Node)) {
        setOpenActionsId(null);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="emp-page">
      <div className="emp-header">
        <div>
          <h1 className="emp-title">Colaboradores</h1>
          <p className="emp-subtitle">Gerencie todos os colaboradores da empresa</p>
        </div>
      </div>

      <div className="emp-searchCard">
        <div className="emp-searchRow">
          <div className="emp-searchInputWrap">
            <span className="emp-searchIcon">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome..."
              className="emp-searchInput"
            />
          </div>

          <button
            className="emp-filterBtn"
            type="button"
            onClick={() => {
              setStatus((s) => (s ? "" : "ATIVO"));
            }}
          >
            <span className="emp-filterIcon">⏳</span>
            Filtros
          </button>
        </div>

        <div className="emp-searchMeta">
          {isLoading ? "Carregando..." : `${data?.totalElements ?? 0} registro(s)`}
          {isFetching ? " • atualizando..." : ""}
        </div>
      </div>

      <div className="emp-tableCard">
        <table className="emp-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Email</th>
              <th>Status</th>
              <th className="emp-thActions">Ações</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={5} className="emp-empty">
                  Nenhum colaborador encontrado.
                </td>
              </tr>
            ) : (
              rows.map((emp) => (
                <tr
                  key={String(emp.id)}
                  onClick={() => navigate(`/employees/${emp.id}`, { state: emp })} // mantém click na linha (opcional)
                >
                  <td>
                    <div className="emp-nameCell">
                      <div className="emp-avatar">{initials(emp.nomeCompleto)}</div>
                      <div className="emp-nameBlock">
                        <div className="emp-name">{emp.nomeCompleto ?? "-"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="emp-muted">{emp.nomeCargo ?? "-"}</td>
                  <td className="emp-muted">{emp.email ?? "-"}</td>

                  <td>
                    <span className={`emp-badge ${statusClass(emp.status)}`}>
                      {statusLabel(emp.status)}
                    </span>
                  </td>

                  <td className="emp-actions" onClick={(e) => e.stopPropagation()}>
                    <div className="emp-actionsWrap" ref={actionsRef}>
                      <button
                        className="emp-kebab"
                        title="Mais ações"
                        type="button"
                        onClick={() =>
                          setOpenActionsId(openActionsId === String(emp.id) ? null : String(emp.id))
                        }
                      >
                        ⋮
                      </button>

                      {openActionsId === String(emp.id) && (
                        <div className="emp-actionsMenu">
                          <button
                            className="emp-actionsItem"
                            type="button"
                            onClick={() => {
                              setOpenActionsId(null);
                              navigate(`/employees/${emp.id}`, { state: emp });
                            }}
                          >
                            Ver detalhes
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="emp-pagination">
          <div className="emp-pageInfo">
            Página <b>{(data?.number ?? 0) + 1}</b> de <b>{data?.totalPages ?? 1}</b>
          </div>

          <div className="emp-pageBtns">
            <button
              className="emp-pageBtn"
              disabled={(data?.number ?? 0) <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Anterior
            </button>

            <button
              className="emp-pageBtn"
              disabled={(data?.number ?? 0) >= (data?.totalPages ?? 1) - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
