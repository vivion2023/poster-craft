<template>
  <draggable
    :list="list"
    class="ant-list-items ant-list-bordered"
    ghost-class="ghost"
    handle=".handle"
    item-key="id"
  >
    <template #item="{ element }">
      <li
        class="ant-list-item"
        :class="{ active: element.id === selectedId }"
        @click="handleClick(element.id)"
      >
        <a-tooltip :title="element.isHidden ? '显示' : '隐藏'">
          <a-button
            shape="circle"
            @click.stop="
              handleChange(element.id, 'isHidden', !element.isHidden)
            "
          >
            <template v-slot:icon v-if="element.isHidden"
              ><EyeOutlined />
            </template>
            <template v-slot:icon v-else><EyeInvisibleOutlined /> </template>
          </a-button>
        </a-tooltip>
        <a-tooltip :title="element.isLocked ? '解锁' : '锁定'">
          <a-button
            shape="circle"
            @click.stop="
              handleChange(element.id, 'isLocked', !element.isLocked)
            "
          >
            <template v-slot:icon v-if="element.isLocked"
              ><UnlockOutlined />
            </template>
            <template v-slot:icon v-else><LockOutlined /> </template>
          </a-button>
        </a-tooltip>
        <inline-edit
          class="edit-area"
          :value="element.layerName"
          :maxLength="10"
          @change="
            (value: string) => {
              handleChange(element.id, 'layerName', value);
            }
          "
        ></inline-edit>
        <a-tooltip title="拖动排序">
          <a-button shape="circle" class="handle">
            <template v-slot:icon><DragOutlined /> </template
          ></a-button>
        </a-tooltip>
      </li>
    </template>
  </draggable>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import draggable from "vuedraggable";
// 图标已通过 configAntD.ts 全局注册，无需导入
import { ComponentData } from "../store/editor";
import InlineEdit from "../components/InlineEdit.vue";

// 定义 props 接口
interface Props {
  list: ComponentData[];
  selectedId: string;
}

// 定义 emits 接口
interface Emits {
  (e: "select", id: string): void;
  (
    e: "change",
    data: { id: string; key: string; value: boolean | string; isRoot: boolean }
  ): void;
  (e: "drop"): void;
}

// 使用 defineProps 和 defineEmits
defineProps<Props>();
const emit = defineEmits<Emits>();

// 事件处理函数
const handleClick = (id: string) => {
  emit("select", id);
};

const handleChange = (id: string, key: string, value: boolean | string) => {
  const data = {
    id,
    key,
    value,
    isRoot: true,
  };
  emit("change", data);
};
</script>

<script lang="ts">
export default {
  name: "LayerList",
};
</script>

<style scoped>
.ant-list-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  transition: all 0.5s ease-out;
  cursor: pointer;
  justify-content: normal;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
}
.ant-list-item.active {
  border: 1px solid #1890ff;
}
.ant-list-item.ghost {
  opacity: 0.5;
}

.ant-list-item:hover {
  background: #e6f7ff;
}
.ant-list-item > * {
  margin-right: 10px;
}
.ant-list-item button {
  font-size: 12px;
}

.ant-list-item .handle {
  cursor: move;
  margin-left: auto;
}
.ant-list-item .edit-area {
  flex: 1;
  min-width: 0;
  max-width: 120px;
}
</style>
