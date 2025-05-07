import { createStore } from "vuex";
import templates, { TemplatesProps } from "./templates";
import user, { UserProps } from "./user";
import editor, { EditorProps } from "./editor";
import { ComponentData } from "./editor";
export { ComponentData };

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorProps;
}

const store = createStore({
  modules: {
    templates,
    user,
    editor,
  },
  actions: {},
});

export default store;
