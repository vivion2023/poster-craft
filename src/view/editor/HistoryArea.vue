<template>
  <div class="history-area">
    <div class="operation-list">
      <a-tooltip>
        <template #title> 快捷键提示 </template>
        <a-button shape="circle" @click="showShortcutModal">
          <template #icon><QuestionOutlined /> </template>
        </a-button>
      </a-tooltip>
      <a-tooltip>
        <template #title> 撤销 </template>
        <a-button
          shape="circle"
          @click="undoHistory"
          :disabled="undoIsDisabled"
        >
          <template #icon><UndoOutlined /> </template>
        </a-button>
      </a-tooltip>
      <a-tooltip>
        <template #title> 重做 </template>
        <a-button
          shape="circle"
          @click="redoHistory"
          :disabled="redoIsDisabled"
        >
          <template #icon><RedoOutlined /> </template>
        </a-button>
      </a-tooltip>
    </div>

    <!-- 快捷键提示弹窗 -->
    <a-modal
      v-model:open="shortcutModalVisible"
      title="快捷操作"
      :footer="null"
      width="500px"
      centered
      :z-index="9999"
    >
      <div class="shortcut-content">
        <div class="shortcut-item">
          <span class="shortcut-label">拷贝图层</span>
          <span class="shortcut-keys">⌘C / Ctrl+C</span>
        </div>
        <div class="shortcut-item">
          <span class="shortcut-label">粘贴图层</span>
          <span class="shortcut-keys">⌘V / Ctrl+V</span>
        </div>
        <div class="shortcut-item">
          <span class="shortcut-label">删除图层</span>
          <span class="shortcut-keys">Backspace / Delete</span>
        </div>
        <div class="shortcut-item">
          <span class="shortcut-label">取消选中</span>
          <span class="shortcut-keys">ESC</span>
        </div>
        <div class="shortcut-item">
          <span class="shortcut-label">撤销</span>
          <span class="shortcut-keys">⌘Z / Ctrl+Z</span>
        </div>
        <div class="shortcut-item">
          <span class="shortcut-label">重做</span>
          <span class="shortcut-keys">⌘⇧Z / Ctrl+Shift+Z</span>
        </div>
        <div class="shortcut-item">
          <span class="shortcut-label">上下左右移动一像素</span>
          <span class="shortcut-keys">↑ ↓ → ←</span>
        </div>
        <div class="shortcut-item">
          <span class="shortcut-label">上下左右移动十像素</span>
          <span class="shortcut-keys">Shift + ↑ ↓ → ←</span>
        </div>
      </div>
    </a-modal>

    <!-- <li v-for="(item, index) in histories" :key="item.id">
      <span :class="{ bold: index === historyIndex }"
        >{{ item.type }} - {{ item.data.key }}</span
      >
    </li> -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
// 图标已通过 configAntD.ts 全局注册，无需导入
import { GlobalDataProps } from "../../store/index";

const store = useStore<GlobalDataProps>();
// const histories = computed(() => store.state.editor.histories);
// const historyIndex = computed(() => store.state.editor.historyIndex);
const undoIsDisabled = computed<boolean>(() => store.getters.checkUndoDisable);
const redoIsDisabled = computed<boolean>(() => store.getters.checkRedoDisable);

// 快捷键弹窗相关
const shortcutModalVisible = ref(false);

const undoHistory = () => {
  store.commit("undo");
};
const redoHistory = () => {
  store.commit("redo");
};
const showShortcutModal = () => {
  shortcutModalVisible.value = true;
};
</script>

<style scoped>
.history-area {
  position: relative;
  z-index: 500;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;

  .operation-list {
    display: flex;
    gap: 10px;
  }
}
.history-area .bold {
  font-weight: bold;
}

.shortcut-content {
  padding: 16px 0;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.shortcut-item:last-child {
  border-bottom: none;
}

.shortcut-label {
  color: #666;
  font-size: 14px;
}

.shortcut-keys {
  color: #1890ff;
  font-weight: 500;
  font-size: 14px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}
</style>
