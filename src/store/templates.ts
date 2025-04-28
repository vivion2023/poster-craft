import { Module } from "vuex";
import { GlobalDataProps } from "./index";
export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
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

export interface TemplatesProps {
  data: TemplateProps[];
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
};

export default templates;
