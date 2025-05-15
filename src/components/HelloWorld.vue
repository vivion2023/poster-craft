<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>这是一个示例组件，用于演示单元测试。</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
.hello {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin: 20px 0;
}
h1 {
  font-size: 1.5em;
  margin-bottom: 15px;
}
</style>
