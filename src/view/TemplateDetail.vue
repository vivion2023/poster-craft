<template>
  <div class="template-detail">
    <section class="main-container">
      <div class="left-container">
        <img :src="template?.coverImg" :alt="`poster${currentId}`" />
      </div>
      <div class="right-container">
        <div class="right-container">
          <div class="title-container">
            <Title :level="3">{{ template?.title }}</Title>
            <Paragraph>未命名作品</Paragraph>
          </div>

          <div class="writer">
            <div class="writer-icon">
              <UserOutlined />
            </div>
            <span>该模板由{{ template?.author }}创作</span>
          </div>

          <div class="qrcode">
            <p>扫一扫，手机预览</p>
            <QrcodeVue :value="qrcodeValue" :size="150" />
          </div>

          <div class="button-container">
            <a-button type="primary" shape="round" :size="size">
              使用模板
            </a-button>
            <a-button shape="round" :size="size">下载图片海报</a-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Typography } from "ant-design-vue";
import { UserOutlined } from "@ant-design/icons-vue";
import QrcodeVue from "qrcode.vue";
import type { SizeType } from "ant-design-vue/es/config-provider";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { GlobalDataProps } from "@/store/index";

const { Title, Paragraph } = Typography;
const size = ref<SizeType>("large");
const qrcodeValue = "https://www.baidu.com";

const route = useRoute();

const store = useStore<GlobalDataProps>();
const currentId = computed(() => Number(route.params.id));
const template = computed(() => store.getters.getTemplateById(currentId.value));
</script>

<style scoped lang="scss">
.main-container {
  max-width: 1200px;
  margin: 50px auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .left-container {
    width: 48%;
    height: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 0 20px;
    img {
      width: 100%;
      max-width: 400px;
    }
  }

  .right-container {
    width: 48%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    min-height: 600px;

    .writer {
      display: flex;
      align-items: center;
      margin-bottom: 32px;

      .writer-icon {
        width: 30px;
        height: 30px;
        font-size: 16px;
        border-radius: 50%;
        color: #fff;
        background-color: #9e9d9d;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 8px;
      }
    }

    .qrcode {
      p {
        margin-bottom: 5px;
      }
    }

    .button-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;

      button {
        margin-right: 16px;
      }
    }
  }
}
</style>
