<template>
  <div class="l-image-component">
    <img :src="props.src" :style="styleProps" />
  </div>
</template>

<script setup lang="ts">
import { defineComponent, computed, withDefaults, defineProps } from "vue";
import {
  imageDefaultProps,
  type ImageComponentProps,
  imageStylePropsNames,
} from "../defaultProps";
import { pick } from "lodash-es";

const props = withDefaults(defineProps<ImageComponentProps>(), {
  ...imageDefaultProps,
});

const styleProps = computed(() => pick(props, imageStylePropsNames));
console.log(props.src);
</script>

<style scoped lang="scss">
.l-image-component {
  position: relative !important;

  img {
    width: 50px;
    height: 50px;
  }
}
</style>
