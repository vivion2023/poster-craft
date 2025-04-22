<template>
  <Layout class="layout">
    <LayoutHeader class="header">
      <div class="left"><LogoBox></LogoBox></div>
      <div class="right">
        <Button type="primary">登录</Button>
      </div>
    </LayoutHeader>
    <LayoutContent class="main">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </LayoutContent>
    <LayoutFooter class="footer"> footer </LayoutFooter>
  </Layout>
</template>

<script setup lang="ts">
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
  Button,
} from "ant-design-vue";
import LogoBox from "@/components/LogoBox.vue";
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .header {
    height: 64px;
    width: 100%;
    display: flex;
    position: sticky;
    top: 0;
    background-color: #000000a6;
    box-shadow: #0000001a 0 12px 15px 0;
    justify-content: space-between;
    align-items: center;
  }

  .main {
    flex: 1;
  }

  .footer {
    height: 314px;
    background-color: #333;
    color: #999;
  }
}
</style>
