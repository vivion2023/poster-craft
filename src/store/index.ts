import { createStore } from "vuex";

export interface UserProps {
  isLogin: boolean;
  userName?: string;
}

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
}

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplateProps[];
}

const testData: TemplateProps[] = [
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

const store = createStore({
  state: {
    templates: testData,
    user: {
      isLogin: false,
    },
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
});

export default store;
