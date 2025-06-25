import { createStore, ActionContext } from "vuex";
import axios, { AxiosRequestConfig } from "axios";
import templates, { TemplatesProps } from "./templates";
import user, { UserProps } from "./user";
import editor, { EditorProps } from "./editor";
import { ComponentData } from "./editor";
export { ComponentData };

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorProps;
}

const store = createStore({
  modules: {
    templates,
    user,
    editor,
  },
  actions: {},
});

// 封装actionWrapper
// 第二步，确定参数
export const actionWrapper = (
  url: string,
  commitName: string,
  config: AxiosRequestConfig = { method: "GET" }
) => {
  // 第一步：先返回一个函数和原来的函数处理一模一样
  return async (context: ActionContext<any, any>, payload?: any) => {
    // 第三部，写重复的逻辑
    const newConfig = { ...config, data: payload };
    const { data } = await axios(url, newConfig);
    context.commit(commitName, data);
    return data;
  };
};

export interface ActionPayload {
  urlParams?: { [key: string]: any };
  data?: any;
  searchParams?: { [key: string]: any };
}
export default store;
