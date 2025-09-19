<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  username: string;
  actions?: Array<{ label: string; onClick: () => void }>;
  open: boolean;
}>();
const emit = defineEmits(["close", "logout"]);

function handleLogout() {
  emit("logout");
}
function handleClose() {
  emit("close");
}
</script>

<template>
  <transition name="slide">
    <aside
      v-if="props.open"
      class="fixed top-0 left-0 h-full w-64 bg-[#C5AF8C] shadow-lg z-40 flex flex-col"
    >
      <!-- Close button -->
      <button
        @click="handleClose"
        class="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
      >
        &times;
      </button>

      <!-- Username with highlighted background -->
      <div class="flex flex-col items-center mt-10 mb-4">
        <div
          class="w-40 px-4 py-2 bg-[#B29B77] rounded-lg flex items-center justify-center text-gray-600 text-xl font-semibold"
        >
          {{ props.username }}
        </div>
      </div>

      <!-- Actions -->
      <nav class="flex-1 flex flex-col items-center mt-8">
        <button
          v-for="(action, idx) in props.actions || [
            { label: 'Edit personal info', onClick: () => {} },
          ]"
          :key="action.label"
          @click="action.onClick"
          class="w-48 mb-3 py-2 rounded-lg bg-[#DBCAAF] text-gray-800 hover:bg-[#B29B77] transition-colors font-medium"
        >
          {{ action.label }}
        </button>
      </nav>

      <!-- Logout button at bottom center -->
      <div class="mb-8 flex justify-center">
        <button
          @click="handleLogout"
          class="w-40 py-2 rounded-lg bg-[#DBCAAF] text-gray-600 font-semibold hover:bg-[#B29B77] transition-colors flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-5"
          >
            <path
              fill-rule="evenodd"
              d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
