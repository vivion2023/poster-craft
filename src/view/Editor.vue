<template>
  <Layout class="editor">
    <LayoutHeader class="editor-header">
      <div class="editor-header-left">
        <LogoBox></LogoBox>
      </div>
      <div class="editor-header-right">
        <UserProfile />
      </div>
    </LayoutHeader>

    <LayoutContent class="editor-content">
      <LayoutSider width="300px">
        <div class="siderbar-container">
          <div class="siderbar-title">组件列表：</div>
          <ComponentList :list="defaultComponents" @on-item-click="addItem" />
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
    </LayoutContent>

    <LayoutFooter class="editor-footer"></LayoutFooter>
  </Layout>
</template>

<script setup lang="ts">
import { LayoutSider, LayoutContent } from "ant-design-vue";
import { ComponentData, GlobalDataProps } from "@/store";
import { useStore } from "vuex";
import { computed, DefineComponent } from "vue";
import { LText, LImage, LShape } from "lego-components";
import { defaultTextTemplates } from "@/defaultTemplates";
import ComponentList from "@/components/ComponentList.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import PropsTable from "@/components/PropsTable";
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
  "l-shape": LShape,
};

const addItem = (component: any) => {
  store.commit("addComponent", component);
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
  display: flex;
  flex-direction: column;
  height: 100vh;

  .editor-header {
    height: 64px;
    width: 100%;
    display: flex;
    background-color: #0c141cf6;
    justify-content: space-between;
    align-items: center;
  }

  .editor-content {
    display: flex;
    flex-direction: row;
    height: calc(100vh - 64px - 30px);

    .siderbar-container {
      padding: 20px;
      background-color: #fff;
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
      padding: 20px;
    }
  }

  .editor-footer {
    height: 30px;
    width: 100%;
    display: flex;
    background-color: #0c141cf6;
  }
}
</style>
