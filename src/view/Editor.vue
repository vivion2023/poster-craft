<template>
  <Layout class="editor">
    <LayoutHeader class="editor-header">
      <div class="editor-header-left">
        <img src="@/assets/logo.png" alt="logo" />
        <inline-edit :value="page.title" @change="titleChange" />
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
          <HistoryArea />
        </div>
        <!-- 阻止右键菜单 -->
        <div class="preview-content" @contextmenu.prevent>
          <div class="preview-list" id="canvas-area" :style="page.props">
            <edit-wrapper
              @set-active="setActive"
              @update-position="updatePosition"
              class="preview-list-item"
              v-for="component in components"
              :key="component.id"
              :id="component.id"
              :props="component.props"
              :hidden="component.isHidden"
              :active="component.id === (currentElement && currentElement.id)"
            >
              <component
                :is="componentMap[component.name]"
                v-bind="component.props"
              >
                {{ component.props.text }}
              </component>
            </edit-wrapper>
          </div>
        </div>
      </LayoutContent>

      <LayoutSider width="300px">
        <div class="property-container" id="settings-panel">
          <a-tabs v-model:activeKey="propertyActiveKey">
            <a-tab-pane key="component" tab="属性设置">
              <EditGroup
                v-if="currentElement && !currentElement.isLocked"
                :props="currentElement.props as AllComponentProps"
                @change="handleChange"
                :active="currentElementId === currentElement?.id"
              >
              </EditGroup>
              <div v-else>
                <a-empty>
                  <template #description>
                    <p>该元素被锁定，无法编辑</p>
                  </template>
                </a-empty>
              </div>
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
            <a-tab-pane key="page" tab="页面设置">
              <props-table
                :props="page.props as PageProps"
                @change="pageChange"
              >
              </props-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </LayoutSider>
    </LayoutContent>

    <LayoutFooter class="editor-footer"></LayoutFooter>
  </Layout>
</template>

<script setup lang="ts">
import { GlobalDataProps } from "@/store";
import { ComponentData } from "@/store/editor";
import { PageProps } from "@/store/editor";
import { useStore } from "vuex";
import initHotKeys from "@/plugins/hotKeys";
import { computed, DefineComponent, onMounted, ref } from "vue";
import { LText, LImage, LShape } from "lego-components";
import defaultTextTemplates from "@/defaultTemplates";
import PropsTable from "@/components/PropsTable.vue";
import UserProfile from "@/components/UserProfile.vue";
import ComponentList from "@/components/ComponentList.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import HistoryArea from "@/view/editor/HistoryArea.vue";
import LayerList from "@/components/LayerList.vue";
import EditGroup from "@/components/EditGroup.vue";
import InlineEdit from "@/components/InlineEdit.vue";
import { AllComponentProps } from "@/defaultProps";
import { pickBy } from "lodash-es";
import initContextMenu from "@/plugins/contextMenu";
import { useRoute } from "vue-router";
export type TabType = "component" | "layer" | "page";
initHotKeys();
initContextMenu();
const store = useStore<GlobalDataProps>();
const route = useRoute();
const currentWorkId = route.params.id;
const components = computed(() => store.state.editor.components);
const page = computed(() => store.state.editor.page);
const defaultComponents = computed(() => defaultTextTemplates);
const currentElement = computed<ComponentData | null>(
  () => store.getters.getCurrentElement
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

onMounted(() => {
  if (currentWorkId) {
    store.dispatch("fetchWork", { urlParams: { id: currentWorkId } });
  }
});

const addItem = (component: any) => {
  store.commit("addComponent", component);
};

const setActive = (id: string) => {
  store.commit("setActive", id);
};

const handleChange = (value: { key: string; value: any }) => {
  store.commit("updateComponent", value);
};

const updatePosition = (data: { left: number; top: number; id: string }) => {
  const { id } = data;
  const updatedData = pickBy<number>(data, (v, k) => k !== "id");
  const keysArr = Object.keys(updatedData); // 获取所有更新的key
  const valuesArr = Object.values(updatedData).map((v) => v + "px"); // 获取所有更新的value
  store.commit("updateComponent", { key: keysArr, value: valuesArr, id });
};

const pageChange = (e: any) => {
  console.log("page", e);
  store.commit("updatePage", e);
};

const titleChange = (newTitle: string) => {
  store.commit("updatePage", { key: "title", value: newTitle, isRoot: true });
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

    .editor-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      img {
        width: 34px;
        height: 34px;
        display: block;
      }
    }

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

    .siderbar-container {
      width: 300px;
    }
    .property-container {
      width: 354px;
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
      overflow: hidden; /* 防止容器本身产生滚动条 */

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

        .history-area {
          width: 90px;
          position: relative;
        }
      }

      .preview-content {
        flex: 1;
        overflow-x: auto;
        overflow-y: auto;
        max-height: calc(100vh - 144px); /* 减去header和footer的高度 */
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        box-sizing: border-box;

        .preview-list {
          padding: 0;
          min-width: 375px;
          min-height: 500px;
          border: 1px solid #efefef;
          position: relative;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          /* 海报的实际尺寸和样式将由page.props控制 */
          /* 默认宽度，如果page.props没有设置width */
          width: 375px;
        }

        .preview-list-item {
          position: absolute;
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
      max-height: 84vh;
      overflow-y: auto;
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
