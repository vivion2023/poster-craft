/*
  @description 创建右键菜单
  @param actions 菜单项
  @param triggerClass 触发菜单的类名
  @returns 销毁菜单的函数，调用后会销毁菜单
*/
import { createVNode, render } from "vue";
import ContextMenu from "./ContextMenu.vue";
export interface ActionItem {
  action: (cid?: string) => void;
  text: string;
  shortcut: string;
}
const createContextMenu = (
  actions: ActionItem[],
  triggerClass = "edit-wrapper"
) => {
  const container = document.createElement("div");
  const options = {
    actions,
    triggerClass,
  };
  const vm = createVNode(ContextMenu, options);
  render(vm, container);
  document.body.appendChild(container);
  return () => {
    render(null, container);
    document.body.removeChild(container);
  };
};

export default createContextMenu;
