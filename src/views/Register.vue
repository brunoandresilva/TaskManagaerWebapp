<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref<string | null>(null);
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();
const bgImage = new URL("@/assets/background_login.webp", import.meta.url).href;

async function onSubmit() {
  error.value = null;
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }
  loading.value = true;
  try {
    await auth.register(username.value, password.value);
    await auth.login(username.value, password.value);
    router.push("/main");
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Registration failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Background -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImage})` }"
    ></div>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-gray-900/40"></div>

    <div class="relative flex items-center justify-center min-h-screen">
      <router-link to="/login">
        <button
          class="mt-6 mr-6 absolute top-0 right-0 w-32 mx-auto block rounded-[20px] bg-[#C5AF8C] text-gray-700 py-2.5 font-medium hover:bg-[#9A7F56] disabled:opacity-60"
        >
          Login
        </button>
      </router-link>

      <div class="w-full max-w-md bg-[#DBCAAF] shadow-lg rounded-2xl p-8">
        <h1 class="text-2xl font-semibold text-gray-800">Register</h1>

        <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Username</label>
            <input
              v-model="username"
              type="text"
              required
              minlength="3"
              maxlength="50"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Password</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="8"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"
              >Confirm Password</label
            >
            <input
              v-model="confirmPassword"
              type="password"
              required
              minlength="8"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            :disabled="loading"
            type="submit"
            class="w-32 mx-auto block rounded-[20px] bg-[#C5AF8C] text-gray-700 py-2.5 font-medium hover:bg-[#9A7F56] disabled:opacity-60"
          >
            {{ loading ? "Loading…" : "Create account" }}
          </button>

          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
