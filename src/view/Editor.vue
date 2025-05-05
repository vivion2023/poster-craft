<template>
  <div class="editor">
    <LayoutSider width="300px">
      <div class="siderbar-container">
        组件列表
        <ComponentList
          :list="defaultComponents"
          @on-item-click="handleItemClick"
        />
      </div>
    </LayoutSider>
    <LayoutContent class="preview-container">
      <p>画布区域</p>
      <div class="preview-list">
        <ComponentList :list="components" />
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
import { defaultTextTemplates } from "@/defaultTemplates";
import ComponentList from "@/components/ComponentList.vue";
const store = useStore<GlobalDataProps>();
const components = computed(() => store.state.editor.components);
const defaultComponents = computed(() => defaultTextTemplates);

const handleItemClick = (props: any) => {
  store.commit("addComponent", props);
};
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

      .preview-item {
        position: relative;
      }
    }
  }
  .property-container {
    background-color: purple;
    height: 100vh;
  }
}
</style>
