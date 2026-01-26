import { useEmployeesTotal } from "../hooks/useEmployeesTotal";
import "../styles/dashboard.css";

export function Dashboard() {
  const { data: total, isLoading } = useEmployeesTotal();

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Visão geral do RH</p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-cardTop">
            <div>
              <div className="dash-cardLabel">Total de colaboradores</div>
              <div className="dash-cardValue">
                {isLoading ? "—" : (total ?? 0)}
              </div>
              <div className="dash-cardHint">Base cadastrada no sistema</div>
            </div>

            <div className="dash-cardIcon">👥</div>
          </div>
        </div>
      </div>
    </div>
  );
}
