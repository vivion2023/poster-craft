<template>
  <a-button
    type="primary"
    v-if="!user.isLogin"
    class="user-profile-component"
    @click="router.push('/login')"
    >登录</a-button
  >
  <div v-else>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{ user.data.nickName }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0" @click="logout"> 退出 </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { computed, ref, onUnmounted } from "vue";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();
const user = computed(() => store.state.user);

// 存储定时器ID以便清理
const logoutTimer = ref<number | null>(null);

const logout = () => {
  store.commit("logout");
  message.success("退出登录成功, 2秒后跳转至首页", 2);
  logoutTimer.value = window.setTimeout(() => {
    router.push("/");
  }, 2000);
};

// 组件销毁时清理定时器
onUnmounted(() => {
  if (logoutTimer.value) {
    clearTimeout(logoutTimer.value);
  }
});
</script>

<style scoped lang="scss">
.a-button {
  padding: 0 14px;
}
</style>
