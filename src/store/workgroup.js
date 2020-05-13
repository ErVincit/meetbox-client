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
  },
  async createWorkgroup({ commit }, { name, image }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup`;
    const data = await fetch(url, {
      credentials: "include",
      body: JSON.stringify({ name, image }),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });
    const json = await data.json();
    commit("newWorkgroup", json.data);
  },
  async editLabel({ commit }, { workgroupId, labelId, editObject }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/label/${labelId}/edit`;
    console.log(url);
    console.log(editObject);
    const data = await fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editObject),
      method: "PUT"
    });
    const json = await data.json();
    console.log(json.data);
    commit("setLabel", json.data);
  },
  async createLabel({ commit }, { workgroupId, label }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/label`;
    const data = await fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(label),
      method: "POST"
    });
    const json = await data.json();
    commit("newLabel", json.data);
  },
  async deleteLabel({ commit }, { workgroupId, labelId }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/label/${labelId}`;
    const data = await fetch(url, {
      credentials: "include",
      method: "DELETE"
    });
    const json = await data.json();
    commit("removeLabel", json.data);
  }
};

const mutations = {
  setWorkgroups: (state, workgroups) => (state.workgroups = workgroups),
  newWorkgroup: (state, workgroup) => state.workgroups.push(workgroup),
  setLabel: (state, label) => {
    console.log(state.workgroups);
    const workgroup = state.workgroups.find(wg => wg.id === label.workgroup);
    console.log(workgroup, label.id);
    const index = workgroup.labels.findIndex(l => l.id === label.id);
    console.log(index);
    workgroup[index] = label;
  },
  newLabel: (state, label) =>
    state.workgroups.find(wg => wg.id === label.workgroup).labels.push(label),
  removeLabel: (state, label) => {
    const workgroup = state.workgroups.find(wg => wg.id === label.workgroup);
    workgroup.labels = workgroup.labels.filter(l => l.id !== label.id);
  }
};

export default { state, getters, actions, mutations };
