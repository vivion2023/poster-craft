<template>
  <div class="create-component-list">
    <div
      class="component-item"
      v-for="item in list"
      :key="item.id"
      @click="onItemClick(item)"
    >
      <LText v-bind="item.props" :tag="item.tag" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import LText from "@/components/LText.vue";
const props = defineProps<{
  list: any[];
}>();

const emit = defineEmits<{
  (e: "on-item-click", data: any): void;
}>();

const onItemClick = (data: any) => {
  emit("on-item-click", data);
};
</script>

<script lang="ts">
export default {
  name: "ComponentList",
};
</script>
