<template>
  <div :style="props" class="l-text-component">
    {{ props.text }}
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  text?: string;
  fontSize?: string;
  [key: string]: any;
}>();
</script>

<style scoped lang="scss"></style>
