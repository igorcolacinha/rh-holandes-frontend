// src/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "../layout/Sidebar";
import { Topbar } from "../layout/Topbar";

export function AppLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      {/* Área da direita (Topbar + Conteúdo das rotas) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar />

        {/* Conteúdo rolável (onde as páginas renderizam via Outlet) */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
