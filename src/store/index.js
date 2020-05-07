import Vue from "vue";
import Vuex from "vuex";

import tasks from "./tasks";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    usersInformation: (state, info) => {
      if (info && Object.keys(info).length > 0) state.usersInformation = info;
    }
  },
  actions: {},
  modules: {
    tasks
  },
  getters: {
    usersInformation: state => {
      return state.usersInformation;
    }
  }
});
