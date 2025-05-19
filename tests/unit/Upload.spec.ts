import { shallowMount, VueWrapper } from "@vue/test-utils";
import Uploader from "@/components/Uploader.vue";
import axios from "axios";
import flushPromises from "flush-promises";
jest.mock("axios");
// 模拟axios
const mockedAxios = axios as jest.Mocked<typeof axios>;
let wrapper: VueWrapper<any>;
const testFile = new File(["xyz"], "test.png", { type: "image/png" });

describe("Uploader component", () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: "test.url",
      },
    });
  });
  it("basic layout before uploading", () => {
    expect(wrapper.find("button").exists()).toBeTruthy();
    expect(wrapper.find("button span").text()).toBe("点击上传");
    expect(getComputedStyle(wrapper.find("input").element).display).toBe(
      "none"
    );
  });

  it("upload process should works fine", async () => {
    // change e.target.files
    // create a file
    const mockedPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: "success" });
      }, 100);
    });
    mockedAxios.post.mockResolvedValueOnce(mockedPromise);

    const fileInput = wrapper.find("input").element as HTMLInputElement;

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

    // 1. 点击按钮
    expect(wrapper.find("button span").text()).toBe("点击上传");
    await wrapper.find("button").trigger("click");

    // 2. 触发 change 事件，应该立即变为 loading 状态
    await wrapper.find("input").trigger("change");
    expect(wrapper.find("button span").text()).toBe("正在上传");

    // 3. 等待上传完成
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    await mockedPromise;
    await flushPromises();
    expect(wrapper.find("button span").text()).toBe("上传成功");
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
    expect(wrapper.find("button span").text()).toBe("上传失败");
  });
});
