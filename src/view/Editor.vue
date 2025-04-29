<template>
  <div class="editor">
    <LayoutSider width="300px">
      <div class="siderbar-container">组件列表</div>
    </LayoutSider>
    <LayoutContent class="preview-container">
      <p>画布区域</p>
      <div class="preview-list">
        <component
          v-for="component in components"
          :key="component.id"
          :is="component.name"
          class="preview-item"
        >
          <LText v-bind="component.props" />
        </component>
      </div>
    </LayoutContent>
    <LayoutSider width="300px">
      <div class="property-container">组件属性</div>
    </LayoutSider>
  </div>
</template>

<script setup lang="ts">
import { LayoutSider, LayoutContent } from "ant-design-vue";
import { GlobalDataProps } from "@/store";
import { useStore } from "vuex";
import { computed } from "vue";
import LText from "@/components/LText.vue";
const store = useStore<GlobalDataProps>();
const components = computed(() => store.state.editor.components);
</script>

<style scoped lang="scss">
.editor {
  height: 100vh;
  display: flex;
  .siderbar-container {
    background-color: yellow;
    height: 100vh;
  }
  .preview-container {
    background-color: grey;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .preview-list {
      background-color: white;
      width: 50%;
      height: 50%;
    }
  }
  .property-container {
    background-color: purple;
    height: 100vh;
  }
}
</style>
