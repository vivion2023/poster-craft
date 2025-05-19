<template>
  <div class="app-container">
    <form
      method="post"
      action="http://local.test:7001/api/upload"
      @change="handleFileChange"
    >
      <input type="file" name="file" />
      <input type="text" name="test" />
      <input type="submit" value="提交" />
    </form>
    <router-view />
  </div>
</template>

<script lang="ts">
import axios from "axios";
export default {
  name: "App",
  setup() {
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        const uploadedFile = files[0];
        const formData = new FormData();
        formData.append(uploadedFile.name, uploadedFile);
        axios
          .post("http://local.test:7001/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res);
          });
      }
    };
    return {
      handleFileChange,
    };
  },
};
</script>

<style lang="scss"></style>
