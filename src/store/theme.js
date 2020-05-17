const state = {
  lightTheme: true
};

const getters = {
  isLightTheme: state => state.lightTheme
};

const actions = {
  initTheme({ commit }) {
    const theme = localStorage.getItem("theme");
    if (theme) commit("setTheme", theme);
    else localStorage.setItem("theme", "light");
  },
  changeTheme({ state, commit }) {
    const newTheme = state.lightTheme ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    commit("setTheme", newTheme);
  }
};

const mutations = {
  setTheme: (state, theme) => (state.lightTheme = theme === "light")
};

export default { state, getters, actions, mutations };
