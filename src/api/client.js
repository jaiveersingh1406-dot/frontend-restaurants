import { API_BASE_URL, STORAGE_KEYS } from "../config/constants";

export class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

function buildHeaders(body, token) {
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseResponse(response) {
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  return { ok: response.ok, status: response.status, data };
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const token = auth ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null;

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: buildHeaders(body, token),
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Cannot connect to the server. Please check the backend.", 0);
  }

  const { ok, status, data } = await parseResponse(response);

  if (!ok) {
    if (status === 401 && token && !path.startsWith("/login")) {
      clearSession();
      redirectToAdminLogin();
    }

    const detail =
      typeof data?.detail === "string" ? data.detail : JSON.stringify(data?.detail);

    throw new ApiError(detail || `Request failed with status ${status}`, status, data?.detail);
  }

  return data;
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

function redirectToAdminLogin() {
  if (!window.location.pathname.startsWith("/admin/login")) {
    window.location.assign("/admin/login?expired=1");
  }
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
