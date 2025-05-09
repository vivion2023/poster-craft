<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <component v-if="value" :is="value.component" :value="value.value" />
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
        item.value = value;
        result[newKey] = item;
      }
      return result;
    },
    {} as PropToFormType
  );
});
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PropsTable",
});
</script>
