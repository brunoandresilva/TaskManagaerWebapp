import { defineStore } from "pinia";
import api from "@/lib/api";

type User = { id: number; username: string };
type LoginResponse = { user: { token: string; username: string } };
type MeResponse = { user?: User } | User;
import { getToken, setToken, clearToken } from "@/lib/token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: getToken(),
    user: null as User | null,
    loadingMain: false,
  }),
  actions: {
    async register(username: string, password: string) {
      await api.post("/api/users/register", { username, password });
    },
    async login(username: string, password: string) {
      const { data } = await api.post<LoginResponse>("/api/users/login", {
        username,
        password,
      });
      this.token = data?.user?.token;
      setToken(this.token);
      await this.fetchMain();
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
    },
    async fetchMain() {
      if (!this.token) return;
      this.loadingMain = true;
      try {
        const { data } = await api.get<MeResponse>("/api/users/users");
        // Support both { user: {...} } and plain object forms
        this.user = (data as any).user ?? (data as User);
      } finally {
        this.loadingMain = false;
      }
    },
  },
});
