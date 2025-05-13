declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 引用 Vue 的 JSX 类型
/// <reference types="vue/jsx" />

// 如果仍需要自定义 JSX 命名空间，可以保留以下内容
declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }

  // 添加 Element 接口
  type Element = VNode;

  // 添加 ElementClass 接口
  interface ElementClass {
    $props: any;
  }

  // 添加 ElementAttributesProperty 接口
  interface ElementAttributesProperty {
    $props: any;
  }
}
