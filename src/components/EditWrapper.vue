<template>
  <div class="edit-wrapper">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  id: {
    type: String;
    required: true;
  };
}>();
</script>
