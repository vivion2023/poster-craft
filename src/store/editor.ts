import { Module } from "vuex";
import { GlobalDataProps } from "./index";
import { v4 as uuidv4 } from "uuid";
import { message } from "ant-design-vue";
import { cloneDeep } from "lodash-es";
import {
  textDefaultProps,
  imageDefaultProps,
  AllComponentProps,
} from "@/defaultProps";
export type MoveDirection = "Up" | "Down" | "Left" | "Right";
export interface EditorProps {
  // 当前编辑的元素
  currentElement: string;
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 一些项目信息，之后补充
  page: PageData;
  // 当前被复制的组件
  copiedComponent?: ComponentData;
}

export interface UpdateComponentData {
  key: keyof AllComponentProps | Array<keyof AllComponentProps>;
  value: string | string[];
  id: string;
  isRoot?: boolean;
}

export interface PageProps {
  backgroundColor: string;
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundSize: string;
  height: string;
}
export type AllFormProps = PageProps & AllComponentProps;

export interface PageData {
  id?: number;
  props?: PageProps;
  title?: string;
  desc?: string;
  coverImg?: string;
  uuid?: string;
  setting?: { [key: string]: any };
  isTemplate?: boolean;
  isHot?: boolean;
  isNew?: boolean;
  author?: string;
  copiedCount?: number;
  status?: number;
  user?: {
    gender: string;
    nickName: string;
    picture: string;
    userName: string;
  };
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
  // 图层是否隐藏
  isHidden?: boolean;
  // 图层是否锁定
  isLocked?: boolean;
  // 图层名称
  layerName?: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "l-text",
    layerName: "图层1",
    props: {
      ...textDefaultProps,
      tag: "div",
      text: "hello",
      fontSize: "20px",
      lineHeight: "1",
      textAlign: "left",
      color: "#000000",
      fontWeight: "normal",
      position: "absolute",
      left: "10px",
      top: "10px",
      width: "200px",
      height: "200px",
    },
  },
  // {
  //   id: uuidv4(),
  //   name: "l-text",
  //   layerName: "图层2",
  //   props: {
  //     ...textDefaultProps,
  //     tag: "div",
  //     text: "hello2",
  //     fontSize: "10px",
  //     color: "red",
  //     fontFamily: "无",
  //     fontWeight: "normal",
  //     position: "absolute",
  //   },
  // },
  // {
  //   id: uuidv4(),
  //   name: "l-text",
  //   layerName: "图层3",
  //   props: {
  //     ...textDefaultProps,
  //     tag: "h2",
  //     text: "hello3",
  //     position: "absolute",
  //   },
  // },
  // {
  //   id: uuidv4(),
  //   name: "l-image",
  //   layerName: "图层4",
  //   props: {
  //     ...imageDefaultProps,
  //     tag: "img",
  //     src: "http://localhost:7001/uploads/xlIvg6-thumbnail.jpg",
  //     position: "absolute",
  //   },
  // },
];

const pageDefaultProps = {
  backgroundColor: "#ffffff",
  backgroundImage:
    "https://static.imooc-lego.com/upload-files/screenshot-677311.png",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "560px",
};

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: "",
    page: {
      props: pageDefaultProps,
      title: "test title",
    },
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
      const newComponent = {
        ...component,
        id: uuidv4(),
      };
      state.components.push(newComponent);
    },
    setActive(state, currentID: string) {
      state.currentElement = currentID;
    },
    updateComponent(state, { key, value, id, isRoot }: UpdateComponentData) {
      const updatedComponent = state.components.find(
        (component) => component.id === (id || state.currentElement)
      );
      if (updatedComponent) {
        if (isRoot) {
          // https://github.com/microsoft/TypeScript/issues/31663
          if (Array.isArray(key)) {
            key.forEach((k, index) => {
              const val = Array.isArray(value) ? value[index] : value;
              (updatedComponent as any)[k as string] = val;
            });
          } else {
            (updatedComponent as any)[key as string] = value;
          }
        } else {
          if (Array.isArray(key)) {
            key.forEach((k, index) => {
              const val = Array.isArray(value) ? value[index] : value;
              updatedComponent.props[k as string] = val;
            });
          } else {
            updatedComponent.props[key as string] = value;
          }
        }
      }
    },
    updatePage: (state, { key, value, isRoot, isSetting }) => {
      if (isRoot) {
        state.page[key as keyof PageData] = value;
      } else if (isSetting) {
        state.page.setting = {
          ...state.page.setting,
          [key]: value,
        };
      } else {
        if (state.page.props) {
          state.page.props[key as keyof PageProps] = value;
        }
      }
    },
    copyComponent(state, id) {
      const currentComponent = state.components.find(
        (component) => component.id === id
      );
      if (currentComponent) {
        state.copiedComponent = currentComponent;
        message.success("已拷贝当前图层", 1);
      }
    },
    pasteCopiedComponent: (state) => {
      if (state.copiedComponent) {
        const clone = cloneDeep(state.copiedComponent);
        clone.id = uuidv4();
        clone.layerName = clone.layerName + "副本";
        state.components.push(clone);
        message.success("已黏贴当前图层", 1);
      }
    },
    moveComponent(
      state,
      data: { direction: MoveDirection; amount: number; id: string }
    ) {
      const currentComponent = state.components.find(
        (component) => component.id === data.id
      );
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || "0");
        const oldLeft = parseInt(currentComponent.props.left || "0");
        const { direction, amount } = data;
        switch (direction) {
          case "Up": {
            const newValue = oldTop - amount + "px";
            currentComponent.props.top = newValue;
            break;
          }
          case "Down": {
            const newValue = oldTop + amount + "px";
            currentComponent.props.top = newValue;
            break;
          }
          case "Left": {
            const newValue = oldLeft - amount + "px";
            currentComponent.props.left = newValue;
            break;
          }
          case "Right": {
            const newValue = oldLeft + amount + "px";
            currentComponent.props.left = newValue;
            break;
          }

          default:
            break;
        }
      }
    },
    deleteComponent: (state, id) => {
      const currentComponent = state.components.find(
        (component) => component.id === id
      );
      if (currentComponent) {
        state.components = state.components.filter(
          (component) => component.id !== id
        );
        message.success("删除当前图层成功", 1);
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
