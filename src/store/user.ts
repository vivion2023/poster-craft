import { Module } from "vuex";
import { GlobalDataProps } from "./index";
import { RespData } from "@/store/respTypes";
import axios from "axios";

export interface UserProps {
  isLogin: boolean;
  token?: string;
  userName?: string;
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
  },

  mutations: {
    login(state, rowData: RespData<{ token: string }>) {
      const { token } = rowData.data;
      state.token = token;
    },
    logout(state) {
      state.isLogin = false;
    },
  },

  actions: {
    login({ commit }, payload) {
      return axios
        .post("/users/loginByPhoneNumber", payload)
        .then((response) => {
          commit("login", response.data);
        });
    },
  },
};

export default user;
