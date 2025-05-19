<template>
  <div class="app-container">
    <Uploader
      action="https://run.mocky.io/v3/dff682b1-f1f6-4ec1-ab36-c735534a6583"
    />
    <router-view />
  </div>
</template>

<script lang="ts">
import Uploader from "./components/Uploader.vue";
export default {
  name: "App",
  components: {
    Uploader,
  },
};
</script>

<style lang="scss"></style>
