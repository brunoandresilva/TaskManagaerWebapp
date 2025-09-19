import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { getToken } from "@/lib/token";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/main" },
  { path: "/login", component: () => import("@/views/Login.vue") },
  { path: "/register", component: () => import("@/views/Register.vue") },
  {
    path: "/main",
    component: () => import("@/views/Main.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (!auth.token) {
    // sincroniza com storage se necessário
    auth.token = getToken();
  }
  if (auth.token && !auth.loadingMain) {
    try {
      await auth.fetchMain();
    } catch {}
  }
  if (to.meta.requiresAuth && !auth.token) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }
});

export default router;
