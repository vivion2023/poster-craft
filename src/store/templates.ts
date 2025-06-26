import { Module } from "vuex";
import { GlobalDataProps } from "./index";
import { RespListData } from "./respTypes";
import { actionWrapper } from "./utils";
import { PageData } from "./editor";
export type TemplateProps = Required<
  // 把结果中的顶层属性都变成必填
  Omit<
    // 先删除指定的两个键
    PageData, // 原始类型
    "props" | "setting" // 需要排除的键
  >
>;

export interface TemplatesProps {
  data: TemplateProps[];
  totalTemplates: number;
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: [], // 初始为空数组
    totalTemplates: 0,
  },

  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.data.find((item) => item.id === id);
    },
  },

  mutations: {
    fetchTemplates(state, rawData: RespListData<TemplateProps>) {
      const { count, list } = rawData.data;
      state.data = [...state.data, ...list];
      state.totalTemplates = count;
    },
  },

  actions: {
    fetchTemplates: actionWrapper("/templates", "fetchTemplates"),
  },
};

export default templates;
