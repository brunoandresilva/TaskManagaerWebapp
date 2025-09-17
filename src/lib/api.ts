import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken } from "@/lib/token";

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Helper to set the Authorization header across Axios v1 types
function setAuthHeader(config: InternalAxiosRequestConfig, token: string) {
  // Axios v1 gives us AxiosHeaders with a .set, but during typing it can be a plain object.
  const headers: any = config.headers ?? {};
  if (typeof headers.set === "function") {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers["Authorization"] = `Bearer ${token}`;
  }
  config.headers = headers;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    // Optional: handle 401s here
    // if (err.response?.status === 401) { /* e.g., redirect to /login */ }
    return Promise.reject(err);
  }
);

export default api;
