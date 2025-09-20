<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import SidePanel from "@/components/SidePanel.vue";
import TaskTracker from "@/components/TaskTracker.vue";
import TaskViewer from "@/components/TaskViewer.vue";
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const sidePanelOpen = ref(false);
const auth = useAuthStore();
const router = useRouter();
const showAddTaskModal = ref(false);
const showDeleteConfirmModal = ref(false);
let taskIdToDelete = ref<number | null>(null);
const showEditTaskModal = ref(false);
let taskIdToEdit = ref<number | null>(null);

type Task = {
  id?: number;
  user_id?: number;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: 0 | 1 | 2 | 3;
  due_at?: string | null;
  completed_at?: string | null;
};

const newTask = ref<Task>({
  title: "",
  description: "",
  status: "todo",
  priority: 0,
  due_at: "",
});
const updatedTask = ref<Partial<Task>>({});

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

async function submitTask() {
  if (!newTask.value.title) return;

  if (newTask.value.due_at === "") {
    delete newTask.value.due_at;
  }

  try {
    await auth.createTask(newTask.value);
    toast.success("Task created successfully!");
    showAddTaskModal.value = false;
    newTask.value = {
      title: "",
      description: "",
      status: "todo",
      priority: 0,
      due_at: undefined,
    };
  } catch (error) {
    toast.error("Error creating task");
    showAddTaskModal.value = false;
  }
}

function handleDeleteTask(id: number) {
  taskIdToDelete.value = id;
  showDeleteConfirmModal.value = true;
}

async function confirmDeleteTask() {
  try {
    await auth.deleteTask(taskIdToDelete.value);
    toast.success("Task deleted successfully!");
  } catch (error) {
    toast.error("Error deleting task");
  } finally {
    showDeleteConfirmModal.value = false;
    taskIdToDelete.value = null;
  }
}

function handleEditTask(id: number) {
  const task = auth.tasks.find((t) => t.id === id);
  if (task?.description === null) task.description = ""; // Ensure description is a string
  if (task) {
    updatedTask.value = { ...task }; // Copies all fields as defaults
    // Format due_at for date input
    if (task.due_at) {
      updatedTask.value.due_at = task.due_at.slice(0, 10);
    }
    // Format completed_at for date input
    if (task.completed_at) {
      updatedTask.value.completed_at = task.completed_at.slice(0, 10);
    }
  }
  taskIdToEdit.value = id;
  showEditTaskModal.value = true;
}

async function confirmEditTask() {
  if (!taskIdToEdit.value) return;

  console.log("Updated Task Data:", updatedTask.value);

  if (updatedTask.value.due_at === "" || updatedTask.value.due_at === null) {
    delete updatedTask.value.due_at;
  }
  if (
    updatedTask.value.completed_at === "" ||
    updatedTask.value.completed_at === null
  ) {
    delete updatedTask.value.completed_at;
  }

  try {
    await auth.editTask(taskIdToEdit.value, updatedTask.value);
    toast.success("Task edited successfully!");
  } catch (error) {
    toast.error("Error editing task");
  } finally {
    showEditTaskModal.value = false;
    taskIdToEdit.value = null;
  }
}

