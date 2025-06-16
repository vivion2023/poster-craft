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
import { imageDefaultProps } from "@/defaultProps";
import { message } from "ant-design-vue";
import { getImageDimensions } from "@/helper";
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
    props: {
      ...data.props,
      position: "relative", // 设置为相对定位(方便开发)
    },
  };
  emit("on-item-click", newComponent);
};

const onImageUploaded = async (resp: UploadResp) => {
  message.success("上传成功");
  const newComponent = {
    id: uuidv4(),
    name: "l-image",
    props: {
      ...imageDefaultProps,
      position: "relative",
    },
  };
  newComponent.props.src = resp.resp.data.url;
  const { width, height } = await getImageDimensions(resp.resp.data.url);

  const maxWidth = 200;
  newComponent.props.width = width > maxWidth ? `${maxWidth}px` : `${width}px`;

  emit("on-item-click", newComponent);
};
</script>

<style scoped>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
