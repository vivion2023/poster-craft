<template>
  <Uploader
    class="styled-uploader"
    action="http://localhost:3000/api/utils/upload-local-img"
    :show-upload-list="showUploadList"
    :auto-upload="autoUpload"
    :beforeUpload="commonUploadCheck"
    @success="onSuccess"
    :drag="true"
  >
    <div class="uploader-container">
      <FileImageOutlined />
      <h4>上传图片</h4>
    </div>
    <template #loading>
      <div class="uploader-container">
        <LoadingOutlined spin />
        <h4>上传中</h4>
      </div>
    </template>
    <template #uploaded>
      <div class="uploader-container">
        <FileImageOutlined />
        <h4>上传图片</h4>
      </div>
    </template>
  </Uploader>
</template>

<script lang="ts">
import Uploader from "./Uploader.vue";
import { commonUploadCheck } from "../helper";
// 图标已通过 configAntD.ts 全局注册，无需导入
export default {
  name: "StyledUploader",
  components: {
    Uploader,
    // 图标已通过 configAntD.ts 全局注册，无需在此注册
  },
  props: {
    showUploadList: {
      type: Boolean,
      default: true,
    },
    autoUpload: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["success"],
  setup(
    _props: {
      showUploadList: boolean;
      autoUpload: boolean;
    },
    {
      emit,
    }: {
      emit: (
        event: "success",
        payload: { resp: { url: string; thumbnailUrl?: string }; file: File }
      ) => void;
    }
  ) {
    const handleUploadSuccess = (
      resp: { url: string; thumbnailUrl?: string },
      file: File
    ) => {
      emit("success", { resp, file });
    };

    const onSuccess = (data: {
      resp: { url: string; thumbnailUrl?: string };
      file: File;
    }) => {
      handleUploadSuccess(data.resp, data.file);
    };

    return {
      commonUploadCheck,
      handleUploadSuccess,
      onSuccess,
    };
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.styled-uploader {
  color: #fff;
  background-color: #1890ff;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #1c7ed6;
  }

  .uploader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
}
</style>
