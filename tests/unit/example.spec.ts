import { shallowMount, mount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import Hello from "@/components/Hello.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
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
});
