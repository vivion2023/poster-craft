import { VueWrapper, mount } from "@vue/test-utils";
import Uploader from "@/components/Uploader.vue";
import axios from "axios";
import flushPromises from "flush-promises";
jest.mock("axios");
jest.useFakeTimers();
// 模拟axios
const mockedAxios = axios as jest.Mocked<typeof axios>;
let wrapper: VueWrapper<any>;
const testFile = new File(["xyz"], "test.png", { type: "image/png" });
const testFile2 = new File(["abc"], "sample.jpg", { type: "image/jpeg" });
const mockComponent = {
  template: "<div><slot></slot></div>",
};
const mockComponents = {
  DeleteOutlined: mockComponent,
  LoadingOutlined: mockComponent,
  FileOutlined: mockComponent,
  FileImageOutlined: mockComponent,
};
const setInputValue = (fileInput: HTMLInputElement, files = [testFile]) => {
  // 创建一个模拟的 FileList 对象
  const fileList = {
    // 索引属性，模拟 FileList 的数组访问方式
    ...files.reduce((acc, file, index) => ({ ...acc, [index]: file }), {}),

    // FileList 的长度属性
    length: files.length,

    // FileList 的 item 方法，用于通过索引获取文件
    item: (index: number) => (index < files.length ? files[index] : null),

    // 实现迭代器接口，使对象可以被 for...of 循环遍历
    [Symbol.iterator]: function* () {
      for (const file of files) {
        yield file;
      }
    },
  } as FileList;

  // 修复：如果files已经定义，先删除它
  try {
    if ("files" in fileInput) {
      Object.defineProperty(fileInput, "files", {
        configurable: true,
        value: fileList,
      });
    } else {
      Object.defineProperty(fileInput, "files", {
        value: fileList,
      });
    }
  } catch (e) {
    console.error("Failed to set files property", e);
  }
};

