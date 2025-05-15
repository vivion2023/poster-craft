<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="count++">{{ count }}</button>
    <Hello msg="1234"></Hello>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Hello from "./Hello.vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    Hello,
  },
  props: {
    msg: String,
  },
  setup() {
    const count = ref(1);
    return { count };
  },
});
</script>

<style scoped>
h1 {
  font-size: 1.5em;
  margin-bottom: 15px;
}
</style>
