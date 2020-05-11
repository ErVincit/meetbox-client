const state = {
  currentUser: null
};

const getters = {
  currentUser: state => state.currentUser
};

const actions = {
  async loginUser({ commit }, credentials) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/login`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
    if (response.ok) {
      const message = await response.json();
      commit("setCurrentUser", message.data);
      return true;
    }
    return false;
  },
  async validateUser({ commit }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/login/validate`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      const json = await response.json();
      commit("setCurrentUser", json.data);
      return true;
    }
    return false;
  }
};

const mutations = {
  setCurrentUser: (state, user) => (state.currentUser = user)
};

export default { state, getters, actions, mutations };