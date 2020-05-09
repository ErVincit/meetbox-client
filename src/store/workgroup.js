const state = {
  workgroups: null
};

const getters = {
  workgroups: state => state.workgroups
};

const actions = {
  async fetchWorkgroups({ commit }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup`;
    const data = await fetch(url, {
      credentials: "include"
    });
    const json = await data.json();
    commit("setWorkgroups", json.data);
  }
};

const mutations = {
  setWorkgroups: (state, workgroups) => (state.workgroups = workgroups)
};

export default { state, getters, actions, mutations };
