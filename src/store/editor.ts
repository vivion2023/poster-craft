import { Module, Mutation } from "vuex";
import { GlobalDataProps } from "./index";
import { v4 as uuidv4 } from "uuid";
import { message } from "ant-design-vue";
import { cloneDeep } from "lodash-es";
import { insertAt } from "@/helper";
import {
  textDefaultProps,
  imageDefaultProps,
  AllComponentProps,
} from "@/defaultProps";
// 移动方向
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
  // 当前操作的历史记录
  histories: HistoryProps[];
  // 当前历史记录的操作位置
  historyIndex: number;
  // 开始更新时的缓存值
  cachedOldValues: any;
  // 保存最多历史条目记录数
  maxHistoryNumber: number;
  // 数据是否有修改
  isDirty: boolean;
}

// 历史记录
export interface HistoryProps {
  id: string;
  componentId: string;
  type: "add" | "delete" | "modify";
  data: any;
  index?: number;
}

// 更新组件数据
export interface UpdateComponentData {
  key: keyof AllComponentProps | Array<keyof AllComponentProps>;
  value: string | string[];
  id: string;
  isRoot?: boolean;
}

// 页面属性
export interface PageProps {
  backgroundColor: string;
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundSize: string;
  height: string;
}

// 所有属性
export type AllFormProps = PageProps & AllComponentProps;

// 页面数据
export interface PageData {
  id?: number; // 模板id(自增)
  props?: PageProps;
  title?: string;
  desc?: string;
  coverImg?: string;
  uuid?: string; // 模板uuid
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

// 组件数据
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
    "url('https://static.imooc-lego.com/upload-files/screenshot-677311.png')",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "560px",
};

/**
 * @description 防抖函数
 * @param callback
 * @param timeout
 * @returns
 */
const debounceChange = (callback: (...args: any) => void, timeout = 1000) => {
  let timer = 0;
  return (...args: any) => {
    console.log(timer);
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = 0;
      callback(...args);
    }, timeout);
  };
};

// 根据 id 查找组件（供 mutation 内部复用）
const findComponentById = (state: EditorProps, id: string) =>
  state.components.find((component) => component.id === id);

/**
 * @description 历史记录相关函数
 */

// 添加历史记录
const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  // check historyIndex is already moved
  if (state.historyIndex !== -1) {
    // if moved, delete all the records greater than the index
    state.histories = state.histories.slice(0, state.historyIndex);
    // move historyIndex to unmoved
    state.historyIndex = -1;
  }
  // check length
  if (state.histories.length < state.maxHistoryNumber) {
    state.histories.push(historyRecord);
  } else {
    // larger than max number
    // shift the first
    // push to last
    state.histories.shift();
    state.histories.push(historyRecord);
  }
};

// 修改历史记录（防抖处理）
const pushModifyHistory = (
  state: EditorProps,
  { key, value, id }: UpdateComponentData
) => {
  pushHistory(state, {
    id: uuidv4(),
    componentId: id || state.currentElement,
    type: "modify",
    data: { oldValue: state.cachedOldValues, newValue: value, key },
  });
  state.cachedOldValues = null;
};
const pushHistoryDebounce = debounceChange(pushModifyHistory);

// 修改历史记录
const modifyHistory = (
  state: EditorProps,
  history: HistoryProps,
  type: "undo" | "redo"
) => {
  const { componentId, data } = history;
  const { key, oldValue, newValue } = data;
  const newKey = key as
    | keyof AllComponentProps
    | Array<keyof AllComponentProps>;
  const updatedComponent = state.components.find(
    (component) => component.id === componentId
  );
  if (updatedComponent) {
    // check if key is array
    if (Array.isArray(newKey)) {
      newKey.forEach((keyName, index) => {
        updatedComponent.props[keyName] =
          type === "undo" ? oldValue[index] : newValue[index];
      });
    } else {
      updatedComponent.props[newKey] = type === "undo" ? oldValue : newValue;
    }
  }
};

/**
 * @description 设置脏状态
 * @param callback
 * @returns
 */
