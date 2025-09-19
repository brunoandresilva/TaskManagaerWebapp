import { defineStore } from "pinia";
import api from "@/lib/api";

type User = { id?: number; username: string };
type LoginResponse = { user: { token: string; username: string; id?: number } };
type Task = {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: 0 | 1 | 2 | 3;
  due_at: string | null;
  created_at: string;
  updated_at: string;
};
type DashboardResponse = Task[];
import {
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
  clearUser,
} from "@/lib/token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: getToken(),
    user: getUser(),
    loadingMain: false,
    tasks: [] as Task[],
    todo_counter: 0,
    in_progress_counter: 0,
    done_counter: 0,
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
      this.user = { username: data?.user?.username, id: data?.user?.id };
      setUser(this.user);
      await this.fetchMain();
    },
    logout() {
      this.token = null;
      this.user = null;
      this.tasks = [];
      this.todo_counter = 0;
      this.in_progress_counter = 0;
      this.done_counter = 0;
      clearToken();
      clearUser();
    },
    async fetchMain() {
      if (!this.token) return;
      this.loadingMain = true;
      try {
        const { data } = await api.get<DashboardResponse>("/api/tasks");
        console.log(data);
        this.tasks = data;
        this.done_counter = data.filter(
          (task) => task.status === "done"
        ).length;
        this.in_progress_counter = data.filter(
          (task) => task.status === "in_progress"
        ).length;
        this.todo_counter = data.filter(
          (task) => task.status === "todo"
        ).length;
      } catch (error) {
        console.error("Error fetching main data:", error);
      } finally {
        this.loadingMain = false;
      }
    },
    async createTask(task: {
      title: string;
      description: string;
      status: string;
      priority: number;
      due_at: string | null;
    }) {
      if (!this.token) return;
      try {
        const { data } = await api.post("/api/tasks", task);
        this.tasks.push(data);
        console.log(data);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    },
  },
});
