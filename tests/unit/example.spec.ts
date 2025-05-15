import { shallowMount, mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import HelloWorld from "@/components/HelloWorld.vue";
import Hello from "@/components/Hello.vue";
import axios from "axios";
jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

describe("HelloWorld.vue", () => {
  const msg = "new message";
  it("renders props.msg when passed", () => {
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    console.log(wrapper.findComponent(Hello as any).props());
    expect(wrapper.text()).toMatch(msg);
  });

  it("should update the count when clicking the button", async () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.find("button").text()).toBe("2");
  });

  it("should add tood when fill the input and click the button", async () => {
    const msg = "new message";
    const todoContent = "buy milk";
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    // Vue Test Utils 2.x中移除了setValue方法
    // 获取input元素,直接设置属性然后触发input事件
    const input = wrapper.find("input");
    input.element.value = todoContent;
    await input.trigger("input");

    expect(wrapper.find("input").element.value).toBe(todoContent);
    await wrapper.find(".addTodo").trigger("click");
    // 2.x中toHaveLength方法被移除了
    // expect(wrapper.find("li").toHaveLength(1));
    const items = wrapper.findAll("li");
    expect(items.length).toBe(1);

    expect(items[0].text()).toBe(todoContent);

    // 测试emit事件
    console.log(wrapper.emitted());
    // 测试emit事件是否存在
    expect(wrapper.emitted()).toHaveProperty("send");
    // 测试emit事件是否触发
    const sendEvents = wrapper.emitted("send");
    // 测试emit事件是否触发正确
    expect(sendEvents).toBeTruthy();
    expect(sendEvents[0]).toEqual([todoContent]);
  });

  it.only("should load user message when click load button", async () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    mockAxios.get.mockResolvedValue({
      data: {
        username: "viking",
      },
    });
    await wrapper.find(".loadUser").trigger("click");
    expect(mockAxios.get).toHaveBeenCalled();
    expect(wrapper.find(".loading").exists()).toBeTruthy();
    await flushPromises();
    // 界面更新完毕
    expect(wrapper.find(".loading").exists()).toBeFalsy();
    expect(wrapper.find(".username").text()).toBe("viking");
  });
});
