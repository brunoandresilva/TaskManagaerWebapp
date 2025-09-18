import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, clearToken } from "@/lib/token";
import router from "@/router";

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

let isHandlingAuthError = false; // evita loops
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const status = err.response?.status;
    const data = err.response?.data ?? {};
    const code: string | undefined =
      typeof data === "object" && data !== null
        ? (data as Record<string, any>).code ||
          (data as Record<string, any>).error ||
          (data as Record<string, any>).message
        : undefined;

    // Heurística para 403 por token inválido/expirado (enquanto o backend não normaliza para 401)
    const isInvalidToken403 =
      status === 403 &&
      typeof code === "string" &&
      /token|expired|signature|invalid/i.test(code);

    if ((status === 401 || isInvalidToken403) && !isHandlingAuthError) {
      isHandlingAuthError = true;
      clearToken();
      const curr = router.currentRoute.value;
      if (curr.path !== "/login") {
        await router.push({
          path: "/login",
          query: { redirect: curr.fullPath },
        });
      }
      isHandlingAuthError = false;
    }
    return Promise.reject(err);
  }
);

export default api;
