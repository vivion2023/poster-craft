import { TextComponentProps } from "./defaultProps";

export interface PropToForm {
  component: string;
  value?: any;
  extraProps?: {
    [key: string]: any;
  };
  valueType?: "string" | "number" | "boolean";
  text?: string;
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
    text: "字体",
    component: "a-input-number",
  },
  lineHeight: {
    text: "行高",
    component: "a-slider",
    valueType: "number",
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1,
    },
  },
};

export const convertValueType = (value: any, type?: string) => {
  if (!type) return value;

  switch (type) {
    case "number":
      return Number(value);
    case "boolean":
      return Boolean(value);
    case "string":
      return String(value);
    default:
      return value;
  }
};
