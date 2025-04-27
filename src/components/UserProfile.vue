<template>
  <div v-if="!isLogin" class="user-profile-component">
    <Button type="primary" shape="round" @click="login"> 登录 </Button>
  </div>
  <div v-else>
    <div class="user-profile">
      <a-dropdown class="user-profile- component">
        <router-link to="/login">{{ user }}</router-link>
        <template v-slot:overlay>
          <a-menu class="user-profile-dropdown">
            <a-menu-item key="0" @click="logout"> 退出 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.state.user.isLogin);
const user = computed(() => store.state.user.userName);
const login = () => {
  store.commit("login");
  message.success("登录成功", 2);
};

const logout = () => {
  store.commit("logout");
  message.success("退出登录成功, 2秒后跳转至首页", 2);
  setTimeout(() => {
    router.push("/");
  }, 2000);
};
</script>

<style scoped lang="scss">
.user-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  .user-name {
    color: #fff;
    margin-right: 10px;
  }
}
</style>
