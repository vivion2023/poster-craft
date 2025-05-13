import { VNode } from "vue";

declare global {
  namespace JSX {
    type Element = VNode;
    interface ElementClass {
      $props: any;
    }
    interface ElementAttributesProperty {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
