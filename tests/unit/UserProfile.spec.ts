import UserProfile from "@/components/UserProfile.vue";
import { mount } from "@vue/test-utils";
import { VueWrapper } from "@vue/test-utils";
import { template } from "lodash-es";
const msg = "new message";
let wrapper: VueWrapper<any>;
jest.mock("ant-design-vue");
jest.mock("vuex");
jest.mock("vue-router");

// 模拟 Vuex store
import { useStore } from "vuex";
const mockStore = {
  state: {
    user: {
      isLogin: false,
      userName: "vivion",
    },
  },
  commit: jest.fn(),
};
(useStore as jest.Mock).mockReturnValue(mockStore);

const mockComponent = {
  template: "<div><slot></slot></div>",
};

const mockComponent2 = {
  template: "<div><slot></slot><slot name='overlay'></slot></div>",
};

const globalComponent = {
  "a-button": mockComponent,
  "a-dropdown-button": mockComponent2,
  "router-link": mockComponent,
  "a-menu": mockComponent,
  "a-menu-item": mockComponent,
};

describe("UserProfile component", () => {
  beforeAll(() => {
    wrapper = mount(UserProfile, {
      global: {
        components: globalComponent,
      },
    });
  });

  it("should render login button when login is false", () => {
    expect(wrapper.find("button").exists()).toBeTruthy;
    console.log(wrapper.html());
    expect(wrapper.find("div").text()).toBe("登录");
  });

  it("should render username when login is true", async () => {
    await wrapper.setProps({
      user: { isLogin: true, userName: "viking" },
    });
    console.log(wrapper.html());
  });

  // afterAll(() => {})
});
