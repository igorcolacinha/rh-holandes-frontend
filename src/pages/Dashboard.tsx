import { useEmployeesTotal } from "../hooks/useEmployeesTotal";
import { useFaltasDashboard } from "../hooks/useTotalFaltasMesAtual";
import "../styles/dashboard.css";

function nomeMesAtual() {
  const now = new Date();
  const mes = now.toLocaleString("pt-BR", { month: "long" });
  return mes.charAt(0).toUpperCase() + mes.slice(1);
}

export function Dashboard() {
  const { data: total, isLoading } = useEmployeesTotal();

  // ✅ Agora esperamos: { totalMesAtual, diferencaMesAnterior }
  const { data: faltasMes, isLoading: isLoadingFaltas } = useFaltasDashboard();

  const mesAtual = nomeMesAtual();

  const totalFaltas = faltasMes?.totalMesAtual ?? 0;
  const diff = faltasMes?.diferencaMesAnterior ?? 0;

  const diffLabel = `${diff > 0 ? "+" : ""}${diff} vs. mês anterior`;
  const diffClass =
    diff > 0 ? "positivo" : diff < 0 ? "negativo" : ""; // 0 fica neutro

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Visão geral do RH</p>
        </div>
      </div>

      <div className="dash-grid">
        {/* Card 1 - Total colaboradores */}
        <div className="dash-card">
          <div className="dash-cardTop">
            <div>
              <div className="dash-cardLabel">Total de colaboradores</div>
              <div className="dash-cardValue">{isLoading ? "—" : total ?? 0}</div>
              <div className="dash-cardHint">Base cadastrada no sistema</div>
            </div>

            <div className="dash-cardIcon">👥</div>
          </div>
        </div>

        {/* Card 2 - Faltas no mês + comparativo */}
        <div className="dash-card">
          <div className="dash-cardTop">
            <div>
              <div className="dash-cardLabel">Faltas no mês</div>

              <div className="dash-cardValue">
                {isLoadingFaltas ? "—" : totalFaltas}
              </div>

              {isLoadingFaltas ? (
                <div className="dash-cardHint">Referente a {mesAtual}</div>
              ) : (
                <div className={`dash-cardHint ${diffClass}`}>
                  {diffLabel}
                </div>
              )}
            </div>

            <div className="dash-cardIcon">📅</div>
          </div>
        </div>
      </div>
    </div>
  );
}
