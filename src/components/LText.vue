<template>
  <div :style="styleProps" class="l-text-component">
    {{ props.text }}
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from "vue";
import { pick } from "lodash-es";
import {
  textDefaultProps,
  textStylePropNames,
  type TextComponentProps,
} from "../defaultProps";

// 使用正确的类型定义
const props = withDefaults(defineProps<TextComponentProps>(), {
  ...textDefaultProps,
});

// 只获取样式相关的属性，并保证正确的优先级
const styleProps = computed(() => ({
  ...pick(textDefaultProps, textStylePropNames),
  ...pick(props, textStylePropNames),
}));
</script>

<style scoped lang="scss">
.l-text-component {
  position: relative !important;
}
</style>
