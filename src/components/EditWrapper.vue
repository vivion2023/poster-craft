<template>
  <div class="edit-wrapper" @click="handleSetActive">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  (e: "setActive", id: string): void;
}>();

const handleSetActive = () => {
  emit("setActive", props.id);
};
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "EditWrapper",
});
</script>
