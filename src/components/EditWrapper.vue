<template>
  <div
    class="edit-wrapper"
    @click="handleSetActive"
    :class="{ active: active }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  id: string;
  active: boolean;
}>();

const emit = defineEmits<{
  (e: "setActive", id: string): void;
}>();

const handleSetActive = () => {
  console.log(props.id);
  emit("setActive", props.id);
};
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "EditWrapper",
});
</script>

<style lang="scss" scoped>
.edit-wrapper.active {
  border: 1px solid #40a9ff;
  user-select: none;
  z-index: 100;
}
</style>