async function updateTaskStatus({
  id,
  status,
}: {
  id: number;
  status: Task["status"];
}) {
  try {
    await auth.editTask(id, { status });
    toast.success("Task status updated successfully!");
  } catch (error) {
    toast.error("Error updating task status");
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-primary">
    <div
      v-if="sidePanelOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-30"
      @click="handleSidePanelClose"
    ></div>
    <SidePanel
      :username="auth.user?.username || 'Guest'"
      :open="sidePanelOpen"
      @close="handleSidePanelClose"
      @logout="handleLogout"
    />

    <!-- tasks header -->
    <header class="grid grid-cols-3 items-start w-full">
      <div class="flex justify-start">
        <button
          @click="sidePanelOpen = true"
          class="w-auto ml-4 mt-4 px-4 py-2 bg-btn text-gray-600 font-semibold rounded-lg hover:bg-btn_hover transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M3 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.25Zm0 4.5A.75.75 0 0 1 3.75 9h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
              clip-rule="evenodd"
            />
          </svg>
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
      <!-- div com flex justify-end se quiser adicionar mais conteudo ao header -->
    </header>
    <!-- show tasks with filter floating to the right, TaskViewer perfectly centered -->
    <!-- show tasks with filter to the right, both inside a max-w-5xl container, no overflow -->
    <div class="flex-1 w-full flex flex-col items-center p-6">
      <div
        class="w-full max-w-5xl relative flex flex-row items-start mx-auto"
        style="min-height: 400px"
      >
        <!-- Absolutely centered TaskViewer -->
        <div
          class="absolute left-1/2 top-0 -translate-x-1/2 max-w-2xl w-full z-10"
        >
          <TaskViewer
            :tasks="filteredTasks"
            @delete-task="handleDeleteTask"
            @edit-task="handleEditTask"
            @status-change="updateTaskStatus"
          />
          <!-- Add Task button always at the bottom -->
          <div class="py-5 flex justify-center">
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
        </div>
        <!-- Filter on the right (desktop only) -->
        <aside
          class="hidden lg:block max-w-xs flex-shrink-0 ml-auto sticky top-8 self-start z-20"
        >
          <div
            class="bg-[#f6f1e7] rounded-xl shadow p-4 border border-[#e2d6c2] flex flex-col gap-4"
          >
            <div>
              <label class="block font-semibold mb-1 text-gray-700"
                >Status</label
              >
              <div class="flex flex-col gap-1">
                <label
                  v-for="status in statusOptions"
                  :key="status.value"
                  class="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#e2d6c2] transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="status.value"
                    v-model="selectedStatuses"
                    class="accent-[#bfa76a] w-4 h-4 rounded focus:ring-2 focus:ring-[#bfa76a]"
                  />
                  <span class="text-gray-700 text-sm">{{ status.label }}</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block font-semibold mb-1 text-gray-700"
                >Priority</label
              >
              <div class="flex flex-col gap-1">
                <label
                  v-for="priority in priorityOptions"
                  :key="priority.value"
                  class="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#e2d6c2] transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="priority.value"
                    v-model="selectedPriorities"
                    class="accent-[#bfa76a] w-4 h-4 rounded focus:ring-2 focus:ring-[#bfa76a]"
                  />
                  <span class="text-gray-700 text-sm">{{
                    priority.label
                  }}</span>
                </label>
              </div>
            </div>
            <button
              @click="resetFilters"
              class="mt-2 px-4 py-2 rounded-lg bg-btn text-gray-600 font-semibold hover:bg-btn_hover transition-colors shadow border border-[#e2d6c2]"
            >
              Reset
            </button>
          </div>
        </aside>
      </div>
      <!-- Responsive: filter below on mobile -->
      <aside class="block lg:hidden w-full mt-6">
        <div
          class="bg-[#f6f1e7] rounded-xl shadow p-4 border border-[#e2d6c2] flex flex-col gap-4"
        >
          <div>
            <label class="block font-semibold mb-1 text-gray-700">Status</label>
            <div class="flex flex-col gap-1">
              <label
                v-for="status in statusOptions"
                :key="status.value"
                class="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#e2d6c2] transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="status.value"
                  v-model="selectedStatuses"
                  class="accent-[#bfa76a] w-4 h-4 rounded focus:ring-2 focus:ring-[#bfa76a]"
                />
                <span class="text-gray-700 text-sm">{{ status.label }}</span>
              </label>
            </div>
          </div>
          <div>
            <label class="block font-semibold mb-1 text-gray-700"
              >Priority</label
            >
            <div class="flex flex-col gap-1">
              <label
                v-for="priority in priorityOptions"
                :key="priority.value"
                class="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#e2d6c2] transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="priority.value"
                  v-model="selectedPriorities"
                  class="accent-[#bfa76a] w-4 h-4 rounded focus:ring-2 focus:ring-[#bfa76a]"
                />
                <span class="text-gray-700 text-sm">{{ priority.label }}</span>
              </label>
            </div>
          </div>
          <button
            @click="resetFilters"
            class="mt-2 px-4 py-2 rounded-lg bg-btn text-gray-600 font-semibold hover:bg-btn_hover transition-colors shadow border border-[#e2d6c2]"
          >
            Reset
          </button>
        </div>
      </aside>
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

    <!-- Edit Task Modal -->
    <transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showEditTaskModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      >
        <div class="bg-btn rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Edit Task</h2>
          <form @submit.prevent="confirmEditTask">
            <div class="mb-3">
              <label class="block font-semibold mb-1">Title</label>
              <input
                v-model="updatedTask.title"
                type="text"
                placeholder="Task Title"
                class="w-full bg-primary border rounded px-3 py-2"
              />
            </div>
            <div class="mb-3">
              <label class="block font-semibold mb-1">Description</label>
              <textarea
                v-model="updatedTask.description"
                placeholder="Task Description"
                class="w-full bg-primary border rounded px-3 py-2"
                rows="2"
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="block font-semibold mb-1">Status</label>
              <select
                v-model="updatedTask.status"
                class="w-full bg-primary border rounded px-3 py-2"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="block font-semibold mb-1">Priority</label>
              <select
                v-model="updatedTask.priority"
                class="w-full bg-primary border rounded px-3 py-2"
              >
                <option :value="0">Low</option>
                <option :value="1">Medium</option>
                <option :value="2">High</option>
                <option :value="3">Critical</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="block font-semibold mb-1">Due At</label>
              <input
                v-model="updatedTask.due_at"
                type="date"
                class="w-full bg-primary border rounded px-3 py-2"
              />
            </div>
            <div class="mb-4">
              <label class="block font-semibold mb-1">Completed At</label>
              <input
                v-model="updatedTask.completed_at"
                type="date"
                class="w-full bg-primary border rounded px-3 py-2"
              />
            </div>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                @click="showEditTaskModal = false"
                class="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded bg-primary text-gray-600 font-semibold hover:bg-btn_hover"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
    <transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showDeleteConfirmModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      >
        <div class="bg-btn rounded-lg shadow-lg p-6 w-full max-w-sm">
          <h2 class="text-xl font-bold mb-4 text-center text-gray-700">
            Delete Task
          </h2>
          <p class="mb-6 text-center text-gray-700">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>
          <div class="flex justify-end gap-2">
            <button
              @click="showDeleteConfirmModal = false"
              class="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              @click="confirmDeleteTask"
              class="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
