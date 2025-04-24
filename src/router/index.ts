import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../view/Home.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import TemplateDetail from "@/view/TemplateDetail.vue";
import Editor from "@/view/Editor.vue";
import Login from "@/view/Login.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "home",
        component: Home,
      },
      {
        path: "/template/:id",
        name: "template",
        component: TemplateDetail,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/editor",
    name: "editor",
    component: Editor,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
