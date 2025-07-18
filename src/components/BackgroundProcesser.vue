<template>
  <div class="background-processer">
    <styled-uploader
      :show-upload-list="false"
      :auto-upload="true"
      v-if="!value"
      @success="onImageUploaded"
    >
    </styled-uploader>
    <image-processer
      v-else
      :value="value"
      @change="handleUploadUrl"
      :showDelete="true"
    >
    </image-processer>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { message } from "@/configAntD";
import ImageProcesser from "./ImageProcesser.vue";
import StyledUploader from "./StyledUploader.vue";

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
});
const emits = defineEmits(["change"]);
const onImageUploaded = (resp: { resp: { data: { url: string } } }) => {
  message.success("上传成功");
  emits("change", resp.resp.data.url);
};
const handleUploadUrl = (url: string) => {
  emits("change", url);
};
</script>

<style scoped></style>
