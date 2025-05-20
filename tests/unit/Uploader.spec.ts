import { shallowMount, VueWrapper, mount } from "@vue/test-utils";
import Uploader from "@/components/Uploader.vue";
import axios from "axios";
import flushPromises from "flush-promises";
jest.mock("axios");
jest.useFakeTimers();
// 模拟axios
const mockedAxios = axios as jest.Mocked<typeof axios>;
let wrapper: VueWrapper<any>;
const testFile = new File(["xyz"], "test.png", { type: "image/png" });
const mockComponent = {
  template: "<div><slot></slot></div>",
};
const mockComponents = {
  DeleteOutlined: mockComponent,
  LoadingOutlined: mockComponent,
  FileOutlined: mockComponent,
};
const setInputValue = (fileInput: HTMLInputElement) => {
  // 创建一个模拟的 FileList 对象
  const fileList = {
    // 索引属性，模拟 FileList 的数组访问方式
    0: testFile, // 第一个文件

    // FileList 的长度属性
    length: 1, // 表示只有一个文件

    // FileList 的 item 方法，用于通过索引获取文件
    item: (index: number) => (index === 0 ? testFile : null),

    // 实现迭代器接口，使对象可以被 for...of 循环遍历
    [Symbol.iterator]: function* () {
      yield testFile; // 每次迭代返回 testFile
    },
  } as FileList;

  Object.defineProperty(fileInput, "files", {
    value: fileList,
    writable: false,
  });
};

describe("Uploader component", () => {
  beforeAll(() => {
    wrapper = mount(Uploader, {
      props: {
        action: "test.url",
      },
      global: {
        stubs: mockComponents,
      },
    });
  });
  it("basic layout before uploading", () => {
    expect(wrapper.find("button").exists()).toBeTruthy();
    expect(wrapper.find("button").text()).toBe("点击上传");
    expect(getComputedStyle(wrapper.find("input").element).display).toBe(
      "none"
    );
  });

  it("upload process should works fine", async () => {
    // 改变 e.target.files
    // 新建一个 file
    const mockedPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: "success" });
      }, 100);
    });
    mockedAxios.post.mockResolvedValueOnce(mockedPromise);

    const fileInput = wrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);

    // 点击按钮
    expect(wrapper.find("button").text()).toBe("点击上传");
    await wrapper.find("button").trigger("click");

    // 触发 change 事件，应该立即变为 loading 状态
    await wrapper.find("input").trigger("change");
    expect(wrapper.find("button").text()).toBe("正在上传");

    // button 为 disabled
    expect(
      wrapper.find("button").element.hasAttribute("disabled")
    ).toBeTruthy();
    // 列表长度修改，并且有正确的class
    expect(wrapper.findAll("li").length).toBe(1);
    const fileItem = wrapper.find("li:first-child");
    expect(fileItem.element.hasAttribute("upload-loading"));

    await flushPromises();
    expect(wrapper.find("button").text()).toBe("正在上传");
    // 有正确的class，并且文件名称相对应
    jest.runAllTimers();
    expect(fileItem.element.hasAttribute("upload-success"));
    expect(fileItem.find(".filename").text()).toBe(testFile.name);
  });

  it("should return error text when post is rejected", async () => {
    const mockedPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ error: "error" });
      }, 100);
    });
    mockedAxios.post.mockRejectedValueOnce(mockedPromise);
    await wrapper.find("input").trigger("change");
    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    await flushPromises();
    expect(wrapper.find("button").text()).toBe("点击上传");

    // 列表长度修改，并且有正确的class
    expect(wrapper.findAll("li").length).toBe(2);
    const lastItem = wrapper.find("li:last-child");
    expect(lastItem.element.hasAttribute("upload-error"));
    // 点击删除按钮
    await lastItem.find(".delete-icon").trigger("click");
    expect(wrapper.findAll("li").length).toBe(1);
  });

  it("should show the correct interface when using custon slot", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        url: "dummy.url",
      },
    });
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        url: "xyz.url",
      },
    });
    const wrapper = mount(Uploader, {
      props: {
        action: "test.url",
      },
      slots: {
        default: "<button>Custom button</button>",
        loading: "<div class='loading'>custom loading</div>",
        uploaded: `<template #uploaded="{ uploadedData }">
          <div class="custom-loaded">{{uploadedData.url}}</div>
          </template>`,
      },
      global: {
        stubs: mockComponents,
      },
    });
    expect(wrapper.find("button").text()).toBe("Custom button");
    const fileInput = wrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.find("input").trigger("change");
    // expect(wrapper.find(".loading").text()).toBe("custom loading");
    await flushPromises();
    expect(wrapper.find(".custom-loaded").text()).toBe("dummy.url");

    await wrapper.find("input").trigger("change");
    // expect(wrapper.find(".loading").text()).toBe("custom loading");
    await flushPromises();
    expect(wrapper.find(".custom-loaded").text()).toBe("xyz.url");
  });
});
