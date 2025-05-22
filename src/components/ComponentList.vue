<template>
  <div class="create-component-list">
    <div
      class="component-item"
      v-for="item in list"
      :key="item.id"
      @click="onItemClick(item)"
    >
      <LText v-bind="item.props" :tag="item.props.tag" />
    </div>
    <StyledUploader @success="onImageUploaded" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import LText from "@/components/LText.vue";
import StyledUploader from "@/components/StyledUploader.vue";
import { UploadResp } from "@/extraType";
import { v4 as uuidv4 } from "uuid";
const props = defineProps<{
  list: any[];
}>();

const emit = defineEmits<{
  (e: "on-item-click", data: any): void;
}>();

const onItemClick = (data: any) => {
  const newComponent = {
    id: data.id,
    name: "l-text",
    props: data.props,
  };
  emit("on-item-click", newComponent);
};

const onImageUploaded = (resp: UploadResp) => {
  console.log("onImageUploaded", resp);
  const newComponent = {
    id: uuidv4(),
    name: "l-image",
    props: {
      src: resp.resp.data.url,
    },
  };
  emit("on-item-click", newComponent);
};
</script>

<script lang="ts">
export default {
  name: "ComponentList",
};
</script>
