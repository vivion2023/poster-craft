declare module "@vue/test-utils" {
  import { ComponentPublicInstance, DefineComponent } from "vue";

  export interface VueWrapper<T extends ComponentPublicInstance> {
    vm: T;
    element: HTMLElement;
    exists(): boolean;
    find<K extends keyof HTMLElementTagNameMap>(
      selector: K
    ): DOMWrapper<HTMLElementTagNameMap[K]>;
    find<T extends Element>(selector: string): DOMWrapper<T>;
    findComponent<T extends DefineComponent>(
      component: T
    ): VueWrapper<InstanceType<T>>;
    findComponent(selector: string): VueWrapper<ComponentPublicInstance>;
    findAllComponents<T extends DefineComponent>(
      component: T
    ): VueWrapper<InstanceType<T>>[];
    findAllComponents(selector: string): VueWrapper<ComponentPublicInstance>[];
    html(): string;
    text(): string;
    trigger(eventName: string, options?: {}): Promise<void>;
    emitted(): Record<string, unknown[]>;
    emitted(eventName: string): unknown[];
    props(): Record<string, unknown>;
    props(selector: string): unknown;
    unmount(): void;
    setProps(props: {}): Promise<void>;
  }

  export interface DOMWrapper<T extends Element> {
    element: T;
    exists(): boolean;
    find<K extends keyof HTMLElementTagNameMap>(
      selector: K
    ): DOMWrapper<HTMLElementTagNameMap[K]>;
    find<T extends Element>(selector: string): DOMWrapper<T>;
    html(): string;
    text(): string;
    trigger(eventName: string, options?: {}): Promise<void>;
  }

  export function mount<T extends DefineComponent>(
    component: T,
    options?: {}
  ): VueWrapper<InstanceType<T>>;
  export function mount<T extends ComponentPublicInstance>(
    component: {},
    options?: {}
  ): VueWrapper<T>;
  export function shallowMount<T extends DefineComponent>(
    component: T,
    options?: {}
  ): VueWrapper<InstanceType<T>>;
  export function shallowMount<T extends ComponentPublicInstance>(
    component: {},
    options?: {}
  ): VueWrapper<T>;
  export function flushPromises(): Promise<void>;
}
