import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AppHome from "../components/AppHome.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import TemplateDetail from "@/components/TemplateDetail.vue";
import PostEditor from "@/components/Editor/PostEditor.vue";

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
    ],
  },
  {
    path: "/editor",
    name: "editor",
    component: PostEditor,
  },
  {
    path: "/template/:id",
    name: "template",
    component: TemplateDetail,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
