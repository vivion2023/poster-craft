import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

const app = createApp(App);
app.use(Antd).use(store).use(router).mount("#app");
