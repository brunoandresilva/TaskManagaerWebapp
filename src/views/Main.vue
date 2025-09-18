<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import SidePanel from "@/components/SidePanel.vue";
import TaskTracker from "@/components/TaskTracker.vue";
import TaskViewer from "@/components/TaskViewer.vue";
import { ref, computed } from "vue";

const sidePanelOpen = ref(false);
const auth = useAuthStore();
const router = useRouter();

// Filter state and logic
const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];
const priorityOptions = [
  { value: 0, label: "Low" },
  { value: 1, label: "Medium" },
  { value: 2, label: "High" },
  { value: 3, label: "Critical" },
];
const selectedStatuses = ref<Array<string>>([]);
const selectedPriorities = ref<Array<number>>([]);

const filteredTasks = computed(() => {
  return auth.tasks.filter((task) => {
    const statusMatch =
      selectedStatuses.value.length === 0 ||
      selectedStatuses.value.includes(task.status);
    const priorityMatch =
      selectedPriorities.value.length === 0 ||
      selectedPriorities.value.includes(task.priority);
    return statusMatch && priorityMatch;
  });
});

function resetFilters() {
  selectedStatuses.value = [];
  selectedPriorities.value = [];
}

function handleLogout() {
  auth.logout();
  router.push("/login");
}
function handleSidePanelClose() {
  sidePanelOpen.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-primary">
    <SidePanel
      :username="auth.user?.username || 'Guest'"
      :open="sidePanelOpen"
      @close="handleSidePanelClose"
      @logout="handleLogout"
    />

    <!-- tasks header -->
    <header class="grid grid-cols-3 items-center w-full">
      <div class="flex justify-start">
        <button
          @click="sidePanelOpen = true"
          class="w-auto mt-4 ml-4 px-4 py-2 bg-btn text-gray-600 font-semibold rounded-lg hover:bg-btn_hover transition-colors"
        >
          Open Side Panel
        </button>
      </div>

      <div
        class="flex items-center justify-center w-full flex-col p-4 bg-[#DBCAAF]"
      >
        <TaskTracker
          :done="auth.done_counter || 0"
          :inProgress="auth.in_progress_counter || 0"
          :todo="auth.todo_counter || 0"
        />
      </div>
      <!-- Add more header content here if needed -->
    </header>
    <!-- show tasks with filter -->
    <div class="p-6 space-y-4 max-w-4xl mx-auto">
      <!-- Filter UI -->
      <div class="mb-4 flex flex-wrap gap-6 items-end">
        <!-- Status filter -->
        <div>
          <label class="block font-semibold mb-1">Status</label>
          <div class="flex gap-2">
            <label
              v-for="status in statusOptions"
              :key="status.value"
              class="flex items-center gap-1"
            >
              <input
                type="checkbox"
                :value="status.value"
                v-model="selectedStatuses"
              />
              <span>{{ status.label }}</span>
            </label>
          </div>
        </div>
        <!-- Priority filter -->
        <div>
          <label class="block font-semibold mb-1">Priority</label>
          <div class="flex gap-2">
            <label
              v-for="priority in priorityOptions"
              :key="priority.value"
              class="flex items-center gap-1"
            >
              <input
                type="checkbox"
                :value="priority.value"
                v-model="selectedPriorities"
              />
              <span>{{ priority.label }}</span>
            </label>
          </div>
        </div>
        <!-- Reset button -->
        <button
          @click="resetFilters"
          class="ml-4 px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 font-medium"
        >
          Reset
        </button>
      </div>
      <TaskViewer :tasks="filteredTasks" />
    </div>
  </div>
</template>
