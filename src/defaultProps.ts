import { without } from "lodash-es";

export interface CommonComponentProps {
  tag?: string;
  // actions
  actionType?: string;
  url?: string;
  // size
  height?: string;
  width?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  // border type
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  // shadow and opacity
  boxShadow?: string;
  opacity?: string;
  // position and x,y
  position?: string;
  left?: string;
  top?: string;
  right?: string;
}
export const commonDefaultProps: CommonComponentProps = {
  // actions
  actionType: "",
  url: "",
  // size
  height: "",
  width: "",
  paddingLeft: "0px",
  paddingRight: "0px",
  paddingTop: "0px",
  paddingBottom: "0px",
  // border type
  borderStyle: "none",
  borderColor: "#000",
  borderWidth: "0",
  borderRadius: "0",
  // shadow and opacity
  boxShadow: "0 0 0 #000000",
  opacity: "1",
  // position and x,y
  position: "absolute",
  left: "0",
  top: "0",
  right: "0",
};
export interface TextComponentProps extends CommonComponentProps {
  text?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  lineHeight?: string;
  textAlign?: string;
  color?: string;
  backgroundColor?: string;
  tag?: string;
}
export interface ImageComponentProps extends CommonComponentProps {
  src?: string;
}
export interface ShapeComponentProps extends CommonComponentProps {
  backgroundColor: string;
}
export type AllComponentProps = TextComponentProps &
  ImageComponentProps &
  ShapeComponentProps;
export const textDefaultProps: TextComponentProps = {
  // basic props - font styles
  text: "正文内容",
  fontSize: "14px",
  fontFamily: "",
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  lineHeight: "1",
  textAlign: "left",
  color: "#000000",
  backgroundColor: "",
  tag: "div",
  ...commonDefaultProps,
};
export const imageDefaultProps: ImageComponentProps = {
  src: "test.url",
  ...commonDefaultProps,
};
export const shapeDefaultProps: ShapeComponentProps = {
  backgroundColor: "#fff",
  ...commonDefaultProps,
};
export const textStylePropNames = without(
  Object.keys(textDefaultProps),
  "actionType",
  "url",
  "text"
);
export const imageStylePropsNames = without(
  Object.keys(imageDefaultProps),
  "src"
);
