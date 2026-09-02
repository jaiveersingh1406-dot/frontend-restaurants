import { apiClient } from "./client";

export function getAccountingEntries() {
  return apiClient.get("/accounting");
}

export function createAccountingEntry(entryData) {
  return apiClient.post("/accounting", entryData);
}

export function deleteAccountingEntry(id) {
  return apiClient.delete(`/accounting/${id}`);
}
