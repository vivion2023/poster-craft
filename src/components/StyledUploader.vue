<template>
  <Uploader
    class="styled-uploader"
    action="https://run.mocky.io/v3/2b8ae831-4f51-43e0-8a4d-7160a85c18b6"
    :show-upload-list="true"
    :beforeUpload="commonUploadCheck"
    @success="
      (data) => {
        handleUploadSuccess(data.resp, data.file);
      }
    "
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
import { FileImageOutlined, LoadingOutlined } from "@ant-design/icons-vue";
export default {
  name: "StyledUploader",
  components: {
    Uploader,
    FileImageOutlined,
    LoadingOutlined,
  },
  emits: ["success"],
  setup(props, { emit }) {
    const handleUploadSuccess = (resp: any, file: File) => {
      emit("success", { resp, file });
    };
    return {
      commonUploadCheck,
      handleUploadSuccess,
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
    gap: 10px;
  }
}
</style>
