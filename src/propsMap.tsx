import { VNode } from "vue";
import { TextComponentProps, ImageComponentProps } from "./defaultProps";

export interface PropToForm {
  component: string; // 组件名称
  subComponent?: string; // 子组件名称
  extraProps?: {
    [key: string]: any;
  }; // 子组件的额外属性
  text?: string; // 组件的文本名称
  options?: {
    text: string | VNode;
    value: any;
  }[]; // 组件的选项
  initialTransform?: (value: any) => any; // 初始值的类型转换
  afterTransform?: (value: any) => any; // 转换后的值的类型转换
  valueProp?: any; // 组件的值属性
  eventName?: string; // 组件的事件名称
}

export type PropToFormType = {
  [key in keyof TextComponentProps | keyof ImageComponentProps]?: PropToForm;
};

const fontFamilyArr = [
  { text: "宋体", value: '"SimSun", "STSong"' },
  { text: "黑体", value: '"SimHei", "STHeiti"' },
  { text: "楷体", value: '"KaiTi", "STKaiti"' },
  { text: "仿宋", value: '"FangSong", "STFangsong"' },
];

const fontFamilyOptions = fontFamilyArr.map((font) => {
  return {
    value: font.value,
    text: (
      <span style={{ fontFamily: font.value }}>{font.text}</span>
    ) as VNode,
  };
});

export const mapPropsToForm: PropToFormType = {
  text: {
    text: "文本",
    component: "a-textarea",
    extraProps: {
      rows: 3,
    },
    afterTransform: (e: any) => e.target.value,
  },
  fontSize: {
    text: "字号",
    component: "a-input-number",
    initialTransform: (value: string) => parseFloat(value),
    // parseFloat 将字符串转换为数字 如 "12px" 转换为 12
    afterTransform: (e: any) => (e ? `${e}px` : ""),
  },
  lineHeight: {
    text: "行高",
    component: "a-slider",
    initialTransform: (value: string) => parseFloat(value),
    afterTransform: (e: number) => e.toString(),
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1,
    },
  },
  textAlign: {
    component: "a-radio-group",
    subComponent: "a-radio-button",
    text: "对齐",
    options: [
      { text: "左对齐", value: "left" },
      { text: "居中", value: "center" },
      { text: "右对齐", value: "right" },
    ],
    afterTransform: (e: any) => e.target.value,
  },
  fontFamily: {
    text: "字体",
    component: "a-select",
    subComponent: "a-select-option",
    options: [{ text: "无", value: "" }, ...fontFamilyOptions],
  },
  color: {
    text: "字体颜色",
    component: "ColorPicker",
  },
  fontWeight: {
    text: "加粗",
    component: "IconSwitch",
    extraProps: {
      tooltip: "加粗",
    },
  },
  src: {
    text: "图片",
    component: "ImageProcesser",
  },
};
