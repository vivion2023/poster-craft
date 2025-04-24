<template>
  <div class="logo-box">
    <Space>
      <img src="@/assets/logo.png" alt="logo" />
      <Title class="title">慕课乐高</Title>
    </Space>
  </div>
</template>

<script setup lang="ts">
import { Space, Typography } from "ant-design-vue";
const { Title } = Typography;
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
