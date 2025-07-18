import { mount } from "@vue/test-utils";
import IconSwitch from "@/components/IconSwitch.vue";
import { VueWrapper } from "@vue/test-utils";
import { BoldOutlined } from "../../src/configAntD";
import rgbHex from "rgb-hex";

let wrapper: VueWrapper<any>;

describe("IconSwitch component", () => {
  beforeEach(() => {
    wrapper = mount(IconSwitch, {
      props: {
        icon: BoldOutlined,
        active: false,
      },
    });
  });
  it("should render the correct interface", () => {
    // <div class="icon-switch">
    // <a-tooltip placement="top">
    //   <div class="active-icon or disactive-icon">
    //     <component :is="icon" />
    //   </div>
    // </a-tooltip>
    // </div>
    // 验证组件是否存在
    expect(wrapper.find(".icon-switch").exists()).toBeTruthy();
    // 验证图标组件是否存在
    expect(wrapper.findComponent(BoldOutlined).exists()).toBeTruthy();
  });
  it("should apply the correct class based on active prop", async () => {
    // 默认为非激活状态
    expect(
      wrapper.find(".icon-container").element.classList.contains("isBold")
    ).toBeFalsy();
  });

  it("should emit toggle event when clicked", async () => {
    // 点击时应该发出toggle事件
    await wrapper.find(".icon-switch").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("change");

    // 检查事件参数
    const changeEvents = wrapper.emitted("change");
    expect(changeEvents).toBeTruthy();
    expect(
      wrapper.find(".icon-container").element.classList.contains("isBold")
    ).toBeTruthy();

    // 设置为激活状态后再点击
    await wrapper.find(".icon-switch").trigger("click");
    expect(
      wrapper.find(".icon-container").element.classList.contains("isBold")
    ).toBeFalsy();
  });

  it("should apply tooltip when tooltip prop is provided", async () => {
    // 使用提示文本重新挂载组件
    const tooltipWrapper = mount(IconSwitch, {
      props: {
        icon: BoldOutlined,
        active: false,
        tooltip: "加粗",
      },
    });

    // 验证tooltip存在
    // 检查 a-tooltip 组件是否存在
    expect(
      tooltipWrapper.findComponent({ name: "ATooltip" }).exists()
    ).toBeTruthy();
  });
});
