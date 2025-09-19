<template>
  <div class="space-y-4 w-full">
    <div class="max-h-[450px] overflow-y-auto space-y-4 w-full">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="bg-btn rounded-xl p-4 shadow flex flex-col"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-gray-800">
              {{ task.title }}
            </h2>
            <div class="flex gap-4 mt-1 text-sm text-gray-700">
              <span>
                Status:
                <span :class="statusColor(task.status)">{{
                  statusLabel(task.status)
                }}</span>
              </span>
              <span>Priority: {{ priorityLabel(task.priority) }}</span>
            </div>
          </div>
          <div class="flex flex-row items-center gap-2">
            <div class="flex flex-col items-center gap-2">
              <button
                @click="$emit('delete-task', task.id)"
                class="p-2 rounded hover:bg-btn_hover text-red-600"
                title="Delete Task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button
                @click="$emit('edit-task', task.id)"
                class="p-2 rounded hover:bg-btn_hover text-blue-600"
                title="Edit Task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"
                  />
                  <path
                    d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"
                  />
                </svg>
              </button>
            </div>
            <button
              @click="toggleDetails(task.id)"
              class="px-3 py-1 rounded bg-[#DBCAAF] text-gray-700 hover:bg-[#B29B77] font-medium"
            >
              {{ expandedTask === task.id ? "Hide details" : "Show details" }}
            </button>
          </div>
        </div>
        <transition
          name="fade-details"
          enter-active-class="transition duration-500"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-500"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="expandedTask === task.id"
            class="mt-3 text-gray-800 text-sm bg-primary rounded p-3 overflow-hidden"
          >
            <div>
              <strong>Description:</strong>
              {{ task.description || "No description" }}
            </div>
            <div><strong>Due at:</strong> {{ formatDate(task.due_at) }}</div>
            <div>
              <strong>Created at:</strong> {{ formatDate(task.created_at) }}
            </div>
            <div>
              <strong>Updated at:</strong> {{ formatDate(task.updated_at) }}
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref } from "vue";

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: 0 | 1 | 2 | 3;
  due_at: string | null;
  created_at: string;
  updated_at: string;
};
const props = defineProps<{
  tasks: Task[];
}>();

console.log("Tasks received:", props.tasks);

const expandedTask = ref<number | null>(null);

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "No due date";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr ?? "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function toggleDetails(id: number) {
  expandedTask.value = expandedTask.value === id ? null : id;
}

function statusLabel(status: Task["status"]): string {
  switch (status) {
    case "todo":
      return "To Do";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}
function statusColor(status: Task["status"]): string {
  switch (status) {
    case "todo":
      return "text-gray-500";
    case "in_progress":
      return "text-yellow-600";
    case "done":
      return "text-green-700";
    default:
      return "";
  }
}
function priorityLabel(priority: number): string {
  switch (priority) {
    case 0:
      return "Low";
    case 1:
      return "Medium";
    case 2:
      return "High";
    case 3:
      return "Critical";
    default:
      return priority.toString();
  }
}
</script>
