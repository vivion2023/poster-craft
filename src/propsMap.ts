import { TextComponentProps } from "./defaultProps";

export interface PropToForm {
  component: string;
  value?: any;
  extraProps?: {
    [key: string]: any;
  };
}

export type PropToFormType = {
  [key in keyof TextComponentProps]: PropToForm;
};

export const mapPropsToForm: PropToFormType = {
  text: {
    component: "a-input",
  },
  fontSize: {
    component: "a-input-number",
  },
  lineHeight: {
    component: "a-slider",
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1,
    },
  },
};
