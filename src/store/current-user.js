const state = {
  currentUser: null
};

const getters = {
  currentUser: state => state.currentUser
};

const actions = {
  async validateUser({ commit }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/login/validate`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include"
    });
    const json = await response.json();
    if (response.ok) commit("setCurrentUser", json.data);
  }
};

const mutations = {
  setCurrentUser: (state, user) => (state.currentUser = user)
};

export default { state, getters, actions, mutations };
