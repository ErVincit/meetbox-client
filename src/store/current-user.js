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
  },
  async signupUser({ commit }, { email, firstname, lastname, password }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/login/registration`;
    const body = { email, firstName: firstname, lastName: lastname, password };
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });
    if (response.ok) {
      commit("setCurrentUser", null);
      return true;
    }
    return false;
  },
  async signoutUser({ commit }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/login/signout`;
    const response = await fetch(url, {
      method: "PUT",
      credentials: "include"
    });
    if (response.ok) commit("setCurrentUser", null);
  }
};

const mutations = {
  setCurrentUser: (state, user) => (state.currentUser = user)
};

export default { state, getters, actions, mutations };
