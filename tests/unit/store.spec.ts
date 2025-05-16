import { testComponents, ComponentData } from "@/store/editor";
import { testData } from "@/store/templates";
import { TextComponentProps } from "@/defaultProps";
import { last, clone } from "lodash-es";
import store from "@/store";
const cloneComponents = clone(testComponents);
describe("test vuex store", () => {
  it("should have three modules", () => {
    expect(store.state).toHaveProperty("user");
    expect(store.state).toHaveProperty("templates");
    expect(store.state).toHaveProperty("editor");
  });

  describe("test user module", () => {
    it("test login mutation", () => {
      store.commit("login");
      expect(store.state.user.isLogin).toBeTruthy();
    });
    it("test logout mutation", () => {
      store.commit("logout");
      expect(store.state.user.isLogin).toBeFalsy();
    });
  });

  describe("test templates module", () => {
    it("should have default templates", () => {
      expect(store.state.templates.data).toHaveLength(testData.length);
    });
    it("should get the correct template by Id", () => {
      const selectTemplate = store.getters.getTemplateById(1);
      expect(selectTemplate.title).toBe("前端架构师海报");
    });
  });

  describe("test templates module", () => {
    it("should have default components", () => {
      expect(store.state.editor.components).toHaveLength(testComponents.length);
    });
    it("should get current component when set active one component", () => {
      store.commit("setActive", testComponents[0].id);
      expect(store.state.editor.currentElement).toBe(testComponents[0].id);
      const currentElement = store.getters.currentElement;
      expect(currentElement.id).toBe(testComponents[0].id);
    });
  });
});
