<template>
  <div class="props-table">
    <!-- 文本样式控件组合在一行，包含加粗、斜体和下划线 -->
    <div class="text-style-group" v-if="hasTextStyleProps">
      <span class="label">文本样式：</span>
      <div class="style-controls">
        <template v-for="(value, index) in textStyleProps" :key="index">
          <component
            :is="value.component"
            :[value.valueProp]="value.value"
            v-bind="value.extraProps"
            v-on="value.events"
          >
            <template v-if="value.options">
              <component
                :is="value.subComponent"
                v-for="(option, key) in value.options"
                :key="key"
                :value="option.value"
              >
                <slot :option="option">
                  {{ option.text }}
                </slot>
              </component>
            </template>
          </component>
        </template>
      </div>
    </div>

    <!-- 其他属性控件 -->
    <div class="prop-item" v-for="(value, index) in otherProps" :key="index">
      <span class="label" v-if="value.text">{{ value.text }}：</span>
      <div class="prop-component">
        <component
          :is="value.component"
          :[value.valueProp]="value.value"
          v-bind="value.extraProps"
          v-on="value.events"
        >
          <template v-if="value.options">
            <component
              :is="value.subComponent"
              v-for="(option, key) in value.options"
              :key="key"
              :value="option.value"
            >
              <slot :option="option">
                {{ option.text }}
              </slot>
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits, VNode } from "vue";
import { reduce } from "lodash";
import type { TextComponentProps } from "../defaultProps";
import { mapPropsToForms } from "../propsMap";

import { Input, InputNumber, Slider, Radio, Select } from "ant-design-vue";
// 导入自定义组件
import ColorPicker from "./ColorPicker.vue";
import IconSwitch from "./IconSwitch.vue";
import ImageProcesser from "./ImageProcesser.vue";
import ShadowPicker from "./ShadowPicker.vue";
import BackgroundProcesser from "./BackgroundProcesser.vue";

const emit = defineEmits<{
  (e: "change", value: { key: string; value: any }): void;
}>();

// 创建组件映射对象
const componentMap = {
  "a-textarea": Input.TextArea,
  "a-input-number": InputNumber,
  "a-slider": Slider,
  "a-radio-group": Radio.Group,
  "a-radio-button": Radio.Button,
  "a-select": Select,
  "a-select-option": Select.Option,
  "color-picker": ColorPicker,
  "icon-switch": IconSwitch,
  "image-processer": ImageProcesser,
  "shadow-picker": ShadowPicker,
  "background-processer": BackgroundProcesser,
} as any;

interface FormProps {
  component: string | any; // 组件名称或组件对象
  subComponent?: string; // 子组件名称
  value: string; // 组件的值
  extraProps?: {
    [key: string]: any;
  }; // 子组件的额外属性
  text?: string; // 组件的文本名称
  options?: {
    text: string | VNode;
    value: any;
  }[]; // 组件的选项
  valueProp?: any; // 组件的值属性
  eventName?: string; // 组件的事件名称
  events: {
    [key: string]: (e: any) => void;
  }; // 组件的事件
}

const props = defineProps<{
  props: TextComponentProps;
}>();

const finalProps = computed(() => {
  return reduce(
    props.props,
    (result, value, key) => {
      const newKey = key as keyof TextComponentProps;
      const item = mapPropsToForms[newKey];
      if (item) {
        const valueProp = item.valueProp || "value";
        const eventName = item.eventName || "change";
        const initialTransform = item.initalTransform;

        // 获取实际的组件：如果是自定义组件则从 componentMap 获取，否则使用字符串名称
        const actualComponent = componentMap[item.component] || item.component;

        const newItem: FormProps = {
          ...item,
          component: actualComponent,
          value: initialTransform ? initialTransform(value) : value,
          valueProp,
          eventName,
          events: {
            [eventName]: (e: any) => {
              emit("change", {
                key,
                value: item.afterTransform ? item.afterTransform(e) : e,
              });
            },
          },
        };
        result[newKey] = newItem;
      }
      return result;
    },
    {} as { [key: string]: FormProps }
  );
});

// 文本样式属性（加粗、斜体、下划线）
const textStyleKeys = ["fontWeight", "fontStyle", "textDecoration"];

const textStyleProps = computed(() => {
  const result: { [key: string]: FormProps } = {};
  textStyleKeys.forEach((key) => {
    if (finalProps.value[key]) {
      result[key] = finalProps.value[key];
    }
  });
  return result;
});

const hasTextStyleProps = computed(() => {
  return Object.keys(textStyleProps.value).length > 0;
});

const otherProps = computed(() => {
  const result: { [key: string]: FormProps } = {};
  Object.keys(finalProps.value).forEach((key) => {
    if (!textStyleKeys.includes(key)) {
      result[key] = finalProps.value[key];
    }
  });
  return result;
});
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PropsTable",
});
</script>

<style lang="scss" scoped>
.props-table {
  .text-style-group {
    display: flex;
    margin-bottom: 10px;
    align-items: center;

    .label {
      width: 70px;
    }

    .style-controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }

  .prop-item {
    display: flex;
    margin-bottom: 10px;
    .label {
      width: 70px;
    }
    .prop-component {
      flex: 1;
    }
  }
}
</style>