const setDirtyWrapper = (callback: Mutation<EditorProps>) => {
  return (state: EditorProps, payload: any) => {
    state.isDirty = true;
    callback(state, payload);
  };
};

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: "",
    page: {
      props: pageDefaultProps,
      title: "test title",
    },
    histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 5,
    isDirty: false,
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find(
        (component) => component.id === state.currentElement
      );
    },
    getElement: (state) => (id: string) => {
      return state.components.find(
        (component) => component.id === (id || state.currentElement)
      );
    },
    getComponentsLength: (state) => {
      return state.components.length;
    },
    checkUndoDisable: (state) => {
      // 1 no history item
      // 2 move to the first item
      if (state.histories.length === 0 || state.historyIndex === 0) {
        return true;
      }
      return false;
    },
    checkRedoDisable: (state) => {
      // 1 no history item
      // 2 move to the last item
      // 3 never undo before
      if (
        state.histories.length === 0 ||
        state.historyIndex === state.histories.length ||
        state.historyIndex === -1
      ) {
        return true;
      }
      return false;
    },
  },
  mutations: {
    setActive(state, currentID: string) {
      state.currentElement = currentID;
    },
    addComponent: setDirtyWrapper((state, component: ComponentData) => {
      component.layerName = "图层" + (state.components.length + 1);
      state.components.push(component);
      pushHistory(state, {
        id: uuidv4(),
        componentId: component.id,
        type: "add",
        data: cloneDeep(component),
      });
    }),
    updateComponent: setDirtyWrapper(
      (state, { key, value, id, isRoot }: UpdateComponentData) => {
        const updatedComponent = state.components.find(
          (component) => component.id === (id || state.currentElement)
        );
        if (updatedComponent) {
          if (isRoot) {
            // https://github.com/microsoft/TypeScript/issues/31663
            (updatedComponent as any)[key as string] = value;
          } else {
            const oldValue = Array.isArray(key)
              ? key.map((key) => updatedComponent.props[key])
              : updatedComponent.props[key];
            if (!state.cachedOldValues) {
              state.cachedOldValues = oldValue;
            }
            pushHistoryDebounce(state, { key, value, id });
            if (Array.isArray(key) && Array.isArray(value)) {
              key.forEach((keyName, index) => {
                updatedComponent.props[keyName] = value[index];
              });
            } else if (typeof key === "string" && typeof value === "string") {
              updatedComponent.props[key] = value;
            }
          }
        }
      }
    ),
    updatePage: setDirtyWrapper((state, { key, value, isRoot, isSetting }) => {
      if (isRoot) {
        state.page[key as keyof PageData] = value;
      } else if (isSetting) {
        debugger;
        state.page.setting = {
          ...state.page.setting,
          [key]: value,
        };
      } else {
        if (state.page.props) {
          state.page.props[key as keyof PageProps] = value;
        }
      }
    }),
    copyComponent(state, id) {
      const currentComponent = findComponentById(state, id);
      if (currentComponent) {
        state.copiedComponent = currentComponent;
        message.success("已拷贝当前图层", 1);
      }
    },
    pasteCopiedComponent: setDirtyWrapper((state) => {
      if (state.copiedComponent) {
        const clone = cloneDeep(state.copiedComponent);
        clone.id = uuidv4();
        clone.layerName = clone.layerName + "副本";
        state.components.push(clone);
        message.success("已黏贴当前图层", 1);
        pushHistory(state, {
          id: uuidv4(),
          componentId: clone.id,
          type: "add",
          data: cloneDeep(clone),
        });
      }
    }),
    moveComponent(
      state,
      data: { direction: MoveDirection; amount: number; id: string }
    ) {
      const currentComponent = findComponentById(state, data.id);
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
    deleteComponent: setDirtyWrapper((state, id) => {
      const currentComponent = state.components.find(
        (component) => component.id === id
      );
      if (currentComponent) {
        const currentIndex = state.components.findIndex(
          (component) => component.id === id
        );
        state.components = state.components.filter(
          (component) => component.id !== id
        );
        pushHistory(state, {
          id: uuidv4(),
          componentId: currentComponent.id,
          type: "delete",
          data: currentComponent,
          index: currentIndex,
        });
        message.success("删除当前图层成功", 1);
      }
    }),
    undo(state) {
      // never undo before
      if (state.historyIndex === -1) {
        // undo the last item of the array
        state.historyIndex = state.histories.length - 1;
      } else {
        // undo to the previous step
        state.historyIndex--;
      }
      // get the history record
      const history = state.histories[state.historyIndex];
      switch (history.type) {
        case "add":
          // if create a component, we should remove it
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          );
          break;
        case "delete":
          // if delete a component, we should restore it to the right position
          state.components = insertAt(
            state.components,
            history.index as number,
            history.data
          );
          break;
        case "modify": {
          // get the modified component by id, restore to the old value
          modifyHistory(state, history, "undo");
          break;
        }
        default:
          break;
      }
    },
    redo(state) {
      // can't redo when historyIndex is the last item or historyIndex is never moved
      if (state.historyIndex === -1) {
        return;
      }
      // get the record
      const history = state.histories[state.historyIndex];
      // process the history data
      switch (history.type) {
        case "add":
          state.components.push(history.data);
          // state.components = insertAt(state.components, history.index as number, history.data)
          break;
        case "delete":
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          );
          break;
        case "modify": {
          modifyHistory(state, history, "redo");
          break;
        }
        default:
          break;
      }
      state.historyIndex++;
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
