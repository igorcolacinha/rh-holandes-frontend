import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { EmployeesListPage } from "../pages/employees/EmployeeListPage";
import { EmployeeDetailsPage } from "../pages/employees/EmployeeDetailsPage";
import { Dashboard } from "../pages/Dashboard";
import { ConfiguracoesPage } from "../pages/configuracoes/ConfiguracoesPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Redirect inicial */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Páginas */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeesListPage />} />
        <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
        <Route path="/configuracoes" element={<ConfiguracoesPage />} />
      </Route>
    </Routes>
  );
}
