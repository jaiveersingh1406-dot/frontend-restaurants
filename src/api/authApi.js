import { apiClient } from "./client";

export function loginApi(email, password) {
  return apiClient.post("/login", { email, password });
}

export function signupApi(name, email, password) {
  return apiClient.post("/signup", { name, email, password });
}

export function meApi(token) {
  return apiClient.get("/auth/me", { auth: true });
}

export function updateProfileApi(phone) {
  return apiClient.put("/auth/profile", { phone }, { auth: true });
}

export function checkEmailExists(email) {
  return apiClient.post("/auth/check-email", { email });
}
