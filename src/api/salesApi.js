import { apiClient } from "./client";

export function getSalesSummary(period = "all") {
  return apiClient.get(`/accounting/sales?period=${period}`);
}
