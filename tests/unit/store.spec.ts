import { testComponents, ComponentData } from "@/store/editor";
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
});
