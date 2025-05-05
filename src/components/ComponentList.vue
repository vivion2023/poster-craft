<template>
  <div class="component-item" v-for="item in list" :key="item.id">
    <LText v-bind="item.props" :tag="item.tag" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import LText from "@/components/LText.vue";
const props = defineProps<{
  list: any[];
}>();
</script>

<script lang="ts">
export default {
  name: "ComponentList",
};
</script>
