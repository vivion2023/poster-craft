<template>
  <h1 class="hello">{{ msg }}</h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Hello",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
.hello-component {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
