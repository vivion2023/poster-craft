<template>
  <Layout class="editor">
    <LayoutHeader class="editor-header">
      <div class="editor-header-left">
        <Logo></Logo>
      </div>
      <div class="editor-header-right">
        <a-button type="primary">预览和设置</a-button>
        <a-button type="primary">保存</a-button>
        <a-button type="primary">发布</a-button>
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
            <ComponentList :list="defaultComponents" @on-item-click="addItem" />
          </a-tab-pane>
          <a-tab-pane key="3">
            <template #tab>
              <span>
                <AppstoreOutlined />
                形状
              </span>
            </template>
            <ComponentList :list="defaultComponents" @on-item-click="addItem" />
          </a-tab-pane>
        </a-tabs>
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
          <a-tabs v-model:activeKey="propertyActiveKey">
            <a-tab-pane key="1" tab="属性设置">
              <PropsTable
                v-if="currentElement && currentElement.props"
                :props="currentElement.props"
                @change="handleChange"
              />
              <div class="property-item">
                {{ currentElement ? currentElement.props : "" }}
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="图层设置">图层设置</a-tab-pane>
            <a-tab-pane key="3" tab="页面设置">页面设置</a-tab-pane>
          </a-tabs>
        </div>

        <!-- <div class="property-container">
          组件属性
          <PropsTable
            v-if="currentElement && currentElement.props"
            :props="currentElement.props"
            @change="handleChange"
          />
          <div class="property-item">
            {{ currentElement ? currentElement.props : "" }}
          </div>
        </div> -->
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
const store = useStore<GlobalDataProps>();
const components = computed(() => store.state.editor.components);
const defaultComponents = computed(() => defaultTextTemplates);
const currentElement = computed<ComponentData | null>(
  () => store.getters.currentElement
);
const currentElementId = computed(() => currentElement.value?.id);
const siderbarActiveKey = ref("1");
const propertyActiveKey = ref("1");
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
    padding: 0 24px;

    .editor-header-right {
      display: flex;
      align-items: center;
      gap: 10px;
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
