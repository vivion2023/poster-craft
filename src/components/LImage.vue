<template>
  <div class="l-image-component" @click="handleClick">
    <img :src="props.src" :style="styleProps" />
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import {
  imageDefaultProps,
  type ImageComponentProps,
  imageStylePropsNames,
} from "../defaultProps";
import useComponentCommon from "../hooks/useComponentCommon";

const props = withDefaults(defineProps<ImageComponentProps>(), {
  ...imageDefaultProps,
});

// 使用 useComponentCommon hook
const { styleProps, handleClick } = useComponentCommon(
  props,
  imageStylePropsNames
);
</script>

<script lang="ts">
export default {
  name: "LImage",
};
</script>

<style scoped lang="scss">
.l-image-component {
  position: relative !important;
}
</style>
