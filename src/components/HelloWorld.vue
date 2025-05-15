<template>
  <h1>{{ msg }}</h1>
  <button @click="setCount">{{ count }}</button>
  <input type="text" v-model="todo" />
  <button class="addTodo" @click="addTodo">add</button>
  <ul>
    <li v-for="(todo, index) in todos" :key="index">{{ todo }}</li>
  </ul>
  <Hello msg="1234"></Hello>
</template>

<script>
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
  emits: ["send"],
  setup(props, context) {
    const todo = ref("");
    const todos = ref([]);
    const count = ref(1);
    const setCount = () => {
      count.value++;
    };
    const addTodo = () => {
      if (todo.value) {
        todos.value.push(todo.value);
        context.emit("send", todo.value);
        todo.value = "";
      }
    };
    return { count, todo, todos, addTodo, setCount };
  },
});
</script>

<style scoped>
h1 {
  font-size: 1.5em;
  margin-bottom: 15px;
}
</style>