describe("Uploader component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = mount(Uploader, {
      props: {
        action: "test.url",
        autoUpload: true,
      },
      global: {
        stubs: mockComponents,
      },
    });
  });

  it("基本布局测试 - 上传前", () => {
    expect(wrapper.find(".upload-area").exists()).toBeTruthy();
    expect(wrapper.find("h4").text()).toBe("上传图片");
    expect(getComputedStyle(wrapper.find("input").element).display).toBe(
      "none"
    );
  });

  it("上传过程应正常工作", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        url: "dummy.url",
      },
    });

    const fileInput = wrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);

    // 触发 change 事件
    await wrapper.find("input").trigger("change");
    await flushPromises();

    // 检查是否调用了 post
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);

    // 等待上传完成
    await flushPromises();

    // 检查文件列表
    expect(wrapper.findAll(".uploaded-file").length).toBe(1);
    const fileItem = wrapper.find(".uploaded-file");
    expect(fileItem.element.classList.contains("upload-success")).toBe(true);
    expect(fileItem.find(".filename").text()).toBe(testFile.name);
  });

  it("上传失败时应显示错误状态", async () => {
    // 使用rejectValue而不是rejectValueOnce，确保拒绝立即生效
    mockedAxios.post.mockRejectedValue(new Error("上传失败"));

    const fileInput = wrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);

    await wrapper.find("input").trigger("change");
    await flushPromises(); // 确保Promise拒绝被处理

    // 重新查找元素，确保拿到更新后的DOM
    const fileItem = wrapper.find(".uploaded-file");
    expect(fileItem.element.classList.contains("upload-error")).toBe(true);
  });

  it("使用自定义插槽渲染内容", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        url: "dummy.url",
      },
    });

    const wrapperWithSlots = mount(Uploader, {
      props: {
        action: "test.url",
        autoUpload: true,
      },
      slots: {
        default: "<button>自定义按钮</button>",
        loading: "<div class='loading'>自定义加载中</div>",
        uploaded:
          '<template #uploaded="{ uploadedData }"><div class="custom-loaded">{{uploadedData.url}}</div></template>',
      },
      global: {
        stubs: mockComponents,
      },
    });

    expect(wrapperWithSlots.find("button").text()).toBe("自定义按钮");

    const fileInput = wrapperWithSlots.find("input")
      .element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapperWithSlots.find("input").trigger("change");

    // 等待上传完成
    await flushPromises();

    // 强制wrapperWithSlots重新渲染以反映新状态
    await wrapperWithSlots.vm.$nextTick();

    expect(wrapperWithSlots.find(".custom-loaded").exists()).toBe(true);
    expect(wrapperWithSlots.find(".custom-loaded").text()).toBe("dummy.url");
  });

  it("beforeUpload检查应正确工作", async () => {
    const callback = jest.fn();
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        url: "dummy.url",
      },
    });

    const checkFileSize = (file: File) => {
      if (file.size > 2) {
        callback();
        return false;
      }
      return true;
    };

    const wrapperWithCheck = mount(Uploader, {
      props: {
        action: "test.url",
        beforeUpload: checkFileSize,
        autoUpload: true,
      },
      global: {
        stubs: mockComponents,
      },
    });

    const fileInput = wrapperWithCheck.find("input")
      .element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapperWithCheck.find("input").trigger("change");
    await flushPromises();

    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(wrapperWithCheck.findAll(".uploaded-file").length).toBe(0);
    expect(callback).toHaveBeenCalled();
  });

  it("使用Promise的beforeUpload检查", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });

    // 创建一个成功的Promise，返回修改后的文件
    const successPromise = (file: File) => {
      const newFile = new File([file], "new_name.docx", {
        type: file.type,
      });
      return Promise.resolve(newFile);
    };

    const wrapperWithPromise = mount(Uploader, {
      props: {
        action: "test.url",
        beforeUpload: successPromise,
        autoUpload: true,
      },
      global: {
        stubs: mockComponents,
      },
    });

    const fileInput = wrapperWithPromise.find("input")
      .element as HTMLInputElement;
    setInputValue(fileInput);

    await wrapperWithPromise.find("input").trigger("change");
    await flushPromises();

    expect(mockedAxios.post).toHaveBeenCalled();

    // 等待组件更新
    await wrapperWithPromise.vm.$nextTick();

    const fileItem = wrapperWithPromise.find(".uploaded-file");
    expect(fileItem.find(".filename").text()).toBe("new_name.docx");
  });

  it("拖拽上传功能测试", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });

    const wrapperWithDrag = mount(Uploader, {
      props: {
        action: "test.url",
        drag: true,
        autoUpload: true,
      },
      global: {
        stubs: mockComponents,
      },
    });

    const uploadArea = wrapperWithDrag.find(".upload-area");

    // 测试拖拽悬停状态
    await uploadArea.trigger("dragover");
    expect(uploadArea.element.classList.contains("is-drag-over")).toBe(true);

    // 测试拖拽离开状态
    await uploadArea.trigger("dragleave");
    expect(uploadArea.element.classList.contains("is-drag-over")).toBe(false);

    // 创建一个模拟的DataTransfer对象
    const dataTransfer = {
      files: [testFile],
      items: [
        {
          kind: "file",
          type: "image/png",
          getAsFile: () => testFile,
        },
      ],
      types: ["Files"],
    } as unknown as DataTransfer;

    // 测试文件拖放
    await uploadArea.trigger("drop", { dataTransfer });
    await flushPromises(); // 等待上传开始

    expect(mockedAxios.post).toHaveBeenCalled();
    await flushPromises(); // 等待上传完成
    expect(wrapperWithDrag.findAll(".uploaded-file").length).toBe(1);
  });

  it("自动上传与手动上传模式测试", async () => {
    // 手动上传模式（默认）
    const manualWrapper = mount(Uploader, {
      props: {
        action: "test.url",
        autoUpload: false,
      },
      global: {
        stubs: mockComponents,
      },
    });

    const fileInput = manualWrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);

    await manualWrapper.find("input").trigger("change");
    await flushPromises();

    expect(mockedAxios.post).not.toHaveBeenCalled();

    // 文件应该在列表中，状态为ready
    expect(manualWrapper.findAll(".uploaded-file").length).toBe(1);
    expect(
      manualWrapper
        .find(".uploaded-file")
        .element.classList.contains("upload-ready")
    ).toBe(true);

    // 手动上传按钮应该显示
    expect(manualWrapper.find(".manual-upload-btn").exists()).toBeTruthy();

    // 点击手动上传按钮
    mockedAxios.post.mockResolvedValueOnce({ data: { url: "manual.url" } });
    await manualWrapper.find(".manual-upload-btn").trigger("click");

    await flushPromises();
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);

    await flushPromises();
    await manualWrapper.vm.$nextTick();

    expect(
      manualWrapper
        .find(".uploaded-file")
        .element.classList.contains("upload-success")
    ).toBe(true);

    // 测试自动上传模式
    mockedAxios.post.mockReset();
    const autoWrapper = mount(Uploader, {
      props: {
        action: "test.url",
        autoUpload: true,
      },
      global: {
        stubs: mockComponents,
      },
    });

    mockedAxios.post.mockResolvedValueOnce({ data: { url: "auto.url" } });

    const autoFileInput = autoWrapper.find("input").element as HTMLInputElement;
    setInputValue(autoFileInput);

    await autoWrapper.find("input").trigger("change");
    await flushPromises();

    // 应该立即发起上传请求
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    // 不应该显示手动上传按钮
    expect(autoWrapper.find(".manual-upload-btn").exists()).toBeFalsy();
  });

  it("多文件上传测试", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { url: "file1.url" } });
    mockedAxios.post.mockResolvedValueOnce({ data: { url: "file2.url" } });

    const multiWrapper = mount(Uploader, {
      props: {
        action: "test.url",
        autoUpload: true,
      },
      global: {
        stubs: mockComponents,
      },
    });

    const fileInput = multiWrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput, [testFile, testFile2]);

    await multiWrapper.find("input").trigger("change");
    await flushPromises();

    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    await flushPromises();
    await multiWrapper.vm.$nextTick();

    // 检查两个文件是否都在列表中
    expect(multiWrapper.findAll(".uploaded-file").length).toBe(2);

    const fileItems = multiWrapper.findAll(".uploaded-file");
    expect(fileItems[0].find(".filename").text()).toBe("test.png");
    expect(fileItems[1].find(".filename").text()).toBe("sample.jpg");
  });

  it("删除文件功能测试", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { url: "dummy.url" } });

    const wrapper = mount(Uploader, {
      props: {
        action: "test.url",
        autoUpload: true,
      },
      global: {
        stubs: mockComponents,
      },
    });

    const fileInput = wrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);

    await wrapper.find("input").trigger("change");
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll(".uploaded-file").length).toBe(1);

    // 点击删除按钮
    await wrapper.find(".delete-icon").trigger("click");
    await wrapper.vm.$nextTick();

    // 文件应该被从列表中删除
    expect(wrapper.findAll(".uploaded-file").length).toBe(0);
  });

  it("点击文件项进行替换测试", async () => {
    // 先添加一个ready状态的文件
    const wrapper = mount(Uploader, {
      props: {
        action: "test.url",
        autoUpload: false,
      },
      global: {
        stubs: mockComponents,
      },
    });

    let fileInput = wrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);

    await wrapper.find("input").trigger("change");
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll(".uploaded-file").length).toBe(1);
    expect(
      wrapper.find(".uploaded-file").element.classList.contains("upload-ready")
    ).toBe(true);
    expect(
      wrapper.find(".uploaded-file").element.classList.contains("clickable")
    ).toBe(true);

    // 模拟点击文件项
    const fileItem = wrapper.find(".uploaded-file");
    await fileItem.trigger("click");

    // 重新获取input元素，因为Vue可能会替换DOM元素
    fileInput = wrapper.find("input").element as HTMLInputElement;

    // 替换为新文件
    setInputValue(fileInput, [testFile2]);
    await wrapper.find("input").trigger("change");
    await wrapper.vm.$nextTick();

    // 检查文件列表长度没变，但文件名已更新
    expect(wrapper.findAll(".uploaded-file").length).toBe(1);
    expect(wrapper.find(".filename").text()).toBe("sample.jpg");
  });

  it("测试emit事件", async () => {
    // 注意：这里模拟的响应数据需与期望值完全一致
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        url: "dummy.url",
        id: 123,
      },
    });

    const wrapper = mount(Uploader, {
      props: {
        action: "test.url",
        autoUpload: true,
      },
      global: {
        stubs: mockComponents,
      },
    });

    const fileInput = wrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);

    await wrapper.find("input").trigger("change");
    await flushPromises();
    await wrapper.vm.$nextTick();

    // 检查success事件
    const successEvent = wrapper.emitted("success");
    expect(successEvent).toBeTruthy();

    // 确保响应数据结构正确
    expect((successEvent as any)[0][0].resp).toEqual({
      url: "dummy.url",
      id: 123,
    });
    expect((successEvent as any)[0][0].file.name).toBe("test.png");

    // 测试error事件
    mockedAxios.post.mockRejectedValueOnce(new Error("上传失败"));

    setInputValue(fileInput, [testFile2]);
    await wrapper.find("input").trigger("change");
    await flushPromises();
    await wrapper.vm.$nextTick();

    const errorEvent = wrapper.emitted("error");
    expect(errorEvent).toBeTruthy();
    expect((errorEvent as any)[0][0].file.name).toBe("sample.jpg");
  });

  it("测试不同listType的显示方式", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { url: "image.url" },
    });

    // 默认是picture模式
    const pictureWrapper = mount(Uploader, {
      props: {
        action: "test.url",
        autoUpload: true,
      },
      global: {
        stubs: mockComponents,
      },
    });

    let fileInput = pictureWrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);

    await pictureWrapper.find("input").trigger("change");
    await flushPromises();
    await pictureWrapper.vm.$nextTick();

    // picture模式应该显示缩略图
    expect(pictureWrapper.find(".upload-list-thumbnail").exists()).toBeTruthy();

    // 文本模式
    mockedAxios.post.mockResolvedValueOnce({
      data: { url: "text.url" },
    });

    const textWrapper = mount(Uploader, {
      props: {
        action: "test.url",
        autoUpload: true,
        listType: "text",
      },
      global: {
        stubs: mockComponents,
      },
    });

    fileInput = textWrapper.find("input").element as HTMLInputElement;
    setInputValue(fileInput);

    await textWrapper.find("input").trigger("change");
    await flushPromises();
    await textWrapper.vm.$nextTick();

    // text模式不应该显示缩略图
    expect(textWrapper.find(".upload-list-thumbnail").exists()).toBeFalsy();
  });
});
