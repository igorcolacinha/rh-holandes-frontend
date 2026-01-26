import { useQuery } from "@tanstack/react-query";
import { getFaltasDashboard } from "../api/dashboardApi";

export function useFaltasDashboard() {
  return useQuery({
    queryKey: ["dashboard", "faltas"],
    queryFn: getFaltasDashboard,
    staleTime: 60_000,
  });
}
