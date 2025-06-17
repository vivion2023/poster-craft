<template>
  <Layout class="editor">
    <LayoutHeader class="editor-header">
      <div class="editor-header-left">
        <Logo></Logo>
      </div>
      <div class="editor-header-right">
        <a-button class="editor-header-button" type="primary">
          预览和设置
        </a-button>
        <a-button class="editor-header-button" type="primary">保存</a-button>
        <a-button class="editor-header-button" type="primary">发布</a-button>
        <UserProfile />
      </div>
    </LayoutHeader>

    <LayoutContent class="editor-content">
      <LayoutSider class="siderbar-container">
        <a-tabs v-model:activeKey="siderbarActiveKey">
          <a-tab-pane key="1">
            <template #tab>
              <span>
                <FontSizeOutlined />
                文本
              </span>
            </template>
            <ComponentList :list="defaultComponents" @on-item-click="addItem" />
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #tab>
              <span>
                <PictureOutlined />
                图片
              </span>
            </template>
          </a-tab-pane>
          <a-tab-pane key="3">
            <template #tab>
              <span>
                <AppstoreOutlined />
                形状
              </span>
            </template>
          </a-tab-pane>
        </a-tabs>
      </LayoutSider>

      <LayoutContent class="preview-container">
        <div class="preview-header">
          <div class="preview-header-left"></div>
          <p class="preview-title">画布区域</p>
          <div class="button-group">
            <div class="button-item"><QuestionOutlined /></div>
            <div class="button-item"><UndoOutlined /></div>
            <div class="button-item"><RedoOutlined /></div>
          </div>
        </div>
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
          <a-tabs v-model:activeKey="propertyActiveKey">
            <a-tab-pane key="component" tab="属性设置">
              <PropsTable
                v-if="currentElement && currentElement.props"
                :props="currentElement.props"
                @change="handleChange"
                :active="currentElementId === currentElement?.id"
              />
              <div class="property-item">
                {{ currentElement ? currentElement.props : "" }}
              </div>
            </a-tab-pane>
            <a-tab-pane key="layer" tab="图层设置">
              <layer-list
                :list="components"
                :selectedId="currentElementId || ''"
                @change="handleChange"
                @select="setActive"
              >
              </layer-list>
            </a-tab-pane>
            <a-tab-pane key="page" tab="页面设置">页面设置</a-tab-pane>
          </a-tabs>
        </div>
      </LayoutSider>
    </LayoutContent>

    <LayoutFooter class="editor-footer"></LayoutFooter>
  </Layout>
</template>

<script setup lang="ts">
import { ComponentData, GlobalDataProps } from "@/store";
import { useStore } from "vuex";
import { computed, DefineComponent, ref } from "vue";
import { LText, LImage, LShape } from "lego-components";
import { defaultTextTemplates } from "@/defaultTemplates";
import Logo from "@/components/Logo.vue";
import UserProfile from "@/components/UserProfile.vue";
import ComponentList from "@/components/ComponentList.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import PropsTable from "@/components/PropsTable";
import LayerList from "@/components/LayerList.vue";
export type TabType = "component" | "layer" | "page";

const store = useStore<GlobalDataProps>();
const components = computed(() => store.state.editor.components);
const defaultComponents = computed(() => defaultTextTemplates);
const currentElement = computed<ComponentData | null>(
  () => store.getters.currentElement
);
const currentElementId = computed(() => currentElement.value?.id);
const siderbarActiveKey = ref("1");
const propertyActiveKey = ref<TabType>("component");
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
* {
  margin: 0;
}

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
    padding: 0 24px;

    .editor-header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .editor-header-button {
      padding: 0 14px;
    }
  }

  .editor-content {
    display: flex;
    flex-direction: row;
    height: 100%;

    .siderbar-container,
    .property-container {
      width: 300px;
    }

    .siderbar-container {
      padding: 20px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .anticon {
        margin-right: 4px;
      }
    }

    .preview-container {
      background-color: rgb(238, 240, 244);
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      .preview-header {
        padding: 0 42px;
        display: flex;
        width: 100%;
        min-height: 50px;
        align-items: center;
        justify-content: space-between;

        .preview-header-left {
          width: 90px;
        }
        .preview-title {
          flex: 1;
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          color: rgb(121, 123, 127);
        }
        .button-group {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
          width: 90px;

          .button-item {
            width: 26px;
            height: 26px;
            padding: 6px;
            display: flex;
            cursor: pointer;
            border-radius: 50%;
            background-color: white;
            justify-content: center;
            align-items: center;
          }
        }
      }

      .preview-list {
        padding: 0;
        margin: 0;
        min-width: 375px;
        min-height: 200px;
        border: 1px solid #efefef;
        background: #fff;
        overflow-x: hidden;
        overflow-y: auto;
        position: fixed;
        margin-top: 50px;
        max-height: 80vh;
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
