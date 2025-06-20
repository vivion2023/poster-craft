/*
  @description 初始化右键菜单
  使用方法：
  import initContextMenu from "@/plugins/contextMenu";
  initContextMenu();
  可传入不同的actions来创建不同的右键菜单
  可自行销毁菜单
*/
import { onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import createContextMenu, { ActionItem } from "@/components/createContextMenu";
const initContextMenu = () => {
  const store = useStore();
  const actions: ActionItem[] = [
    {
      shortcut: "Ctrl+C",
      text: "复制图层",
      action: (cid) => {
        store.commit("copyComponent", cid);
      },
    },
    {
      shortcut: "Backspace / Delete",
      text: "删除图层",
      action: (cid) => {
        store.commit("deleteComponent", cid);
      },
    },
    {
      shortcut: "Ctrl+Z",
      text: "撤销",
      action: () => {
        store.commit("undo");
      },
    },
    {
      shortcut: "Ctrl+Y",
      text: "重做",
      action: () => {
        store.commit("redo");
      },
    },
  ];

  // 可通过传入不同的actions来创建不同的右键菜单
  // const testActions2: ActionItem[] = [
  //   {
  //     shortcut: "Ctrl+C",
  //     text: "复制配置",
  //     action: () => {
  //       console.log(2);
  //     },
  //   },
  // ];
  let destory: any;
  // let destory2: any;
  onMounted(() => {
    destory = createContextMenu(actions, "edit-wrapper");
    // destory2 = createContextMenu(testActions2, "settings-panel");
  });
  onUnmounted(() => {
    destory();
    // destory2();
  });
};

export default initContextMenu;
