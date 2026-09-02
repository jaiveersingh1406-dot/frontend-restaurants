import { apiClient } from "./client";

export function getOrders(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.payment_status) params.set("payment_status", filters.payment_status);
  const qs = params.toString();
  return apiClient.get(`/orders${qs ? `?${qs}` : ""}`);
}

export function placeOrder(orderData) {
  return apiClient.post("/orders", orderData);
}

export function updateOrderStatus(id, status) {
  return apiClient.put(`/orders/${id}/status?status=${encodeURIComponent(status)}`);
}

export function deleteOrder(id) {
  return apiClient.delete(`/orders/${id}`);
}
