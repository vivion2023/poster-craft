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

export const testData: TemplateProps[] = [
  {
    id: 1,
    title: "前端架构师海报",
    desc: "前端架构师海报",
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
    uuid: "123",
    author: "vivion",
    copiedCount: 1,
    isTemplate: true,
    isHot: true,
    isNew: true,
    status: 1,
    user: {
      gender: "male",
      nickName: "vivion",
      picture:
        "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
      userName: "vivion",
    },
  },
  {
    id: 2,
    title: "前端架构师海报",
    desc: "前端架构师海报",
    coverImg: "http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png",
    uuid: "123",
    author: "vivion",
    copiedCount: 1,
    isTemplate: true,
    isHot: true,
    isNew: true,
    status: 1,
    user: {
      gender: "male",
      nickName: "vivion",
      picture:
        "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
      userName: "vivion",
    },
  },
  {
    id: 3,
    title: "前端架构师海报",
    desc: "前端架构师海报",
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-323204.png",
    uuid: "123",
    author: "vivion",
    copiedCount: 1,
    isTemplate: true,
    isHot: true,
    isNew: true,
    status: 1,
    user: {
      gender: "male",
      nickName: "vivion",
      picture:
        "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
      userName: "vivion",
    },
  },
  {
    id: 4,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-677311.png",
    title: "前端架构师海报",
    desc: "前端架构师海报",
    uuid: "123",
    author: "vivion",
    copiedCount: 1,
    isTemplate: true,
    isHot: true,
    isNew: true,
    status: 1,
    user: {
      gender: "male",
      nickName: "vivion",
      picture:
        "https://static.imooc-lego.com/upload-files/screenshot-677311.png",
      userName: "vivion",
    },
  },
  {
    id: 5,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-726751.png",
    title: "前端架构师海报",
    desc: "前端架构师海报",
    uuid: "123",
    author: "vivion",
    copiedCount: 1,
    isTemplate: true,
    isHot: true,
    isNew: true,
    status: 1,
    user: {
      gender: "male",
      nickName: "vivion",
      picture:
        "https://static.imooc-lego.com/upload-files/screenshot-726751.png",
      userName: "vivion",
    },
  },
  {
    id: 6,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-682056.png",
    title: "前端架构师海报",
    desc: "前端架构师海报",
    uuid: "123",
    author: "vivion",
    copiedCount: 1,
    isTemplate: true,
    isHot: true,
    isNew: true,
    status: 1,
    user: {
      gender: "male",
      nickName: "vivion",
      picture:
        "https://static.imooc-lego.com/upload-files/screenshot-682056.png",
      userName: "vivion",
    },
  },
  {
    id: 7,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-133701.png",
    title: "前端架构师海报",
    desc: "前端架构师海报",
    uuid: "123",
    author: "vivion",
    copiedCount: 1,
    isTemplate: true,
    isHot: true,
    isNew: true,
    status: 1,
    user: {
      gender: "male",
      nickName: "vivion",
      picture:
        "https://static.imooc-lego.com/upload-files/screenshot-133701.png",
      userName: "vivion",
    },
  },
  {
    id: 8,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-649919.png",
    title: "前端架构师海报",
    desc: "前端架构师海报",
    uuid: "123",
    author: "vivion",
    copiedCount: 1,
    isTemplate: true,
    isHot: true,
    isNew: true,
    status: 1,
    user: {
      gender: "male",
      nickName: "vivion",
      picture:
        "https://static.imooc-lego.com/upload-files/screenshot-649919.png",
      userName: "vivion",
    },
  },
  {
    id: 9,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-649919.png",
    title: "前端架构师海报",
    desc: "前端架构师海报",
    uuid: "123",
    author: "vivion",
    copiedCount: 1,
    isTemplate: true,
    isHot: true,
    isNew: true,
    status: 1,
    user: {
      gender: "male",
      nickName: "vivion",
      picture:
        "https://static.imooc-lego.com/upload-files/screenshot-649919.png",
      userName: "vivion",
    },
  },
  {
    id: 10,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-649919.png",
    title: "前端架构师海报",
    desc: "前端架构师海报",
    uuid: "123",
    author: "vivion",
    copiedCount: 1,
    isTemplate: true,
    isHot: true,
    isNew: true,
    status: 1,
    user: {
      gender: "male",
      nickName: "vivion",
      picture:
        "https://static.imooc-lego.com/upload-files/screenshot-649919.png",
      userName: "vivion",
    },
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
