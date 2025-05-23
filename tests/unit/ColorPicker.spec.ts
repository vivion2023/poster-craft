import { mount, VueWrapper } from "@vue/test-utils";
import ColorPicker from "@/components/ColorPicker.vue";
import rgbHex from "rgb-hex";
const defaultColors = [
  "#ffffff",
  "#f5222d",
  "#fa541c",
  "#fadb14",
  "#52c41a",
  "#1890ff",
  "#722ed1",
  "#8c8c8c",
  "#000000",
  "",
];
let wrapper: VueWrapper<any>;

describe("UserProfile component", () => {
  beforeAll(() => {
    wrapper = mount(ColorPicker, {
      props: {
        value: "#ffffff",
      },
    });
  });

  it("should render the correct interface", () => {
    // <div><input></div>
    // <ul class="picked-color-list">
    //   <li class="item-0" or class="transparent-item">
    //     <div></div>
    //   </li>
    // </ul>

    // 测试左侧是否为input，类型和值是否正确
    expect(wrapper.find("input").exists()).toBeTruthy();
    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.type).toBe("color");
    expect(input.value).toBe("#ffffff");
    // 测试右侧是否有颜色的列表
    expect(wrapper.findAll(".picked-color-list li").length).toBe(
      defaultColors.length
    );
    // 检查一个元素的 css backgroundColor 是否为相对应的颜色
    const firstItem = wrapper.find("li:first-child div")
      .element as HTMLDivElement;
    expect("#" + rgbHex(firstItem.style.backgroundColor)).toBe(
      defaultColors[0]
    );
    // 测试最后一个元素是否为特殊的类名
    const lastItem = wrapper.find("li:last-child div")
      .element as HTMLDivElement;
    expect(lastItem.classList.contains("transparent-item")).toBeTruthy();
  });

  it("should send the correct event when change input", async () => {
    // 测试input修改后，是否发送对应的事件和对应的值
    const blackHex = "#000000";
    const input = wrapper.find("input");
    // 使用 element.value 设置值，然后触发 input 事件
    input.element.value = blackHex;
    await input.trigger("input");

    expect(wrapper.emitted()).toHaveProperty("change"); // 是否发送change事件
    const events = wrapper.emitted("change");
    expect(events[0]).toEqual([blackHex]); // 是否发送正确的值
  });

  it("should send the correct event when clicking color list", async () => {
    // 测试点击颜色列表后，是否发送对应的事件和对应的值
    const firstItem = wrapper.find("li:first-child div");
    expect(firstItem.exists()).toBeTruthy();
    await firstItem.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("change"); // 是否发送change事件
    const events = wrapper.emitted("change");
    expect(events[1]).toEqual([defaultColors[0]]); // 是否发送正确的值
  });
});
