import { ActionContext } from "vuex";
import axios, { AxiosRequestConfig } from "axios";

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
    const newConfig = { ...config, data: payload, opName: commitName };
    const { data } = await axios(url, newConfig);
    context.commit(commitName, data);
    return data;
  };
};
