<template>
  <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
    <input
      v-model="innerValue"
      v-if="isEditing"
      placeholder="文本不能为空"
      ref="inputRef"
      :class="{ 'input-error': !validateCheck }"
      class="ant-input"
    />
    <slot v-else :text="truncatedText"
      ><span class="truncated-text" :title="innerValue">{{
        truncatedText
      }}</span></slot
    >
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, defineProps, defineEmits } from "vue";
import useKeyPress from "@/hooks/useKeyPress";
import useClickOutside from "@/hooks/useClickOutside";

const props = defineProps<{
  value?: string;
  maxLength?: number;
}>();

const emits = defineEmits<{
  (e: "change", value: string): void;
}>();

const innerValue = ref(props.value || "");
watch(
  () => props.value,
  (newValue) => {
    innerValue.value = newValue || "";
  }
);

const wrapper = ref<null | HTMLElement>(null);
const inputRef = ref<null | HTMLInputElement>(null);
const isOutside = useClickOutside(wrapper);
let cachedOldValue = "";
const isEditing = ref(false);
const handleClick = () => {
  isEditing.value = true;
};
const validateCheck = computed(() => (innerValue.value || "").trim() !== "");

// 截断文本显示
const truncatedText = computed(() => {
  const text = innerValue.value || "";
  const maxLen = props.maxLength || 20; // 默认显示20个字符
  if (text.length <= maxLen) {
    return text;
  }
  return text.slice(0, maxLen) + "...";
});
watch(isEditing, async (isEditing) => {
  if (isEditing) {
    cachedOldValue = innerValue.value || "";
    await nextTick();
    if (inputRef.value) {
      inputRef.value.focus();
    }
  }
});
watch(isOutside, (newValue) => {
  if (!validateCheck.value) {
    return;
  }
  if (newValue && isEditing.value) {
    isEditing.value = false;
    emits("change", innerValue.value || "");
  }
  isOutside.value = false;
});
useKeyPress("Enter", () => {
  if (!validateCheck.value) {
    return;
  }
  if (isEditing.value) {
    isEditing.value = false;
    emits("change", innerValue.value || "");
  }
});
useKeyPress("Escape", () => {
  if (isEditing.value) {
    isEditing.value = false;
    innerValue.value = cachedOldValue;
  }
});
</script>

<style>
.inline-edit {
  cursor: pointer;
}

.truncated-text {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ant-input.input-error {
  border: 1px solid #ff323ccf;
}
.ant-input.input-error:focus {
  border-color: #ff323ccf;
}
.ant-input.input-error::placeholder {
  color: #ff323ccf;
}
</style>
