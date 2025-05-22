<template>
  <div class="editor">
    <LayoutSider width="300px">
      <div class="siderbar-container">
        <div class="siderbar-title">组件列表：</div>
        <ComponentList
          :list="defaultComponents"
          @on-item-click="handleItemClick"
        />
        <div class="siderbar-title">上传图片：</div>
        <StyledUploader />
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
          <a class="delete-btn" @click="handleDelete(component.id)"> 删除 </a>
        </edit-wrapper>
      </div>
    </LayoutContent>
    <LayoutSider width="300px">
      <div class="property-container">
        组件属性
        <PropsTable
          v-if="currentElement && currentElement.props"
          :props="currentElement.props"
          @change="handleChange"
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
import LImage from "@/components/LImage.vue";
import { defaultTextTemplates } from "@/defaultTemplates";
import ComponentList from "@/components/ComponentList.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import PropsTable from "@/components/PropsTable";
import StyledUploader from "@/components/StyledUploader.vue";
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
  "l-image": LImage,
};

const handleItemClick = (props: any) => {
  store.commit("addComponent", props);
};

const setActive = (id: string) => {
  store.commit("setActive", id);
};

const handleChange = (value: { key: string; value: any }) => {
  store.commit("updateComponent", value);
};

const handleDelete = (id: string) => {
  store.commit("deleteComponent", id);
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
    display: flex;
    flex-direction: column;
    gap: 10px;

    .siderbar-title {
      color: #000;
      font-size: 24px;
      font-weight: bold;
    }
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

    .delete-btn {
      color: red;
      display: flex;
      justify-content: right;
      align-items: center;
      cursor: pointer;
    }
  }
  .property-container {
    background-color: #fff;
    height: 100vh;
    padding: 20px;
  }
}
</style>
