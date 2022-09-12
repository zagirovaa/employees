import { createApp } from "vue";
import "bulma";
import "bulma-tooltip";

import App from "./App.vue";

const app = createApp(App);
app.config.unwrapInjectedRef = true;
const vm = app.mount("#app");
