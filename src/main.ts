import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router";
import App from "./App.vue";
import "./assets/main.css";

import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Toast, {
  // You can add options here if desired
});
app.mount("#app");
