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
const showAddTaskModal = ref(false);

const newTask = ref({
  title: "",
  description: "",
  status: "todo",
  priority: 0,
  due_at: "",
});

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
function handleCreateTask() {
  showAddTaskModal.value = true;
}

function submitTask() {
  if (!newTask.value.title) return;

  auth.createTask(newTask.value);

  showAddTaskModal.value = false;
  newTask.value = {
    title: "",
    description: "",
    status: "todo",
    priority: 0,
    due_at: "",
  };
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
    <div class="p-6 space-y-4 max-w-2xl mx-auto flex flex-col items-center">
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
      <button
        class="flex items-center gap-2 px-4 py-2 bg-btn text-gray-600 font-semibold rounded-lg hover:bg-btn_hover transition-colors shadow"
        @click="handleCreateTask()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Task
      </button>
    </div>
    <transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <!-- Add Task Modal -->
      <div
        v-if="showAddTaskModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      >
        <div class="bg-btn rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Add Task</h2>
          <form @submit.prevent="submitTask">
            <div class="mb-3">
              <label class="block font-semibold mb-1"
                >Title <span class="text-red-500">*</span></label
              >
              <input
                v-model="newTask.title"
                type="text"
                class="w-full bg-primary border rounded px-3 py-2"
                required
              />
            </div>
            <div class="mb-3">
              <label class="block font-semibold mb-1">Description</label>
              <textarea
                v-model="newTask.description"
                class="w-full bg-primary border rounded px-3 py-2"
                rows="2"
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="block font-semibold mb-1">Status</label>
              <select
                v-model="newTask.status"
                class="w-full bg-primary border rounded px-3 py-2"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="block font-semibold mb-1">Priority</label>
              <select
                v-model="newTask.priority"
                class="w-full bg-primary border rounded px-3 py-2"
              >
                <option :value="0">Low</option>
                <option :value="1">Medium</option>
                <option :value="2">High</option>
                <option :value="3">Critical</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block font-semibold mb-1">Due At</label>
              <input
                v-model="newTask.due_at"
                type="date"
                class="w-full bg-primary border rounded px-3 py-2"
              />
            </div>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                @click="showAddTaskModal = false"
                class="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded bg-primary text-gray-600 font-semibold hover:bg-btn_hover"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>
