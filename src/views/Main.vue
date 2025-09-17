<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div
        class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between"
      >
        <h1 class="text-xl font-semibold">Dashboard</h1>
        <button
          @click="logout"
          class="rounded-lg bg-gray-800 text-white px-4 py-2 hover:bg-black"
        >
          Logout
        </button>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow p-6">
        <h2 class="text-lg font-medium mb-2">
          Welcome, {{ auth.user?.username || "user" }}!
        </h2>
        <p class="text-gray-600">This is a protected page.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
const auth = useAuthStore();
const router = useRouter();
function logout() {
  auth.logout();
  router.push("/login");
}
</script>
