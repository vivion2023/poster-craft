<template>
  <div class="app-container">
    <Uploader
      action="https://run.mocky.io/v3/e988be00-32a8-4cb1-a6cf-7b11299ba003"
      drag
    >
      <div class="upload-container">
        <h4>上传图片</h4>
      </div>
      <template #loading>
        <div class="upload-container">
          <h4>上传中</h4>
        </div>
      </template>
      <template #uploaded> </template>
    </Uploader>
    <router-view />
  </div>
</template>

<script lang="ts">
import Uploader from "./components/Uploader.vue";
import { ref } from "vue";
export default {
  name: "App",
  components: {
    Uploader,
  },
  setup() {
    const uploader = ref();
    const callUpload = () => {
      uploader.value.submit();
    };
    return {
      uploader,
      callUpload,
    };
  },
};
</script>

<style lang="scss">
.uploaded-area {
  text-align: center;
  h3 {
    margin-top: 8px;
    color: #666;
  }
}
// img {
//   width: 10%;
//   height: 10%;
//   object-fit: cover;
// }
</style>
