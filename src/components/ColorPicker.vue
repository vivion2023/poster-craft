<template>
  <div>
    <div class="color-picker">
      <div class="native-color-container">
        <input type="color" :value="value" />
      </div>
      <ul class="picked-color-list">
        <li v-for="(item, key) in colors" :key="key" :class="`item-${key}`">
          <div
            class="color-item"
            :style="{ backgroundColor: item }"
            v-if="item.startsWith('#')"
          ></div>
          <div v-else class="color-item transparent-back"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
const defaultColors = [
  "#ffffff",
  "#f5222d",
  "#fa541c",
  "#fadb14",
  "#52c41a",
  "#1890ff",
  "#722ed1",
  "#8c8c8c",
  "#000000",
  "",
];
export default defineComponent({
  name: "ColorPicker",
  props: {
    value: {
      type: String,
      default: "#ffffff",
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => defaultColors,
    },
  },
});
</script>
