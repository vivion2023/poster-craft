import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AppHome from "../view/Home.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import TemplateDetail from "@/view/TemplateDetail.vue";
import PostEditor from "@/view/Editor.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "home",
        component: AppHome,
      },
      {
        path: "/template/:id",
        name: "template",
        component: TemplateDetail,
      },
    ],
  },
  {
    path: "/editor",
    name: "editor",
    component: PostEditor,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
