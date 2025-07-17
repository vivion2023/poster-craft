import UserProfile from "@/components/UserProfile.vue";
import { mount } from "@vue/test-utils";
import { VueWrapper } from "@vue/test-utils";
import { message } from "ant-design-vue";
import store from "@/store/index";
let wrapper: VueWrapper<any>;
jest.mock("ant-design-vue", () => ({
  message: {
    success: jest.fn(),
  },
}));

const mockedRoutes: string[] = [];
jest.mock("vue-router", () => ({
  useRouter: () => ({
    push: (url: string) => mockedRoutes.push(url),
  }),
}));

// 模拟 Vuex store
// import { useStore } from "vuex";
// import { provide } from "vue";
// const mockStore = {
//   state: {
//     user: {
//       isLogin: false,
//       userName: "vivion",
//     },
//   },
//   commit: jest.fn(),
// };
// (useStore as jest.Mock).mockReturnValue(mockStore);

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
        provide: {
          store,
        },
      },
    });
    jest.useFakeTimers();
  });

  it("should render login button when login is false", async () => {
    expect(wrapper.find("button").exists()).toBeTruthy;
    console.log(wrapper.html());
    expect(wrapper.find("div").text()).toBe("登录");
    await wrapper.find("div").trigger("click");
    expect(message.success).toHaveBeenCalled();
  });

  it("should render username when login is true", async () => {
    await wrapper.setProps({
      user: { isLogin: true, userName: "viking" },
    });
    console.log(wrapper.html());
  });

  it("should call logout and show message, call router.push after timeout", async () => {
    await wrapper.find(".user-profile-dropdown div").trigger("click");
    expect(store.state.user.isLogin).toBeFalsy();
    expect(message.success).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    expect(mockedRoutes).toEqual(["/"]);
  });

  afterEach(() => {
    (message as jest.Mocked<typeof message>).success.mockReset();
  });
});
