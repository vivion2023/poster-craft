<template>
  <div class="props-table">
    <div class="prop-item" v-for="(value, key) in finalProps" :key="key">
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
              {{ option.text }}
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits } from "vue";
import { reduce } from "lodash";
import type { TextComponentProps } from "../defaultProps";
import { mapPropsToForm, PropToFormType } from "../propsMap";

const emit = defineEmits<{
  (e: "change", value: { key: string; value: any }): void;
}>();

interface FormProps {
  component: string; // 组件名称
  subComponent?: string; // 子组件名称
  value: string; // 组件的值
  extraProps?: {
    [key: string]: any;
  }; // 子组件的额外属性
  text?: string; // 组件的文本名称
  options?: {
    text: string;
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
      const item = mapPropsToForm[newKey];
      if (item) {
        const valueProp = "value";
        const eventName = "change";
        const initialTransform = item.initialTransform;
        const newItem: FormProps = {
          ...item,
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
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PropsTable",
});
</script>

<style lang="scss" scoped>
.props-table {
  .prop-item {
    display: flex;
    margin-bottom: 10px;
    .label {
      width: 100px;
    }
    .prop-component {
      flex: 1;
    }
  }
}
</style>
