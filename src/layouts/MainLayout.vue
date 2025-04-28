<template>
  <Layout class="layout">
    <LayoutHeader class="header">
      <div class="left"><LogoBox></LogoBox></div>
      <div class="right">
        <UserProfile />
      </div>
    </LayoutHeader>
    <LayoutContent class="main">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </LayoutContent>
    <LayoutFooter class="footer">
      <div class="footer-inner">
        <div class="footer-Info">
          <Row :gutter="16" style="margin-left: -8px; margin-right: -8px">
            <Col :span="6">
              <div class="footer-item">
                <h2>慕课乐高</h2>
                <p>购买课程</p>
                <p>联系我们</p>
                <p>关注我们</p>
              </div>
            </Col>
            <Col :span="6">
              <div class="footer-item">
                <h2>设计制作帮助</h2>
                <p>关于我们</p>
                <p>联系我们</p>
                <p>关注我们</p>
              </div>
            </Col>
            <Col :span="6">
              <div class="footer-item">
                <h2>审核问题</h2>
                <p>关于我们</p>
                <p>联系我们</p>
                <p>关注我们</p>
              </div>
            </Col>
            <Col :span="6">
              <div class="footer-item">
                <h2>其他问题</h2>
                <p>关于我们</p>
                <p>联系我们</p>
                <p>关注我们</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div class="footer-bottom">
        <span> © 慕课网（imooc.com）版权所有 | </span>
        <span>
          <ul>
            <li>
              <a href="#"> 津ICP备20000929号-2 </a>
            </li>
            <li>
              <a href="#"> 购买课程 </a>
            </li>
            <li>
              <a href="#"> 作业和打卡 </a>
            </li>
            <li>
              <a href="#"> 联系我们 </a>
            </li>
            <li>
              <a href="#"> 帮助 </a>
            </li>
          </ul>
        </span>
      </div>
    </LayoutFooter>
  </Layout>
</template>

<script setup lang="ts">
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
  Row,
  Col,
} from "ant-design-vue";
import LogoBox from "@/components/Logo.vue";
import UserProfile from "@/components/UserProfile.vue";
</script>

<style scoped lang="scss">
@use "./MainLayout.module.scss" as *;
</style>
