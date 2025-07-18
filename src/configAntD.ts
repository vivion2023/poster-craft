// 按需导入项目中实际使用的组件，避免导入整个 ant-design-vue

// 基础组件
import Space from "ant-design-vue/es/space";
import Typography from "ant-design-vue/es/typography";
import Tooltip from "ant-design-vue/es/tooltip";
import Avatar from "ant-design-vue/es/avatar";
import Button from "ant-design-vue/es/button";
import Spin from "ant-design-vue/es/spin";

// 反馈组件
import Modal from "ant-design-vue/es/modal";
import Drawer from "ant-design-vue/es/drawer";
import message from "ant-design-vue/es/message";

// 数据展示组件
import Card from "ant-design-vue/es/card";
import Tag from "ant-design-vue/es/tag";
import Empty from "ant-design-vue/es/empty";

// 布局组件
import Layout from "ant-design-vue/es/layout";
import Row from "ant-design-vue/es/row";
import Col from "ant-design-vue/es/col";

// 导航组件
import Tabs from "ant-design-vue/es/tabs";
import Menu from "ant-design-vue/es/menu";

// 表单组件
import Form from "ant-design-vue/es/form";
import Dropdown from "ant-design-vue/es/dropdown";
import Input from "ant-design-vue/es/input";
import InputNumber from "ant-design-vue/es/input-number";
import Slider from "ant-design-vue/es/slider";
import Radio from "ant-design-vue/es/radio";
import Select from "ant-design-vue/es/select";
// 按需导入项目中使用的图标
import {
  FontSizeOutlined,
  PictureOutlined,
  AppstoreOutlined,
  LoadingOutlined,
  FileImageOutlined,
  FileOutlined,
  DeleteOutlined,
  ScissorOutlined,
  UserOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UnlockOutlined,
  DragOutlined,
  RedoOutlined,
  UndoOutlined,
  QuestionOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons-vue";
import { App } from "vue";

// 导出 message 供其他组件使用
export { message };
export { BoldOutlined };
const components = [
  Space,
  Typography.Title,
  Typography.Paragraph,
  Tooltip,
  Avatar,
  Button,
  Spin,
  Modal,
  Drawer,
  Card,
  Card.Meta,
  Tag,
  Layout,
  Layout.Header,
  Layout.Footer,
  Layout.Sider,
  Layout.Content,
  Tabs,
  Tabs.TabPane,
  Menu,
  Menu.Item,
  Row,
  Col,
  Form,
  Form.Item,
  Dropdown,
  Dropdown.Button,
  Input,
  Input.Search,
  InputNumber,
  Input.TextArea,
  Slider,
  Radio.Group,
  Radio.Button,
  Select,
  Select.Option,
  Empty,
];

// 项目中使用的图标
const icons = [
  FontSizeOutlined,
  PictureOutlined,
  AppstoreOutlined,
  LoadingOutlined,
  FileImageOutlined,
  FileOutlined,
  DeleteOutlined,
  ScissorOutlined,
  UserOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UnlockOutlined,
  DragOutlined,
  RedoOutlined,
  UndoOutlined,
  QuestionOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
];

const install = (app: App) => {
  // 注册 Ant Design 组件
  components.forEach((component) => {
    app.component(component.name as string, component);
  });

  // 注册项目中使用的图标
  icons.forEach((icon) => {
    app.component(icon.name, icon);
  });
};
export default {
  install,
};
