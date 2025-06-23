import { Module } from "vuex";
import { GlobalDataProps } from "./index";
import { RespListData } from "./respTypes";
import axios from "axios";
import { PageData } from "./editor";
export type TemplateProps = Required<
  // 把结果中的顶层属性都变成必填
  Omit<
    // 先删除指定的两个键
    PageData, // 原始类型
    "props" | "setting" // 需要排除的键
  >
>;

export const testData: PageData[] = [
  {
    id: 1,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
    title: "前端架构师海报",
    author: "vivion",
    copiedCount: 1,
  },
  {
    id: 2,
    coverImg: "http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png",
    title: "前端架构师海报",
    author: "vivion",
    copiedCount: 1,
  },
  {
    id: 3,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-323204.png",
    title: "前端架构师海报",
    author: "vivion",
    copiedCount: 1,
  },
  {
    id: 4,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-677311.png",
    title: "前端架构师海报",
    author: "vivion",
    copiedCount: 1,
  },
  {
    id: 5,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-726751.png",
    title: "前端架构师海报",
    author: "vivion",
    copiedCount: 1,
  },
  {
    id: 6,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-682056.png",
    title: "前端架构师海报",
    author: "vivion",
    copiedCount: 1,
  },
  {
    id: 7,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-133701.png",
    title: "前端架构师海报",
    author: "vivion",
    copiedCount: 1,
  },
  {
    id: 8,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-649919.png",
    title: "前端架构师海报",
    author: "vivion",
    copiedCount: 1,
  },
  {
    id: 9,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-649919.png",
    title: "前端架构师海报",
    author: "vivion",
    copiedCount: 1,
  },
  {
    id: 10,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-649919.png",
    title: "前端架构师海报",
    author: "vivion",
    copiedCount: 1,
  },
];

export interface TemplatesProps {
  data: typeof testData;
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: testData,
  },

  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.data.find((item) => item.id === id);
    },
  },

  mutations: {
    fetchTemplates(state, rawData: RespListData<TemplateProps>) {
      state.data = rawData.data.list;
    },
  },

  actions: {
    fetchTemplates({ commit }) {
      return axios.get("/templates").then((resp) => {
        commit("fetchTemplates", resp.data);
      });
    },
  },
};

export default templates;
