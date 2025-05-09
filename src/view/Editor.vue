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
        <edit-wrapper
          v-for="component in components"
          :key="component.id"
          :id="component.id"
          @set-active="setActive"
          :active="component.id === currentElementId"
        >
          <component
            :is="componentMap[component.name]"
            v-bind="component.props"
          >
            {{ component.props.text }}
          </component>
        </edit-wrapper>
      </div>
    </LayoutContent>
    <LayoutSider width="300px">
      <div class="property-container">
        组件属性
        <PropsTable
          v-if="currentElement && currentElement.props"
          :props="currentElement.props"
        />
        <div class="property-item">
          {{ currentElement ? currentElement.props : "" }}
        </div>
      </div>
    </LayoutSider>
  </div>
</template>

<script setup lang="ts">
import { LayoutSider, LayoutContent } from "ant-design-vue";
import { ComponentData, GlobalDataProps } from "@/store";
import { useStore } from "vuex";
import { computed, DefineComponent } from "vue";
import LText from "@/components/LText.vue";
import { defaultTextTemplates } from "@/defaultTemplates";
import ComponentList from "@/components/ComponentList.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import PropsTable from "@/components/PropsTable.vue";
const store = useStore<GlobalDataProps>();
const components = computed(() => store.state.editor.components);
const defaultComponents = computed(() => defaultTextTemplates);
const currentElement = computed<ComponentData | null>(
  () => store.getters.currentElement
);
const currentElementId = computed(() => currentElement.value?.id);

// 字符串到实际组件的映射
const componentMap: {
  [key: string]: DefineComponent<any, any, any>;
} = {
  "l-text": LText,
};

const handleItemClick = (props: any) => {
  store.commit("addComponent", props);
};

const setActive = (id: string) => {
  store.commit("setActive", id);
};
</script>

<style scoped lang="scss">
.editor {
  height: 100vh;
  display: flex;
  .siderbar-container {
    padding: 20px;
    background-color: #fff;
    height: 100vh;
  }
  .preview-container {
    background-color: rgb(210, 210, 210);
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
    background-color: #fff;
    height: 100vh;
    padding: 20px;
  }
}
</style>
