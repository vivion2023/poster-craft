<template>
  <Uploader
    class="styled-uploader"
    action="https://run.mocky.io/v3/e988be00-32a8-4cb1-a6cf-7b11299ba003"
    :show-upload-list="true"
    :beforeUpload="commonUploadCheck"
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
import { commonUploadCheck } from "../help";
import { FileImageOutlined, LoadingOutlined } from "@ant-design/icons-vue";
export default {
  name: "StyledUploader",
  components: {
    Uploader,
    FileImageOutlined,
    LoadingOutlined,
  },
  setup() {
    return {
      commonUploadCheck,
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
