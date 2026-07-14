/**
 * Centralized API client.
 *
 * Every request in the app goes through here. Nothing in pages/components
 * should call fetch() directly — see services/ for domain-specific wrappers.
 *
 * Requests are sent to /api/* which next.config.js rewrites (server-side,
 * no CORS involved) to the FastAPI backend at NEXT_PUBLIC_API_BASE_URL.
 *
 * The backend always responds with either:
 *   { success: true, message: string, data: any }
 *   { success: false, message: string, errors: any }
 * or a FastAPI default error shape: { detail: string | object }
 *
 * ApiError below normalizes both so the UI can always show
 * `error.message` exactly as the backend phrased it.
 */

const API_PREFIX = "/api";

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("fms_token");
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem("fms_token", token);
  } else {
    window.localStorage.removeItem("fms_token");
  }
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("fms_user");
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user) {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem("fms_user", JSON.stringify(user));
  } else {
    window.localStorage.removeItem("fms_user");
  }
}

/**
 * Extracts a human-readable message from a FastAPI error body.
 * FastAPI validation errors arrive as detail: [{ loc, msg, type }, ...]
 * while our custom exceptions arrive as detail: "Some message."
 */
function extractErrorMessage(body, fallback) {
  if (!body) return fallback;

  if (typeof body.detail === "string") return body.detail;

  if (Array.isArray(body.detail) && body.detail.length > 0) {
    return body.detail.map((d) => d.msg).join(" ");
  }

  if (typeof body.message === "string") return body.message;

  return fallback;
}

async function request(path, { method = "GET", body, params, signal } = {}) {
  const token = getToken();

  let url = `${API_PREFIX}${path}`;
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
    );
    url += `?${query.toString()}`;
  }

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (networkErr) {
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      0,
      null
    );
  }

  // Handle unauthenticated / expired sessions uniformly.
  if (response.status === 401) {
    setToken(null);
    setStoredUser(null);
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
  }

  const contentType = response.headers.get("content-type") || "";
  let payload = null;
  if (contentType.includes("application/json")) {
    payload = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const message = extractErrorMessage(
      payload,
      `Request failed (${response.status}).`
    );
    throw new ApiError(message, response.status, payload?.errors ?? payload?.detail ?? null);
  }

  // Successful responses follow { success, message, data }
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload;
}

async function requestBlob(path, { method = "GET", params } = {}) {
  const token = getToken();
  let url = `${API_PREFIX}${path}`;
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
    );
    url += `?${query.toString()}`;
  }

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { method, headers });

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const payload = await response.json();
      message = extractErrorMessage(payload, message);
    } catch {
      // response body wasn't JSON (likely a binary/PDF error page)
    }
    throw new ApiError(message, response.status, null);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") || "";
  const match = disposition.match(/filename="?([^";]+)"?/);
  const filename = match ? match[1] : "download.pdf";
  return { blob, filename };
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
  getBlob: (path, opts) => requestBlob(path, { ...opts, method: "GET" }),
};
