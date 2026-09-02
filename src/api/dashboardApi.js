import { apiClient } from "./client";

export function getDashboardStats(period = "all") {
  return apiClient.get(`/dashboard/stats?period=${period}`);
}