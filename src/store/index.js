import Vue from "vue";
import Vuex from "vuex";

import currentUser from "./current-user";
import tasks from "./tasks";
import calendar from "./calendar";
import workgroup from "./workgroup";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    currentUser,
    tasks,
    calendar,
    workgroup
  }
});
