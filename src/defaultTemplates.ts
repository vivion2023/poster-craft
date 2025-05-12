import { v4 as uuidv4 } from "uuid";
export const defaultTextTemplates = [
  {
    id: uuidv4(),
    props: {
      tag: "h2",
      text: "大标题",
      fontSize: "24px",
      fontWeight: "bold",
      lineHeight: "1",
    },
  },
  {
    id: uuidv4(),
    props: {
      tag: "p",
      text: "正文内容",
      fontSize: "16px",
    },
  },
  {
    id: uuidv4(),
    props: {
      tag: "a",
      text: "链接内容",
      color: "#1890ff",
    },
  },
  {
    id: uuidv4(),
    props: {
      tag: "button",
      text: "按钮内容",
      paddingLeft: "10px",
      paddingRight: "10px",
      paddingTop: "4px",
      paddingBottom: "4px",
      backgroundColor: "#1890ff",
      borderRadius: "4px",
      borderColor: "#1890ff",
      borderWidth: "1px",
      boxShadow: "0 0 0 rgb(244, 238, 238)",
      borderStyle: "none",
      color: "#fff",
    },
  },
];
