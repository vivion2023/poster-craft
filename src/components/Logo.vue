<template>
  <div class="logo-box">
    <a-space>
      <img src="@/assets/logo.png" alt="logo" />
      <a-typography-title class="title">慕课乐高</a-typography-title>
    </a-space>
  </div>
</template>

<script setup lang="ts">
// 组件已通过 configAntD.ts 全局注册，无需导入
</script>

<script lang="ts">
export default {
  name: "LogoBox",
};
</script>

<style scoped lang="scss">
.logo-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-width: 130px;
}

:deep(.ant-space) {
  align-items: center;
}

img {
  width: 34px;
  height: 34px;
  display: block;
}

.title {
  font-size: 22px;
  margin: 0;
  padding: 0;
  color: #fff;
  line-height: 32px;
}
</style>
