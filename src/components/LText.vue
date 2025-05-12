<template>
  <component :is="props.tag" :style="styleProps" class="l-text-component">
    {{ props.text }}
  </component>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from "vue";
import { pick } from "lodash-es";
import {
  textDefaultProps,
  type TextComponentProps,
  textStylePropNames,
} from "../defaultProps";

const props = withDefaults(defineProps<TextComponentProps>(), {
  ...textDefaultProps,
});

// 只获取样式相关的属性，并保证正确的优先级
const styleProps = computed(() => pick(props, textStylePropNames));
console.log(styleProps.value.textAlign);
</script>

<script lang="ts">
export default {
  name: "LText",
};
</script>

<style scoped lang="scss">
.l-text-component {
  position: relative !important;
}
</style>
