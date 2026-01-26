import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEmployeeById } from "../../hooks/useEmployeeById";
import "../../styles/employee-details.css";
import { useState } from "react";
import { EmployeeSalaryHistoryTab } from "./EmployeeSalaryHistoryTab";
import { EmployeeAbsencesTab } from "./EmployeeAbsencesTab";
import { EmployeeBenefitsTab } from "./EmployeeBenefitsTab";
import { EmployeeNotesTab } from "./EmployeeNotesTab";

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

type TabKey = "info" | "salary" | "absences" | "benefits" | "notes";

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

  const colaboradorId = Number(id);

  const [activeTab, setActiveTab] = useState<TabKey>("info");

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
        <button
          className={`empd-tab ${activeTab === "info" ? "is-active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Informações
        </button>

        <button
          className={`empd-tab ${activeTab === "salary" ? "is-active" : ""}`}
          onClick={() => setActiveTab("salary")}
        >
          Histórico Salarial
        </button>

       <button
          className={`empd-tab ${activeTab === "absences" ? "is-active" : ""}`}
          onClick={() => setActiveTab("absences")}
          >
          Faltas e Afastamentos
       </button>
      <button
          className={`empd-tab ${activeTab === "benefits" ? "is-active" : ""}`}
          onClick={() => setActiveTab("benefits")}
          >
          Benefícios
      </button>
       <button
          className={`empd-tab ${activeTab === "notes" ? "is-active" : ""}`}
          onClick={() => setActiveTab("notes")}
          >
          Anotações
      </button>
        <button className="empd-tab" disabled>
          Recibos Avulsos
        </button>
      </div>

      {activeTab === "info" && (
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
      )}

      {activeTab === "salary" && Number.isFinite(colaboradorId) && (
        <EmployeeSalaryHistoryTab colaboradorId={colaboradorId} />
      )}
      {activeTab === "absences" && Number.isFinite(colaboradorId) && (
        <EmployeeAbsencesTab colaboradorId={colaboradorId} />
      )}
      {activeTab === "benefits" && Number.isFinite(colaboradorId) && (
        <EmployeeBenefitsTab colaboradorId={colaboradorId} />
      )}
      {activeTab === "notes" && Number.isFinite(colaboradorId) && (
        <EmployeeNotesTab colaboradorId={colaboradorId} />
      )}
    </div>
  );
}
