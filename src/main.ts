import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import * as Icons from "@ant-design/icons-vue";

const app = createApp(App);
app.use(Antd).use(store).use(router);

// 全局注册所有图标
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

app.mount("#app");
