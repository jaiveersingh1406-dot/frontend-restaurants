import { apiClient } from "./client";

export function getReservations(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  const qs = params.toString();
  return apiClient.get(`/reservations${qs ? `?${qs}` : ""}`);
}

export function getAvailability(date, timeSlot) {
  const params = new URLSearchParams({ date, time_slot: timeSlot });
  return apiClient.get(`/reservations/availability?${params}`);
}

export function createReservation(reservationData) {
  return apiClient.post("/reservations", reservationData);
}

export function updateReservationStatus(id, status) {
  return apiClient.put(`/reservations/${id}/status?status=${encodeURIComponent(status)}`);
}

export function deleteReservation(id) {
  return apiClient.delete(`/reservations/${id}`);
}
