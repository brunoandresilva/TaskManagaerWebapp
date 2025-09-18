<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  done: number;
  inProgress: number;
  todo: number;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center bg-[#C5AF8C] px-6 py-2 rounded-xl shadow-md"
  >
    <h1 class="text-4xl font-bold text-gray-800">Tasks</h1>
    <div class="flex items-center gap-8">
      <!-- Done -->
      <div class="flex items-center gap-1">
        <img src="@/assets/check-mark.png" alt="Done" class="w-6 h-6" />
        <span class="text-lg text-gray-900 font-medium">{{ done }}</span>
      </div>
      <!-- In Progress -->
      <div class="flex items-center gap-1">
        <img src="@/assets/in_progress.png" alt="In Progress" class="w-6 h-6" />
        <span class="text-lg text-gray-900 font-medium">{{ inProgress }}</span>
      </div>
      <!-- Todo -->
      <div class="flex items-center gap-1">
        <img src="@/assets/unchecked.png" alt="Todo" class="w-6 h-6" />
        <span class="text-lg text-gray-900 font-medium">{{ todo }}</span>
      </div>
    </div>
  </div>
</template>
