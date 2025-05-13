// 为 vue/jsx-runtime 创建声明文件
declare module "vue/jsx-runtime" {
  import { VNode } from "vue";

  export function jsx(type: any, props?: any, ...children: any[]): VNode;

  export function jsxs(type: any, props?: any, ...children: any[]): VNode;

  export const Fragment: symbol;
}
