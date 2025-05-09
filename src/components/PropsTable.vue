<template>
  <div class="props-table">
    <div class="prop-item" v-for="(value, key) in finalProps" :key="key">
      <span class="label" v-if="value.text">{{ value.text }}：</span>
      <div class="prop-component">
        <component v-if="value" :is="value.component" :value="value.value">
          <template v-if="value.subComponent">
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
import { defineProps, computed } from "vue";
import { reduce } from "lodash";
import type { TextComponentProps } from "../defaultProps";
import { mapPropsToForm, PropToFormType } from "../propsMap";
const props = defineProps<{
  props: {
    type: TextComponentProps;
    required: true;
  };
}>();

const finalProps = computed(() => {
  return reduce(
    props.props,
    (result, value, key) => {
      const newKey = key as keyof TextComponentProps;
      const item = mapPropsToForm[newKey];
      if (item) {
        item.value = item.initialTransform
          ? item.initialTransform(value)
          : value;
        result[newKey] = item;
      }
      return result;
    },
    {} as Required<PropToFormType>
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
  }
}
</style>
