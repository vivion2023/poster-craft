<template>
  <div class="banner">
    <div class="banner-text">
      <a-typography-title class="title"
        >海量精彩设计 一键生成</a-typography-title
      >
      <a-input-search
        class="search-input"
        placeholder="搜索一下，快速找模版"
        enter-button
        size="large"
      />
    </div>
  </div>

  <div class="welcome-container">
    <div class="welcome-inner">
      <a-row :gutter="[16, 24]">
        <a-col :span="8" class="welcome-item">
          <svg
            t="1745402536718"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="7072"
          >
            <path
              d="M513.232572 801.024649c-4.230348 0-8.444323-0.75827-12.467963-2.293229l-185.809893-70.886467c-12.544711-4.787026-21.234627-16.373922-22.350031-29.780257l-6.889921-83.941807c-1.574868-19.2269 12.727882-36.09508 31.950689-37.671994 19.48989-1.638313 36.094056 12.734022 37.682227 31.963992l5.097088 62.005192 153.11833 58.414411 162.173566-58.526975 6.444782-149.767002L315.026348 520.540514c-18.438954 0-33.701566-14.340613-34.858926-32.741705l-13.095249-208.28272c-0.621147-9.632381 2.795673-19.084661 9.388834-26.109658 6.614651-7.028067 15.827477-11.019984 25.470091-11.019984l433.917644 0c19.293415 0 34.936697 15.636119 34.936697 34.929534 0 19.300578-15.642259 34.936697-34.936697 34.936697l-396.715347 0 8.69094 138.420583 370.835933 0c9.530051 0 18.651802 3.889587 25.222451 10.769274 6.592139 6.879688 10.102079 16.143679 9.685593 25.664519l-9.03477 209.603809c-0.607844 14.157441-9.699919 26.542516-23.048949 31.358195l-196.407252 70.892607C521.258363 800.338011 517.234723 801.024649 513.232572 801.024649zM513.232572 980.803175c-4.299933 0-8.578376-0.783853-12.650111-2.371L159.556461 845.934488c-12.860912-4.992711-21.580504-17.104563-22.236444-30.885428L103.095541 100.733239c0.184195-36.966936 30.948873-37.361933 63.513546-37.796838 91.086531-1.203408 364.468922 1.196245 364.489388 1.196245-0.791016 0 246.738567-2.378164 329.086064-1.196245 27.059286 0.403183 60.745503 0.890276 60.745503 36.129872l-34.209126 715.983811c-0.657986 13.762445-9.325389 25.836435-22.145369 30.859845L525.958408 978.410686C521.86416 980.014206 517.545808 980.803175 513.232572 980.803175zM206.001259 789.033547l307.188334 119.355365 304.830637-119.28885 31.407314-656.423297c-12.742209-0.119727-30.560016-0.211824-55.515385-0.211824-105.08536 0-262.721587 1.531889-262.770705 1.531889-0.670266 0-175.036525-1.531889-291.298436-1.531889-30.156834 0-50.960649 0.112564-65.342194 0.257873L206.001259 789.033547z"
              fill="#1296db"
              p-id="7073"
            ></path>
          </svg>
          <h3>专注H5 始终如一</h3>
          <p>三年保持行业领先</p>
        </a-col>
        <a-col :span="8" class="welcome-item">
          <svg
            t="1745397822363"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4780"
          >
            <path
              d="M916 210H376c-17.7 0-32 14.3-32 32v236H108c-17.7 0-32 14.3-32 32v272c0 17.7 14.3 32 32 32h540c17.7 0 32-14.3 32-32V546h236c17.7 0 32-14.3 32-32V242c0-17.7-14.3-32-32-32z m-504 68h200v200H412V278z m-68 468H144V546h200v200z m268 0H412V546h200v200z m268-268H680V278h200v200z"
              fill="#1296DB"
              p-id="4781"
            ></path>
          </svg>
          <h3>海量 H5 模版</h3>
          <p>一键生成，一分钟轻松制作</p>
        </a-col>
        <a-col :span="8" class="welcome-item">
          <svg
            t="1745397949552"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5981"
          >
            <path
              d="M426.688 670.272V768h170.624v-97.728A298.816 298.816 0 0 0 512 85.312a298.688 298.688 0 0 0-85.312 584.96z m256 57.792v125.248H341.312v-125.248a384 384 0 1 1 341.312 0z m-341.376 210.56h341.376V1024H341.312v-85.312z"
              fill="#1296db"
              p-id="5982"
            ></path>
          </svg>
          <h3>极致体验</h3>
          <p>用户的一致选择</p>
        </a-col>
      </a-row>
    </div>
  </div>

  <div class="content-container">
    <div class="hot-title">
      <h2 class="hot-template">热门海报</h2>
      <p>只需替换文字和图片，一键自动生成H5</p>
    </div>

    <div class="template-container">
      <template-list :list="testData"></template-list>
      <h1 v-if="isLoading">template is loading...</h1>
    </div>
    <a-row type="flex" justify="center">
      <a-row type="flex" justify="center">
        <a-button
          type="primary"
          size="large"
          @click="loadMorePage"
          v-if="!isLastPage"
          :loading="isLoading"
          >加载更多</a-button
        >
      </a-row>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import TemplateList from "@/components/TemplateList.vue";
import { useStore } from "vuex";
import useLoadMore from "@/hooks/useLoadMore";
// 组件已通过 configAntD.ts 全局注册，无需导入
const store = useStore();
const isLoading = computed(() => store.getters.isOpLoading("fetchTemplates"));
const testData = computed(() => store.state.templates.data);
const total = computed(() => store.state.templates.totalTemplates);
const { loadMorePage, isLastPage } = useLoadMore("fetchTemplates", total, {
  pageIndex: 0,
  pageSize: 4,
});
// 组件挂载时获取模板数据
onMounted(() => {
  store.dispatch("fetchTemplates", {
    searchParams: { pageIndex: 0, pageSize: 4 },
  });
});
</script>

<style scoped lang="scss">
@use "./Home.module.scss" as *;
</style>
