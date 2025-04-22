<template>
  <Layout class="layout">
    <LayoutHeader class="header"> header </LayoutHeader>
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
} from "ant-design-vue";
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .header {
    height: 64px;
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
