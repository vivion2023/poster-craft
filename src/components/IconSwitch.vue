<template>
  <div class="icon-template" @click.prevent="handleClick">
    <a-tooltip>
      <template v-slot:title>
        {{ tip }}
      </template>
      <a-button :type="checked ? 'primary' : 'default'" shape="circle">
        <template v-slot:icon><component :is="iconName" /></template>
      </a-button>
    </a-tooltip>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    iconName: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
    },
  },
  emits: ["change"],
  setup(props, context) {
    const handleClick = () => {
      context.emit("change", !props.checked);
    };
    return {
      handleClick,
    };
  },
});
</script>

<style></style>
