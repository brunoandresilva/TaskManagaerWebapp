<template>
  <div class="space-y-4 w-full">
    <div
      v-for="task in tasks"
      :key="task.id"
      class="bg-btn rounded-xl p-4 shadow flex flex-col"
    >
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-800">{{ task.title }}</h2>
          <div class="flex gap-4 mt-1 text-sm text-gray-700">
            <span
              >Status:
              <span :class="statusColor(task.status)">{{
                statusLabel(task.status)
              }}</span></span
            >
            <span>Priority: {{ priorityLabel(task.priority) }}</span>
          </div>
        </div>
        <button
          @click="toggleDetails(task.id)"
          class="ml-4 px-3 py-1 rounded bg-[#DBCAAF] text-gray-700 hover:bg-[#B29B77] font-medium"
        >
          {{ expandedTask === task.id ? "Hide details" : "Show details" }}
        </button>
      </div>
      <div
        v-if="expandedTask === task.id"
        class="mt-3 text-gray-800 text-sm bg-primary rounded p-3"
      >
        <div>
          <strong>Description:</strong>
          {{ task.description || "No description" }}
        </div>
        <div><strong>Due at:</strong> {{ task.due_at || "No due date" }}</div>
        <div><strong>Created at:</strong> {{ task.created_at }}</div>
        <div><strong>Updated at:</strong> {{ task.updated_at }}</div>
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
