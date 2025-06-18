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

<script lang="ts">
import { defineComponent } from "vue";
import { message } from "ant-design-vue";
import ImageProcesser from "./ImageProcesser.vue";
import StyledUploader from "./StyledUploader.vue";
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  components: {
    ImageProcesser,
    StyledUploader,
  },
  emits: ["change"],
  setup(props, { emit }) {
    const onImageUploaded = (data: {
      resp: { errno: number; data?: { url: string; thumbnail: string } };
      file: File;
    }) => {
      const { resp } = data;
      message.success("上传成功");
      emit("change", resp.data?.thumbnail);
    };
    const handleUploadUrl = (url: string) => {
      emit("change", url);
    };
    return {
      onImageUploaded,
      handleUploadUrl,
    };
  },
});
</script>

<style></style>
