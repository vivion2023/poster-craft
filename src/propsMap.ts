import { TextComponentProps } from "./defaultProps";

export interface PropToForm {
  component: string;
  subComponent?: string;
  value?: any;
  extraProps?: {
    [key: string]: any;
  };
  text?: string;
  options?: {
    text: string;
    value: any;
  }[];
  initialTransform?: (value: any) => any;
}

export type PropToFormType = {
  [key in keyof TextComponentProps]: PropToForm;
};

export const mapPropsToForm: PropToFormType = {
  text: {
    text: "文本",
    component: "a-textarea",
    extraProps: {
      rows: 3,
    },
  },
  fontSize: {
    text: "字号",
    component: "a-input-number",
    initialTransform: (value: string) => parseFloat(value),
    // parseFloat 将字符串转换为数字 如 "12px" 转换为 12
  },
  lineHeight: {
    text: "行高",
    component: "a-slider",
    initialTransform: (value: string) => parseFloat(value),
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
  },
  fontFamily: {
    text: "字体",
    component: "a-select",
    subComponent: "a-select-option",
    options: [
      { text: "无", value: "" },
      { text: "宋体", value: '"SimSun", "STSong"' },
      { text: "黑体", value: '"SimHei", "STHeiti"' },
      { text: "楷体", value: '"KaiTi", "STKaiti"' },
      { text: "仿宋", value: '"FangSong", "STFangsong"' },
    ],
  },
};
