<template>
  <div class="app-container">
    <a-spin v-if="showLoading" tip="读取中" class="global-spinner" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { message } from "@/configAntD";
import { GlobalDataProps } from "./store/index";
export default defineComponent({
  name: "App",
  setup() {
    const store = useStore<GlobalDataProps>();
    const route = useRoute();
    const isLoading = computed(() => store.getters.isLoading);
    const showLoading = computed(
      () => isLoading.value && !route.meta.disableLoading
    );
    const error = computed(() => store.state.global.error);

    // 存储定时器ID以便清理
    let errorClearTimer: number | null = null;

    watch(
      () => error.value.status,
      (errorValue) => {
        if (errorValue) {
          message.error(error.value.message || "未知错误", 3);
          // 清理之前的定时器
          if (errorClearTimer) {
            clearTimeout(errorClearTimer);
          }
          // 显示错误后清除错误状态，避免重复显示
          errorClearTimer = window.setTimeout(() => {
            store.commit("setError", { status: false, message: "" });
            errorClearTimer = null;
          }, 100);
        }
      }
    );

    // 组件销毁时清理定时器
    onUnmounted(() => {
      if (errorClearTimer) {
        clearTimeout(errorClearTimer);
      }
    });

    return {
      showLoading,
    };
  },
});
</script>
<style>
.app-container .global-spinner {
  position: fixed;
  top: 10px;
  right: 50%;
}
</style>
