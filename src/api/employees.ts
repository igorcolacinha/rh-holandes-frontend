import { http } from "./http";
import type { PageResponse } from "../types/pagination";
import type { EmployeeListItem } from "../types/employee";

export type GetEmployeesParams = {
  page?: number;
  size?: number;
  q?: string;
  status?: string;
};

export async function getEmployees(params: GetEmployeesParams) {
  const { data } = await http.get<PageResponse<EmployeeListItem>>("/api/employees", { params });
  return data;
}

export async function getEmployeeById(id: string | number) {
  const { data } = await http.get(`/api/employees/${id}`);
  return data;
}
