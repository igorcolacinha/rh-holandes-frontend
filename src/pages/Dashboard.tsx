import { MainLayout } from "../layout/MainLayout";
import { sincronizarColaboradores } from "../services/employeesService";
import { useState } from "react";

export function Dashboard() {
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    try {
      setLoading(true);
      const res = await sincronizarColaboradores();
      setResultado(res);
    } catch (err) {
      console.error(err);
      alert("Erro ao sincronizar colaboradores");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <h2>Dashboard</h2>

      <button
        onClick={handleSync}
        disabled={loading}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {loading ? "Sincronizando..." : "Sincronizar Colaboradores"}
      </button>

      {resultado && (
        <pre
          style={{
            marginTop: 20,
            background: "#fff",
            padding: 16,
            borderRadius: 8,
            maxWidth: 600,
          }}
        >
          {JSON.stringify(resultado, null, 2)}
        </pre>
      )}
    </MainLayout>
  );
}
