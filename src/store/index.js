import Vue from "vue";
import Vuex from "vuex";

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
    calendar
  },
  getters: {
    usersInformation: state => {
      return state.usersInformation;
    }
  }
});
