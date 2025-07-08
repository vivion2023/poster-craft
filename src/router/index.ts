import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../view/Home.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import TemplateDetail from "@/view/TemplateDetail.vue";
import { message } from "ant-design-vue";
import store from "@/store";
import axios from "axios";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "home",
        component: Home,
        meta: { title: "欢迎来到慕课乐高" },
      },
      {
        path: "/template/:id",
        name: "template",
        component: TemplateDetail,
        meta: { title: "模板详情" },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    // 按需加载登录组件, 提高首屏加载速度
    component: () => import(/* webpackChunkName: "login" */ "@/view/Login.vue"),
    meta: {
      redirectAlreadyLogin: true,
      title: "登录到慕课乐高",
      disableLoading: true, // 禁用加载动画
    },
  },
  {
    path: "/editor/:id",
    name: "editor",
    // 按需加载编辑器组件, 提高首屏加载速度
    component: () =>
      import(/* webpackChunkName: "editor" */ "@/view/Editor.vue"),
    meta: { requiredLogin: true, title: "编辑我的设计" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
// 在路由跳转前进行拦截，检查用户是否登录，并根据路由配置进行相应的处理
// redirectAlreadyLogin: 如果用户已登录，则跳转到首页
// requiredLogin: 如果用户未登录，则跳转到登录页面
// title: 设置页面标题
router.beforeEach(async (to, from) => {
  const { user } = store.state;
  const { token, isLogin } = user;
  const { redirectAlreadyLogin, requiredLogin, title } = to.meta;
  if (title) {
    document.title = title as string;
  }
  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        // 优先使用token验证，如果成功则获取用户信息
        await store.dispatch("verifyTokenAndFetch");
        if (redirectAlreadyLogin) {
          return "/";
        }
      } catch {
        // Token验证失败，清除token并跳转到登录页
        console.log("Token验证失败，清除登录状态");
        store.commit("logout");
        if (requiredLogin) {
          return "/login";
        }
      }
    } else {
      if (requiredLogin) {
        return "/login";
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      return "/";
    }
  }
});

export default router;
