<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script lang="ts">
import Uploader from "./components/Uploader.vue";
import { ref } from "vue";
export default {
  name: "App",
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
