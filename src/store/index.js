import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    usersInformation: (state, info) => {
      if (info && Object.keys(info).length > 0) state.usersInformation = info;
    }
  },
  actions: {},
  modules: {},
  getters: {
    usersInformation: state => {
      return state.usersInformation;
    }
  }
});