<template>
  <div class="context-menu-component menu-container" ref="menuRef">
    <ul class="ant-menu-light ant-menu-root ant-menu ant-menu-vertical">
      <li
        v-for="(action, index) in actions"
        :key="index"
        @click="action.action(componentId)"
        class="ant-menu-item"
      >
        <span class="item-text">{{ action.text }}</span>
        <span class="item-shortcut">{{ action.shortcut }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, PropType, defineProps } from "vue";
import { getParentElement } from "@/helper";
import { ActionItem } from "./createContextMenu";

const props = defineProps({
  actions: {
    type: Array as PropType<ActionItem[]>,
    required: true,
  },
  triggerClass: {
    type: String,
    default: "edit-wrapper",
  },
});
const menuRef = ref<HTMLElement | null>(null);
const componentId = ref("");
const triggerContextMenu = (e: MouseEvent) => {
  const domElement = menuRef.value as HTMLElement;
  const wrapperElement = getParentElement(
    e.target as HTMLElement,
    props.triggerClass
  );
  if (wrapperElement) {
    e.preventDefault();
    domElement.style.display = "block";

    // 获取菜单尺寸和窗口尺寸
    const menuWidth = 200; // 与CSS中的width保持一致
    const menuHeight = domElement.offsetHeight || 120; // 估算高度
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 计算菜单位置，确保不超出屏幕
    let left = e.pageX;
    let top = e.pageY;

    // 右边界检查
    if (left + menuWidth > windowWidth) {
      left = windowWidth - menuWidth - 10;
    }

    // 下边界检查
    if (top + menuHeight > windowHeight) {
      top = windowHeight - menuHeight - 10;
    }

    // 确保不超出左边界和上边界
    left = Math.max(10, left);
    top = Math.max(10, top);

    domElement.style.top = top + "px";
    domElement.style.left = left + "px";

    const cid = wrapperElement.dataset.componentId;
    if (cid) {
      componentId.value = cid;
    }
  }
};
const handleClick = () => {
  const domElement = menuRef.value as HTMLElement;
  domElement.style.display = "none";
};
onMounted(() => {
  document.addEventListener("contextmenu", triggerContextMenu);
  document.addEventListener("click", handleClick);
});

onUnmounted(() => {
  console.log("removed");
  document.removeEventListener("contextmenu", triggerContextMenu);
  document.removeEventListener("click", handleClick);
});
</script>

<style scoped>
.menu-container {
  display: none;
  position: absolute;
  background: #ffffff;
  z-index: 2000;
  width: 210px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e8e8e8;
  padding: 6px 0;
  font-size: 14px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}

.ant-menu-light {
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ant-menu-root {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ant-menu-vertical {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ant-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  margin: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.4;
  min-height: 36px;
  list-style: none;
}

.ant-menu-item:hover {
  background: #f5f5f5;
  color: #1890ff;
}

.ant-menu-item:active {
  background: #e6f7ff;
}

.item-text {
  font-weight: 400;
  color: #262626;
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ant-menu-item:hover .item-text {
  color: #1890ff;
}

.item-shortcut {
  color: #8c8c8c;
  font-size: 12px;
  margin-left: 10px;
  font-weight: 400;
  text-align: right;
  white-space: nowrap;
  flex-shrink: 0;
}

.ant-menu-item:hover .item-shortcut {
  color: #69c0ff;
}

/* 第一个和最后一个菜单项的圆角处理 */
.ant-menu-item:first-child {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.ant-menu-item:last-child {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

/* 菜单项之间的分隔线效果 */
.ant-menu-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.ant-menu-item:hover:not(:last-child) {
  border-bottom-color: transparent;
}
</style>
