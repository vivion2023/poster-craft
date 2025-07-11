import { Module } from "vuex";
import { GlobalDataProps } from "./index";
export interface GlobalStatus {
  opNames: { [key: string]: boolean };
  requestNumber: number;
  error: {
    status: boolean;
    message?: string;
  };
  loadingTimers: { [key: string]: number };
}

const global: Module<GlobalStatus, GlobalDataProps> = {
  state: {
    requestNumber: 0,
    opNames: {},
    error: {
      status: false,
    },
    loadingTimers: {},
  },
  mutations: {
    startLoading(state, { opName }) {
      state.requestNumber++;
      if (opName) {
        state.opNames[opName] = true;
      }
    },
    finishLoading(state, { opName }) {
      // 清理之前的定时器
      if (opName && state.loadingTimers[opName]) {
        clearTimeout(state.loadingTimers[opName]);
        delete state.loadingTimers[opName];
      }

      const timerId = window.setTimeout(() => {
        state.requestNumber--;
        if (opName) {
          delete state.opNames[opName];
          delete state.loadingTimers[opName];
        }
      }, 1000);

      // 存储定时器ID
      if (opName) {
        state.loadingTimers[opName] = timerId;
      }
    },
    clearLoadingTimer(state, { opName }) {
      if (opName && state.loadingTimers[opName]) {
        clearTimeout(state.loadingTimers[opName]);
        delete state.loadingTimers[opName];
        delete state.opNames[opName];
        state.requestNumber = Math.max(0, state.requestNumber - 1);
      }
    },
    setError(state, e) {
      state.error = e;
    },
  },
  getters: {
    isLoading: (state) => {
      return state.requestNumber > 0;
    },
    isOpLoading: (state) => (opName: string) => {
      return state.opNames[opName];
    },
  },
};

export default global;
