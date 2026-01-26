// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { EmployeesListPage } from "../pages/employees/EmployeeListPage";
// futura
import { EmployeeDetailsPage } from "../pages/employees/EmployeeDetailsPage";
import { Dashboard } from "../pages/Dashboard";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/employees" replace />} />

        <Route path="/employees" element={<EmployeesListPage />} />
        <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
