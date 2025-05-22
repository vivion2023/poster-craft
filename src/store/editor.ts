import { Module } from "vuex";
import { GlobalDataProps } from "./index";
import { v4 as uuidv4 } from "uuid";
export interface EditorProps {
  // 当前编辑的元素
  currentElement: string;
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 一些项目信息，之后补充
}

export interface ComponentData {
  // 元素的属性
  props: {
    [key: string]: any;
  };
  // 元素的id
  id: string;
  // 业务组件库名称
  name: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "l-text",
    props: {
      tag: "div",
      text: "hello",
      fontSize: "20px",
      lineHeight: "1",
      textAlign: "left",
      color: "#000000",
      fontWeight: "normal",
    },
  },
  {
    id: uuidv4(),
    name: "l-text",
    props: {
      tag: "div",
      text: "hello2",
      fontSize: "10px",
      color: "red",
      fontFamily: "无",
      fontWeight: "normal",
    },
  },
  {
    id: uuidv4(),
    name: "l-text",
    props: {
      tag: "h2",
      text: "hello3",
    },
  },
];

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: "",
  },
  getters: {
    currentElement: (state) => {
      return state.components.find(
        (component) => component.id === state.currentElement
      );
    },
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      state.components.push(component);
    },
    setActive(state, currentID: string) {
      state.currentElement = currentID;
    },
    updateComponent(state, { key, value }) {
      const currentComponent = state.components.find(
        (component) => component.id === state.currentElement
      );
      if (currentComponent) {
        currentComponent.props[key] = value;
      }
    },
    deleteComponent(state, id: string) {
      const index = state.components.findIndex(
        (component) => component.id === id
      );
      if (index !== -1) {
        state.components.splice(index, 1);
      }
    },
  },
  actions: {
    addComponent({ commit }, component: ComponentData) {
      commit("addComponent", component);
    },
    setActive({ commit }, currentID: string) {
      commit("setActive", currentID);
    },
    deleteComponent({ commit }, id: string) {
      commit("deleteComponent", id);
    },
  },
};

export default editor;
