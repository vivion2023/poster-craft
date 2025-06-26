import { createStore } from "vuex";
import templates, { TemplatesProps } from "./templates";
import user, { UserProps } from "./user";
import editor, { EditorProps } from "./editor";
import { ComponentData } from "./editor";
export { ComponentData };
import global, { GlobalStatus } from "./global";

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorProps;
  global: GlobalStatus;
}

const store = createStore({
  modules: {
    templates,
    user,
    editor,
    global,
  },
  actions: {},
});

export interface ActionPayload {
  urlParams?: { [key: string]: any };
  data?: any;
  searchParams?: { [key: string]: any };
}
export default store;
