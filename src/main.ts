import { createApp } from "vue";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import configAntD from "./configAntD";
import "ant-design-vue/dist/reset.css";
import "cropperjs/dist/cropper.css";
import { RespData } from "./store/respTypes";
export type ICustomAxiosConfig = AxiosRequestConfig & {
  opName?: string;
};

const app = createApp(App);
// 添加后端接口前缀
const baseBackendURL = "http://localhost:3000";
const baseH5URL = "http://localhost:8082";
export { baseBackendURL, baseH5URL };

axios.defaults.baseURL = `${baseBackendURL}/api/`;
axios.interceptors.request.use((config) => {
  const newConfig = config as ICustomAxiosConfig;
  store.commit("setError", { status: false, message: "" });
  store.commit("startLoading", { opName: newConfig.opName });
  return config;
});
axios.interceptors.response.use(
  (resp: AxiosResponse<RespData>) => {
    const { config, data } = resp;
    const newConfig = config as ICustomAxiosConfig;
    store.commit("finishLoading", { opName: newConfig.opName });
    const { errno, message: errorMessage } = data;
    if (errno && errno !== 0) {
      store.commit("setError", { status: true, message: errorMessage });
      return resp;
    }
    return resp;
  },
  (e: AxiosError) => {
    const newConfig = e.config as ICustomAxiosConfig;
    const errorMessage = "服务器错误";
    store.commit("setError", { status: true, message: errorMessage });
    store.commit("finishLoading", { opName: newConfig.opName });
    return Promise.reject(e);
  }
);

app.use(configAntD).use(store).use(router);

app.mount("#app");
