import { apiClient } from "./client";

export function initPayment(amount, receipt) {
  return apiClient.post("/payments/init", { amount, receipt });
}

export function verifyPayment(payload) {
  return apiClient.post("/payments/verify", payload);
}