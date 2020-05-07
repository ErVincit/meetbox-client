import Vue from "vue";
import Vuex from "vuex";

import tasks from "./tasks";
import calendar from "./calendar";

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
    tasks,
    calendar
  },
  getters: {
    usersInformation: state => {
      return state.usersInformation;
    }
  }
});
