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

interface ComponentData {
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
      text: "hello",
    },
  },
  {
    id: uuidv4(),
    name: "l-text",
    props: {
      text: "hello2",
    },
  },
  {
    id: uuidv4(),
    name: "l-text",
    props: {
      text: "hello3",
    },
  },
];

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    currentElement: "",
    components: testComponents,
  },
};

export default editor;
