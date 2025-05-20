<template>
  <div class="icon-switch" @click.prevent="handleChange">
    <a-tooltip v-if="tooltip" placement="top">
      <template #title>
        <span>{{ tooltip }}</span>
      </template>
      <div class="icon-container" :class="active ? 'isBold' : ''">
        <BoldOutlined />
      </div>
    </a-tooltip>
    <div v-else class="icon-container" :class="active ? 'isBold' : ''">
      <BoldOutlined />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Tooltip } from "ant-design-vue";
import { BoldOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "IconSwitch",
  components: {
    ATooltip: Tooltip,
    BoldOutlined,
  },
  props: {
    tooltip: {
      type: String,
      default: "",
    },
    fontWeight: {
      type: String,
      default: "normal",
    },
  },
  emits: ["change"],
  setup(props, { emit }) {
    const active = ref(props.fontWeight === "bold");
    const handleChange = () => {
      active.value = !active.value;
      emit("change", active.value ? "bold" : "normal");
    };

    return {
      handleChange,
      active,
    };
  },
});
</script>

<style scoped>
.icon-switch {
  display: inline-block;
  cursor: pointer;
  user-select: none;
}

.icon-container {
  padding: 6px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  background-color: #e7e7e7;
  color: rgb(52, 52, 52);
}

.icon-container.isBold {
  background-color: #1890ff;
  color: #fff;
}

.icon-container :deep(svg) {
  font-size: 16px;
}
</style>
