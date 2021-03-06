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
    if (json.error) console.error(json);
    else commit("setWorkgroups", json.data);
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
    if (json.error) console.error(json);
    else commit("newWorkgroup", json.data);
    return json.data;
  },
  async deleteWorkgroup({ commit }, workgroupId) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}`;
    const data = await fetch(url, {
      credentials: "include",
      method: "DELETE"
    });
    const json = await data.json();
    if (json.error) console.error(json);
    else commit("removeWorkgroup", json.data.id);
  },
  async editWorkgroup({ commit }, { workgroupId, editObject }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/edit`;
    const data = await fetch(url, {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify(editObject),
      headers: { "Content-Type": "application/json" }
    });
    const json = await data.json();
    if (json.error) console.error(json);
    else commit("setWorkgroup", json.data);
  },
  async addMember({ commit }, { workgroupId, memberId }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/member/${memberId}`;
    const data = await fetch(url, {
      credentials: "include",
      method: "PUT"
    });
    const json = await data.json();
    if (json.error) console.error(json);
    else commit("newMember", { workgroupId, member: json.data });
  },
  async deleteMember(
    { commit },
    { workgroupId, memberId, removeFromWorkgroups }
  ) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/member/${memberId}`;
    const response = await fetch(url, {
      credentials: "include",
      method: "DELETE"
    });
    const json = await response.json();
    if (json.error) console.error(json);
    else {
      commit("removeMember", { workgroupId, memberId });
      if (removeFromWorkgroups) commit("removeWorkgroup", workgroupId);
    }
  },
  async editLabel({ commit }, { workgroupId, labelId, editObject }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/label/${labelId}/edit`;
    const data = await fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editObject),
      method: "PUT"
    });
    const json = await data.json();
    if (json.error) console.error(json);
    else commit("setLabel", json.data);
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
    if (json.error) console.error(json);
    else commit("newLabel", json.data);
  },
  async deleteLabel({ commit }, { workgroupId, labelId }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/label/${labelId}`;
    const data = await fetch(url, {
      credentials: "include",
      method: "DELETE"
    });
    const json = await data.json();
    if (json.error) console.error(json);
    else commit("removeLabel", json.data);
  }
};

const mutations = {
  setWorkgroups: (state, workgroups) => (state.workgroups = workgroups),
  newWorkgroup: (state, workgroup) => {
    if (!state.workgroups) state.workgroups = [];
    state.workgroups.push(workgroup);
  },
  removeWorkgroup: (state, workgroupId) => {
    const index = state.workgroups.findIndex(wg => wg.id === workgroupId);
    state.workgroups.splice(index, 1);
  },
  setWorkgroup: (state, workgroup) => {
    const index = state.workgroups.findIndex(wg => wg.id === workgroup.id);
    state.workgroups[index] = workgroup;
  },
  newMember: (state, { workgroupId, member }) => {
    const workgroup = state.workgroups.find(wg => wg.id === workgroupId);
    workgroup.members.push(member);
  },
  removeMember: (state, { workgroupId, memberId }) => {
    const workgroup = state.workgroups.find(wg => wg.id === workgroupId);
    const memberIndex = workgroup.members.findIndex(m => m.id === memberId);
    workgroup.members.splice(memberIndex, 1);
  },
  setLabel: (state, label) => {
    const workgroup = state.workgroups.find(wg => wg.id === label.workgroup);
    const index = workgroup.labels.findIndex(l => l.id === label.id);
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
