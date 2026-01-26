import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEmployeeById } from "../../hooks/useEmployeeById";
import "../../styles/employee-details.css";

type EmployeeState = {
  id?: number | string;
  nomeCompleto?: string;
  email?: string | null;
  nomeCargo?: string;
  status?: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: string;
  nomeDepartamento?: string;
  dataAdmissao?: string;
  nomeSupervisor?: string;
  sobrenomeSupervisor?: string;
};


function initials(name?: string) {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1]?.[0] : "")).toUpperCase();
}

export function EmployeeDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const stateEmp = location.state as EmployeeState | null;

  // ✅ busca detalhada pelo ID
  const { data: apiEmp, isLoading } = useEmployeeById(id);

  // ✅ preferir dados da API (mais completos). Se ainda não carregou, usa state.
  const emp: EmployeeState | null = apiEmp ?? stateEmp;

  if (!emp && !isLoading) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Detalhe do colaborador</h1>
        <p>ID: {id}</p>
        <p>Não foi possível carregar os dados.</p>
        <button onClick={() => navigate("/employees")}>Voltar para lista</button>
      </div>
    );
  }

  const nomeCompleto = emp?.nomeCompleto ?? "—";
  const cargo = emp?.nomeCargo ?? "-";
  const status = emp?.status ?? "-";

  const gestor =
    emp?.nomeSupervisor
      ? `${emp.nomeSupervisor}${emp.sobrenomeSupervisor ? " " + emp.sobrenomeSupervisor : ""}`
      : "-";

  return (
    <div className="empd-page">
      <button className="empd-back" onClick={() => navigate("/employees")}>
        ← Voltar para lista
      </button>

      <div className="empd-header">
        <div className="empd-avatar">{initials(nomeCompleto)}</div>

        <div className="empd-titleBlock">
          <h1 className="empd-name">{nomeCompleto}</h1>
          <div className="empd-role">{cargo}</div>
          <span className="empd-badge empd-badge--green">{status}</span>
        </div>
      </div>

      <div className="empd-tabs">
        <button className="empd-tab is-active">Informações</button>
        <button className="empd-tab" disabled>Histórico Salarial</button>
        <button className="empd-tab" disabled>Faltas e Afastamentos</button>
        <button className="empd-tab" disabled>Benefícios</button>
        <button className="empd-tab" disabled>Anotações</button>
      </div>

      <div className="empd-card">
        <h2 className="empd-cardTitle">Informações Pessoais</h2>

        <div className="empd-grid">
          <div>
            <div className="empd-label">Email</div>
            <div className="empd-value">{emp?.email ?? "-"}</div>
          </div>

          <div>
            <div className="empd-label">Telefone</div>
            <div className="empd-value">{emp?.telefone ?? "-"}</div>
          </div>

          <div>
            <div className="empd-label">CPF</div>
            <div className="empd-value">{emp?.cpf ?? "-"}</div>
          </div>

          <div>
            <div className="empd-label">Data de Nascimento</div>
            <div className="empd-value">{emp?.dataNascimento ?? "-"}</div>
          </div>

          <div className="empd-span2">
            <div className="empd-label">Endereço</div>
            <div className="empd-value">{emp?.endereco ?? "-"}</div>
          </div>
        </div>

        <div className="empd-divider" />

        <h2 className="empd-cardTitle">Informações Profissionais</h2>

        <div className="empd-grid">
          <div>
            <div className="empd-label">Cargo</div>
            <div className="empd-value">{emp?.nomeCargo ?? "-"}</div>
          </div>

          <div>
            <div className="empd-label">Departamento</div>
            <div className="empd-value">{emp?.nomeDepartamento ?? "-"}</div>
          </div>

          <div>
            <div className="empd-label">Data de Admissão</div>
            <div className="empd-value">{emp?.dataAdmissao ?? "-"}</div>
          </div>

          <div>
            <div className="empd-label">Gestor Direto</div>
            <div className="empd-value">{gestor}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
