import { api } from "./api";

export async function sincronizarColaboradores() {
  const response = await api.post("/api/sync/employees");
  return response.data;
}
